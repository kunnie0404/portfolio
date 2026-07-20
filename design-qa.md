**Comparison Target**

- Source visual truth: Browser Comment 1 screenshot attached in the current Codex task (`reference-dino-preview.html#portfolio-collection`).
- Implementation screenshot: in-app Browser capture of `https://www.kunnie0217.art/?verify=1ce921f#portfolio-collection`.
- Viewports: 1280 × 720 desktop and 390 × 844 mobile.
- State: Portfolio collection, chapter 03 list visible on desktop and the matching collection visual visible on mobile.

**Full-view Comparison Evidence**

- The left visual panel keeps its original dimensions and grid position.
- The project image is visibly higher inside the panel while the right project list remains unchanged.
- Navigation, chapter header, stars, counter, typography, colors, and copy preserve the existing design.
- The heading veil now ends at the project divider instead of extending into the project panel.

**Focused Region Comparison Evidence**

- `.chapter-image` resolves to `translate: 0 -30%` on desktop and `translate: none` at 390 × 844 mobile.
- The mobile collection panel remains 420px high, the image keeps its original in-panel position, and no horizontal overflow is introduced.
- At 1468 × 674, `.collection-head` ends at y=719.094 and `.collection-panel` starts at y=719.094; the veil and divider are flush with no overlap.
- `.collection-visual`, `.collection-stars`, and `.chapter-counter` all resolve to `translate: none`; the panel markers were not moved with the image.
- The image remains contained without stretching, pixelation, or a changed blend treatment.

**Findings**

- No actionable P0, P1, or P2 visual differences remain for the requested image-position adjustment.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Raise only the project image on desktop.
- [x] Restore the original image position on mobile.
- [x] Preserve the panel, stars, counter, list, and interactions.
- [x] Verify the production CSS and rendered placement.

**Comparison History**

- Iteration 1 finding: the previous desktop offset of -18% was still too low (P2).
- Fix made: increased desktop offset to -30%; a later user review removed the mobile offset entirely.
- Post-fix evidence: production Browser capture shows the desktop image higher in the unchanged panel; the mobile media rule explicitly resets image translation while surrounding markers remain unmoved.
- Iteration 2 finding: the fixed-height heading veil extended below the divider into the project region (P2).
- Fix made: bound the gradient background to `.collection-head` and disabled the fixed-height collection pseudo-element.
- Post-fix evidence: the production Browser measurement shows the heading bottom and project panel top at the same y-coordinate, and the 1468 × 674 capture shows a clean divider edge.

**Follow-up Polish**

- None required for this scoped adjustment.

final result: passed
