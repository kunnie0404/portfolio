"use client";

import type { ImgHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
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

export function OptimizedPicture({
  src,
  alt,
  loading = "lazy",
  decoding = "async",
  ...imageProps
}: OptimizedPictureProps) {
  const pictureRef = useRef<HTMLPictureElement>(null);
  const eager = loading === "eager";
  const [shouldLoad, setShouldLoad] = useState(eager);
  const webpSrc = withExtension(src, "webp");
  const avifSrc = withExtension(src, "avif");
  const dimensions = imageManifest[webpSrc as keyof typeof imageManifest];

  useEffect(() => {
    if (eager || shouldLoad) return;

    const picture = pictureRef.current;
    if (!picture) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(picture);
    return () => observer.disconnect();
  }, [eager, shouldLoad]);

  return (
    <picture ref={pictureRef} className="optimized-picture">
      {shouldLoad ? (
        <>
          <source srcSet={avifSrc} type="image/avif" />
          <source srcSet={webpSrc} type="image/webp" />
        </>
      ) : (
        <>
          <source data-srcset={avifSrc} type="image/avif" />
          <source data-srcset={webpSrc} type="image/webp" />
        </>
      )}
      <img
        {...imageProps}
        src={shouldLoad ? webpSrc : undefined}
        data-src={webpSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        width={dimensions?.width}
        height={dimensions?.height}
        style={{
          color: shouldLoad ? undefined : "transparent",
          ...imageProps.style,
        }}
      />
    </picture>
  );
}
