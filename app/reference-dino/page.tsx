"use client";

import { AnimatePresence, motion, usePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BrainCircuit,
  ChevronRight,
  Cpu,
  MonitorSmartphone,
  PencilRuler,
  Plus,
  Sparkles,
  Watch,
  Wand2,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const chaptersData = [
  {
    name: "Echos AI Workbench",
    label: "PC system",
    image: "/portfolio-assets/cover-echos.png",
    summary: "展会管理、建站和智能体能力被整理到同一个工作台里，重点是让复杂流程一眼能懂。",
  },
  {
    name: "SODA / Luxury / NEON",
    label: "Smart watch",
    image: "/portfolio-assets/cover-watch.png",
    summary: "从小屏比例、运动场景到动态组件，把穿戴设备的信息层级做得更清楚、更有节奏。",
  },
  {
    name: "MO GLASS Guide",
    label: "Smart glasses",
    image: "/portfolio-assets/cover-mo-glass.png",
    summary: "围绕连接、引导、反馈和状态提示搭建轻量流程，降低智能眼镜首次上手的阻力。",
  },
  {
    name: "Da Ring Health",
    label: "Smart ring",
    image: "/portfolio-assets/cover-da-ring.png",
    summary: "把健康数据、设备绑定和日常提醒收拢成稳定路径，让用户每天打开也不费劲。",
  },
  {
    name: "AI Website / Brand",
    label: "Visual system",
    image: "/portfolio-assets/cover-neon.png",
    summary: "把 AI 产品、官网视觉和品牌物料做成可延展的识别系统，而不是一次性的漂亮页面。",
  },
];

const capabilityPills = [
  { icon: MonitorSmartphone, label: "App / Web / PC UI" },
  { icon: Watch, label: "智能穿戴" },
  { icon: BrainCircuit, label: "AI 产品视觉" },
  { icon: PencilRuler, label: "0-1 设计流程" },
  { icon: Wand2, label: "Motion / Icon" },
];

const navItems = ["About", "Work", "System", "Motion", "Contact"];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const letterBlock = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

function PortfolioLogo() {
  return (
    <motion.svg
      viewBox="0 0 840 100"
      className="h-auto w-full fill-[#111]"
      aria-label="XK portfolio"
      initial="initial"
      animate="animate"
      variants={{
        initial: { scale: 1.03 },
        animate: {
          scale: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.1 },
        },
      }}
    >
      <motion.g variants={letterBlock}>
        <polygon points="0,0 18,0 214,100 196,100" />
        <polygon points="196,0 214,0 18,100 0,100" />
      </motion.g>
      <motion.g transform="translate(280,0)" variants={letterBlock}>
        <polygon points="0,0 18,0 18,100 0,100" />
        <polygon points="196,0 214,0 214,100 196,100" />
        <polygon points="18,43 196,43 196,57 18,57" />
      </motion.g>
      <motion.g transform="translate(560,0)" variants={letterBlock}>
        <polygon points="0,0 18,0 18,100 0,100" />
        <polygon points="18,43 182,0 214,0 82,47 214,100 182,100 18,57" />
      </motion.g>
    </motion.svg>
  );
}

function LeafMark() {
  return (
    <svg viewBox="0 0 28 28" className="h-6 w-6" aria-hidden="true">
      <path d="M22.6 4.8c-8.2.3-14.2 4.8-16 11.9 6.8.5 13.9-3.1 16-11.9Z" fill="currentColor" />
      <path d="M6.8 17.1c3.1-3.8 7.1-6.1 12-7.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.2 18.9c-1.7 1.4-3.1 3-4.1 4.9" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.6 8.5c-3.2.9-5 3.4-5.5 7.5 2.9-.2 5.3-2.6 5.5-7.5Z" fill="currentColor" opacity=".72" />
    </svg>
  );
}

function SandTransitionImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isPresent, safeToRemove] = usePresence();
  const filterId = useId().replace(/:/g, "");
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const offsetRef = useRef<SVGFEOffsetElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const matrixRef = useRef<SVGFEColorMatrixElement>(null);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const duration = 900;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - startedAt) / duration);
      const eased = isPresent ? 1 - Math.pow(1 - raw, 4) : Math.pow(raw, 3);
      const progress = isPresent ? 1 - eased : eased;

      displacementRef.current?.setAttribute("scale", `${progress * 150}`);
      offsetRef.current?.setAttribute("dx", `${(isPresent ? -30 : 30) * progress}`);
      offsetRef.current?.setAttribute("dy", `${(isPresent ? -80 : 120) * progress}`);
      blurRef.current?.setAttribute("stdDeviation", `${progress * 6}`);
      matrixRef.current?.setAttribute("values", `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${Math.max(0, 1 - progress * 1.2)} 0`);

      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      } else if (!isPresent) {
        safeToRemove();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPresent, safeToRemove]);

  return (
    <>
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <filter id={`sand-${filterId}`}>
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise" />
          <feDisplacementMap ref={displacementRef} in="SourceGraphic" in2="noise" scale="0" result="displaced" />
          <feOffset ref={offsetRef} in="displaced" dx="0" dy="0" result="offset" />
          <feGaussianBlur ref={blurRef} in="offset" stdDeviation="0" result="blurred" />
          <feColorMatrix ref={matrixRef} in="blurred" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
        </filter>
      </svg>
      <motion.img
        src={src}
        alt={alt}
        className={className}
        style={{ filter: `url(#sand-${filterId})` }}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />
    </>
  );
}

export default function ReferenceDinoPage() {
  const [showVisual, setShowVisual] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const active = chaptersData[activeChapter];

  useEffect(() => {
    const visualTimer = window.setTimeout(() => setShowVisual(true), 1200);
    const chapterTimer = window.setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % chaptersData.length);
    }, 3500);

    return () => {
      window.clearTimeout(visualTimer);
      window.clearInterval(chapterTimer);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fcfcfc] text-[#111] selection:bg-black selection:text-white">
      <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <motion.header
          className="relative z-20 px-6 pt-6 md:px-16"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        >
          <motion.h1 className="m-0" variants={fadeUp}>
            <PortfolioLogo />
          </motion.h1>

          <motion.div
            className="mt-8 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.2em] md:text-[11px]"
            variants={fadeUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-[36%] leading-relaxed md:w-[15%]">
              <p>Xu</p>
              <p>Xiao</p>
              <p>Lin</p>
            </div>
            <ArrowRight className="hidden w-[5%] text-gray-400 md:block" size={14} strokeWidth={1} />
            <p className="flex-1 leading-relaxed text-gray-800 md:w-[30%] md:flex-none">
              把 AI、硬件和多端界面里的复杂信息，整理成用户第一眼就知道怎么走的体验。
            </p>
            <ArrowRight className="hidden w-[5%] text-gray-400 md:block" size={14} strokeWidth={1} />
            <div className="hidden w-[15%] space-y-2 text-gray-800 md:block">
              {navItems.map((item) => (
                <a className="block hover:text-black hover:underline" href={`#${item.toLowerCase()}`} key={item}>
                  {item}
                </a>
              ))}
            </div>
            <button
              className="relative z-[60] ml-6 flex w-10 flex-col items-end gap-[6px] md:hidden"
              type="button"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isMobileMenuOpen ? "w-10 translate-y-[4px] rotate-45" : "w-8"
                }`}
              />
              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isMobileMenuOpen ? "w-10 -translate-y-[4px] -rotate-45" : "w-8"
                }`}
              />
            </button>
          </motion.div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="absolute left-0 top-full z-50 w-full border-b border-gray-200 bg-[#fcfcfc] px-8 py-8 font-mono text-sm uppercase tracking-[0.2em] shadow-xl md:hidden"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <div className="space-y-6">
                  {navItems.map((item) => (
                    <a className="block text-gray-800" href={`#${item.toLowerCase()}`} key={item} onClick={() => setIsMobileMenuOpen(false)}>
                      {item}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <AnimatePresence>
          {showVisual && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <img className="h-full w-full object-cover opacity-20 grayscale" src="/portfolio-assets/hero.png" alt="" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#fcfcfc_0%,rgba(252,252,252,.72)_38%,rgba(252,252,252,.16)_100%)]" />
              <div className="absolute right-[-12vw] top-[22vh] h-[54vw] w-[54vw] rounded-full border border-black/10" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 mt-20 flex flex-1 justify-between px-10 sm:mt-28 md:mt-32 md:px-16">
          <motion.div
            className="w-[320px]"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
          >
            <motion.div className="mb-6 flex items-center gap-4 font-mono text-xs" variants={fadeUp}>
              <span>01</span>
              <span className="h-[1.5px] w-16 bg-black/20" />
            </motion.div>
            <motion.h2 className="text-[3.5rem] font-normal leading-[1] tracking-tight md:text-[5rem]" variants={fadeUp}>
              CLEAR
              <br />
              SYSTEMS
            </motion.h2>
            <motion.p className="mt-6 w-[250px] text-[13px] leading-[1.6] text-gray-700 md:text-[14px]" variants={fadeUp}>
              我做 App、Web、PC 和智能硬件界面。比起堆概念，我更在意用户打开时能不能马上知道下一步。
            </motion.p>
            <motion.a
              href="#work"
              className="group relative mt-8 inline-flex overflow-hidden rounded-md border border-[#1a1a1a] bg-[#1a1a1a] px-6 py-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(17,17,17,0.5)] active:translate-y-0 active:shadow-none"
              variants={fadeUp}
            >
              <span className="absolute inset-0 -translate-x-[101%] bg-[#fcfcfc] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative z-10 mr-3 text-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-[#111]">
                <LeafMark />
              </span>
              <span className="relative z-10 text-[15px] font-medium text-white transition-colors group-hover:text-[#111]">查看作品</span>
            </motion.a>
          </motion.div>

          <motion.aside
            className="mt-20 hidden w-[220px] flex-col md:flex"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}
          >
            <motion.div variants={fadeUp}>
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest">Current Focus</h3>
              <p className="mt-3 text-[12px] leading-[1.6] text-gray-600">AI 产品系统 / 智能穿戴 / 多端体验重构</p>
            </motion.div>
            <motion.div className="mt-8 grid grid-cols-2 gap-6" variants={fadeUp}>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Projects</p>
                <strong className="text-[13px] font-medium">20+</strong>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Years</p>
                <strong className="text-[13px] font-medium">6+</strong>
              </div>
            </motion.div>
            <motion.a className="mt-9 inline-flex items-center gap-4" href="#system" variants={fadeUp}>
              <span className="grid h-10 w-10 rounded-full border border-gray-400 place-items-center transition-colors hover:border-black hover:bg-[#111] hover:text-white">
                <Plus size={16} strokeWidth={1.5} />
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">View Details</span>
            </motion.a>
          </motion.aside>
        </div>

        <motion.div
          className="absolute bottom-10 left-[2.5rem] hidden items-center gap-4 md:left-[4rem] md:flex"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="flex h-12 w-12 items-center justify-center gap-[4px] rounded-full border border-gray-300">
            <span className="h-[12px] w-px bg-gray-600" />
            <span className="h-[12px] w-px bg-gray-600" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Scroll to explore</span>
        </motion.div>
      </section>

      <section id="about" className="relative z-20 flex min-h-[75vh] w-full flex-col items-center bg-[#fcfcfc] px-8 pb-0 pt-24 md:min-h-screen md:pt-32">
        <p className="mb-12 font-mono text-[10px] uppercase tracking-[0.2em] md:text-[11px]">
          <span className="text-gray-500">[ 02 ]</span> <span className="font-bold text-gray-900">Explore My System</span>
        </p>
        <motion.h2
          className="max-w-[1000px] text-center text-[2.2rem] font-medium leading-[1.1] tracking-tight text-[#111] md:text-[3.5rem] lg:text-[4.2rem]"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          把复杂产品里的入口、状态、数据和反馈，
          <br className="hidden md:block" />
          重新整理成清楚、稳定、好上手的界面。
        </motion.h2>
        <motion.div
          className="mt-10 flex max-w-5xl flex-wrap justify-center gap-3 md:mb-24 md:gap-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        >
          {capabilityPills.map(({ icon: Icon, label }) => (
            <motion.a
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/50 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-800 backdrop-blur-sm transition-colors hover:border-black hover:bg-black hover:text-white"
              href="#work"
              variants={fadeUp}
              key={label}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </motion.a>
          ))}
        </motion.div>
        <div className="min-h-[220px] md:min-h-[450px]" />
        <div className="pointer-events-none absolute bottom-0 hidden w-full justify-between px-16 pb-12 font-mono text-[10px] font-medium uppercase tracking-widest text-gray-500 md:flex">
          <span>WE DO NOT JUST MAKE SCREENS.</span>
          <span>PORTFOLIO (C) 2026</span>
        </div>
      </section>

      <section id="work" className="relative z-30 flex w-full flex-col bg-[#0a0a0a] text-white">
        <motion.img
          className="pointer-events-none absolute left-1/2 top-0 z-0 w-[160vw] max-w-none -translate-x-1/2 object-contain md:w-[1100px]"
          src="/portfolio-assets/hero.png"
          alt=""
          initial={{ y: "-65%", opacity: 0 }}
          whileInView={{ y: "-78%", opacity: 0.92 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        <div id="system" className="relative z-10 mb-16 flex flex-col justify-between gap-12 px-8 pt-32 md:px-16 md:pt-48 xl:flex-row">
          <h2 className="max-w-5xl text-[1.8rem] font-medium leading-[1.15] tracking-tight text-white md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem]">
            Curated from years of product work
            <span className="mx-2 inline-flex translate-y-[-4px] gap-2 align-middle md:mx-4 md:gap-3">
              {[Blocks, Cpu, Sparkles].map((Icon, index) => (
                <span
                  className="inline-grid h-10 w-10 place-items-center rounded-full border border-gray-600 bg-black text-gray-400 transition-colors hover:border-white hover:bg-white hover:text-black md:h-14 md:w-14"
                  key={index}
                >
                  <Icon size={22} />
                </span>
              ))}
            </span>
            into clearer interfaces & calmer decisions.
          </h2>
          <div className="max-w-sm">
            <p className="mb-6 font-mono text-[9px] uppercase leading-relaxed tracking-widest text-gray-400 md:text-[10px]">
              不只是做漂亮封面
              <br />
              更是在帮产品找到可持续的体验秩序
            </p>
            <div className="flex flex-wrap gap-3">
              {["Structured", "Practical", "Memorable"].map((pill) => (
                <span
                  className="rounded-full border border-gray-600 px-5 py-2 font-mono text-[9px] uppercase tracking-widest text-gray-300 transition-colors hover:border-white hover:bg-white hover:text-black"
                  key={pill}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 h-px bg-gray-800" />
        <div className="relative z-10 flex flex-col md:flex-row">
          <div className="relative flex min-h-[400px] border-b border-gray-800 p-8 md:min-h-[500px] md:w-[35%] md:border-b-0 md:border-r">
            <span className="absolute left-8 top-8 text-xl tracking-[0.3em] text-gray-500">***</span>
            <div className="relative m-auto h-[80%] w-[80%]">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={active.image}
                  src={active.image}
                  alt={active.name}
                  className="absolute inset-0 m-auto h-full w-full object-contain mix-blend-lighten"
                />
              </AnimatePresence>
            </div>
            <div className="absolute bottom-8 left-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[#888]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeChapter}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                >
                  {String(activeChapter + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
              <span className="text-[#333]">/</span>
              <span>05</span>
            </div>
          </div>

          <div className="md:w-[65%]">
            <div className="flex items-center justify-between border-b border-gray-800 p-8 font-mono text-[10px] uppercase tracking-widest text-gray-400">
              <span>Design the flow. Sharpen the signal.</span>
              <AnimatePresence mode="wait">
                <motion.span key={activeChapter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Chapter {String(activeChapter + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <div>
              {chaptersData.map((chapter, index) => {
                const isActive = index === activeChapter;
                return (
                  <button
                    className={`group flex w-full items-center justify-between border-b border-gray-800/80 px-8 py-8 text-left transition-colors ${
                      isActive ? "text-white" : "text-[#444] hover:text-[#999]"
                    }`}
                    type="button"
                    onClick={() => setActiveChapter(index)}
                    key={chapter.name}
                  >
                    <span>
                      <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-gray-500">{chapter.label}</span>
                      <span className="block text-2xl font-medium tracking-tight md:text-[2rem]">{chapter.name}</span>
                      <span className={`mt-3 block max-w-xl text-sm leading-6 transition-colors ${isActive ? "text-gray-400" : "text-[#555]"}`}>
                        {chapter.summary}
                      </span>
                    </span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                          <ArrowUpRight className="text-gray-400" size={22} strokeWidth={1} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-800" />
        <div id="contact" className="flex flex-col gap-6 bg-[#0a0a0a] px-8 py-8 font-mono text-[10px] uppercase tracking-widest text-gray-500 md:flex-row md:items-center md:justify-between">
          <span>BUILDING INTERFACES THAT FEEL LESS HEAVY</span>
          <a className="inline-flex items-center gap-2 text-gray-300 transition-colors hover:text-white" href="mailto:1827617577@qq.com">
            1827617577@qq.com <ChevronRight size={14} />
          </a>
        </div>
      </section>
    </main>
  );
}
