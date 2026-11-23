# Changelog

What changed in the design system, newest first. Dates are 2026.

## 23 November
- **New component: Action bar.** A bar fixed to the bottom of the screen with the one main action of a page (plus an optional Switch or secondary Button), so it is never hidden below the fold on a phone. Safe-area aware, 48 px button. Replaces the one-off sticky bars on the Coffee Brew Guide and Vegetable Recipe pages, and is now used for "Next question" and the auto-advance switch in the Vegetable Face-off. Documented in `DESIGN.md`, the Storybook Introduction and the skill.
- **Vegetable Face-off on a phone:** after Start the header is compact (title on one line, the dark-mode switch in the top corner with its label kept for screen readers), the stats sit on one line and the cards are shorter, so the question and all four options fit on one screen.
- **Numerals:** all numbers use lining, equal-width digits (set once on `body`).

## 21 November
- **Vegetable Recipe** is now much more varied: 12 dish types (tray bake, salad, soup, stir-fry, tortilla or frittata, pasta, curry, gratin, stuffed vegetables, fritters, pan-cooked greens, warm and fresh) with suggested extras such as chicken, chorizo, prawns, salmon, tofu, eggs, chickpeas, feta, yoghurt, rice or pasta, and a third vegetable (onion) where it makes sense. The same pair always gives the same recipe, in any order. The nutrition and cost on the card still count only the two chosen vegetables, and the card says so. Long recipes shrink their text slightly to stay on one page (tested on all 351 pairs).

## 20 November
- **Selectable card:** unselected cards are no longer faded (they looked disabled). They now have full opacity and a 3:1 outline (new component token `--cg-card-border-unselected`). Selected cards get a thicker border, the filled background and a check mark. Updated in the component, the Vegetable Explorer, `DESIGN.md` and the skill. The Vegetable Recipe page keeps its own 1/2 number badge instead of the check.
- New example page **Vegetable Recipe** (`examples/vegetable-recipe`): pick two of 27 vegetables, preview and download a one-page A4 recipe card as a PDF. Any pair works (702 ordered pairs tested to fit on one page). Uses only existing tokens, components (Selectable card, Button, Chip, Table, Score bar, Banner) and the Vegetable Chart illustrations. The card is always drawn in the light theme.
- Added the `arrow_forward` icon to the shared example icons.

## 17 November
- Fixed vegetable illustrations showing as empty circles on GitHub Pages: `publish_examples.py` now copies the icons folder next to the example pages.

## 16 November
- Coffee Brew Guide: the Start brewing button now stays fixed at the bottom of the screen on the pick screen and names the chosen coffee ("Start Latera Normal"). Notes updated (grind 12 confirmed, whiteboard "60" removed).
- Example pages published on GitHub Pages now include the viewport setting, so phones show the mobile layout instead of the desktop one. Added by `publish_examples.py`.
- The three example pages are now published with the Storybook on GitHub Pages, at `/examples/`. `npm run build-docs` copies them in.
- New type size token `--cg-text-display` (56 px, 40 px on phones) for one big headline per page. Used for the Coffee Brew Guide title and its first question.
- Coffee icon removed from the Coffee Brew Guide title.

## 15 November
- Repository renamed from `vegetablecharts` to `cool-graphs`.
- Latera Normal grind setting 12 confirmed (no longer marked work in progress) in the Coffee Brew Guide example.

## 14 November
- Skill file updated: introductions are one to two sentences (matching DESIGN.md), current token files, per 100 g example, check every state, rules on motion, timers and non-data content, how far a page may go beyond the components, and updating every place when a definition changes.
- **Chip** component (outline, solid, dashed) added.
- Example pages added in `examples/`: Vegetable Explorer and Vegetable Face-off.

## 13 November
- **Switch:** the off state is now quiet (empty track, lighter outline and knob). The on state is a solid ink track. New colour role `--cg-color-control-off` and four Switch component colours.
- **Colour in three layers:** primitive, semantic and component tokens. Component colours for Table, Banner, Card and Button.

## 11 to 13 November
- Soft border colour for content cards.
- Table header is dark with light text by default.
- Banner component and 20 Material Design icons.
- Skill file for AI agents added (`.claude/skills/cool-graphs-design/SKILL.md`).
- Information principle: every page opens with a concise but comprehensive introduction (units, data, source, date, limits).
- Accent green is more vivid and used only for focus and data marks. Error, warning and success colours added; brighter in the light theme.
- Minimum touch target of 30 px.
- Renamed to **Cool Graphs** (token prefix `cg-`).

## 11 November (start)
- First components, tokens and Storybook, taken from the Vegetable Chart prototype.
