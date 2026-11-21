# Vegetable Recipe

Pick two of 27 vegetables, preview a one-page A4 recipe card, and download it as a PDF.

- **Source files:** `src/body.html` (page text), `src/recipe.css` (styles, including the recipe sheet), `src/recipe.js` (recipe engine, preview and PDF). Run `python3 build.py` to make `index.html`.
- **Data:** nutrition, prices and illustrations come from `../shared/` (the Vegetable Chart data). Nothing about nutrition or price is invented. The cooking profile of each vegetable (typical roast and sauté minutes, how to prepare it, amount bought for 2 servings) is general cooking guidance written for this page, listed at the top of `recipe.js`.
- **How any pair works:** each vegetable is tagged (leafy, raw-friendly, raw-only, roastable, good in soup, stir-fry, tortilla, curry, gratin, stuffing or fritters). Every dish type checks if the pair suits it, then one is picked from the pair, always the same one for the same pair. There are 12 dish types: tray bake, salad, soup, stir-fry, tortilla or frittata, pasta, curry, gratin, stuffed vegetables, fritters, pan-cooked greens and warm-and-fresh. Each one also picks a suggested extra (chicken, chorizo, ham, beef, prawns, salmon, tofu, eggs, chickpeas, feta, halloumi, yoghurt, rice or pasta) and spices or herbs.
- **Extras are not data:** meat, dairy, rice, pasta and spices are cooking suggestions. Nutrition and cost count only the two chosen vegetables, and the card says so. A long recipe shrinks its text a little (never below 70%) so every pair still fits on one page.
- **PDF:** the sheet (`.sheet`, 794 x 1123 px, A4) is drawn with the light theme tokens, turned into an image with html2canvas and placed on one A4 page with jsPDF (both loaded from cdnjs). A hidden text layer is added so text can be searched and copied.
- **To change a recipe step or a time:** edit `recipe.js`, rebuild, then run `npm run build-docs` in the repo root so GitHub Pages is updated.
