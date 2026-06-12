import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Generates a floor-swapped room image using the Gemini image generation API.
 * Sends both the room photo and tile reference image as multimodal input,
 * then returns the generated image as a base64 data URL.
 */
export async function generateFloorSwap(
  roomImageBuffer: Buffer,
  tileImageBuffer: Buffer,
  roomMimeType: "image/jpeg" | "image/png" | "image/webp",
  tileMimeType: "image/jpeg" | "image/png" | "image/webp"
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in .env.local");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const roomBase64 = roomImageBuffer.toString("base64");
  const tileBase64 = tileImageBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "You are an interior design AI. Replace the floor in the room image with the tile pattern shown in the tile reference image. " +
              "Keep all walls, furniture, lighting, and room layout exactly the same. " +
              "Only the floor surface should change to use the provided tile design. " +
              "Output a photorealistic, high-quality interior photograph.",
          },
          {
            inlineData: {
              mimeType: roomMimeType,
              data: roomBase64,
            },
          },
          {
            text: "Tile reference image:",
          },
          {
            inlineData: {
              mimeType: tileMimeType,
              data: tileBase64,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Extract the generated image part
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const mimeType = part.inlineData.mimeType ?? "image/png";
      return `data:${mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error(
    "Gemini did not return an image. Response: " +
      JSON.stringify(response.candidates?.[0]?.content ?? {})
  );
}