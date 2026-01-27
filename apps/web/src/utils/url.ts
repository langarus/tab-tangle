/**
 * Extracts a display-friendly domain/identifier from a URL
 * - For http/https URLs: returns the hostname (without www.)
 * - For other URLs (about:, chrome:, etc.): returns truncated text
 */
export function getDomainFromUrl(url: string): string {
  // For http/https URLs, use normal URL parsing
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      // If parsing fails, fall through to truncation
    }
  }

  // For everything else (about:, chrome:, moz-extension:, etc.), just truncate
  // Remove protocol, hash, and query params for cleaner display
  return url?.replace(/^[^:]+:/, "") ?? ""?.split("#")[0]?.split("?")[0];
}





