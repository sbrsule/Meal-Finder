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
				if (data.meals === null) {
					mealsEl.innerHTML = resultHeading.innerHTML = '';
					resultHeading.innerHTML = `<h2>No Results for '${term}'</h2>`;
				}
				else {
					mealsEl.innerHTML = data.meals.map(meal => 
						`<div class="meal">
							<img src="${meal.strMealThumb}"/>
							<div class="meal-info" data-mealID="${meal.idMeal}">
								<h3>${meal.strMeal}</h3>					
							</div>
						</div>`)
					.join('');
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

// Fetch meal by ID 
function getMealById(mealID) {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
		.then(res => res.json())
		.then(data => {
			const meal = data.meals[0];
			addMealToDOM(meal);
		});
}

// Add meal to DOM
function addMealToDOM(meal) {
	const ingredients = [];

	for (let i = 1; i <= 20; i++) {
		if(meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} = ${meal[`strMeasure${i}`]}`);	
		}
		else {
			break;
		}
	};

	single_mealEl.innerHTML = `
		<div class="single-meal" id="single-meal">
			<h1 id="single-meal">${meal.strMeal}</h1>
			<button class="close-btn" id="close">
				<i class="fas fa-times fa-lg" aria-hidden="true"></i>
			</button>
			<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
			<div class="single-meal-info"> 
				${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
				${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
			</div>
			<div class="main">
				<p>${meal.strInstructions}</p>
				<h2>Ingredients</h2>
				<ul>
					${ingredients.map(ing => `<li>${ing}</li>`).join('')}
				</ul>
			</div>
		</div>
	`;
	document.getElementById("single-meal").scrollIntoView();
	const close = document.getElementById("close");
	close.addEventListener('click', e => {
		single_mealEl.innerHTML = '';
		const selectedMeal = document.getElementById("selected");
		selectedMeal.scrollIntoView();
		selectedMea.removeAttribute('id');	
	});
}

// Event listeners

submit.addEventListener('submit', searchMeal);

random.addEventListener('click', e => {
	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)                                           	
        	.then(res => res.json())
        	.then(data => {
			getMealById(data.meals[0].idMeal);
        	});
});

mealsEl.addEventListener('click', e => {
	let mealInfo;
	if (e.path) {
		mealInfo = e.path.find(item => {
			if (item.classList) {
				return item.classList.contains('meal-info');
			}
			else {
				return false;
			}
		});
	}
	else if (e.composedPath) {
		mealInfo = e.composedPath().find(item => {
			if (item.classList) {
				return item.classList.contains('meal-info');
			}
			else {
				return false;
			}
		});
	}

	if (mealInfo) {
		e.target.setAttribute('id', 'selected');
		const mealID = mealInfo.getAttribute('data-mealid');
		getMealById(mealID);
	}
});
