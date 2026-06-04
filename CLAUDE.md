# Personal Dashboard — Project Guide

## Project Overview
A personal dashboard web application built with plain HTML, CSS, and JavaScript (no framework required unless specified).

## File Structure Convention

Each UI section or widget must have its **own separate files**:

```
personal-dashboard/
├── CLAUDE.md
├── index.html                  # Main entry point — imports all sections
├── styles/
│   ├── global.css              # Reset, variables, base typography
│   ├── layout.css              # Grid/flex layout for the dashboard shell
│   ├── <section-name>.css      # One CSS file per widget/section
│   └── ...
├── scripts/
│   ├── main.js                 # Bootstrap only — imports & initializes modules
│   ├── <section-name>.js       # One JS file per widget/section
│   └── ...
└── components/
    ├── <section-name>.html     # Partial HTML per widget (included via JS or SSI)
    └── ...
```

### Naming Examples
| Widget | HTML | CSS | JS |
|--------|------|-----|----|
| Clock | `components/clock.html` | `styles/clock.css` | `scripts/clock.js` |
| Weather | `components/weather.html` | `styles/weather.css` | `scripts/weather.js` |
| Todo List | `components/todo.html` | `styles/todo.css` | `scripts/todo.js` |

## Rules

### File Separation
- **Never combine** styles for two different widgets into one CSS file.
- **Never combine** logic for two different widgets into one JS file.
- `global.css` holds only CSS custom properties (variables), resets, and base font styles — nothing widget-specific.
- `layout.css` holds only the dashboard grid/flex shell — no widget internals.

### HTML
- `index.html` links all CSS files in `<head>` and all JS files before `</body>`.
- Each `components/*.html` partial contains only the markup for that one widget.

### CSS
- Use CSS custom properties (`--var-name`) defined in `global.css` for colors, spacing, and font sizes.
- Each widget's CSS file uses a BEM-like class prefix matching its name (e.g., `.clock__`, `.weather__`).

### JavaScript
- Each `scripts/<name>.js` exports or exposes a single `init()` function.
- `main.js` calls every widget's `init()` — no business logic lives in `main.js`.

## Workflow: How to Complete a Task

1. **Plan** — identify which widget(s) are affected and which files need to change.
2. **Implement** — create/edit only the files for that widget.
3. **Recheck** — after implementation, review the following before declaring done:
   - [ ] No styles leaked into another widget's CSS file
   - [ ] No JS logic leaked into `main.js`
   - [ ] `index.html` correctly imports every new CSS/JS file
   - [ ] CSS custom properties are used for all colors and spacing (no hardcoded hex/px outside `global.css`)
   - [ ] HTML is valid and semantic (`<section>`, `<article>`, `<header>`, etc.)
   - [ ] No `console.log` left in production code
   - [ ] Widget works in isolation (can be tested by opening `components/<name>.html` directly if possible)

## Code Style

- Indentation: **2 spaces**
- No trailing whitespace
- Single quotes in JS, double quotes in HTML attributes
- CSS properties ordered: positioning → box model → typography → visual → misc
- No comments except for non-obvious WHY (not what)

## Do Not

- Do not install npm packages or introduce a build step unless the user explicitly requests it.
- Do not use `!important` in CSS.
- Do not inline styles in HTML.
- Do not use `id` selectors in CSS (use classes only).
