import { OptimizedPicture } from "@/components/ui/optimized-picture";

const motionImages = Array.from(
  { length: 13 },
  (_, index) => `/portfolio-assets/other/motion-${String(index + 1).padStart(2, "0")}.webp`,
);

const classicImages = Array.from(
  { length: 29 },
  (_, index) => `/portfolio-assets/other/classic/classic-${String(index + 1).padStart(2, "0")}.png`,
);

const digitalImages = Array.from(
  { length: 26 },
  (_, index) => `/portfolio-assets/other/digital/digital-${String(index + 1).padStart(2, "0")}.png`,
);

const showcaseImages = Array.from(
  { length: 9 },
  (_, index) => `/portfolio-assets/other/showcase/showcase-${String(index + 1).padStart(2, "0")}.png`,
);

function WatchFaceSection({
  title,
  images,
  altPrefix,
}: {
  title: string;
  images: string[];
  altPrefix: string;
}) {
  return (
    <section className="watch-face-section" aria-labelledby={`${altPrefix}-title`}>
      <h2 id={`${altPrefix}-title`}>{title}</h2>
      <div className="watch-face-grid">
        {images.map((src, index) => (
          <figure className="watch-face-card" key={src}>
            <OptimizedPicture
              src={src}
              alt={`${title} ${index + 1}`}
              loading="lazy"
              draggable={false}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

export function MotionGallery() {
  return (
    <>
      <div className="motion-gallery" aria-label="动效网格展示，共 13 项">
        <div className="motion-gallery-track">
          {motionImages.map((src, index) => (
            <figure className="motion-card" key={src}>
              <img
                src={src}
                alt={`动效作品 ${index + 1}`}
                draggable={false}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
      <WatchFaceSection
        title="Classic Watch Faces"
        images={classicImages}
        altPrefix="classic-watch-faces"
      />
      <WatchFaceSection
        title="Digital Watch Faces"
        images={digitalImages}
        altPrefix="digital-watch-faces"
      />
      <div className="other-showcase-gallery" aria-label="其他视觉作品展示">
        {showcaseImages.map((src, index) => (
          <OptimizedPicture
            key={src}
            src={src}
            alt={`其他视觉作品 ${index + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </>
  );
}
