export const SITE_OVERRIDE_KEY_PREFIX = "settings:site:"

export function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase()
}

export function siteOverrideKey(hostname: string): string {
  return `${SITE_OVERRIDE_KEY_PREFIX}${normalizeHostname(hostname)}`
}

export function hostnameFromSiteOverrideKey(key: string): string | undefined {
  if (!key.startsWith(SITE_OVERRIDE_KEY_PREFIX)) return undefined
  return key.slice(SITE_OVERRIDE_KEY_PREFIX.length)
}
