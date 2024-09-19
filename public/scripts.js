// Sample vehicle data (replace with real data from Firebase)
const vehicles = [
  {
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    price: 15000,
    image: "https://source.unsplash.com/400x300/?toyota,corolla"
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2019,
    price: 17000,
    image: "https://source.unsplash.com/400x300/?honda,civic"
  },
  {
    make: "Ford",
    model: "Fusion",
    year: 2017,
    price: 14000,
    image: "https://source.unsplash.com/400x300/?ford,fusion"
  }
];

// Function to display vehicle listings
function displayListings(vehicleData) {
  const listingsContainer = document.getElementById("listings-container");
  listingsContainer.innerHTML = "";
  
  if (vehicleData.length === 0) {
    listingsContainer.innerHTML = "<p>No vehicles found matching your criteria.</p>";
    return;
  }

  vehicleData.forEach(vehicle => {
    const card = document.createElement("div");
    card.classList.add("vehicle-card");

    // Vehicle Image
    const img = document.createElement("img");
    img.src = vehicle.image || "https://via.placeholder.com/400x300?text=No+Image";
    img.alt = `${vehicle.make} ${vehicle.model}`;
    card.appendChild(img);

    // Card Content
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const title = document.createElement("h3");
    title.textContent = `${vehicle.make} ${vehicle.model}`;
    cardContent.appendChild(title);

    const year = document.createElement("p");
    year.innerHTML = `<strong>Year:</strong> ${vehicle.year}`;
    cardContent.appendChild(year);

    const price = document.createElement("p");
    price.innerHTML = `<strong>Price:</strong> $${vehicle.price.toLocaleString()}`;
    cardContent.appendChild(price);

    card.appendChild(cardContent);
    listingsContainer.appendChild(card);
  });
}

// Function to handle search form submission
document.getElementById("search-form").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const make = document.getElementById("make").value.trim().toLowerCase();
  const model = document.getElementById("model").value.trim().toLowerCase();
  const minPrice = parseFloat(document.getElementById("min-price").value);
  const maxPrice = parseFloat(document.getElementById("max-price").value);
  const year = parseInt(document.getElementById("year").value);
  
  // Validate input data
  if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
    alert("Minimum price cannot be greater than maximum price.");
    return;
  }

  // Filter vehicles based on search criteria
  const filteredVehicles = vehicles.filter(vehicle => {
    const makeMatch = !make || vehicle.make.toLowerCase().includes(make);
    const modelMatch = !model || vehicle.model.toLowerCase().includes(model);
    const priceMatch = (isNaN(minPrice) || vehicle.price >= minPrice) &&
                       (isNaN(maxPrice) || vehicle.price <= maxPrice);
    const yearMatch = isNaN(year) || vehicle.year === year;
    
    return makeMatch && modelMatch && priceMatch && yearMatch;
  });
  
  displayListings(filteredVehicles);
});

// Initial display of vehicle listings
displayListings(vehicles);

// Modal Functionality
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginClose = document.getElementById('login-close');
const registerClose = document.getElementById('register-close');

const financeModal = document.getElementById('finance-modal');
const financeBtn = document.getElementById('finance-btn');
const financeClose = document.getElementById('finance-close');

// Open login modal
loginBtn.addEventListener('click', function () {
  loginModal.style.display = 'block';
});

// Open register modal
registerBtn.addEventListener('click', function () {
  registerModal.style.display = 'block';
});

// Close login modal
loginClose.addEventListener('click', function () {
  loginModal.style.display = 'none';
});

// Close register modal
registerClose.addEventListener('click', function () {
  registerModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function (event) {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  } else if (event.target === registerModal) {
    registerModal.style.display = 'none';
  } else if (event.target === financeModal) {
    financeModal.style.display = 'none';
  }
});

// //=============\\
// ||   Finance   ||
// \\=============//
// Open Finance modal
financeBtn.addEventListener('click', function () {
  financeModal.style.display = 'block';
});

// Close Finance modal
financeClose.addEventListener('click', function () {
  financeModal.style.display = 'none';
});

// Dynamically update the database as the user types
document.getElementById('car-price').addEventListener('input', function() { Finance();});
document.getElementById('interest-rate').addEventListener('input', function() { Finance();});
document.getElementById('loan-term').addEventListener('input', function() { Finance();});
document.getElementById('sales-rate').addEventListener('input', function() { Finance();});
document.getElementById('down-payment').addEventListener('input', function() { Finance();});
document.getElementById('trade-value').addEventListener('input', function() { Finance();});
document.getElementById('trade-owed').addEventListener('input', function() { Finance();});

// Calculate
function Finance() {
  // Variables
  // Set variables to 0 if it's not a number, float, or integer
  var carPrice = parseFloat(document.getElementById('car-price').value);  if (isNaN(carPrice)) { carPrice = 0;}
  var loanTerm = parseFloat(document.getElementById('loan-term').value);  if (isNaN(loanTerm)) { loanTerm = 0;}
  var downPayment = parseFloat(document.getElementById('down-payment').value);  if (isNaN(downPayment)) { downPayment = 0;}
  var tradeValue = parseFloat(document.getElementById('trade-value').value);  if (isNaN(tradeValue)) { tradeValue = 0;}
  var tradeOwed = parseFloat(document.getElementById('trade-owed').value);  if (isNaN(tradeOwed)) { tradeOwed = 0;}

  // Convert Rates
  let interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;  // Divides by 100 to convert to percentage
  if (isNaN(interestRate)) { interestRate = 0;}
  let salesRate = parseFloat(document.getElementById('sales-rate').value) / 100;  // Divides by 100 to convert to percentage
  if (isNaN(salesRate)) { salesRate = 0;}

  let interestRate_month = (interestRate) / 12;   // Interest rate per month

  /*  Calculate Sales Tax
      Sales Tax has its own formula apart from the Rate   */
  let salesTax = (carPrice) * (salesRate);

  /*  Calculate Total Finance  
      From: https://www.autotrader.com/car-payment-calculator   */
  let totalFinance = (carPrice) + (salesTax) - (downPayment) - (tradeValue) + (tradeOwed);

  /*  Calculate Monthly Payment
      Formula for Monthly Payment was taken from these 2 websites:
        https://www.calculatorsoup.com/calculators/financial/loan-calculator.php
        https://www.rocketloans.com/learn/financial-smarts/how-to-calculate-monthly-payment-on-a-loan   */
  let monthlyPayment = totalFinance * ((interestRate_month) * ((1 + interestRate_month) ** loanTerm)) / (((1 + interestRate_month) ** loanTerm) - 1);

  /*  Calculate Total Interest
      Formula: https://www.reddit.com/r/HelpMeFind/comments/12mtb62/what_does_est_total_interest_mean_im_confused/  */
  let totalInterest = (monthlyPayment * loanTerm) - (totalFinance);

  // Calculate Total Loan
  let totalLoan = (totalFinance) + (totalInterest);

  /* Check Results
     Set to 0 if any variable is NaN or infinity   */
  if (!isFinite(monthlyPayment) || isNaN(monthlyPayment) ) { monthlyPayment = 0;}
  if (!isFinite(totalFinance) || isNaN(totalFinance) ) { totalFinance = 0;}
  if (!isFinite(totalInterest) || isNaN(totalInterest) ) { totalInterest = 0;}
  if (!isFinite(totalLoan) || isNaN(totalLoan) ) { totalLoan = 0;}

  // Update HTML
  document.getElementById("monthly-pay").innerHTML = "Est. Monthly Payment: $" + monthlyPayment;
  document.getElementById("total-finance").innerHTML = "Est. Total Financed: $" + totalFinance;
  document.getElementById("total-interest").innerHTML = "Est. Total Interest: $" + totalInterest;
  document.getElementById("total-loan").innerHTML = "Est. Total Loan: $" + totalLoan;

};



