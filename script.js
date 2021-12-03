const	search = document.getElementById('search'),
	submit = document.getElementById('submit'),
	mealsEl = document.getElementById('meals'),
	resultHeading = document.getElementById('result-heading'),
	single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API 
function searchMeal(e) {
	e.preventDefault();	

	// Clear single meal
	single_mealEl.innerHTML = '';

	// Get search term
	const term = search.value;

	if(term.trim()) {
		fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (data.meals === null) {
					resultHeading.innerHTML = `<h2>No Results for '${term}'</h2>`;
				}
				else {
					mealsEl.innerHTML = data.meals.map(meal => `<div class="meal">
						<img src="${meal.strMealThumb}"/>
						<div class="meal-info" data-mealID="${meal.idMeal}">
							<h3>${meal.strMeal}</h3>					</div>
						</div>
					`).join('');
					search.value = '';
				}
				if (data.meals.length === 1) {
					resultHeading.innerHTML = `<h2>1 result for '${term}':</h2>`;
					
				}
				else if (data.meals.length > 1) {
					resultHeading.innerHTML = `<h2>${data.meals.length} results for '${term}':</h2>`;
				}
			});
	}
	else {
		mealsEl.innerHTML = resultHeading.innerHTML = '';
	}
};

// Event listeners
submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', e => {
	const mealInfo = e.path.find(item => {
		if(item.classList) {
			return item.classList.contains('meal-info');
		}
		else {
			return false;
		}
	})	

	console.log(mealInfo);
});
