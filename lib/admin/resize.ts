const MAX_EDGE = 3000;
const PASSTHROUGH_BYTES = 1_500_000;
const TARGET_BYTES = 2_200_000;

const ATTEMPTS = [
  { edge: MAX_EDGE, quality: 0.92 },
  { edge: MAX_EDGE, quality: 0.86 },
  { edge: 2200, quality: 0.86 },
  { edge: 1800, quality: 0.82 },
];

export const MAX_ORIGINAL_BYTES = 60 * 1024 * 1024;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as a photo."));
    };
    image.src = url;
  });
}

function hasTransparency(context: CanvasRenderingContext2D, width: number, height: number) {
  try {
    const { data } = context.getImageData(0, 0, width, height);
    const step = Math.max(4, Math.floor(data.length / 4 / 40000) * 4);
    for (let index = 3; index < data.length; index += step) {
      if (data[index] < 250) return true;
    }
    return false;
  } catch {
    return true;
  }
}

function encode(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

function renamed(file: File, type: string) {
  const extension = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  return `${file.name.replace(/\.[^.]+$/, "")}.${extension}`;
}

export async function resizeForHero(file: File): Promise<File> {
  const image = await loadImage(file);
  const longEdge = Math.max(image.width, image.height);

  if (longEdge <= MAX_EDGE && file.size < PASSTHROUGH_BYTES) return file;

  let best: { blob: Blob; type: string } | null = null;

  for (const attempt of ATTEMPTS) {
    const scale = longEdge > attempt.edge ? attempt.edge / longEdge : 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return file;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const transparent = hasTransparency(context, canvas.width, canvas.height);

    let blob = await encode(canvas, "image/webp", attempt.quality);
    let type = "image/webp";

    if (!blob || blob.type !== "image/webp") {
      if (transparent) {
        blob = await encode(canvas, "image/png");
        type = "image/png";
      } else {
        blob = await encode(canvas, "image/jpeg", attempt.quality);
        type = "image/jpeg";
      }
    }

    if (!blob) continue;
    if (!best || blob.size < best.blob.size) best = { blob, type };
    if (blob.size <= TARGET_BYTES) {
      best = { blob, type };
      break;
    }
  }

  if (!best) return file;
  if (longEdge <= MAX_EDGE && best.blob.size >= file.size) return file;

  return new File([best.blob], renamed(file, best.type), { type: best.type });
}
