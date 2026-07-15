import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isProjectSlug,
  projectDetails,
  projectSlugs,
} from "../project-data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isProjectSlug(slug)) {
    return {};
  }

  return {
    title: `${projectDetails[slug].name} - 项目详情`,
    description: `${projectDetails[slug].name} 作品项目详情`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  if (!isProjectSlug(slug)) {
    notFound();
  }

  const project = projectDetails[slug];

  return (
    <main className="project-detail">
      <header className="project-detail-header">
        <Link className="project-detail-back" href="/#work-first" aria-label="返回首页项目目录">
          <img
            className="project-detail-return-icon"
            src="/portfolio-assets/return.svg"
            alt=""
            aria-hidden="true"
          />
        </Link>
        <nav className="project-detail-nav-links" aria-label="项目页面导航">
          <Link href="/"><span>Home</span></Link>
          <Link href="/#work-first"><span>Work</span></Link>
          <Link href="/#about"><span>About</span></Link>
          <Link href="/#contact"><span>Contact</span></Link>
        </nav>
        <a className="project-detail-email" href="mailto:1827617577@qq.com">
          <span>1827617577@qq.com</span>
        </a>
        <h1 className="visually-hidden">{project.name}</h1>
      </header>

      <div className="project-detail-gallery" aria-label={`${project.name} 项目图片`}>
        {project.images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`${project.name} 项目展示 ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
      </div>
    </main>
  );
}
