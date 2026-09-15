let currentCategory = "";

let favoritePlaces =
    JSON.parse(localStorage.getItem("nearGoFavorites")) || [];


// ===============================
// DARK MODE
// ===============================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    let button =
        document.getElementById("themeButton");

    if (document.body.classList.contains("dark-mode")) {

        button.innerText = "Light Mode";

    } else {

        button.innerText = "Dark Mode";

    }

}


// ===============================
// LOCATION FEATURE
// ===============================

function showLocationBox() {

    document.getElementById("locationBox").style.display =
        "block";

}


function addLocation() {

    let location =
        document.getElementById("locationInput").value.trim();

    let message =
        document.getElementById("locationMessage");


    if (location === "") {

        message.style.color = "red";

        message.innerText =
            "Please enter your location.";

    } else {

        localStorage.setItem("nearGoLocation", location);

        message.style.color = "green";

        message.innerText =
            "Your location is: " + location;

    }

}


function getCurrentLocation() {

    let message =
        document.getElementById("locationMessage");


    if (!navigator.geolocation) {

        message.style.color = "red";

        message.innerText =
            "Geolocation is not supported.";

        return;

    }


    message.style.color = "blue";

    message.innerText =
        "Detecting your location...";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            let latitude =
                position.coords.latitude;

            let longitude =
                position.coords.longitude;


            let locationText =
                "Latitude: " + latitude
                + ", Longitude: " + longitude;


            localStorage.setItem(
                "nearGoLocation",
                locationText
            );


            message.style.color = "green";

            message.innerText =
                "Current location detected: "
                + locationText;

        },

        function() {

            message.style.color = "red";

            message.innerText =
                "Location permission denied. Enter location manually.";

        }

    );

}


// ===============================
// SEARCH
// ===============================

function searchPlace() {

    let searchValue =
        document.getElementById("searchInput")
        .value
        .trim();


    if (searchValue === "") {

        alert("Please enter a place name.");

        return;

    }


    let categories = [

        "Railway Station",
        "Airport",
        "Bus Stand",
        "Hotel",
        "Restaurant",
        "Petrol Pump",
        "EV Charging",
        "Hospital",
        "ATM",
        "Police Station",
        "Shopping Complex"

    ];


    let matchedCategory =
        categories.find(function(category) {

            return category.toLowerCase()
                .includes(searchValue.toLowerCase());

        });


    if (matchedCategory) {

        openCategory(matchedCategory);

    } else {

        openCategory(searchValue);

    }

}


// ===============================
// CATEGORY OPEN
// ===============================

function openCategory(category) {

    currentCategory = category;


    document.getElementById("resultTitle").innerText =
        category;


    document.getElementById("resultDescription").innerText =
        "Choose an option to find nearby " + category;


    document.getElementById("options").innerHTML = "";

    document.getElementById("placeResults").innerHTML = "";


    if (category === "Hospital") {

        createFilterButton("All", function() {
            showHospital("All");
        });

        createFilterButton("Government", function() {
            showHospital("Government");
        });

        createFilterButton("Private", function() {
            showHospital("Private");
        });


        showHospital("All");

    }


    else if (category === "ATM") {

        let banks = [
            "All Banks",
            "SBI",
            "PNB",
            "BOI",
            "HDFC",
            "ICICI",
            "Axis Bank",
            "Canara Bank"
        ];


        banks.forEach(function(bank) {

            createFilterButton(bank, function() {
                showATM(bank);
            });

        });


        showATM("All Banks");

    }


    else {

        createFilterButton("All", function() {
            showPlaces(category, "All");
        });

        createFilterButton("Nearest", function() {
            showPlaces(category, "Nearest");
        });

        createFilterButton("Open Now", function() {
            showPlaces(category, "Open Now");
        });


        showPlaces(category, "All");

    }


    document.getElementById("results").scrollIntoView({
        behavior: "smooth"
    });

}


// ===============================
// FILTER BUTTON
// ===============================

function createFilterButton(text, action) {

    let button =
        document.createElement("button");


    button.innerText = text;


    button.onclick = function() {

        action();

        setActiveButton(button);

    };


    document.getElementById("options")
        .appendChild(button);

}


function setActiveButton(selectedButton) {

    let buttons =
        document.querySelectorAll("#options button");


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    selectedButton.classList.add("active");

}


// ===============================
// HOSPITAL DATA
// ===============================

function showHospital(type) {

    let hospitals = [

        {
            name: "AIIMS Patna",
            type: "Government",
            address: "AIIMS Patna, Bihar",
            distance: 5,
            open: true,
            image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        },

        {
            name: "PMCH",
            type: "Government",
            address: "PMCH, Patna, Bihar",
            distance: 8,
            open: true,
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d"
        },

        {
            name: "Private Care Hospital",
            type: "Private",
            address: "Private Care Hospital, Patna",
            distance: 3,
            open: true,
            image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907"
        }

    ];


    let filteredHospitals = hospitals;


    if (type !== "All") {

        filteredHospitals =
            hospitals.filter(function(hospital) {

                return hospital.type === type;

            });

    }


    displayPlaces(filteredHospitals);

}


// ===============================
// ATM DATA
// ===============================

function showATM(bank) {

    let banks = [

        "SBI",
        "PNB",
        "BOI",
        "HDFC",
        "ICICI",
        "Axis Bank",
        "Canara Bank"

    ];


    let filteredBanks = banks;


    if (bank !== "All Banks") {

        filteredBanks =
            banks.filter(function(item) {

                return item === bank;

            });

    }


    let places =
        filteredBanks.map(function(bankName, index) {

            return {

                name: bankName + " ATM",

                type: "ATM",

                address: bankName + " ATM, Patna, Bihar",

                distance: index + 1,

                open: true,

                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"

            };

        });


    displayPlaces(places);

}


// ===============================
// OTHER CATEGORY DATA
// ===============================

function showPlaces(category, option) {

    let places = [

        {
            name: "Main " + category,
            type: category,
            address: "Main Road, Patna, Bihar",
            distance: 7,
            open: true,
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
        },

        {
            name: "City Center " + category,
            type: category,
            address: "City Center, Patna, Bihar",
            distance: 3,
            open: true,
            image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df"
        },

        {
            name: "Nearby " + category,
            type: category,
            address: "Near Main Market, Patna",
            distance: 1,
            open: false,
            image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72"
        }

    ];


    let filteredPlaces = places;


    if (option === "Nearest") {

        filteredPlaces =
            places.filter(function(place) {

                return place.distance <= 3;

            });

    }


    if (option === "Open Now") {

        filteredPlaces =
            places.filter(function(place) {

                return place.open === true;

            });

    }


    displayPlaces(filteredPlaces);

}


// ===============================
// DISPLAY RESULT CARDS
// ===============================

function displayPlaces(places) {

    let resultBox =
        document.getElementById("placeResults");


    resultBox.innerHTML = "";


    if (places.length === 0) {

        resultBox.innerHTML =
            "<p>No places found.</p>";

        return;

    }


    places.forEach(function(place) {

        let card =
            document.createElement("div");


        card.className = "place-card";


        let isFavorite =
            favoritePlaces.some(function(item) {

                return item.name === place.name;

            });


        card.innerHTML = `

            <img
                src="${place.image}"
                alt="${place.name}"
            >

            <div class="place-card-content">

                <h3>${place.name}</h3>

                <p>
                    <strong>Type:</strong>
                    ${place.type}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${place.address}
                </p>

                <p>
                    <strong>Distance:</strong>
                    ${place.distance} km
                </p>

                <p>
                    <strong>Status:</strong>
                    ${place.open ? "Open Now" : "Closed"}
                </p>

                <button onclick='openMap(${JSON.stringify(place.address)})'>
                    View Location
                </button>

                <button
                    class="favorite-button"
                    onclick='toggleFavorite(${JSON.stringify(place)})'
                >
                    ${isFavorite ? "Remove Favorite" : "Save Favorite"}
                </button>

            </div>

        `;


        resultBox.appendChild(card);

    });

}


// ===============================
// GOOGLE MAPS
// ===============================

function openMap(address) {

    let mapURL =
        "https://www.google.com/maps/search/?api=1&query="
        + encodeURIComponent(address);


    window.open(mapURL, "_blank");

}


// ===============================
// FAVORITE FEATURE
// ===============================

function toggleFavorite(place) {

    let alreadySaved =
        favoritePlaces.some(function(item) {

            return item.name === place.name;

        });


    if (alreadySaved) {

        favoritePlaces =
            favoritePlaces.filter(function(item) {

                return item.name !== place.name;

            });

    } else {

        favoritePlaces.push(place);

    }


    localStorage.setItem(
        "nearGoFavorites",
        JSON.stringify(favoritePlaces)
    );


    displayFavorites();


    if (currentCategory === "Hospital") {

        showHospital("All");

    }

    else if (currentCategory === "ATM") {

        showATM("All Banks");

    }

    else if (currentCategory !== "") {

        showPlaces(currentCategory, "All");

    }

}


function displayFavorites() {

    let box =
        document.getElementById("favoriteResults");


    box.innerHTML = "";


    if (favoritePlaces.length === 0) {

        box.innerHTML =
            "<p>No favorite places saved yet.</p>";

        return;

    }


    favoritePlaces.forEach(function(place) {

        let item =
            document.createElement("div");


        item.className = "favorite-item";


        item.innerHTML = `

            ${place.name}

            <button onclick='openMap(${JSON.stringify(place.address)})'>
                View
            </button>

        `;


        box.appendChild(item);

    });

}


// Load saved favorites when page opens

displayFavorites();