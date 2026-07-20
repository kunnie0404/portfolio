# Design QA

- Source visual truth: `C:/Users/ASUS/Desktop/image 1637.png`
- Implementation URL: `https://www.kunnie0217.art/?verify=972110b#home`
- Implementation screenshot: `D:/CodexProjects/网站1.0/qa/hero-production.png`
- Combined comparison: `D:/CodexProjects/网站1.0/qa/hero-comparison.png`
- Responsive evidence: `D:/CodexProjects/网站1.0/qa/hero-mobile.png`
- Viewport: 1672 × 941 desktop; 390 × 844 responsive check
- State: homepage hero, initial poster/video surface, centered cover crop

## Full-view comparison evidence

The combined comparison places the supplied bubble-girl image on the left and the production browser-rendered hero on the right at the same 1672 × 941 viewport. The implementation uses the exact supplied subject, keeps the central bubble and girl centered, preserves the source aspect ratio through `object-fit: cover`, and applies only the homepage's existing dark overlay and content layers.

## Focused comparison evidence

No separate crop was needed because the full-view comparison keeps the source and implementation at matching dimensions and the important subject, highlights, bubble edges, and crop boundaries remain readable. Browser inspection confirmed the video and its background container share the same 1657 × 941 rendered box, with `object-fit: cover` and `object-position: 50% 50%`.

## Required fidelity surfaces

- Fonts and typography: unchanged from the existing homepage; navigation, hero title, supporting copy, and CTA keep their reviewed sizing and hierarchy.
- Spacing and layout rhythm: unchanged; the poster occupies the same full-screen hero box as the video. The 15px width difference from the requested viewport is the browser scrollbar, not layout drift.
- Colors and visual tokens: the supplied image colors are preserved. The darker appearance in the rendered hero is the existing intentional homepage overlay, which maintains text contrast.
- Image quality and asset fidelity: exact supplied image used, encoded once to an 88-quality WebP at 1672 × 941 (about 86 KB). The subject remains sharp and centered with no stretching or replacement artwork.
- Copy and content: unchanged.

## Responsive evidence

At 390 × 844, browser inspection confirmed the same poster URL, `object-fit: cover`, `object-position: 50% 50%`, and a hero/video box matching the visible viewport height. No console warnings or errors were recorded at either viewport.

## WORK image quality

A representative 1280px Echos project image was visually inspected after recompression. Fine interface text, gradients, device edges, and dark tonal transitions remained readable and free of obvious banding or blur. All WORK images were rebuilt from their original PNG files rather than recompressed from prior WebP/AVIF files.

## Findings

- No actionable P0, P1, or P2 visual differences.
- Acceptable intentional difference: the existing hero overlay darkens the raw source image to preserve the site's established text contrast.

## Comparison history

- Pass 1: no actionable P0/P1/P2 findings; no visual fix iteration required.

## Primary interactions tested

- Production homepage loaded successfully at the desktop viewport; the local production build was also checked at the mobile viewport.
- Poster URL, deferred video source, shared dimensions, crop mode, and crop center were inspected in the rendered browser.
- Console errors and warnings checked: none.

final result: passed
