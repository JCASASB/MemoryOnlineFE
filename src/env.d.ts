/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SIGNALR_HUB_URL: string;
  readonly VITE_LOGIN_URL: string;
  readonly VITE_AWS_REGION?: string;
  readonly VITE_AWS_S3_BUCKET?: string;
  readonly VITE_AWS_ACCESS_KEY_ID?: string;
  readonly VITE_AWS_SECRET_ACCESS_KEY?: string;
  readonly VITE_AWS_SESSION_TOKEN?: string;
  readonly VITE_AWS_S3_PHOTOS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}