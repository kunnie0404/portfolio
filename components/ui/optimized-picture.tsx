import type { ImgHTMLAttributes } from "react";
import imageManifest from "./image-manifest.json";

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
    ? `${smallWebp} 1280w, ${webpSrc} ${fullWidth}w`
    : webpSrc;
  const avifSrcSet = hasSmallVariant
    ? `${smallAvif} 1280w, ${avifSrc} ${fullWidth}w`
    : avifSrc;

  return (
    <picture className="optimized-picture">
      <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />
      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      <img
        {...imageProps}
        src={webpSrc}
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
