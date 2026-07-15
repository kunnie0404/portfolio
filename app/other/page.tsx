import type { Metadata } from "next";
import Link from "next/link";
import { MotionGallery } from "./motion-gallery";

export const metadata: Metadata = {
  title: "Dynamic Effect - Other",
  description: "界面动效与动态视觉作品展示",
};

export default function OtherPage() {
  return (
    <main className="other-page">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&display=swap"
      />
      <header className="project-detail-header">
        <Link className="project-detail-back" href="/#work-first" aria-label="返回首页项目目录">
          <span className="project-detail-return-icon" aria-hidden="true" />
        </Link>
        <nav className="project-detail-nav-links" aria-label="页面导航">
          <Link href="/"><span>Home</span></Link>
          <Link href="/#work-first"><span>Work</span></Link>
          <Link href="/#about"><span>About</span></Link>
          <Link href="/#contact"><span>Contact</span></Link>
        </nav>
        <a className="project-detail-email" href="mailto:1827617577@qq.com">
          <span>1827617577@qq.com</span>
        </a>
      </header>

      <section className="motion-showcase" aria-labelledby="motion-title">
        <div className="motion-heading">
          <p>Other / Motion Studies</p>
          <h1 id="motion-title">Dynamic Effect</h1>
          <span>横向滚动浏览</span>
        </div>
        <MotionGallery />
      </section>
    </main>
  );
}
