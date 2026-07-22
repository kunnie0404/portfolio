const assetBaseUrl = (process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

export function assetUrl(src: string) {
  if (!assetBaseUrl || !src.startsWith("/portfolio-assets/")) {
    return src;
  }

  return `${assetBaseUrl}${src}`;
}
