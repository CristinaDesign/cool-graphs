---
name: cool-graphs-design
description: Use when designing or building any page, screen, site or component with the Cool Graphs design system (data pages, charts, rankings, tables, interactive info pages), in code or when translating Figma designs. Applies the tokens, components, accessibility rules and information rules from DESIGN.md.
---

# Cool Graphs design system skill

Use this skill for any new page, site, screen or component. The designer is a UX designer, not a developer: explain choices in plain language, show results visually, and avoid jargon.

## 1. Before you start

1. Read `DESIGN.md` (rules) and the token files in `src/tokens/`: `tokens.css` (type, space, shape), and the three colour layers `primitives.css`, `semantic.css` and `component.css`. Check whether a component colour already exists (for example `--cg-switch-off-border`) before using a semantic one. These files and `DESIGN.md` are the source of truth.
2. List `src/components/` to see what already exists. Open the published Storybook if available. Look at `examples/` for finished pages (a browse page and a game) before starting something similar.
3. Understand the job of the page in one sentence, and who it is for. Ask the designer one short question if the audience, the data or the goal is unclear. Do not ask about things the design system already decides.

## 2. Workflow

1. **Write the introduction first.** One to two sentences that say what the page shows, the unit of every number (€ / kg, %, per 100 g), where the data comes from, how recent it is, and what it does not cover. If it cannot be written, the page is not clear yet. Always follow this for every page.
2. **Pick components from the table in `DESIGN.md` section 4.** It lists every component, so do not work from memory. Reuse before inventing.
3. **Build with tokens only.** Never hard-code a hex colour, pixel size, font or radius. Use `--cg-*` variables. For colour use component tokens where one exists (for example `--cg-table-header-bg`), otherwise semantic ones (`--cg-color-ink`). Never use a primitive (such as `--cg-brown-700`) in a component or page.
4. **Check both themes** (light and dark) and a phone width of 400 px.
5. **Check accessibility:** text 4.5:1 contrast, icons and borders 3:1, everything clickable at least 30 px, visible keyboard focus, everything usable without a mouse, meaning never carried by colour alone.
6. **Verify by looking.** Build it, take screenshots in light, dark and phone width, and fix what is off before showing the designer. Check every state, not just the first screen (default, selected, empty, error, finished), and check the browser console for errors and the page for sideways scrolling at 400 px.
7. **Report plainly.** Say what was made, what was reused, and anything new or uncertain.

## 3. Rules that never bend

- Accent green is only for keyboard focus and data marks. Status colours (error, warning, success) always come with an icon and words.
- Units sit next to every number. Units, source and date are never hidden inside an expandable section.
- Estimated or provisional data is marked differently from official data, and the page says so in words.
- Plain language. Short labels. Define each term once.
- Icons come from `src/components/Icon` (Material Design, 24 px default). If an icon is missing, add it from the same Material set and tell the designer.
- Light and dark are equal. Never ship one without the other.
- Motion is decoration. Animations and micro-interactions switch off when the device asks for reduced motion, and nothing important depends on them.
- Nothing important depends on a timer. Anything that moves on by itself shows the time left and has a way to turn it off.
- Content that is not data (for example a fun fact or an opinion) is labelled as such, and is never mixed into the numbers.

**Motion rules (see `DESIGN.md`, Motion):** use `--cg-duration-fast` / `--cg-duration` / `--cg-duration-slow` and `--cg-ease` / `--cg-ease-playful`, animate only transform and opacity, no motion for repeated actions, rewards run once and stay under half a second, no endless loops outside a landing hero, and always respect reduced motion.

## 4. When something is missing

Do not improvise a one-off style. For a missing colour, follow "To add a new colour" in `DESIGN.md` section 3: primitive first, then a semantic role, then a component token only if needed. Otherwise:
1. Say what is missing (for example, "a field error message", "a tooltip").
2. Propose a new token or component in the style of the existing ones.
3. If the designer agrees, add it in `src/`, with a story for every state in light and dark, and update `DESIGN.md` and the Storybook Introduction.
4. Run `npm run build-docs` so the published Storybook stays current, and add a line to `CHANGELOG.md`.

**Pages may go further than the components.** A landing page or a hero can use a very large headline, illustrations and playful motion, as long as it still uses the tokens and follows the rules above. Say plainly what is new ("a hero with a card cluster") and offer to add it to the design system as a documented pattern, as was done for the Chip.

**When a definition or rule changes** (for example how a score is calculated, or a unit), search all pages, examples and docs for the old wording and update every place, and add a line to `CHANGELOG.md`.

## 5. Working from Figma

When given Figma frames or screenshots:
- Map every colour, size and font to the nearest token and say which one. If a value has no match, list it as "off-system" and ask, rather than copying it.
- Expect Figma variables to mirror the tokens (`color/ink`, `color/panel`, `space/4`, and so on) with **Light** and **Dark** as variable modes. Suggest this setup if it is not there.
- Name Figma components like the code components (Switch, Segmented control, Banner...) so design and code stay in step.
- Flag touch targets under 30 px, text under 4.5:1 contrast, and designs that use colour alone for meaning.

## 6. Pattern: interactive illustration explorer

Example: a page where clicking an illustration of a vegetable shows information about it. Reuse this shape for any "click a thing, learn about it" page.

**Structure**
1. Introduction (see workflow step 1): what the page shows, units, data source and date.
2. A grid of illustrations. Each one is a button, not a plain image.
3. A detail panel for the selected item, next to the grid on wide screens and below it on a phone.

**Behaviour**
- Each illustration is a real `<button>` with an accessible name (for example "Spinach"), at least 30 px, with the standard focus ring.
- Selected state works like the **Selectable card**: the chosen item gets a thicker dark border, a filled background and a check mark, and the others stay fully visible with a normal outline (never faded).
- Nothing depends on hover. Everything also works with touch and keyboard (arrow keys or Tab to move, Enter or Space to choose).
- Also offer the same information as a list or **Table**, for people who cannot use the illustrations.

**Detail panel contents**
- Name, and a one-sentence plain description.
- Key numbers with units, shown as **Score bars** or a small **Table** (for example price in € / kg, a nutrient score out of 100).
- A **Legend marker** wherever a value is an estimate, and a short note saying why.
- Source and date for the data, always visible.
- Extra detail inside a **Disclosure**.
- **Action bar** for the main action of any page that can scroll on a phone (Start, Next, Generate): one primary Button, plus at most a Switch or a secondary Button.
- **Chips** for short facts and counts near the top (for example "10 questions"); use the dashed Chip, with words, for provisional data.
- A **Banner** if information fails to load, saying what happened and what to do.

**Illustrations**
- One consistent style, with a transparent background, and readable on both the light and dark backgrounds.
- Provide alternative text that names the item. Illustrations are not the only way to find an item.
- Do not use real brand logos or copyrighted artwork. Ask the designer where the illustrations come from.

## 7. Definition of done

- [ ] Introduction states what the page shows, units, data, source, date and limits
- [ ] Only tokens and existing components, or new ones documented in `DESIGN.md`
- [ ] Checked in light, dark and at 400 px wide, in every state, with no console errors
- [ ] Contrast, 30 px targets, focus ring and keyboard use verified
- [ ] Status and estimates are communicated by more than colour
- [ ] Storybook rebuilt if components changed
- [ ] Summary written for a non-developer
