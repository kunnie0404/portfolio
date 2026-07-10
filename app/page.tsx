const projects = [
  {
    name: "Echos",
    label: "PC system",
    image: "/portfolio-assets/cover-echos.png",
    alt: "Echos PC system shown on a laptop mockup",
    summary: "展会管理、建站和创建智能体放在同一个工作台里，重点是让复杂流程看起来顺手。",
    meta: "AIGC / Web / SaaS",
  },
  {
    name: "SODA / Luxury / NEON",
    label: "Smart watch",
    image: "/portfolio-assets/cover-watch.png",
    alt: "Smart watch interface in a cycling scene",
    summary: "从芯片平台、屏幕比例到动态图标，把智能手表的小屏信息做得清楚、有记忆点。",
    meta: "0-1 / Wearable / Motion",
  },
  {
    name: "MO GLASS",
    label: "Smart glasses",
    image: "/portfolio-assets/cover-mo-glass.png",
    alt: "MO GLASS smart glasses app cover",
    summary: "围绕连接、引导、反馈和状态提示做 APP 体验，让智能眼镜的上手路径更短。",
    meta: "APP / Hardware / Guide",
  },
  {
    name: "Da Ring",
    label: "Smart ring",
    image: "/portfolio-assets/cover-da-ring.png",
    alt: "Da Ring health app interface cover",
    summary: "健康数据、设备绑定、日常陪伴和异常提示都要轻一点，用户才愿意每天打开。",
    meta: "Health / Redesign / Data",
  },
  {
    name: "Luxury",
    label: "Concept bid",
    image: "/portfolio-assets/cover-luxury.png",
    alt: "Luxury smart watch visual proposal cover",
    summary: "偏高级感的智能穿戴视觉方案，强调屏幕里的秩序、质感和品牌辨识度。",
    meta: "Visual / Proposal / UI",
  },
  {
    name: "NEON",
    label: "Motion identity",
    image: "/portfolio-assets/cover-neon.png",
    alt: "NEON smart wearable cover image",
    summary: "用更亮的色彩和动效语言，把科技感从装饰变成可识别的交互线索。",
    meta: "Neon / Icon / Motion",
  },
];

const skills = [
  "App / Web / PC UI",
  "智能穿戴界面",
  "AI 产品视觉",
  "0-1 设计流程",
  "动效与图标",
  "设计规范沉淀",
];

const experience = [
  {
    time: "2025.04 - 2026.02",
    company: "艾氪未来（深圳）人工智能有限公司",
    role: "中级 UI 设计师",
    text: "做 Echos 系统的多端迭代、官网视觉重构，也负责客户官网和品牌物料。更像是在把新的 AI 业务整理成别人能看懂、能使用的界面。",
  },
  {
    time: "2021.07 - 2024.11",
    company: "深圳市魔样科技有限公司",
    role: "UI 设计师",
    text: "长期围绕智能手表、智能眼镜、智能戒指做产品界面，从标案到落地、从切图到真机反馈都参与过。",
  },
  {
    time: "2019.02 - 2021.04",
    company: "深圳市创品新媒体科技有限公司",
    role: "设计助理",
    text: "从商业设备、运营后台到宣传物料开始接触完整产品流程，也养成了先理清使用场景再动手的习惯。",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="top-nav" aria-label="Primary navigation">
        <a className="mark" href="#top" aria-label="Back to top">
          XK
        </a>
        <div className="nav-links" aria-label="Page sections">
          <a href="#about">关于</a>
          <a href="#work">项目</a>
          <a href="#experience">经历</a>
          <a href="#contact">联系</a>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open menu">菜单</summary>
          <div>
            <a href="#about">关于</a>
            <a href="#work">项目</a>
            <a href="#experience">经历</a>
            <a href="#contact">联系</a>
          </div>
        </details>
        <a className="nav-cta" href="mailto:1827617577@qq.com">
          Contact
        </a>
      </nav>

      <section id="top" className="hero section-reveal" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">UI Designer / Shenzhen</p>
          <h1 id="hero-title">
            把硬件、AI 和多端界面，
            <span>做得更清楚一点。</span>
          </h1>
          <p className="hero-intro">
            我是许晓琨，做 App、Web、PC 和智能穿戴界面。比起堆概念，我更在意一件事：
            用户第一次打开时，能不能马上知道下一步该做什么。
          </p>
          <div className="hero-actions">
            <a className="pill primary" href="#work">
              看项目目录
            </a>
            <a className="pill ghost" href="tel:13723711274">
              13723711274
            </a>
          </div>
        </div>

        <div className="hero-stage" aria-label="Portfolio visual preview">
          <img src="/portfolio-assets/hero.png" alt="Glowing Portfolio wordmark on a dark textured background" />
          <div className="floating-card">
            <span>Case 01</span>
            <strong>Echos system</strong>
            <small>PC 端 / 建站 / 智能体</small>
          </div>
        </div>
        <p className="hero-word" aria-hidden="true">
          PORTFOLIO
        </p>
      </section>

      <section id="about" className="about section-reveal" aria-labelledby="about-title">
        <div className="section-kicker">About</div>
        <h2 id="about-title">
          我习惯先把事情理顺，再让界面变漂亮。
        </h2>
        <p>
          工作里接触过 AI 展会系统、智能手表、智能眼镜、智能戒指，也做过官网和品牌物料。
          这些项目看起来方向不同，但底层问题很像：信息多、入口多、设备限制多，还要让用户觉得轻松。
        </p>
        <div className="skill-cloud" aria-label="Skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="work" className="work section-reveal" aria-labelledby="work-title">
        <div className="section-heading">
          <div>
            <div className="section-kicker">Selected work</div>
            <h2 id="work-title">一些放在首页的项目入口</h2>
          </div>
          <p>
            这里只放目录封面和简短说明。每个项目的详细过程图，会留到后续二级页面里展开。
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className="project-image">
                <img src={project.image} alt={project.alt} />
                <span>{project.label}</span>
              </div>
              <div className="project-copy">
                <p>{project.meta}</p>
                <h3>{project.name}</h3>
                <span>{project.summary}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="experience section-reveal" aria-labelledby="experience-title">
        <div className="section-kicker">Experience</div>
        <h2 id="experience-title">从商业屏，到智能穿戴，再到 AI 产品。</h2>
        <div className="timeline">
          {experience.map((item) => (
            <article key={item.company}>
              <time>{item.time}</time>
              <div>
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact section-reveal" aria-labelledby="contact-title">
        <p className="section-kicker">Contact</p>
        <h2 id="contact-title">如果你在找 UI 设计师，可以直接联系我。</h2>
        <p>
          我目前求职方向是 UI 设计师，偏多端产品、智能硬件、AI 工具和需要从 0-1 梳理体验的项目。
        </p>
        <div className="contact-actions">
          <a className="pill primary" href="mailto:1827617577@qq.com">
            1827617577@qq.com
          </a>
          <a className="pill dark" href="tel:13723711274">
            手机 / 微信：13723711274
          </a>
        </div>
      </section>
    </main>
  );
}
