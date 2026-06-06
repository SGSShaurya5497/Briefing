export async function generateFloorSwap(
  roomImageBuffer: Buffer,
  tileImageBuffer: Buffer,
  roomMimeType: "image/jpeg" | "image/png" | "image/webp",
  tileMimeType: "image/jpeg" | "image/png" | "image/webp"
): Promise<string> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("HUGGINGFACE_API_KEY is not set in .env.local");
  }

  const roomBase64 = roomImageBuffer.toString("base64");

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-inpainting",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: "photorealistic room with beautiful new floor tiles, same walls and furniture, professional interior photography, high quality",
        parameters: {
          negative_prompt: "blurry, distorted, low quality, deformed",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Hugging Face error: ${err}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}