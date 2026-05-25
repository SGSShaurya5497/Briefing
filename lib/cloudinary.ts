import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a Buffer or base64 data URL to Cloudinary.
 * @returns The secure HTTPS URL of the uploaded image.
 */
export async function uploadToCloudinary(
  data: Buffer | string,
  options: {
    folder?: string;
    publicId?: string;
    resourceType?: "image" | "raw" | "auto";
  } = {}
): Promise<string> {
  const { folder = "floorswap", publicId, resourceType = "image" } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: resourceType,
    };
    if (publicId) uploadOptions.public_id = publicId;

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve(result.secure_url);
      }
    );

    if (typeof data === "string") {
      // base64 data URL — convert to buffer first
      const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      uploadStream.end(buffer);
    } else {
      uploadStream.end(data);
    }
  });
}

export { cloudinary };
