---
name: Unity & Heritage
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3e4a3f'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#6e7a6e'
  outline-variant: '#bdcabc'
  surface-tint: '#006d35'
  primary: '#006933'
  on-primary: '#ffffff'
  primary-container: '#008542'
  on-primary-container: '#eeffec'
  inverse-primary: '#71dc8e'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fecc00'
  on-secondary-container: '#6e5700'
  tertiary: '#5a5a5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#737373'
  on-tertiary-container: '#fafafa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8df9a8'
  primary-fixed-dim: '#71dc8e'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005226'
  secondary-fixed: '#ffe089'
  secondary-fixed-dim: '#f0c100'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  anc-green-dark: '#006432'
  anc-gold-muted: '#E5B800'
  surface-border: '#E2E8F0'
  status-active: '#008542'
  text-secondary: '#4A5568'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 20px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in the "Unity & Heritage" narrative, positioning the platform as a digital home for civic participation. The brand personality is **statesmanlike, authoritative, and community-centric**, reflecting the historical gravity of the organization while embracing a forward-looking digital infrastructure.

The visual style is **Corporate Modern with Editorial nuances**. It rejects fleeting trends like glassmorphism or neomorphism in favor of high-contrast layouts, structured grids, and premium material surfaces. The aesthetic priorities are:
- **Clarity of Purpose:** Information architecture that respects the user's time and intent.
- **Dignified Presence:** A palette and type scale that feels established and official.
- **Production-Ready Utility:** Components designed for real-world use cases with high accessibility and clear visual feedback.

## Colors

The palette is derived from the historic colors of the South African struggle, refined for digital legibility. 

- **ANC Green (#008542):** Used for primary actions, branding, and active status indicators. It represents growth and the land.
- **ANC Gold (#FFCD00):** Used sparingly as an accent color for highlights, secondary CTAs, and decorative elements to ensure it remains a "premium gold" rather than a "neon yellow."
- **Black (#000000):** Used for primary typography and high-impact surfaces to provide a grounded, serious tone.
- **Neutrals:** A range of sophisticated cool greys are used to define surface hierarchies and card containers, ensuring the interface feels airy and clean.

**Usage Note:** Maintain a high contrast ratio for all text on colored backgrounds. The Gold should primarily be used on Black or White backgrounds, never as a background for white text.

## Typography

This design system utilizes a dual-font strategy to balance editorial impact with functional clarity.

- **Headline Font (Hanken Grotesk):** Chosen for its sharp, contemporary geometry. It provides an "editorial" feel for news updates and major announcements. Use Bold and ExtraBold weights for hierarchy.
- **Body & Label Font (Inter):** A workhorse typeface for administrative data, member details, and long-form reading. It ensures maximum legibility across all device types.

**Hierarchy Rules:**
- Use **Display-LG** only for major campaign titles or hero sections.
- Use **Label-SM** with uppercase styling for category tags and membership status badges.
- Ensure **Body-LG** is used for news article introductions to maintain an editorial tone.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. On mobile, it uses a 4-column fluid grid; on tablet and desktop, it transitions to a 12-column centered grid with a max-width of 1280px.

**Spacing Philosophy:**
- **Rhythm:** An 8px base unit drives all spatial relationships.
- **Breathing Room:** Liberal use of `stack-lg` between major sections to prevent information density fatigue.
- **Verticality:** Content is organized in "stacks," where cards and editorial pieces are separated by consistent vertical margins.

**Breakpoints:**
- **Mobile:** < 600px (Margins: 20px)
- **Tablet:** 600px - 1024px (Margins: 40px)
- **Desktop:** > 1024px (Margins: Auto, Max-width 1280px)

## Elevation & Depth

To maintain a premium, non-fintech aesthetic, elevation is achieved through **Tonal Layers and Crisp Outlines** rather than heavy shadows.

- **Surface Levels:** 
  - Level 0 (Background): #F5F5F5
  - Level 1 (Cards/Containers): #FFFFFF
  - Level 2 (Popovers/Modals): #FFFFFF with a subtle 1px border (#E2E8F0) and a soft 10% black shadow.
- **Depth Cues:** Depth is signaled by subtle color shifts. Active states or pressed buttons move "into" the page (darker fill), while interactive cards have a slight "lift" on hover in desktop environments.
- **Borders:** 1px solid borders are the primary method for defining card boundaries, keeping the UI sharp and structured.

## Shapes

The design system uses a **Soft (0.25rem / 4px)** roundedness level to maintain a professional and architectural feel. 

- **Standard Elements:** Buttons, input fields, and small cards use 4px corners.
- **Large Components:** Editorial news cards and the Digital Member Card use `rounded-lg` (8px) to soften their presence against the grid.
- **Interactive Controls:** Checkboxes remain slightly rounded (4px), while radio buttons are full circles to differentiate selection types.

## Components

### Buttons
- **Primary:** Solid ANC Green fill with white text. High contrast, 48px minimum height for mobile.
- **Secondary:** Solid Black fill or Ghost (Transparent fill with Black border).
- **Tertiary:** Text-only with a heavy weight and Green color, used for "Read More" links.

### Member Status Card
A specialized component featuring a white background, a 1px #E2E8F0 border, and a prominent "ACTIVE" badge in ANC Green. It displays the membership number in a monospaced-style font for high legibility.

### Digital Member Card
The system's "hero" component. It features a subtle background texture (e.g., a faint watermark of the ANC logo), the South African flag in the top right, and bold white typography on a dark Green or Black background.

### Editorial Content Cards
Large-scale cards utilizing high-quality photography. The headline is overlaid on the bottom 30% of the image using a dark gradient scrim, ensuring the "Hanken Grotesk" type remains legible.

### Navigation (Bottom Nav)
A 5-destination bar with clear icon-and-label pairings. The active state is indicated by the icon and label shifting to ANC Green, with a small 2px horizontal bar above the icon.

### Service Grid
A clean grid of 80x80px tiles for services (Airtime, Data). Icons are minimal, single-color (Black), set against a light grey (#EDF2F7) background to maintain a utility-first look.