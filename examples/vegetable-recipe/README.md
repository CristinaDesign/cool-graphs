# Vegetable Recipe

Pick two of 27 vegetables, preview a one-page A4 recipe card, and download it as a PDF.

- **Source files:** `src/body.html` (page text), `src/recipe.css` (styles, including the recipe sheet), `src/recipe.js` (recipe engine, preview and PDF). Run `python3 build.py` to make `index.html`.
- **Data:** nutrition, prices and illustrations come from `../shared/` (the Vegetable Chart data). Nothing about nutrition or price is invented. The cooking profile of each vegetable (typical roast and sauté minutes, how to prepare it, amount bought for 2 servings) is general cooking guidance written for this page, listed at the top of `recipe.js`.
- **How any pair works:** each vegetable is tagged as leafy, raw-friendly, raw-only or roastable. The pair then gets one of four dish types: salad (no cooking), pan-cooked greens, warm and fresh (oven plus raw), or sheet-pan roast.
- **PDF:** the sheet (`.sheet`, 794 x 1123 px, A4) is drawn with the light theme tokens, turned into an image with html2canvas and placed on one A4 page with jsPDF (both loaded from cdnjs). A hidden text layer is added so text can be searched and copied.
- **To change a recipe step or a time:** edit `recipe.js`, rebuild, then run `npm run build-docs` in the repo root so GitHub Pages is updated.
