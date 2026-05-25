import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/storage";
import { generateFloorSwap } from "@/lib/gemini";

// ─── Validation ───────────────────────────────────────────────────────────────

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AllowedMimeType = (typeof ALLOWED_TYPES)[number];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function validateImageFile(
  file: File,
  fieldName: string
): { mimeType: AllowedMimeType } | NextResponse {
  if (!ALLOWED_TYPES.includes(file.type as AllowedMimeType)) {
    return NextResponse.json(
      {
        error: `${fieldName} must be JPG, PNG, or WEBP. Got: ${file.type}`,
      },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      {
        error: `${fieldName} exceeds the 5 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`,
      },
      { status: 400 }
    );
  }
  return { mimeType: file.type as AllowedMimeType };
}

// ─── POST /api/generate ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth guard
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to generate images." },
      { status: 401 }
    );
  }
  const userId = session.user.id;

  // 2. Parse multipart/form-data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse request. Ensure Content-Type is multipart/form-data." },
      { status: 400 }
    );
  }

  const roomFile = formData.get("room");
  const tileFile = formData.get("tile");

  if (!(roomFile instanceof File) || !(tileFile instanceof File)) {
    return NextResponse.json(
      { error: "Both 'room' and 'tile' image files are required." },
      { status: 400 }
    );
  }

  // 3. Validate files
  const roomValidation = validateImageFile(roomFile, "Room image");
  if (roomValidation instanceof NextResponse) return roomValidation;

  const tileValidation = validateImageFile(tileFile, "Tile image");
  if (tileValidation instanceof NextResponse) return tileValidation;

  // 4. Create a PROCESSING record so the user can see it immediately
  const generation = await prisma.generation.create({
    data: {
      userId,
      originalRoomUrl: "",
      tileUrl: "",
      status: "PROCESSING",
    },
  });

  try {
    // 5. Convert files to Buffers
    const [roomBuffer, tileBuffer] = await Promise.all([
      roomFile.arrayBuffer().then((ab) => Buffer.from(ab)),
      tileFile.arrayBuffer().then((ab) => Buffer.from(ab)),
    ]);

    // 6. Save original images to local storage
    const [originalRoomUrl, tileUrl] = await Promise.all([
      uploadImage(roomBuffer, {
        prefix: "room",
        mimeType: roomValidation.mimeType,
      }),
      uploadImage(tileBuffer, {
        prefix: "tile",
        mimeType: tileValidation.mimeType,
      }),
    ]);

    // Persist upload URLs
    await prisma.generation.update({
      where: { id: generation.id },
      data: { originalRoomUrl, tileUrl },
    });

    // 7. Call Gemini — the heavy lifting
    const generatedDataUrl = await generateFloorSwap(
      roomBuffer,
      tileBuffer,
      roomValidation.mimeType,
      tileValidation.mimeType
    );

    // 8. Save the generated image to local storage
    const generatedImageUrl = await uploadImage(generatedDataUrl, {
      prefix: "generated",
      mimeType: "image/png",
    });

    // 9. Mark as DONE
    const finalRecord = await prisma.generation.update({
      where: { id: generation.id },
      data: { generatedImageUrl, status: "DONE" },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      originalRoomUrl: finalRecord.originalRoomUrl,
      tileUrl: finalRecord.tileUrl,
      generatedImageUrl,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error during generation.";

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "FAILED", errorMessage: errorMessage.slice(0, 500) },
    });

    console.error("[/api/generate] Error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
