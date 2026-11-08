# Vpple

> **Vpple** is an open-source engineering initiative reverse-engineering and cloning Apple ecosystem software, typefaces, design frameworks, and system assets under clean-room legal standards and permissive licenses (SIL OFL 1.1 / MIT).

---

## The Initiative

Apple builds industry-defining design systems, system fonts, and interaction paradigms—but restricts their deployment to Apple hardware through proprietary EULAs and trademark gates. Cross-platform developers building for Linux, Windows, Android, and the open web are left without legal access to these assets.

**Vpple** exists to solve this problem permanently through clean-room reverse engineering. We do not extract or redistribute Apple’s proprietary byte code; instead, we measure, analyze, and rebuild every geometry, metric table, and optical specification from scratch on open-source foundations.

---

## Active & Upcoming Projects

| Project | Status | Description | License |
| :--- | :--- | :--- | :--- |
| **SP Pro Display** |  **Released (v1.0.0)** | 1:1 metric-identical clone of Apple SF Pro Display. Zero line-wrap delta across all 18 weights. | SIL OFL 1.1 |
| **SP Pro Text** |  *In Development* | Optical size variant engineered specifically for small body text (< 20pt) with wider counters. | SIL OFL 1.1 |
| **SP Mono** |  *In Development* | Monospaced developer typeface matching Apple SF Mono character geometry and glyph slots. | SIL OFL 1.1 |
| **SP Compact** |  *Planned* | High-density variant clone of Apple SF Compact for smartwatch and embedded displays. | SIL OFL 1.1 |
| **Vpple UI Kit** |  *Planned* | Web component and CSS library cloning macOS Tahoe & iOS 18 glassmorphism design tokens. | MIT |
| **Vpple Symbols** |  *Planned* | Open vector icon repository mapping standard Apple SF Symbols nomenclature. | MIT |

---

## Flagship Release: SP Pro Display

**SP Pro Display** is an open-source, 1:1 metric-identical replacement for Apple's **SF Pro Display** system font. 

If you swap `SF Pro Display` for `SP Pro Display` in Figma, Sketch, or a web layout, **not a single character will reflow, shift, or wrap onto a different line**.

```
Reference:  SF Pro Display Regular   [unitsPerEm: 2048 | Ascender: 1950 | Descender: -494 | CapHeight: 1443]
Candidate:  SP Pro Display Regular   [unitsPerEm: 2048 | Ascender: 1950 | Descender: -494 | CapHeight: 1443]
Delta:      0px (0.000000%) across all tested layout containers
```

### 18 Weights & Styles Included

SP Pro Display provides the full 18-style typographic matrix:

* **Roman**: Ultralight (100), Thin (200), Light (300), Regular (400), Medium (500), Semibold (600), Bold (700), Heavy (800), Black (900)
* **Italic**: Ultralight Italic, Thin Italic, Light Italic, Regular Italic, Medium Italic, Semibold Italic, Bold Italic, Heavy Italic, Black Italic

---

## macOS 1:1 Polish & Curve Improvements

Earlier approximations of San Francisco often suffer from generic sans-serif artifacts. SP Pro Display v1.0.0 addresses these at the outline level:

1. **Footless Digit One (`1`)**: Replaces the pedestal base serif found in generic fonts with Apple’s slanted top-flag and flat bottom stem across all Roman and Italic weights.
2. **Authentic Rounded Punctuation**: Period, comma, colon, semicolon, and curly quotation marks (`‘`, `’`, `“`, `”`) utilize Apple's smooth rounded contours rather than harsh square terminal blocks.
3. **Scaled GPOS Pair Kerning**: OpenType pair kerning adjustments (`GPOS` lookup type 2) are scaled to match the isotropic cap-height transformation ratio ($S = 1443.0 / 1490.0$).
4. **Decomposed Outline Geometry**: All compound glyphs have been completely decomposed into native, independent TrueType contour coordinate sets to eliminate subglyph attachment drift.

---

## Quick Start

### 1. Web (CSS `@font-face`)

Link the stylesheet directly in your HTML or import it into your CSS:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jabirking-ux/Vpple@main/css/sp-pro-display.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jabirking-ux/Vpple@main/css/apple-typography.css">
```

Apply the font with Apple's subpixel antialiasing:

```css
body {
  font-family: "SP Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

### 2. Apple Dynamic Type Tracking

macOS renders SF Pro with size-dependent negative letter-spacing. Use the included utility classes or CSS custom properties:

```css
/* Included in css/apple-typography.css */
.apple-large-title { font-size: 34px; letter-spacing: -0.022em; font-weight: 700; }
.apple-title-1     { font-size: 28px; letter-spacing: -0.021em; font-weight: 700; }
.apple-title-2     { font-size: 22px; letter-spacing: -0.018em; font-weight: 700; }
.apple-title-3     { font-size: 20px; letter-spacing: -0.015em; font-weight: 600; }
.apple-body        { font-size: 17px; letter-spacing: -0.011em; font-weight: 400; }
```

### 3. Desktop Installation (macOS, Windows, Linux)

1. Clone or download this repository.
2. Open the [`dist/ttf/`](./dist/ttf/) folder.
3. Select all 18 `.ttf` files, right-click, and choose **Install** (Windows) or double-click to install via **Font Book** (macOS).

---

## Metric Benchmark Table

Comparison of fundamental glyph metrics between Apple reference binaries and SP Pro Display:

| Character | Codepoint | Apple Reference Width | SP Pro Display Width | Deviation |
| :---: | :---: | :---: | :---: | :---: |
| `A` | `U+0041` | 1301 | 1301 | **0** |
| `W` | `U+0057` | 1892 | 1892 | **0** |
| `g` | `U+0067` | 1124 | 1124 | **0** |
| `1` | `U+0031` | 908 | 908 | **0** |
| `2` | `U+0032` | 1159 | 1159 | **0** |
| `8` | `U+0038` | 1228 | 1228 | **0** |
| `0` | `U+0030` | 1242 | 1242 | **0** |
| `,` | `U+002C` | 440 | 440 | **0** |
| `.` | `U+002E` | 440 | 440 | **0** |
| `@` | `U+0040` | 1791 | 1791 | **0** |
| `{` | `U+007B` | 660 | 660 | **0** |
| `}` | `U+007D` | 660 | 660 | **0** |

---

## Repository Structure

```
Vpple/
├── dist/                          # Production font binaries
│   ├── ttf/                       # 18 TrueType desktop fonts
│   └── woff2/                     # 18 Compressed modern web fonts
├── css/                           # Core styles
│   ├── sp-pro-display.css         # Complete @font-face rules
│   └── apple-typography.css       # Dynamic Type tracking & utility classes
├── packages/
│   └── sp-pro-display/            # Dedicated standalone package
│       ├── dist/
│       ├── css/
│       ├── scripts/               # Reverse-engineering build pipeline
│       ├── specimens/             # Interactive web testbench
│       └── package.json           # @vpple/sp-pro-display
├── LICENSE                        # SIL Open Font License 1.1
├── package.json                   # Root monorepo workspace configuration
└── README.md                      # Project documentation
```

---

## Legal & Clean-Room Statement

* **Clean-Room Design**: SP Pro Display was built using an independent clean-room engineering pipeline. Source outline curves originate from permissively licensed open fonts (Inter Display by Rasmus Andersson, SIL OFL 1.1). No proprietary glyph binaries from Apple Inc. are contained or bundled in this release.
* **Apple Inc. Disclaimers**: Apple, SF Pro, San Francisco, macOS, and iOS are trademarks of Apple Inc., registered in the U.S. and other countries. The Vpple project is an independent community initiative and is not endorsed by, affiliated with, or sponsored by Apple Inc.
* **License**: Released under the [SIL Open Font License, Version 1.1](./LICENSE). You are free to use, bundle, embed, modify, and redistribute this font in commercial or open-source software without royalty.
