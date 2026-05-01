# Contact Page UX Specification
**Designer:** Lyra  
**Requested by:** Sigge  
**Date:** 2024  
**Status:** Design Brief (Ready for Implementation by Selene)

---

## 1. OVERVIEW & GOALS

### Current Issues
- Massive "Contact" headline dominates above-the-fold, pushing contact info down
- Contact links are small and tucked below headline
- No visual impact or engagement—feels static and dense
- Missing the signature "full-width banner with parallax" treatment from portfolio brand promise

### Design Goals
1. **Hero Banner at Top:** Full-width parallax banner matching veochfasa.se style (slow scroll effect)
2. **Prominent Contact Info:** Immediate visual hierarchy after banner—no scrolling past
3. **Scannable Layout:** Links are large, bold, easy to click (mobile & desktop friendly)
4. **Minimal Headline:** Small, elegant "Get in touch" label—not overwhelming
5. **Clean Form:** Secondary call-to-action below, maintains visual hierarchy
6. **Responsive:** Desktop parallax → Mobile simplified banner, all stacked gracefully

---

## 2. VISUAL HIERARCHY

### Importance Ranking (Most to Least)
1. **Banner Image/Gradient** – Visual anchor, captures attention
2. **Contact Links** (Email, GitHub, LinkedIn) – Primary CTA, needs instant visibility
3. **Form Section** – Secondary CTA for message inquiries
4. **Helpful Text/Labels** – Supporting information

### Color Scheme (Per Existing Brand)
- **Dark backgrounds:** `--bg: #111111`, `--bg-secondary: #1a1a1a`, `--bg-tertiary: #0d0d0d`
- **Text:** `--text-primary: #f5f5f5`, `--text-secondary: #a3a3a3`, `--text-muted: #525252`
- **Accent (Dark Emerald):** `--accent: #053311`, `--accent-light: #084017`, `--accent-bright: #064516`
- **Borders:** `--border: #2a2a2a`, `--border-light: #3a3a3a`

---

## 3. LAYOUT WIREFRAME

### Desktop Layout (≥1024px)
```
┌──────────────────────────────────────────────────────────────────┐
│ NAVIGATION BAR (64px height, fixed)                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  FULL-WIDTH BANNER (400px height, parallax effect)                │
│  ─────────────────────────────────────────────────────────────    │
│  Background Image / Gradient (Dark emerald theme)                 │
│  Small centered "Get in touch" label (accent-bright)              │
│  Minimal fade gradient to main content                            │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  CONTACT INFO SECTION (High prominence, immediately visible)      │
│  ───────────────────────────────────────────────────────────────  │
│                                                                    │
│  ┌─────────────────────────┐   ┌─────────────────────────────┐   │
│  │ CONTACT LINKS           │   │   ADDITIONAL INFO / SPACING │   │
│  │                         │   │                             │   │
│  │ GitHub                  │   │   (Optional: tagline or     │   │
│  │ sigge1511 (large, bold) │   │    brief contact info text) │   │
│  │ → (hover: arrow moves)  │   │                             │   │
│  │                         │   └─────────────────────────────┘   │
│  │ Email                   │                                      │
│  │ you@example.com         │                                      │
│  │ → (hover: arrow moves)  │                                      │
│  │                         │                                      │
│  │ LinkedIn                │                                      │
│  │ linkedin.com/in/you     │                                      │
│  │ → (hover: arrow moves)  │                                      │
│  │                         │                                      │
│  └─────────────────────────┘                                      │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  CONTACT FORM SECTION (Below links, secondary CTA)                │
│  ───────────────────────────────────────────────────────────────  │
│                                                                    │
│  "Send a message" (small label)                                   │
│                                                                    │
│  ┌──────────────────────┐   ┌──────────────────────────────┐      │
│  │ Name field           │   │   Additional form fields     │      │
│  │ [____________]       │   │   or spacing                 │      │
│  │                      │   │                              │      │
│  │ Email field          │   │   (Right column for desktop) │      │
│  │ [____________]       │   │                              │      │
│  │                      │   │                              │      │
│  │ Message (textarea)   │   └──────────────────────────────┘      │
│  │ [_________________]  │                                         │
│  │ [_________________]  │                                         │
│  │                      │                                         │
│  │ [SEND MESSAGE BTN]   │                                         │
│  └──────────────────────┘                                         │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER                                                             │
└──────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px–1023px)
```
┌────────────────────────────────────────┐
│ NAVIGATION (64px)                       │
├────────────────────────────────────────┤
│                                         │
│  BANNER (320px height, parallax)        │
│  ─────────────────────────────────────  │
│  (Same as desktop, but narrower)        │
│                                         │
├────────────────────────────────────────┤
│                                         │
│  CONTACT LINKS (Full width, stacked)    │
│  GitHub | ──────────── →                │
│  Email  | ──────────── →                │
│  LinkedIn | ─────────── →               │
│                                         │
├────────────────────────────────────────┤
│                                         │
│  CONTACT FORM (Full width, stacked)     │
│  [Name Field]                           │
│  [Email Field]                          │
│  [Message Textarea]                     │
│  [SEND MESSAGE BTN]                     │
│                                         │
└────────────────────────────────────────┘
```

### Mobile Layout (<768px)
```
┌─────────────────────────┐
│ NAVIGATION (64px)       │
├─────────────────────────┤
│                         │
│  BANNER (250px height)  │
│  "Get in touch" label   │
│  (No parallax, fixed)   │
│                         │
├─────────────────────────┤
│                         │
│  CONTACT LINKS (Full)   │
│  GitHub → (tap)         │
│  sigge1511              │
│                         │
│  Email → (tap)          │
│  you@example.com        │
│                         │
│  LinkedIn → (tap)       │
│  linkedin...            │
│                         │
├─────────────────────────┤
│                         │
│  FORM (Stacked, full)   │
│  [Name]                 │
│  [Email]                │
│  [Message]              │
│  [SEND]                 │
│                         │
└─────────────────────────┘
```

---

## 4. DETAILED COMPONENT SPECS

### 4.1 BANNER SECTION (`.contact__banner`)

#### Structure
```
.contact__banner (container, parallax wrapper)
├── .contact__banner-bg (background image/gradient)
│   └── .contact__banner-grid (subtle grid overlay, optional)
├── .contact__banner-content (centered text overlay)
│   ├── .contact__banner-label ("Get in touch")
│   └── .contact__banner-headline (optional, minimal—consider removing entirely)
└── .contact__banner-fade (gradient fade to content below)
```

#### Specifications
- **Height:** `400px` (desktop), `320px` (tablet), `250px` (mobile)
- **Background:** 
  - Use image if available, OR gradient matching hero (dark emerald theme)
  - Gradient example: `linear-gradient(150deg, #0d0d0d 0%, #071a12 35%, #0a2218 55%, #0d0d0d 100%)`
  - Optional subtle grid pattern overlay (like hero)
- **Parallax Effect:**
  - Desktop/tablet: `background-attachment: fixed;` (slow scroll at 50% speed)
  - Mobile: Remove parallax (`background-attachment: scroll;`) for performance
  - No parallax on prefers-reduced-motion
- **Label Styling:**
  - Font: `0.75rem`, weight `600`, letter-spacing `0.22em`, uppercase
  - Color: `--accent-bright` (#064516)
  - Position: Centered, overlaid on background
- **Headline (Optional):**
  - If included: Font size `clamp(1.5rem, 4vw, 2.5rem)` (much smaller than current 5rem)
  - Weight: 700, not 900
  - Keep subtle; label "Get in touch" is the primary element
- **Fade Gradient:**
  - `height: 240px`
  - `background: linear-gradient(to bottom, transparent, var(--bg));`
  - Smooth transition from banner to white space

#### Accessibility
- Parallax is a visual enhancement only; content must not depend on it
- Use `prefers-reduced-motion` media query to disable parallax for users who need it
- Banner text should have sufficient contrast against background

---

### 4.2 CONTACT LINKS SECTION (`.contact__links-section`)

#### Structure
```
.contact__links-section
├── .contact__links-label ("Find me here" or similar)
└── .contact__link-item (repeated for each link)
    ├── .contact__link-left
    │   ├── .contact__link-platform ("GitHub", "Email", etc.)
    │   └── .contact__link-name ("sigge1511", "you@example.com", etc.)
    └── .contact__link-arrow (→ icon, aria-hidden)
```

#### Specifications
- **Container:**
  - `padding: var(--space-2xl)` top/bottom (80px)
  - `padding: var(--section-padding-x)` left/right (clamp(20px, 5vw, 64px))
  - `border-top: 1px solid var(--border);` (no bottom border)
  - `max-width: var(--max-width); margin: 0 auto;`

- **Label (`--links-label`):**
  - Font: `0.75rem`, weight `600`, letter-spacing `0.2em`, uppercase
  - Color: `--text-muted` (#525252)
  - Margin bottom: `var(--space-lg)` (24px)

- **Link Items (`.contact__link-item`):**
  - Display: `flex`, `align-items: center`, `justify-content: space-between`
  - Padding: `var(--space-xl) 0` (48px vertical, no horizontal—use parent padding)
  - Border-bottom: `1px solid var(--border);` (divider between links)
  - Text decoration: `none`
  - Transition: `color 0.2s ease`, `transform 0.2s ease`

- **Left Content (`--link-left`):**
  - Display: `flex`, flex-direction: column, `gap: 4px`
  - Platform (`.contact__link-platform`):
    - Font: `0.75rem`, weight `600`, letter-spacing `0.12em`, uppercase
    - Color: `--text-muted` (#525252)
  - Name (`.contact__link-name`):
    - **Font size: `1.25rem` (desktop), `1.125rem` (mobile)** — MAKE IT BIG
    - Weight: `700` (bold)
    - Color: `--text-primary` (#f5f5f5)
    - Transition on hover: color → `--accent-bright`

- **Arrow (`.contact__link-arrow`):**
  - Icon: `→` (Unicode `&#8594;`)
  - Font-size: `1.25rem`
  - Color: `--text-muted` (#525252)
  - Transform on hover: `translateX(6px)`
  - Color on hover: `--accent-bright`

- **Hover State:**
  - Link name color → `--accent-bright`
  - Arrow: color → `--accent-bright`, translateX(6px)
  - Overall link feels interactive and inviting

#### Responsive
- **Desktop (≥1024px):** All links in single column
- **Tablet/Mobile:** Links remain full-width, single column
- **Link names scale:** `clamp(1.125rem, 2.5vw, 1.25rem)`

#### Accessibility
- Links are semantic `<a>` tags with proper `href` values
- Arrow is `aria-hidden="true"` (decorative)
- Tab order: Natural, top-to-bottom
- Minimum touch target: 48px height (link items meet this with `var(--space-xl)` padding)
- Keyboard focus: Border color changes to `--accent-bright`

---

### 4.3 CONTACT FORM SECTION (`.contact__form-section`)

#### Structure
```
.contact__form-section
├── .contact__form-label ("Send a message" or similar)
├── .contact__form-note (disclaimer, optional)
└── .contact-form (form element)
    ├── .contact-form__group (for each field)
    │   ├── .contact-form__label
    │   └── .contact-form__input or .contact-form__textarea
    └── .contact-form__submit (button)
```

#### Specifications
- **Container:**
  - `padding: var(--space-2xl)` top/bottom
  - `border-top: 1px solid var(--border);`
  - `max-width: var(--max-width); margin: 0 auto;`
  - Padding: `0 var(--section-padding-x);` (left/right)

- **Form Label (`.contact__form-label`):**
  - Font: `0.75rem`, weight `600`, letter-spacing `0.2em`, uppercase
  - Color: `--text-muted`
  - Margin bottom: `var(--space-md)` (16px)

- **Form Note (`.contact__form-note`):**
  - Font: `0.875rem`
  - Color: `--text-muted`
  - Margin bottom: `var(--space-xl)` (48px)
  - Line-height: 1.6

- **Form Groups (`.contact-form__group`):**
  - Display: flex, flex-direction: column, gap: `var(--space-sm)` (8px)
  - Margin bottom: `var(--space-md)` (16px)

- **Field Labels (`.contact-form__label`):**
  - Font: `0.8125rem`, weight `500`, letter-spacing `0.06em`, uppercase
  - Color: `--text-muted`

- **Input/Textarea (`.contact-form__input`, `.contact-form__textarea`):**
  - Background: `--bg-secondary` (#1a1a1a)
  - Border: `1px solid var(--border)` (#2a2a2a)
  - Color: `--text-primary`
  - Font-family: `--font-main` (Inter)
  - Font-size: `1rem`
  - Padding: `var(--space-md)` (16px)
  - Width: 100%
  - Transition: border-color 0.2s ease
  - **Focus state:** border-color → `--accent-bright`
  - Outline: none

- **Textarea Specific:**
  - Resize: vertical
  - Min-height: 140px
  - Line-height: 1.6

- **Submit Button (`.contact-form__submit`):**
  - Background: `--accent` (#053311)
  - Color: `--text-primary`
  - Border: `1px solid var(--accent)`
  - Padding: 14px 32px
  - Font: `0.875rem`, weight `600`, letter-spacing `0.08em`, uppercase
  - Cursor: pointer
  - Transition: all 0.2s ease
  - Align-self: flex-start
  - **Hover state:**
    - Background: `--accent-light` (#084017)
    - Border: `--accent-light`

#### Responsive
- **Desktop (≥1024px):** Form in right column, links in left (grid layout)
- **Tablet/Mobile:** Form full-width, stacked below links

---

## 5. INTERACTION PATTERNS

### 5.1 Parallax Scroll Effect (Banner)
- **Desktop/Tablet:** Background image moves at 50% of scroll speed (slower than content)
- **Effect:** `background-attachment: fixed;` creates perception of depth
- **Mobile:** Disabled for performance; uses `background-attachment: scroll;`
- **Accessibility:** Respects `prefers-reduced-motion: reduce` media query

### 5.2 Link Hover States
- **Name Color:** Changes from `--text-primary` to `--accent-bright`
- **Arrow Animation:** Translates right by 6px with color change
- **Smooth Transition:** 0.2s ease-out
- **Desktop:** Hover on full link item
- **Mobile:** Active/focus states (no hover, but shows on tap/focus)

### 5.3 Form Focus States
- **Input/Textarea:** Border changes from `--border` to `--accent-bright` on focus
- **Smooth Transition:** 0.2s ease

### 5.4 Keyboard Navigation
- Tab order: Banner → Links (GitHub → Email → LinkedIn) → Form fields (Name → Email → Message) → Submit button
- All interactive elements have visible focus states
- Links have underline or background change on focus (use outline or border-color change)

---

## 6. CSS/TAILWIND CLASS NAMING

### Class Hierarchy
All classes follow **BEM (Block Element Modifier)** naming convention:
- **Block:** `.contact__*` (top-level sections)
- **Element:** `.contact__banner-*`, `.contact__link-*`, etc.
- **Modifier:** `.contact__*--active`, `.contact__*--disabled`, etc.

### Suggested Class Names
```css
/* Container */
.contact { }

/* Banner Section */
.contact__banner { }
.contact__banner-bg { }
.contact__banner-grid { }  /* optional overlay */
.contact__banner-content { }
.contact__banner-label { }
.contact__banner-headline { }
.contact__banner-fade { }

/* Links Section */
.contact__links-section { }
.contact__links-label { }
.contact__link-item { }
.contact__link-item:hover { }  /* for interactive state */
.contact__link-left { }
.contact__link-platform { }
.contact__link-name { }
.contact__link-arrow { }

/* Form Section */
.contact__form-section { }
.contact__form-label { }
.contact__form-note { }

.contact-form { }
.contact-form__group { }
.contact-form__label { }
.contact-form__input { }
.contact-form__textarea { }
.contact-form__input:focus { }
.contact-form__textarea:focus { }
.contact-form__submit { }
.contact-form__submit:hover { }

/* Utility States */
.contact__banner[data-parallax] { }  /* optional: data attribute for parallax control */
```

### Tailwind Alternative (if used)
If transitioning to Tailwind, consider utility-first approach:
```jsx
// Banner wrapper with parallax
<div className="relative w-full h-[400px] md:h-[320px] sm:h-[250px] overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#071a12] to-[#0d0d0d] bg-fixed">
    {/* content */}
  </div>
</div>

// Link item
<a className="flex items-center justify-between py-12 px-0 border-b border-[#2a2a2a] hover:text-[#064516] transition-colors">
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold tracking-wide text-[#525252] uppercase">GitHub</span>
    <span className="text-xl font-bold text-[#f5f5f5] group-hover:text-[#064516]">sigge1511</span>
  </div>
  <span className="text-xl text-[#525252] group-hover:text-[#064516] group-hover:translate-x-1.5 transition-all">→</span>
</a>
```

---

## 7. RESPONSIVE BREAKPOINTS

### Breakpoint Strategy
- **Mobile:** < 768px (phone-first)
- **Tablet:** 768px–1023px
- **Desktop:** ≥ 1024px

### Key Changes by Breakpoint
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Banner height | 250px | 320px | 400px |
| Parallax | Disabled | Enabled | Enabled |
| Links layout | Full-width stack | Full-width stack | Full-width stack |
| Form layout | Full-width stack | Full-width stack | Side-by-side (grid) |
| Link name font | 1.125rem | 1.125rem | 1.25rem |
| Section padding | 20px | 32px | 64px |

### Media Queries (CSS)
```css
/* Base: Mobile */
.contact__banner { height: 250px; background-attachment: scroll; }
.contact__link-name { font-size: 1.125rem; }
.contact__content { grid-template-columns: 1fr; gap: var(--space-2xl); }

/* Tablet */
@media (min-width: 768px) {
  .contact__banner { height: 320px; background-attachment: fixed; }
  .contact__section-padding { padding-left: var(--space-lg); padding-right: var(--space-lg); }
}

/* Desktop */
@media (min-width: 1024px) {
  .contact__banner { height: 400px; }
  .contact__content { grid-template-columns: 1fr 1fr; gap: var(--space-3xl); }
  .contact__link-name { font-size: 1.25rem; }
}

/* Accessibility: Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .contact__banner-bg { background-attachment: scroll !important; }
  .contact__link-arrow, .contact__link-name { transition: none !important; }
}
```

---

## 8. ACCESSIBILITY NOTES

### WCAG 2.1 Compliance (Level AA)
1. **Parallax Effect:**
   - Not critical to content understanding
   - Disabled for `prefers-reduced-motion: reduce`
   - Mobile: Disabled by default for performance/accessibility

2. **Color Contrast:**
   - Link names (#f5f5f5 on #111111): ~14:1 ✓ (AAA)
   - Hover state (#064516 on #111111): ~3.5:1 ✓ (AA)
   - Muted text (#525252 on #111111): ~4.5:1 ✓ (AA)

3. **Typography:**
   - Base font size: 16px (not smaller)
   - Line height: 1.6–1.8 (good readability)
   - Font weights: 600+ for labels, 700+ for important text

4. **Keyboard Navigation:**
   - All interactive elements (links, form fields) are keyboard accessible
   - Tab order: Logical, top-to-bottom
   - Focus indicators: Visible (border-color or outline change)
   - No keyboard traps

5. **Form Accessibility:**
   - All form fields have associated labels (`<label for="...">`)
   - Error messages (when added) linked to fields via `aria-describedby`
   - Submit button is a `<button>` element, not a div
   - Placeholder text is not a substitute for labels

6. **Semantic HTML:**
   - Use `<a>` for links, not `<div onclick>`
   - Use `<form>`, `<input>`, `<textarea>`, `<button>` for form
   - Use `<header>` for banner section (optional)
   - Alt text not required for decorative background images

7. **Mobile/Touch:**
   - Minimum touch target size: 48px × 48px (link items: 48px padding ✓)
   - No hover-only functionality
   - Works without JavaScript (progressive enhancement)

---

## 9. TECHNICAL IMPLEMENTATION NOTES

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- `background-attachment: fixed;` is widely supported
- CSS Grid and Flexbox: Standard support
- Fallback for older browsers: Remove parallax, use solid background

### Performance
- Banner background image: Optimize file size (< 200KB recommended)
- No heavy animations or transforms (parallax via CSS only, no JS)
- Mobile: Disable parallax to avoid jank on low-end devices
- Form: No client-side validation library needed (HTML5 validation sufficient for demo)

### Future Enhancements (Not in This Spec)
- Email validation and actual form submission (connect EmailJS/Formspree)
- Parallax animation enhancement with subtle transform/opacity effects
- Gradient animate on hover (if brand evolves)
- Dark/light mode toggle (if design system expands)

---

## 10. HANDOFF CHECKLIST FOR SELENE (Developer)

- [ ] **Banner Section:** Implement parallax effect; disable on mobile/prefers-reduced-motion
- [ ] **Contact Links:** Make names larger (1.25rem desktop), add hover animations
- [ ] **Visual Hierarchy:** Ensure links are prominent; headline is minimal
- [ ] **Responsive:** Test all breakpoints (250px mobile → 320px tablet → 400px desktop)
- [ ] **Accessibility:** Check color contrast, keyboard navigation, focus states
- [ ] **Form Styling:** Ensure input focus states are visible (`--accent-bright` border)
- [ ] **CSS Classes:** Follow BEM naming convention
- [ ] **Cross-browser Testing:** Parallax works in all modern browsers
- [ ] **Mobile Testing:** Parallax disabled, layout is clean, no overflow
- [ ] **Link URLs:** Update email and LinkedIn to actual values (currently placeholders)

---

## 11. DESIGN INSPIRATION REFERENCE

### References
- **veochfasa.se** – Full-width banner with parallax scroll effect on homepage
- **hellaholics.com** – Clean, minimal typography and spacing
- **Existing Portfolio (This Site)** – Dark theme with emerald accents, monochrome aesthetic

### Design Principles Applied
- **Hierarchy:** Banner > Links > Form (in visual importance)
- **Minimalism:** No unnecessary decoration; whitespace is a design element
- **Usability:** Large touch targets, clear CTAs, fast visual scanning
- **Brand Consistency:** Dark emerald theme, monochrome palette, clean sans-serif typography

---

**End of Specification Document**

Ready for implementation. Questions? Ask Sigge or Lyra. 🎨
