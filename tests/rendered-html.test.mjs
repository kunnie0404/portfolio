import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import test, { after, before } from "node:test";

const projects = {
  echos: { name: "Echos", prefix: "echos", start: 1, end: 12 },
  "mo-glass": { name: "MO GLASS", prefix: "moglass", start: 1, end: 12 },
  "da-ring": { name: "Da Ring", prefix: "daring", start: 1, end: 9 },
  luxury: { name: "Luxury", prefix: "Luxury", start: 9, end: 14 },
  neon: { name: "NEON", prefix: "neon", start: 3, end: 8 },
};

const port = 43173;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

before(async () => {
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: new URL("..", import.meta.url),
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk;
  });
  server.stderr.on("data", (chunk) => {
    output += chunk;
  });

  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before tests started.\n${output}`);
    }

    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status < 500) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for Next.js.\n${output}`);
});

after(() => {
  server?.kill();
});

async function render(pathname) {
  return fetch(new URL(pathname, baseUrl), {
    headers: { accept: "text/html" },
  });
}

test("home page links only the five projects with detail assets", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>许晓琨｜UI 设计作品集<\/title>/);
  assert.match(html, /<section id=["']home["'] class=["']hero["']/);
  assert.match(html, /<div id=["']work-first["'] class=["']chapter-list["']/);
  assert.doesNotMatch(html, /(?:src|href)=["']public\//);

  for (const slug of Object.keys(projects)) {
    assert.match(html, new RegExp(`href=["']\\/projects\\/${slug}["']`));
  }

  assert.doesNotMatch(html, /href=["']\/projects\/soda/i);
});

for (const [slug, project] of Object.entries(projects)) {
  test(`${project.name} renders every image in numeric order`, async () => {
    const response = await render(`/projects/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.match(html, /href=["']\/#work-first["']/);
    let lastIndex = -1;

    for (let number = project.start; number <= project.end; number += 1) {
      const stem = `/portfolio-assets/projects/${slug}/${project.prefix}_${number}`;
      await Promise.all(
        ["avif", "webp"].map((extension) =>
          access(new URL(`../public${stem}.${extension}`, import.meta.url)),
        ),
      );
      const currentIndex = html.indexOf(`${stem}.webp`);
      assert.ok(currentIndex > lastIndex, `${stem} should be in numeric order`);
      lastIndex = currentIndex;
    }
  });
}

test("unknown project slugs return 404", async () => {
  const response = await render("/projects/not-a-project");
  assert.equal(response.status, 404);
});

test("obsolete reference route is removed", async () => {
  const response = await render("/reference-dino");
  assert.equal(response.status, 404);
});

test("other page renders all animated WebP files in numeric order", async () => {
  const response = await render("/other");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, />Dynamic Effect</);
  assert.match(html, /type=["']image\/avif["']/);
  assert.match(html, /type=["']image\/webp["']/);
  assert.doesNotMatch(html, /(?:src|srcset)=["'][^"']+\.(?:png|gif)["']/i);

  let lastIndex = -1;
  for (let number = 1; number <= 13; number += 1) {
    const file = `/portfolio-assets/other/motion-${String(number).padStart(2, "0")}.webp`;
    await access(new URL(`../public${file}`, import.meta.url));
    const currentIndex = html.indexOf(file);
    assert.ok(currentIndex > lastIndex, `${file} should be in numeric order`);
    lastIndex = currentIndex;
  }

  for (const [folder, prefix, count] of [
    ["classic", "classic", 29],
    ["digital", "digital", 26],
  ]) {
    let previousIndex = -1;
    for (let number = 1; number <= count; number += 1) {
      const stem = `/portfolio-assets/other/${folder}/${prefix}-${String(number).padStart(2, "0")}`;
      await Promise.all(
        ["avif", "webp"].map((extension) =>
          access(new URL(`../public${stem}.${extension}`, import.meta.url)),
        ),
      );
      const currentIndex = html.indexOf(`${stem}.webp`);
      assert.ok(currentIndex > previousIndex, `${stem} should be in numeric order`);
      previousIndex = currentIndex;
    }
  }

  let previousShowcaseIndex = -1;
  for (let number = 1; number <= 9; number += 1) {
    const stem = `/portfolio-assets/other/showcase/showcase-${String(number).padStart(2, "0")}`;
    await Promise.all(
      ["avif", "webp"].map((extension) =>
        access(new URL(`../public${stem}.${extension}`, import.meta.url)),
      ),
    );
    const currentIndex = html.indexOf(`${stem}.webp`);
    assert.ok(currentIndex > previousShowcaseIndex, `${stem} should be in numeric order`);
    previousShowcaseIndex = currentIndex;
  }
});

test("detail gallery keeps images full-width and gapless", async () => {
  const [css, preview] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../project-detail-preview.html", import.meta.url), "utf8"),
  ]);

  assert.match(css, /\.project-detail-gallery\s*\{[^}]*width:\s*100%[^}]*padding-top:\s*0/s);
  assert.match(
    css,
    /\.project-detail-gallery img\s*\{[^}]*display:\s*block[^}]*width:\s*100%[^}]*height:\s*auto[^}]*margin:\s*0/s,
  );
  assert.match(preview, /\.gallery\s*\{[^}]*width:\s*100%[^}]*padding-top:\s*0/s);
});

test("reference preview catalog links to the five project pages", async () => {
  const html = await readFile(
    new URL("../reference-dino-preview.html", import.meta.url),
    "utf8",
  );

  for (const slug of Object.keys(projects)) {
    assert.match(
      html,
      new RegExp(`data-project-route=["']\\/projects\\/${slug}["']`),
    );
  }

  assert.match(html, /data-project-route=["']\/other["']/);
  assert.doesNotMatch(html, /data-project-route=["']\/projects\/other/i);
  assert.match(html, /window\.location\.protocol === ["']file:["']/);
  assert.match(html, /project-detail-preview\.html\?project=\$\{slug\}/);
  assert.doesNotMatch(html, /http:\/\/localhost:3000/);
});

test("Work heading veil ends exactly at the project divider", async () => {
  const html = await readFile(
    new URL("../reference-dino-preview.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /\.collection::before\s*\{[^}]*content:\s*none/s);
  assert.match(
    html,
    /\.collection-head\s*\{[^}]*background:\s*linear-gradient\([\s\S]*?rgba\(0, 0, 0, 0\) 0%[\s\S]*?#000 100%/s,
  );
});

test("catalog project preview image sits higher in its visual panel", async () => {
  const html = await readFile(
    new URL("../reference-dino-preview.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /\.chapter-image\s*\{[^}]*translate:\s*0\s+-30%/s);
  assert.match(
    html,
    /@media \(max-width: 809\.98px\)[\s\S]*?\.chapter-image\s*\{[^}]*translate:\s*none/s,
  );
});

test("hero presentation follows the reviewed visual details", async () => {
  const html = await readFile(
    new URL("../reference-dino-preview.html", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(html, /Water Wave|Gridwave|Light Tunnel|Hero theme switcher/i);
  assert.match(html, /\.hero-background video\s*\{[^}]*object-position:\s*center center/s);
  assert.match(html, /class=["']availability["'][^>]*>[\s\S]*?id=["']statusDot["']/);
  assert.match(html, /<span>Start A Project<\/span>/);
  assert.match(html, /time\.education-degree\s*\{[^}]*color:\s*#fff/s);
  assert.match(html, /<time class=["']education-degree["']>本科<\/time>/);
});

test("offline detail preview includes every project and local image path", async () => {
  const html = await readFile(
    new URL("../project-detail-preview.html", import.meta.url),
    "utf8",
  );

  for (const [slug, project] of Object.entries(projects)) {
    assert.match(html, new RegExp(`["']?${slug}["']?\\s*:`));
    assert.match(html, new RegExp(`prefix:\\s*["']${project.prefix}["']`));
  }

  assert.match(
    html,
    /public\/portfolio-assets\/projects\/\$\{slug\}\/\$\{project\.prefix\}_\$\{number\}\.webp/,
  );
  assert.match(html, /reference-dino-preview\.html#portfolio-collection/);
});

test("offline detail preview includes the Other motion gallery", async () => {
  const html = await readFile(
    new URL("../project-detail-preview.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /other:\s*\{\s*name:\s*["']Dynamic Effect["']/);
  assert.match(html, /public\/portfolio-assets\/other\/motion-\$\{index\}\.webp/);
  assert.match(html, /class=["']motion-scroller["']/);
  assert.match(html, />Classic Watch Faces</);
  assert.match(html, />Digital Watch Faces</);
  assert.match(html, /classicTrack,\s*["']classic["'],\s*["']classic["'],\s*29/);
  assert.match(html, /digitalTrack,\s*["']digital["'],\s*["']digital["'],\s*26/);
  assert.match(html, /\.watch-face-card img\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(html, /\.other-showcase-gallery img\s*\{[^}]*display:\s*block[^}]*width:\s*100%[^}]*height:\s*auto[^}]*margin:\s*0/s);
  assert.match(html, /public\/portfolio-assets\/other\/showcase\/showcase-\$\{index\}\.webp/);
  assert.match(html, /grid-template-columns:\s*repeat\(6,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(html, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(html, /\.motion-card\s*\{[^}]*border-radius:\s*50%/s);
  assert.match(html, /\.motion-scroller\s*\{[^}]*margin-top:\s*clamp\(160px,\s*24vh,\s*300px\)/s);
  assert.match(html, /\.motion-heading h2\s*\{[^}]*font-family:\s*Figtree,\s*Arial,\s*sans-serif[^}]*font-size:\s*clamp\(34px,\s*5vw,\s*76px\)[^}]*font-weight:\s*500/s);
  assert.match(html, /\.watch-face-section h3\s*\{[^}]*font-family:\s*Figtree,\s*Arial,\s*sans-serif[^}]*font-weight:\s*500/s);
  assert.doesNotMatch(html, /createElement\(["']figcaption["']\)/);
  assert.doesNotMatch(html, /scroller\.addEventListener\(["']pointerdown["']/);
  assert.doesNotMatch(html, /scroller\.addEventListener\(["']wheel["']/);
});

test("navigation stays fixed at the top of catalog and detail pages", async () => {
  const [catalog, offlineDetail, globalCss] = await Promise.all([
    readFile(new URL("../reference-dino-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../project-detail-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(catalog, /\.navbar\s*\{[^}]*position:\s*fixed[^}]*z-index:\s*100/s);
  assert.match(catalog, /\.navbar\s*\{[^}]*top:\s*16px[^}]*left:\s*0[^}]*width:\s*100%/s);
  assert.match(catalog, /\.desktop-nav\s*\{[^}]*grid-column:\s*2[^}]*justify-self:\s*center/s);
  assert.match(catalog, /\.nav-meta\s*\{[^}]*grid-column:\s*3[^}]*justify-self:\s*end/s);
  assert.match(offlineDetail, /\.detail-header\s*\{[^}]*position:\s*fixed[^}]*top:\s*16px[^}]*left:\s*0[^}]*width:\s*100%[^}]*z-index:\s*100/s);
  assert.match(globalCss, /\.project-detail-header\s*\{[^}]*position:\s*fixed[^}]*top:\s*16px[^}]*left:\s*0[^}]*width:\s*100%[^}]*z-index:\s*100/s);
});

test("Home and Work navigation target the hero and first project list", async () => {
  const [catalog, offlineDetail, route] = await Promise.all([
    readFile(new URL("../reference-dino-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../project-detail-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../app/projects/[slug]/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(catalog, /href=["']#home["'][^>]*>[\s\S]*?Home/);
  assert.match(catalog, /href=["']#work-first["'][^>]*>[\s\S]*?Work/);
  assert.match(catalog, /<section id=["']home["'] class=["']hero["']/);
  assert.match(catalog, /<div id=["']work-first["'] class=["']chapter-list["']/);
  assert.match(catalog, /#work-first\s*\{[^}]*scroll-margin-top:\s*74px/s);
  assert.match(offlineDetail, /href=["']reference-dino-preview\.html#portfolio-collection["'][^>]*>[\s\S]*?Work/);
  assert.match(route, /href=["']\/#work-first["'][^>]*><span>Work<\/span>/);
});

test("Work is browsed before About on the production home page", async () => {
  const preview = await readFile(
    new URL("../reference-dino-preview.html", import.meta.url),
    "utf8",
  );

  assert.match(preview, /\.collection\s*\{[^}]*order:\s*1/s);
  assert.match(preview, /\.about-page\s*\{[^}]*order:\s*2/s);
});

test("Contact navigation targets the footer after the About section", async () => {
  const preview = await readFile(
    new URL("../reference-dino-preview.html", import.meta.url),
    "utf8",
  );

  assert.match(preview, /<footer class=["']collection-footer["'] id=["']contact["']/);
  assert.doesNotMatch(preview, /class=["']availability["'][^>]*id=["']contact["']/);
  assert.ok(preview.indexOf('id="about"') < preview.indexOf('id="contact"'));
});

test("catalog and detail navigation use layered liquid glass styling", async () => {
  const [catalog, offlineDetail, globalCss] = await Promise.all([
    readFile(new URL("../reference-dino-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../project-detail-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  for (const source of [catalog, offlineDetail, globalCss]) {
    assert.match(source, /backdrop-filter:\s*blur\(20px\)\s+saturate\(165%\)/);
    assert.match(source, /inset\s+0\s+0\s+18px/);
  }

  assert.match(catalog, /\.nav-link\s*\{[^}]*background:\s*transparent[^}]*color:\s*#fff/s);
  assert.match(catalog, /\.nav-link::before\s*\{[^}]*background:\s*#fff/s);
  assert.match(catalog, /\.nav-link:hover,[\s\S]*?color:\s*#000/);
  assert.match(catalog, /border-radius:\s*999px/);
  assert.match(globalCss, /\.project-detail-nav-links a > span\s*\{[^}]*z-index:\s*1[^}]*color:\s*inherit/s);
  assert.match(globalCss, /\.project-detail-nav-links a:hover > span,[\s\S]*?color:\s*#000/);
});

test("detail navigation keeps its links and uses the supplied return icon", async () => {
  const [offlineDetail, route, otherRoute, icon, globalCss, liquidGlassNav] = await Promise.all([
    readFile(new URL("../project-detail-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../app/projects/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/other/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/portfolio-assets/return.svg", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../components/ui/liquid-glass-nav.tsx", import.meta.url), "utf8"),
  ]);

  for (const label of ["Home", "Work", "About", "Contact"]) {
    assert.match(offlineDetail, new RegExp(`>${label}<`));
  }

  for (const label of ["Home", "Work", "About", "Contact"]) {
    assert.match(route, new RegExp(`<span>${label}<\\/span>`));
  }

  assert.doesNotMatch(offlineDetail, /<span>Other<\/span>/);
  assert.doesNotMatch(route, /<span>Other<\/span>/);

  assert.match(offlineDetail, /href=["']reference-dino-preview\.html#about["'][^>]*><span>Contact<\/span>/);
  assert.match(route, /href=["']\/#about["'][^>]*><span>Contact<\/span>/);
  assert.match(otherRoute, /href=["']\/#about["'][^>]*><span>Contact<\/span>/);
  assert.doesNotMatch(route, /href=["']\/#contact["'][^>]*><span>Contact<\/span>/);
  assert.doesNotMatch(otherRoute, /href=["']\/#contact["'][^>]*><span>Contact<\/span>/);

  assert.match(
    globalCss,
    /\.liquid-glass-nav-backdrop\s*\{[^}]*rgba\(8, 8, 8, 0\.42\)[^}]*backdrop-filter:\s*blur\(20px\)\s+saturate\(165%\)\s+contrast\(105%\)/s,
  );
  assert.match(
    offlineDetail,
    /\.liquid-glass-nav-backdrop\s*\{[^}]*rgba\(8, 8, 8, 0\.42\)[^}]*backdrop-filter:\s*blur\(20px\)\s+saturate\(165%\)\s+contrast\(105%\)/s,
  );
  assert.match(liquidGlassNav, /liquid-glass-nav-backdrop/);
  assert.match(liquidGlassNav, /backdropFilter:\s*["']blur\(20px\) saturate\(165%\) contrast\(105%\)["']/);
  assert.match(offlineDetail, /style=["'][^"']*backdrop-filter:\s*blur\(20px\) saturate\(165%\) contrast\(105%\)/);
  assert.doesNotMatch(liquidGlassNav, /feTurbulence|feDisplacementMap/);
  assert.match(route, /<LiquidGlassNav className=["']project-detail-nav-links["']/);
  assert.match(otherRoute, /<LiquidGlassNav className=["']project-detail-nav-links["']/);

  assert.match(offlineDetail, /<img[^>]*class=["']return-icon["'][^>]*src=["']public\/portfolio-assets\/return\.svg["']/);
  assert.match(offlineDetail, /\.return-icon\s*\{[^}]*filter:\s*brightness\(0\)\s+invert\(1\)/s);
  assert.match(offlineDetail, /\.back-link\s*\{[^}]*background:\s*rgba\(0,\s*0,\s*0,\s*0\.1\)/s);
  assert.match(offlineDetail, /\.back-link:hover,[\s\S]*?color:\s*#fff/);
  assert.match(offlineDetail, /class=["']detail-email["'][^>]*mailto:1827617577@qq\.com/);
  assert.match(route, /project-detail-return-icon/);
  assert.match(route, /src=["']\/portfolio-assets\/return\.svg["']/);
  assert.match(route, /className=["']project-detail-email["']/);
  assert.match(icon, /viewBox=["']0 0 78 78["']/);
  assert.match(globalCss, /\.project-detail-back\s*\{[^}]*background:\s*rgba\(0,\s*0,\s*0,\s*0\.1\)/s);
});

test("spotlight cursor runs across app and offline previews without blocking input", async () => {
  const [catalog, offlineDetail, component, script, layout] = await Promise.all([
    readFile(new URL("../reference-dino-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../project-detail-preview.html", import.meta.url), "utf8"),
    readFile(new URL("../components/ui/spotlight-cursor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/spotlight-cursor.js", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  for (const preview of [catalog, offlineDetail]) {
    assert.match(preview, /data-spotlight-cursor/);
    assert.match(preview, /public\/spotlight-cursor\.js/);
    assert.match(preview, /pointer-events:\s*none/);
  }

  assert.match(component, /requestAnimationFrame/);
  assert.match(component, /\(pointer:\s*coarse\)/);
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /currentX \+= \(targetX - currentX\) \* smoothing/);
  assert.match(layout, /<SpotlightCursor \/>/);
});
