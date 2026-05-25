import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// genAI is initialized lazily inside generateFloorSwap so that the module
// can be imported during Next.js build without GEMINI_API_KEY being set.
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file."
    );
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

const FLOOR_SWAP_PROMPT = `You are an expert interior design AI and photorealistic image editor.

I am providing you with two images:
1. A room photograph (first image)
2. A floor tile texture sample (second image)

Your task:
- Carefully identify all floor surfaces visible in the room image.
- Replace the existing floor texture COMPLETELY and REALISTICALLY with the tile texture from the second image.
- Maintain the original room's lighting, shadows, reflections, and perspective geometry precisely.
- Ensure the tile pattern tiles correctly across the floor area, respecting the room's vanishing points.
- Do NOT alter any walls, furniture, ceiling, or other non-floor elements.
- Output ONLY the modified room image with the new floor — nothing else.`;

/**
 * Calls the Gemini image generation model to swap floor textures.
 * Returns the generated image as a base64 data URL.
 */
export async function generateFloorSwap(
  roomImageBuffer: Buffer,
  tileImageBuffer: Buffer,
  roomMimeType: "image/jpeg" | "image/png" | "image/webp",
  tileMimeType: "image/jpeg" | "image/png" | "image/webp"
): Promise<string> {
  // Use gemini-2.0-flash-exp for image generation output
  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
    generationConfig: {
      // @ts-expect-error – responseModalities is part of the image gen API
      responseModalities: ["image", "text"],
    },
  });

  const roomBase64 = roomImageBuffer.toString("base64");
  const tileBase64 = tileImageBuffer.toString("base64");

  const result = await model.generateContent([
    FLOOR_SWAP_PROMPT,
    {
      inlineData: {
        mimeType: roomMimeType,
        data: roomBase64,
      },
    },
    {
      inlineData: {
        mimeType: tileMimeType,
        data: tileBase64,
      },
    },
  ]);

  const response = result.response;
  const parts = response.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error("Gemini returned no content parts.");
  }

  // Find the image part in the response
  for (const part of parts) {
    if (part.inlineData?.data && part.inlineData?.mimeType?.startsWith("image/")) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  // If no image returned, log the text response and throw
  const textPart = parts.find((p) => p.text);
  console.error("Gemini text response (no image):", textPart?.text);
  throw new Error(
    "Gemini did not return an image. The model may not have image output enabled for your API key region. Try the gemini-2.0-flash-preview-image-generation model or enable Imagen in Google AI Studio."
  );
}
