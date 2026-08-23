const INGREDIENTS_KEY = "recipeLabIngredients";
const RECIPES_KEY = "recipeLabRecipes";

/* =========================
   INGREDIENTE
========================= */

function getIngredients() {
    const saved = localStorage.getItem(INGREDIENTS_KEY);

    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}

function saveIngredients(ingredients) {
    localStorage.setItem(
        INGREDIENTS_KEY,
        JSON.stringify(ingredients)
    );
}

function getIngredientById(id) {
    return getIngredients().find(
        ingredient => Number(ingredient.id) === Number(id)
    );
}

/* =========================
   RETETE
========================= */

function getRecipes() {
    const saved = localStorage.getItem(RECIPES_KEY);

    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}

function saveRecipes(recipes) {
    localStorage.setItem(
        RECIPES_KEY,
        JSON.stringify(recipes)
    );
}

/* =========================
   FORMATARE
========================= */

function formatMoney(value) {
    return Number(value)
        .toFixed(2)
        .replace(".", ",") + " lei";
}

function formatUnitCost(value) {
    const number = Number(value);

    if (number < 0.01) {
        return number
            .toFixed(4)
            .replace(".", ",") + " lei";
    }

    return number
        .toFixed(3)
        .replace(".", ",") + " lei";
}

function formatQuantity(value) {
    const number = Number(value);

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return number
        .toFixed(2)
        .replace(".", ",");
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
