// Browser-only: downscale a photo to ≤1600px and re-encode as WebP so
// phone photos (4–10MB) upload as ~200–400KB.
export async function compressImage(file: File, maxSide = 1600, quality = 0.82): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  if (!blob) throw new Error("Encoding failed");
  // Safari without WebP encoding falls back to PNG; re-encode as JPEG then.
  if (blob.type !== "image/webp") {
    const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!jpeg) throw new Error("Encoding failed");
    return new File([jpeg], "photo.jpg", { type: "image/jpeg" });
  }
  return new File([blob], "photo.webp", { type: "image/webp" });
}
