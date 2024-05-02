// Sample vehicle data (replace with real data from Firebase)
const vehicles = [
    { make: "Toyota", model: "Corolla", year: 2018, price: 15000 },
    { make: "Honda", model: "Civic", year: 2019, price: 17000 },
    { make: "Ford", model: "Fusion", year: 2017, price: 14000 }
  ];
  
  // Function to display vehicle listings
  function displayListings(vehicleData) {
    const listingsContainer = document.getElementById("vehicle-listings");
    listingsContainer.innerHTML = "";
    vehicleData.forEach(vehicle => {
      const card = document.createElement("div");
      card.classList.add("vehicle-card");
      card.innerHTML = `
        <h2>${vehicle.make} ${vehicle.model}</h2>
        <p>Year: ${vehicle.year}</p>
        <p>Price: $${vehicle.price}</p>
      `;
      listingsContainer.appendChild(card);
    });
  }
  
  // Function to handle search form submission
  document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const make = document.getElementById("make").value.toLowerCase();
    const model = document.getElementById("model").value.toLowerCase();
    const minPrice = parseFloat(document.getElementById("min-price").value);
    const maxPrice = parseFloat(document.getElementById("max-price").value);
    const year = parseInt(document.getElementById("year").value);
  
    // Filter vehicles based on search criteria
    const filteredVehicles = vehicles.filter(vehicle => {
      const makeMatch = make === "" || vehicle.make.toLowerCase().includes(make);
      const modelMatch = model === "" || vehicle.model.toLowerCase().includes(model);
      const priceMatch = (isNaN(minPrice) || vehicle.price >= minPrice) &&
                         (isNaN(maxPrice) || vehicle.price <= maxPrice);
      const yearMatch = isNaN(year) || vehicle.year === year;
      return makeMatch && modelMatch && priceMatch && yearMatch;
    });
  
    displayListings(filteredVehicles);
  });
  
  // Initial display of vehicle listings
  displayListings(vehicles);
  