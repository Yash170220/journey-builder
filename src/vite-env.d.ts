/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_TENANT_ID?: string;
  readonly VITE_BLUEPRINT_ID?: string;
  readonly VITE_USE_FIXTURE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
