import type { ImgHTMLAttributes } from "react";
import imageManifest from "./image-manifest.json";
import { assetUrl } from "./asset-url";

type OptimizedPictureProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src: string;
};

function withExtension(src: string, extension: "avif" | "webp") {
  return src.replace(/\.(?:png|jpe?g)$/i, `.${extension}`);
}

function withWidthVariant(src: string, width: number) {
  return src.replace(/\.(avif|webp)$/i, `.${width}.$1`);
}

export function OptimizedPicture({
  src,
  alt,
  loading = "lazy",
  decoding = "async",
  sizes = "100vw",
  ...imageProps
}: OptimizedPictureProps) {
  const webpSrc = withExtension(src, "webp");
  const avifSrc = withExtension(src, "avif");
  const dimensions = imageManifest[webpSrc as keyof typeof imageManifest];
  const smallWebp = withWidthVariant(webpSrc, 1280);
  const smallAvif = withWidthVariant(avifSrc, 1280);
  const hasSmallVariant = smallWebp in imageManifest;
  const fullWidth = dimensions?.width ?? 2560;
  const webpSrcSet = hasSmallVariant
    ? `${assetUrl(smallWebp)} 1280w, ${assetUrl(webpSrc)} ${fullWidth}w`
    : assetUrl(webpSrc);
  const avifSrcSet = hasSmallVariant
    ? `${assetUrl(smallAvif)} 1280w, ${assetUrl(avifSrc)} ${fullWidth}w`
    : assetUrl(avifSrc);

  return (
    <picture className="optimized-picture">
      <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />
      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      <img
        {...imageProps}
        src={assetUrl(webpSrc)}
        alt={alt}
        loading={loading}
        decoding={decoding}
        sizes={sizes}
        width={dimensions?.width}
        height={dimensions?.height}
      />
    </picture>
  );
}
