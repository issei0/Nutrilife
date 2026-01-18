let foods = [];

async function loadCSV() {
  const res = await fetch("./data.csv");
  const text = await res.text();

  const lines = text.trim().split(/\r?\n/);

  foods = lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
      .map(v => v.replace(/"/g, "").trim());

    const num = i => {
      const v = values[i];
      const n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    };

    return {
      name: values[1],
      calories: num(2),
      fat: num(3),
      carbs: num(7),
      sugar: num(8),
      protein: num(9),
      fiber: num(10),
      sodium: num(12),
      water: num(13),
      vitaminA: num(14),
      vitaminC: num(22),
      vitaminD: num(23),
      vitaminE: num(24),
      vitaminK: num(25),
      calcium: num(26),
      copper: num(27),
      iron: num(28),
      magnesium: num(29),
      phosphorus: num(31),
      potassium: num(32),
      selenium: num(33),
      zinc: num(34)
    };
  });
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  document.getElementById(id).classList.add("active");

  if (id === "account") {
    resetAccountFlow();
  }
}

function calculateNutrition() {
  const name = document.getElementById("foodInput").value.toLowerCase();
  const qty = Number(document.getElementById("qtyInput").value);

  const food = foods.find(f =>
    f.name && f.name.toLowerCase() === name
  );

  if (!food || !qty) {
    document.getElementById("nutritionResult").innerText =
      "Food not found or invalid quantity";
    return;
  }

  const factor = qty / 100;

  document.getElementById("nutritionResult").innerHTML = `
    <strong>${name} for ${qty} g</strong><br><br>

    🔥 Calories: ${(food.calories * factor).toFixed(1)} kcal<br>
    🥩 Protein: ${(food.protein * factor).toFixed(1)} g<br>
    🥖 Carbs: ${(food.carbs * factor).toFixed(1)} g<br>
    🧈 Fat: ${(food.fat * factor).toFixed(1)} g<br>
    🍬 Sugar: ${(food.sugar * factor).toFixed(1)} g<br>
    🌾 Fiber: ${(food.fiber * factor).toFixed(1)} g<br>
    🧂 Sodium: ${(food.sodium * factor).toFixed(1)} g<br>
    💧 Water: ${(food.water * factor).toFixed(1)} g<br><br>

    🦴 Calcium: ${(food.calcium * factor).toFixed(1)} mg<br>
    🧲 Iron: ${(food.iron * factor).toFixed(1)} mg<br>
    ⚡ Magnesium: ${(food.magnesium * factor).toFixed(1)} mg<br>
    🍌 Potassium: ${(food.potassium * factor).toFixed(1)} mg<br>
    🧪 Zinc: ${(food.zinc * factor).toFixed(1)} mg<br><br>

    🌞 Vitamin A: ${(food.vitaminA * factor).toFixed(1)} mg<br>
    🍊 Vitamin C: ${(food.vitaminC * factor).toFixed(1)} mg<br>
    🌤 Vitamin D: ${(food.vitaminD * factor).toFixed(1)} mg<br>
    🌿 Vitamin E: ${(food.vitaminE * factor).toFixed(1)} mg<br>
    🥬 Vitamin K: ${(food.vitaminK * factor).toFixed(1)} mg
  `;
  document.getElementById("foodInput").value = "";
  document.getElementById("qtyInput").value = "";
}

function calculateBMI() {
  const h = Number(document.getElementById("height").value) / 100;
  const w = Number(document.getElementById("weight").value);

  if (!h || !w) {
    document.getElementById("bmiResult").innerText = "Invalid input";
    return;
  }

  const bmi = (w / (h * h)).toFixed(1);
  
  // Determine BMI category and status
  let category = "";
  let status = "";
  let advice = "";
  let emoji = "";
  
  if (bmi < 18.5) {
    category = "Underweight";
    status = "low";
    emoji = "⚠️";
    advice = "You may need to gain weight. Consult a healthcare provider for personalized advice.";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal Weight";
    status = "normal";
    emoji = "✅";
    advice = "Great! You're in a healthy weight range. Keep maintaining your lifestyle.";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
    status = "moderate";
    emoji = "⚠️";
    advice = "Consider adopting a healthier diet and increasing physical activity.";
  } else {
    category = "Obese";
    status = "high";
    emoji = "🔴";
    advice = "It's recommended to consult a healthcare provider for weight management guidance.";
  }
  
  document.getElementById("bmiResult").innerHTML = `
    <div class="bmi-result-card ${status}">
      <div class="bmi-emoji">${emoji}</div>
      <div class="bmi-value">BMI: ${bmi}</div>
      <div class="bmi-category">${category}</div>
      <div class="bmi-advice">${advice}</div>
      <div class="bmi-scale">
        <div class="scale-item">
          <div class="scale-bar underweight ${status === 'low' ? 'active' : ''}"></div>
          <div class="scale-label">Underweight<br>&lt;18.5</div>
        </div>
        <div class="scale-item">
          <div class="scale-bar normal ${status === 'normal' ? 'active' : ''}"></div>
          <div class="scale-label">Normal<br>18.5-24.9</div>
        </div>
        <div class="scale-item">
          <div class="scale-bar overweight ${status === 'moderate' ? 'active' : ''}"></div>
          <div class="scale-label">Overweight<br>25-29.9</div>
        </div>
        <div class="scale-item">
          <div class="scale-bar obese ${status === 'high' ? 'active' : ''}"></div>
          <div class="scale-label">Obese<br>≥30</div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById("height").value = "";
  document.getElementById("weight").value = "";
}

loadCSV();

// AUTOCOMPLETE FUNCTIONALITY
function showSuggestions(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestionsDiv = document.getElementById(suggestionsId);
  const searchText = input.value.toLowerCase().trim();

  // Clear suggestions if input is empty or less than 1 character
  if (searchText.length < 1) {
    suggestionsDiv.classList.remove('show');
    suggestionsDiv.innerHTML = '';
    return;
  }

  // Filter foods that match the search text
  const matches = foods.filter(food => 
    food.name && food.name.toLowerCase().includes(searchText)
  ).slice(0, 10); // Limit to 10 suggestions

  // If no matches, hide suggestions
  if (matches.length === 0) {
    suggestionsDiv.classList.remove('show');
    suggestionsDiv.innerHTML = '';
    return;
  }

  // Create suggestion items
  let html = '';
  matches.forEach(food => {
    const foodName = food.name;
    // Highlight matching text
    const regex = new RegExp(`(${searchText})`, 'gi');
    const highlightedName = foodName.replace(regex, '<span class="suggestion-highlight">$1</span>');
    
    html += `<div class="suggestion-item" onclick="selectSuggestion('${inputId}', '${suggestionsId}', '${foodName.replace(/'/g, "\\'")}')">${highlightedName}</div>`;
  });

  suggestionsDiv.innerHTML = html;
  suggestionsDiv.classList.add('show');
}

function selectSuggestion(inputId, suggestionsId, foodName) {
  const input = document.getElementById(inputId);
  const suggestionsDiv = document.getElementById(suggestionsId);
  
  input.value = foodName;
  suggestionsDiv.classList.remove('show');
  suggestionsDiv.innerHTML = '';
}

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
  const suggestions = document.querySelectorAll('.autocomplete-suggestions');
  suggestions.forEach(suggestionDiv => {
    if (!suggestionDiv.parentElement.contains(e.target)) {
      suggestionDiv.classList.remove('show');
      suggestionDiv.innerHTML = '';
    }
  });
});

function showLogin() {
  hideAllAccountCards();
  document.getElementById("loginCard").classList.remove("hidden");
}

function showSignup() {
  hideAllAccountCards();
  document.getElementById("signupCard").classList.remove("hidden");
}

function showPayment() {
  hideAllAccountCards();
  document.getElementById("paymentCard").classList.remove("hidden");
}

function hideAllAccountCards() {
  ["loginCard","signupCard","paymentCard"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
}

let fakeUser = null;

function login() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  fakeUser = {
    email,
    password: pass,
    subscribed: true
  };

  showPage("account");
  refreshPremiumFeatures();
  refreshNavbar();

  document.getElementById("logoutBtn").classList.remove("hidden");
}

function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const plan = document.getElementById("planSelect").value;

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  fakeUser = { name, email, password, plan, subscribed: false };
  showPayment();
}

function formatCardNumber(input) {
  input.value = input.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim();
}

function formatExpiry(input) {
  input.value = input.value.replace(/\D/g,'').replace(/(.{2})/, '$1/').substr(0,5);
}

function confirmPayment() {
  if (!fakeUser) {
    showSignup();
    return;
  }

  fakeUser.subscribed = true;

  document.getElementById("paymentCard").classList.add("hidden");

  refreshPremiumFeatures();
  refreshNavbar();
  document.getElementById("logoutBtn").classList.remove("hidden");

  const overlay = document.getElementById("successOverlay");
  overlay.classList.remove("hidden");

  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 3000);
}

function refreshNavbar() {
  const subNav = document.getElementById("navSubscription");

  if (fakeUser && fakeUser.subscribed) {
    subNav.style.display = "none";
  } else {
    subNav.style.display = "block";
  }
}

refreshNavbar();

let meals = [];
let weeklyMeals = []; // Store meals by day

const dailyTargets = {
  male: {
    calories: 2500,
    fat: 70,
    carbs: 300,
    sugar: 36,
    protein: 56,
    fiber: 38,
    sodium: 2300,
    water: 3700,
    vitaminA: 0.9,
    vitaminC: 90,
    vitaminD: 0.015,
    vitaminE: 15,
    vitaminK: 0.12,
    calcium: 1000,
    copper: 0.9,
    iron: 8,
    magnesium: 420,
    phosphorus: 700,
    potassium: 3400,
    selenium: 0.055,
    zinc: 11
  },
  female: {
    calories: 2000,
    fat: 60,
    carbs: 260,
    sugar: 25,
    protein: 46,
    fiber: 25,
    sodium: 2300,
    water: 2700,
    vitaminA: 0.7,
    vitaminC: 75,
    vitaminD: 0.015,
    vitaminE: 15,
    vitaminK: 0.09,
    calcium: 1000,
    copper: 0.9,
    iron: 18,
    magnesium: 320,
    phosphorus: 700,
    potassium: 2600,
    selenium: 0.055,
    zinc: 8
  }
};

function addMeal() {
  const gender = document.getElementById("genderSelect").value;
  const date = document.getElementById("mealDate").value;
  const time = document.getElementById("mealTime").value;
  const name = document.getElementById("mealFood").value.toLowerCase();
  const qty = Number(document.getElementById("mealQty").value);

  const food = foods.find(f => f.name?.toLowerCase() === name);

  if (!food || !qty || !time || !date) {
    alert("Please fill all fields (date, time, food name, and quantity)");
    return;
  }

  const factor = qty / 100;

  const mealData = {
    calories: food.calories * factor,
    fat: food.fat * factor,
    carbs: food.carbs * factor,
    sugar: food.sugar * factor,
    protein: food.protein * factor,
    fiber: food.fiber * factor,
    sodium: food.sodium * factor,
    water: food.water * factor,
    vitaminA: food.vitaminA * factor,
    vitaminC: food.vitaminC * factor,
    vitaminD: food.vitaminD * factor,
    vitaminE: food.vitaminE * factor,
    vitaminK: food.vitaminK * factor,
    calcium: food.calcium * factor,
    copper: food.copper * factor,
    iron: food.iron * factor,
    magnesium: food.magnesium * factor,
    phosphorus: food.phosphorus * factor,
    potassium: food.potassium * factor,
    selenium: food.selenium * factor,
    zinc: food.zinc * factor,
    timestamp: new Date(date + 'T' + time)
  };

  // Add to weekly data using the selected date
  const selectedDate = new Date(date).toDateString();
  const existingDay = weeklyMeals.find(d => d.date === selectedDate);
  if (existingDay) {
    existingDay.meals.push(mealData);
  } else {
    weeklyMeals.push({ date: selectedDate, meals: [mealData] });
  }
  
  // Sort weekly meals by date
  weeklyMeals.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Keep only last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  weeklyMeals = weeklyMeals.filter(d => new Date(d.date) >= thirtyDaysAgo);

  // Update daily summary for the selected date
  updateDailySummary(gender, date);
  
  const btn = document.getElementById("showRecommendationBtn");
  btn.classList.remove("hidden");
  
  document.getElementById("recommendationResults").innerHTML = "";

  document.getElementById("mealTime").value = "";
  document.getElementById("mealFood").value = "";
  document.getElementById("mealQty").value = "";

  // ✅ ensure divider is visible
  document.getElementById("trackerDivider").classList.remove("hidde");
}

function calculateTotals(dateString) {
  // Get meals for specific date
  const dayData = weeklyMeals.find(d => d.date === dateString);
  
  if (!dayData || !dayData.meals.length) {
    return {};
  }
  
  return dayData.meals.reduce((totals, meal) => {
    for (const key in meal) {
      if (key !== 'timestamp') {
        totals[key] = (totals[key] || 0) + meal[key];
      }
    }
    return totals;
  }, {});
}

function updateDailySummary(gender, dateValue) {
  const target = dailyTargets[gender];
  const selectedDate = new Date(dateValue).toDateString();
  const total = calculateTotals(selectedDate);

  // If no meals for this date, show empty table
  if (!Object.keys(total).length) {
    document.getElementById("dailySummary").innerHTML = `
      <h4>Daily Nutrition Summary - ${new Date(dateValue).toLocaleDateString()}</h4>
      <p class="muted">No meals added for this date yet.</p>
    `;
    return;
  }

  let html = `
    <h4>Daily Nutrition Summary - ${new Date(dateValue).toLocaleDateString()}</h4>
    <table class="nutrition-table">
      <thead>
        <tr>
          <th>Nutrient</th>
          <th>Consumed</th>
          <th>Recommended</th>
          <th>Remaining</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const key in target) {
    const consumed = total[key] || 0;
    const recommended = target[key];
    const remaining = Math.max(recommended - consumed, 0);
    const unit = nutrientUnits[key] || "";
    const status = getNutrientStatus(consumed, recommended);

    html += `
      <tr class="${status}">
        <td>${formatLabel(key)}</td>
        <td>${consumed.toFixed(1)} ${unit}</td>
        <td>${recommended} ${unit}</td>
        <td>${remaining.toFixed(1)} ${unit}</td>
        <td class="status">${status.toUpperCase()}</td>
      </tr>
    `;
  }

  html += `</tbody></table>`;
  document.getElementById("dailySummary").innerHTML = html;
}

function formatLabel(label) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase());
}

const nutrientUnits = {
  calories: "kcal",
  protein: "g",
  carbs: "g",
  fat: "g",
  sugar: "g",
  fiber: "g",
  sodium: "mg",
  water: "g",
  calcium: "mg",
  iron: "mg",
  magnesium: "mg",
  potassium: "mg",
  zinc: "mg",
  vitaminA: "mg",
  vitaminC: "mg",
  vitaminD: "mg",
  vitaminE: "mg",
  vitaminK: "mg"
};

function getNutrientStatus(consumed, recommended) {
  const ratio = consumed / recommended;
  if (ratio < 0.7) return "low";
  if (ratio <= 1.1) return "ok";
  return "high";
}

const nutrientFieldMap = {
  calories: "calories",
  protein: "protein",
  fat: "fat",
  carbs: "carbs",
  fiber: "fiber",
  sugar: "sugar",
  sodium: "sodium",
  water: "water",
  calcium: "calcium",
  iron: "iron",
  magnesium: "magnesium",
  potassium: "potassium",
  zinc: "zinc",
  vitaminA: "vitaminA",
  vitaminC: "vitaminC",
  vitaminD: "vitaminD",
  vitaminE: "vitaminE",
  vitaminK: "vitaminK"
};

function getFoodsForNutrient(nutrientKey, remaining, limit = 3) {
  const field = nutrientFieldMap[nutrientKey];
  if (!field) return [];

  const filteredFoods = foods.filter(f => {
    if (!f[field] || f[field] <= 0) return false;
    
    const name = f.name.toLowerCase();
    
    if (name.includes('alcohol') || name.includes('beer') || 
        name.includes('wine') || name.includes('whiskey') || 
        name.includes('vodka') || name.includes('rum') || 
        name.includes('gin') || name.includes('tequila') ||
        name.includes('liqueur') || name.includes('brandy') ||
        name.includes('champagne') || name.includes('sake')) {
      return false;
    }
    
    if (name.includes('pork') || name.includes('bacon') || 
        name.includes('ham') || name.includes('sausage')) {
      return false;
    }
    
    return true;
  });

  return filteredFoods
    .sort((a, b) => b[field] - a[field])
    .slice(0, limit)
    .map(f => {
      const contentPer100g = f[field];
      const gramsNeeded = (remaining / contentPer100g) * 100;
      
      return {
        name: f.name,
        gramsNeeded: gramsNeeded,
        contentPer100g: contentPer100g
      };
    });
}

function getDeficiencies(total, target) {
  return Object.keys(target).filter(
    key => (total[key] || 0) < target[key] * 0.7
  );
}

function showFoodRecommendations() {
  if (!foods || !foods.length) return;

  const gender = document.getElementById("genderSelect").value;
  const dateValue = document.getElementById("mealDate").value;
  const selectedDate = new Date(dateValue).toDateString();
  const total = calculateTotals(selectedDate);
  const target = dailyTargets[gender];

  if (!Object.keys(total).length) {
    document.getElementById("recommendationResults").innerHTML = 
      `<p class="muted">No meals added for this date yet.</p>`;
    return;
  }

  const deficiencies = getDeficiencies(total, target);

  let html = "";

  if (deficiencies.length) {
    html += `<h4>🧠 Food Suggestions (To Meet Daily Requirements)</h4><ul class="suggestions">`;

    deficiencies.forEach(nutrient => {
      const consumed = total[nutrient] || 0;
      const recommended = target[nutrient];
      const remaining = Math.max(recommended - consumed, 0);
      const unit = nutrientUnits[nutrient] || "";
      
      const suggestions = getFoodsForNutrient(nutrient, remaining);

      if (suggestions.length) {
        html += `<li><strong>${formatLabel(nutrient)}</strong> (${remaining.toFixed(1)} ${unit} remaining):<br>`;
        
        suggestions.forEach(food => {
          html += `&nbsp;&nbsp;• ${food.name}: ${food.gramsNeeded.toFixed(0)}g to meet remaining requirement<br>`;
        });
        
        html += `</li>`;
      }
    });

    html += `</ul>`;
  } else {
    html = `<p class="success-msg">✅ All nutrients are within healthy range</p>`;
  }

  document.getElementById("recommendationResults").innerHTML = html;
  document.getElementById("showRecommendationBtn").classList.add("hidden");

  // ✅ ensure divider is visible
  document.getElementById("trackerDivider").classList.remove("hidden");
}

function refreshPremiumFeatures() {
  const dashboardDiv = document.getElementById("premiumDashboard");
  
  if (fakeUser && fakeUser.subscribed) {
    dashboardDiv.classList.remove("hidden");
    
    document.getElementById("addMealsSection").classList.add("hidden");
    document.getElementById("waterTrackerSection").classList.add("hidden");
    document.getElementById("weeklyNutritionSection").classList.add("hidden");
  } else {
    dashboardDiv.classList.add("hidden");
  }
}

function showFeatureSection(feature) {
  document.getElementById("premiumDashboard").classList.add("hidden");
  
  document.getElementById("addMealsSection").classList.add("hidden");
  document.getElementById("waterTrackerSection").classList.add("hidden");
  document.getElementById("weeklyNutritionSection").classList.add("hidden");
  
  if (feature === 'addMeals') {
    document.getElementById("addMealsSection").classList.remove("hidden");
    // Set date to today when opening Add Meals
    document.getElementById("mealDate").value = getTodayDate();
  } else if (feature === 'waterTracker') {
    document.getElementById("waterTrackerSection").classList.remove("hidden");
    updateWaterDisplay();
  } else if (feature === 'weeklyNutrition') {
    document.getElementById("weeklyNutritionSection").classList.remove("hidden");
    drawWeeklyChart();
  }
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Handle date change - reset table and show data for selected date
function handleDateChange() {
  const dateValue = document.getElementById("mealDate").value;
  const gender = document.getElementById("genderSelect").value;
  
  // Hide recommendation button and clear recommendations
  document.getElementById("showRecommendationBtn").classList.add("hidden");
  document.getElementById("recommendationResults").innerHTML = "";
  
  // Update the summary for the new date
  updateDailySummary(gender, dateValue);
}

function backToDashboard() {
  document.getElementById("addMealsSection").classList.add("hidden");
  document.getElementById("waterTrackerSection").classList.add("hidden");
  document.getElementById("weeklyNutritionSection").classList.add("hidden");
  
  document.getElementById("premiumDashboard").classList.remove("hidden");
}

// WATER TRACKER FUNCTIONS
let waterIntake = 0;

function addWater(amount) {
  waterIntake += amount;
  updateWaterDisplay();
}

function resetWater() {
  waterIntake = 0;
  updateWaterDisplay();
}

function updateWaterDisplay() {
  const gender = document.getElementById("genderSelect").value;
  const goal = gender === 'male' ? 3700 : 2700;
  
  document.getElementById("waterAmount").textContent = waterIntake + " ml";
  document.getElementById("waterGoal").textContent = goal + " ml";
  
  const percentage = Math.min((waterIntake / goal) * 100, 100);
  const progressBar = document.getElementById("waterProgressBar");
  progressBar.style.width = percentage + "%";
  progressBar.textContent = percentage.toFixed(0) + "%";
}

// WEEKLY CHART
let weeklyChart = null;

function getWeekDays(referenceDate = new Date()) {
  // Get the Monday of the week containing the reference date
  const date = new Date(referenceDate);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));
  
  // Generate array of 7 days starting from Monday
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    weekDays.push(currentDay.toDateString());
  }
  
  return weekDays;
}

function drawWeeklyChart() {
  const ctx = document.getElementById("weeklyChart");
  
  if (weeklyChart) {
    weeklyChart.destroy();
  }

  // Get Monday to Sunday of current week
  const weekDays = getWeekDays();

  // Calculate totals for each day
  const dailyData = weekDays.map(date => {
    const dayMeals = weeklyMeals.find(d => d.date === date);
    
    if (!dayMeals) {
      return {
        calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0,
        vitaminA: 0, vitaminC: 0, vitaminD: 0, fiber: 0,
        sodium: 0, calcium: 0, iron: 0
      };
    }
    
    return dayMeals.meals.reduce((totals, meal) => {
      totals.calories += meal.calories || 0;
      totals.protein += meal.protein || 0;
      totals.carbs += meal.carbs || 0;
      totals.fat += meal.fat || 0;
      totals.sugar += meal.sugar || 0;
      totals.vitaminA += meal.vitaminA || 0;
      totals.vitaminC += meal.vitaminC || 0;
      totals.vitaminD += meal.vitaminD || 0;
      totals.fiber += meal.fiber || 0;
      totals.sodium += meal.sodium || 0;
      totals.calcium += meal.calcium || 0;
      totals.iron += meal.iron || 0;
      return totals;
    }, {
      calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0,
      vitaminA: 0, vitaminC: 0, vitaminD: 0, fiber: 0,
      sodium: 0, calcium: 0, iron: 0
    });
  });

  const labels = weekDays.map(date => {
    const d = new Date(date);
    const today = new Date().toDateString();
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return date === today ? `${dayName} (Today)\n${dateStr}` : `${dayName}\n${dateStr}`;
  });

  weeklyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Calories (kcal)',
          data: dailyData.map(d => d.calories.toFixed(1)),
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          tension: 0.4
        },
        {
          label: 'Protein (g)',
          data: dailyData.map(d => d.protein.toFixed(1)),
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.4
        },
        {
          label: 'Carbs (g)',
          data: dailyData.map(d => d.carbs.toFixed(1)),
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
          tension: 0.4
        },
        {
          label: 'Fat (g)',
          data: dailyData.map(d => d.fat.toFixed(1)),
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          tension: 0.4
        },
        {
          label: 'Sugar (g)',
          data: dailyData.map(d => d.sugar.toFixed(1)),
          borderColor: '#e91e63',
          backgroundColor: 'rgba(233, 30, 99, 0.1)',
          tension: 0.4
        },
        {
          label: 'Fiber (g)',
          data: dailyData.map(d => d.fiber.toFixed(1)),
          borderColor: '#795548',
          backgroundColor: 'rgba(121, 85, 72, 0.1)',
          tension: 0.4
        },
        {
          label: 'Sodium (mg)',
          data: dailyData.map(d => d.sodium.toFixed(1)),
          borderColor: '#607d8b',
          backgroundColor: 'rgba(96, 125, 139, 0.1)',
          tension: 0.4
        },
        {
          label: 'Vitamin A (mg)',
          data: dailyData.map(d => d.vitaminA.toFixed(1)),
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          tension: 0.4
        },
        {
          label: 'Vitamin C (mg)',
          data: dailyData.map(d => d.vitaminC.toFixed(1)),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4
        },
        {
          label: 'Vitamin D (mg)',
          data: dailyData.map(d => d.vitaminD.toFixed(1)),
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          tension: 0.4
        },
        {
          label: 'Calcium (mg)',
          data: dailyData.map(d => d.calcium.toFixed(1)),
          borderColor: '#00bcd4',
          backgroundColor: 'rgba(0, 188, 212, 0.1)',
          tension: 0.4
        },
        {
          label: 'Iron (mg)',
          data: dailyData.map(d => d.iron.toFixed(1)),
          borderColor: '#673ab7',
          backgroundColor: 'rgba(103, 58, 183, 0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 10,
            font: { size: 11 }
          }
        },
        title: {
          display: true,
          text: 'Your Weekly Nutrition Trends (Monday - Sunday)',
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Day of Week'
          }
        }
      }
    }
  });
}

function resetAccountFlow() {
  hideAllAccountCards();

  if (fakeUser) {
    refreshPremiumFeatures();
    document.getElementById("logoutBtn").classList.remove("hidden");
  } else {
    showLogin();
    document.getElementById("logoutBtn").classList.add("hidden");
  }
}

function logout() {
  fakeUser = null;
  waterIntake = 0;
  meals = [];
  weeklyMeals = [];

  hideAllAccountCards();
  document.getElementById("premiumDashboard").classList.add("hidden");
  document.getElementById("addMealsSection").classList.add("hidden");
  document.getElementById("waterTrackerSection").classList.add("hidden");
  document.getElementById("weeklyNutritionSection").classList.add("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");

  refreshNavbar();
  showLogin();
}
