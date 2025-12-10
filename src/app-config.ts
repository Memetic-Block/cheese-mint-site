export default {
  releaseTag: (import.meta as any).env.VITE_RELEASE_TAG,
  versionSha: (import.meta as any).env.VITE_VERSION_SHA,
  versionTimestamp: (import.meta as any).env.VITE_VERSION_TIMESTAMP,
  siteHostname: (import.meta as any).env.VITE_SITE_HOSTNAME
}
