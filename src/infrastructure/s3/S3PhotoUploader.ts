import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const region = import.meta.env.VITE_AWS_REGION;
const bucket = import.meta.env.VITE_AWS_S3_BUCKET;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const sessionToken = import.meta.env.VITE_AWS_SESSION_TOKEN;
const basePublicUrl = import.meta.env.VITE_AWS_S3_PHOTOS_BASE_URL;

function sanitizeSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

function sanitizeFilename(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const basename = lastDot > -1 ? name.slice(0, lastDot) : name;
  const ext = lastDot > -1 ? name.slice(lastDot + 1).toLowerCase() : "jpg";

  const safeBase = sanitizeSegment(basename) || "photo";
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "jpg";
  return `${safeBase}.${safeExt}`;
}

function getClient(): S3Client {
  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Faltan variables VITE_AWS_REGION, VITE_AWS_S3_BUCKET, VITE_AWS_ACCESS_KEY_ID o VITE_AWS_SECRET_ACCESS_KEY.",
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken,
    },
  });
}

export type UploadedPhoto = {
  key: string;
  url: string;
};

export async function uploadPhotoToS3(
  playerName: string,
  file: File,
): Promise<UploadedPhoto> {
  const safePlayer = sanitizeSegment(playerName) || "sin-nombre";
  const safeName = sanitizeFilename(file.name);
  const uniquePrefix = `${Date.now()}-${crypto.randomUUID()}`;
  const key = `${safePlayer}/${uniquePrefix}-${safeName}`;

  const client = getClient();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    }),
  );

  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const url = basePublicUrl
    ? `${basePublicUrl.replace(/\/$/, "")}/${encodedKey}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;

  return { key, url };
}