export const projectSlugs = [
  "echos",
  "mo-glass",
  "da-ring",
  "luxury",
  "neon",
] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

type ProjectDetail = {
  name: string;
  images: string[];
};

function numberedImages(
  slug: ProjectSlug,
  prefix: string,
  start: number,
  end: number,
) {
  return Array.from(
    { length: end - start + 1 },
    (_, index) =>
      `/portfolio-assets/projects/${slug}/${prefix}_${start + index}.png`,
  );
}

export const projectDetails: Record<ProjectSlug, ProjectDetail> = {
  echos: {
    name: "Echos",
    images: numberedImages("echos", "echos", 1, 12),
  },
  "mo-glass": {
    name: "MO GLASS",
    images: numberedImages("mo-glass", "moglass", 1, 12),
  },
  "da-ring": {
    name: "Da Ring",
    images: numberedImages("da-ring", "daring", 1, 9),
  },
  luxury: {
    name: "Luxury",
    images: numberedImages("luxury", "Luxury", 9, 14),
  },
  neon: {
    name: "NEON",
    images: numberedImages("neon", "neon", 3, 8),
  },
};

export function isProjectSlug(slug: string): slug is ProjectSlug {
  return projectSlugs.includes(slug as ProjectSlug);
}
