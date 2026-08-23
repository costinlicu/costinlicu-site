const INGREDIENTS_KEY = "recipeLabIngredients";
const RECIPES_KEY = "recipeLabRecipes";
const TECH_SHEETS_KEY = "recipeLabTechnologySheets";


/* ==================================================
   INGREDIENTE
================================================== */

function getIngredients() {

    const saved =
        localStorage.getItem(
            INGREDIENTS_KEY
        );

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}


function saveIngredients(
    ingredients
) {

    localStorage.setItem(
        INGREDIENTS_KEY,
        JSON.stringify(
            ingredients
        )
    );
}


function getIngredientById(id) {

    return getIngredients().find(
        ingredient =>
            Number(
                ingredient.id
            ) ===
            Number(id)
    );
}


/* ==================================================
   RETETE
================================================== */

function getRecipes() {

    const saved =
        localStorage.getItem(
            RECIPES_KEY
        );

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}


function saveRecipes(
    recipes
) {

    localStorage.setItem(
        RECIPES_KEY,
        JSON.stringify(
            recipes
        )
    );
}


function getRecipeById(id) {

    return getRecipes().find(
        recipe =>
            Number(
                recipe.id
            ) ===
            Number(id)
    );
}


/* ==================================================
   FISE TEHNOLOGICE
================================================== */

function getTechnologySheets() {

    const saved =
        localStorage.getItem(
            TECH_SHEETS_KEY
        );

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}


function saveTechnologySheets(
    sheets
) {

    localStorage.setItem(
        TECH_SHEETS_KEY,
        JSON.stringify(
            sheets
        )
    );
}


function getTechnologySheetByRecipeId(
    recipeId
) {

    return getTechnologySheets().find(
        sheet =>
            Number(
                sheet.recipeId
            ) ===
            Number(recipeId)
    );
}


/* ==================================================
   RANDAMENT RETETA
================================================== */

function getRecipeYield(recipe) {

    if (!recipe) {
        return null;
    }


    const quantity =
        Number(
            recipe.yieldQuantity
        );


    if (
        !quantity ||
        quantity <= 0
    ) {

        return null;
    }


    return {

        quantity:
            quantity,

        unit:
            recipe.yieldUnit ||
            "g"

    };
}


/* ==================================================
   COST DIRECT INGREDIENTE
================================================== */

function calculateDirectIngredientsCost(
    recipe
) {

    if (
        !recipe ||
        !Array.isArray(
            recipe.ingredients
        )
    ) {

        return 0;
    }


    let total = 0;


    recipe.ingredients.forEach(
        line => {

            const ingredient =
                getIngredientById(
                    line.ingredientId
                );


            if (!ingredient) {
                return;
            }


            total +=
                Number(
                    ingredient.unitCost
                ) *
                Number(
                    line.quantity
                );

        }
    );


    return total;
}


/* ==================================================
   COST RECURSIV RETETA
================================================== */

function calculateRecipeTotalCost(
    recipeOrId,
    stack = new Set()
) {

    let recipe;


    if (
        typeof recipeOrId ===
        "object"
    ) {

        recipe =
            recipeOrId;

    } else {

        recipe =
            getRecipeById(
                recipeOrId
            );

    }


    if (!recipe) {
        return 0;
    }


    const recipeId =
        Number(
            recipe.id
        );


    /*
        Protecție împotriva
        dependențelor circulare.
    */

    if (
        stack.has(
            recipeId
        )
    ) {

        return null;
    }


    const nextStack =
        new Set(
            stack
        );


    nextStack.add(
        recipeId
    );


    let total =
        calculateDirectIngredientsCost(
            recipe
        );


    const components =
        Array.isArray(
            recipe.components
        )
            ? recipe.components
            : [];


    for (
        const component
        of components
    ) {

        const childRecipe =
            getRecipeById(
                component.recipeId
            );


        if (!childRecipe) {
            continue;
        }


        const childYield =
            getRecipeYield(
                childRecipe
            );


        if (!childYield) {
            continue;
        }


        const childCost =
            calculateRecipeTotalCost(
                childRecipe,
                nextStack
            );


        if (
            childCost === null
        ) {

            return null;
        }


        const costPerUnit =
            childCost /
            childYield.quantity;


        total +=
            costPerUnit *
            Number(
                component.quantity
            );

    }


    return total;
}


/* ==================================================
   COST / UNITATE SUB-RETETA
================================================== */

function calculateRecipeUnitCost(
    recipeOrId
) {

    const recipe =
        typeof recipeOrId ===
        "object"
            ? recipeOrId
            : getRecipeById(
                recipeOrId
            );


    if (!recipe) {
        return null;
    }


    const yieldData =
        getRecipeYield(
            recipe
        );


    if (!yieldData) {
        return null;
    }


    const totalCost =
        calculateRecipeTotalCost(
            recipe
        );


    if (
        totalCost === null
    ) {

        return null;
    }


    return (
        totalCost /
        yieldData.quantity
    );
}


/* ==================================================
   VERIFICARE DEPENDENTA
================================================== */

function recipeDependsOn(
    recipeId,
    searchedRecipeId,
    visited = new Set()
) {

    const numericRecipeId =
        Number(
            recipeId
        );


    const numericSearchId =
        Number(
            searchedRecipeId
        );


    if (
        numericRecipeId ===
        numericSearchId
    ) {

        return true;
    }


    if (
        visited.has(
            numericRecipeId
        )
    ) {

        return false;
    }


    visited.add(
        numericRecipeId
    );


    const recipe =
        getRecipeById(
            numericRecipeId
        );


    if (!recipe) {
        return false;
    }


    const components =
        Array.isArray(
            recipe.components
        )
            ? recipe.components
            : [];


    for (
        const component
        of components
    ) {

        if (
            Number(
                component.recipeId
            ) ===
            numericSearchId
        ) {

            return true;
        }


        if (
            recipeDependsOn(
                component.recipeId,
                numericSearchId,
                visited
            )
        ) {

            return true;
        }

    }


    return false;
}


/* ==================================================
   FORMATARE
================================================== */

function formatMoney(value) {

    return Number(value)
        .toFixed(2)
        .replace(".", ",") +
        " lei";
}


function formatUnitCost(value) {

    const number =
        Number(value);


    if (number < 0.01) {

        return number
            .toFixed(4)
            .replace(".", ",") +
            " lei";

    }


    return number
        .toFixed(3)
        .replace(".", ",") +
        " lei";
}


function formatQuantity(value) {

    const number =
        Number(value);


    if (
        Number.isInteger(
            number
        )
    ) {

        return number.toString();

    }


    return number
        .toFixed(2)
        .replace(".", ",");
}


function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;
}
