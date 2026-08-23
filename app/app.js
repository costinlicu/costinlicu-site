const STORAGE_KEY = "recipeLabIngredients";

function getIngredients() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}

function saveIngredients(ingredients) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(ingredients)
    );
}

function formatMoney(value) {
    return Number(value).toFixed(2).replace(".", ",") + " lei";
}

function formatUnitCost(value) {
    if (value < 0.01) {
        return value.toFixed(4).replace(".", ",") + " lei";
    }

    return value.toFixed(3).replace(".", ",") + " lei";
}
