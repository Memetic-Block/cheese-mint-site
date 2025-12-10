/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RELEASE_TAG: string
  readonly VITE_VERSION_SHA: string
  readonly VITE_VERSION_TIMESTAMP: string
  readonly VITE_SITE_HOSTNAME: string
  readonly VITE_ALLOW_INDEXING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
