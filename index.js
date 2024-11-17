document.getElementById("search-button").addEventListener("click", function () {
  const query = document.getElementById("search-input").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (query) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals) {
          data.meals.forEach((meal) => {
            const mealDiv = document.createElement("div");
            mealDiv.className = "recipe";
            mealDiv.innerHTML = `
                            <h3>${meal.strMeal}</h3>
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <p><a href="${meal.strSource}" target="_blank">Recipe Link</a></p>
                        `;
            resultsDiv.appendChild(mealDiv);
          });
        } else {
          resultsDiv.innerHTML = "<p>No results found.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        resultsDiv.innerHTML = "<p>Error fetching data. Please try again.</p>";
      });
  } else {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
  }
});

const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const gallery = document.getElementById("recipeGallery");
const recipeDetails = document.getElementById("recipeDetails");

async function fetchRecipes() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  displayRecipes(data.meals);
}

function displayRecipes(recipes) {
  recipes.forEach((recipe) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe");
    recipeDiv.innerHTML = `
             <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
             <p>${recipe.strMeal}</p>
         `;
    recipeDiv.addEventListener("click", () => showRecipeDetails(recipe.idMeal));
    gallery.appendChild(recipeDiv);
  });
}

async function showRecipeDetails(id) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    if (data.meals) {
      const recipe = data.meals[0];
      recipeDetails.innerHTML = `
          <h2>${recipe.strMeal}</h2>
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
          <h3>Ingredients:</h3>
          <ul>
              ${Object.keys(recipe)
                .filter((key) => key.startsWith("strIngredient") && recipe[key])
                .map((key) => `<li>${recipe[key]}</li>`)
                .join("")}
          </ul>
          <h3>Instructions:</h3>
          <p>${recipe.strInstructions}</p>
      `;
      recipeDetails.style.display = "block";
    } else {
      recipeDetails.innerHTML = "<p>No recipe found.</p>";
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    recipeDetails.innerHTML = "<p>Error fetching recipe details.</p>";
  }
}

fetchRecipes();
