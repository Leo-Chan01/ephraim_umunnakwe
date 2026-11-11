/**
 * Downscale and re-encode an image in the browser before upload.
 *
 * Link-preview crawlers (WhatsApp especially) silently drop og:images that are
 * too large (~300–600 KB), so featured images are resized to at most
 * `maxWidth` px wide and re-encoded as JPEG. GIFs (animation) and SVGs
 * (vector) are returned untouched, as is anything that would end up larger.
 */
export async function compressImage(
  file: File,
  { maxWidth = 1200, quality = 0.82 }: { maxWidth?: number; quality?: number } = {}
): Promise<File> {
  if (typeof window === 'undefined') return file;
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // format the browser can't decode; upload as-is
  }

  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  // JPEG has no alpha: paint white so transparent PNGs don't turn black
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob || blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}
