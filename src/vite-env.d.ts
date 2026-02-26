/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_NETWORK: string;
  readonly VITE_RPC_URL: string;
  readonly VITE_ALCHEMY_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
