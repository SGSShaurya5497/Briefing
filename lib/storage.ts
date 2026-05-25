/**
 * Storage abstraction layer.
 *
 * Current implementation: local filesystem → /public/uploads/
 *
 * To upgrade to a cloud provider (S3, Cloudinary, GCS), replace the body
 * of `uploadImage` below. The rest of the codebase needs zero changes.
 *
 * Example upgrade to Cloudinary:
 *   import { v2 as cloudinary } from "cloudinary";
 *   const result = await cloudinary.uploader.upload(dataUrl, { folder: "floorswap" });
 *   return result.secure_url;
 */

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

/**
 * Upload an image and return its public URL.
 *
 * @param data   Raw Buffer OR a base64 data URL string ("data:image/...;base64,…")
 * @param options.prefix    Filename prefix for readability (e.g. "room", "tile", "generated")
 * @param options.mimeType  MIME type used to derive the file extension (default "image/png")
 */
export async function uploadImage(
  data: Buffer | string,
  options?: { prefix?: string; mimeType?: string }
): Promise<string> {
  // Ensure the upload directory exists
  await mkdir(UPLOADS_DIR, { recursive: true });

  const prefix = options?.prefix ?? "img";
  const mimeType = options?.mimeType ?? "image/png";
  // Derive extension from MIME type, normalising jpeg → jpg
  const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
  const filename = `${prefix}-${randomUUID()}.${ext}`;
  const filepath = join(UPLOADS_DIR, filename);

  if (typeof data === "string") {
    // Strip the data-URL prefix ("data:image/png;base64,") before writing
    const base64Data = data.replace(/^data:[^;]+;base64,/, "");
    await writeFile(filepath, Buffer.from(base64Data, "base64"));
  } else {
    await writeFile(filepath, data);
  }

  // Return a root-relative URL resolvable from the browser
  return `/uploads/${filename}`;
}
