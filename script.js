function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.style.display = 'none'; // Hide all tabs
    });
    document.getElementById(tabName).style.display = 'block'; // Show the selected tab
}

function calculateTimeDifference() {
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    if (!startTime || !endTime) {
        alert("Please enter both start and end times.");
        return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    let difference = (endDate - startDate) / 1000; // Convert to seconds

    if (difference < 0) {
        difference += 24 * 3600; // Add 24 hours in seconds
    }

    const totalHours = difference / 3600;
    const hours = Math.floor(totalHours);
    const minutes = Math.floor(difference / 60);
    const seconds = (difference % 60).toFixed(2);

    document.getElementById("resultHours").innerText = `Hours: ${totalHours.toFixed(2)}`;
    document.getElementById("resultMinutes").innerText = `Minutes: ${minutes}`;
    document.getElementById("resultSeconds").innerText = `Seconds: ${seconds}`;
}

async function lookupIP() {
    const ip = document.getElementById("ipAddress").value;
    const ipResult = document.getElementById("ipResult");

    // Simple IP validation
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(ip)) {
        alert("Please enter a valid IP address.");
        return;
    }

    // Show loading indicator
    ipResult.innerHTML = "Loading...";

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        if (data.status === "fail") {
            ipResult.innerText = "Invalid IP address or not found.";
            return;
        }

        const flagUrl = `https://countryflagsapi.com/svg/${data.countryCode}`;

        ipResult.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                    <th style="border: 1px solid #ccc; padding: 8px;">Field</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Value</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">IP Address</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${data.query}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">City</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${data.city}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">Region</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${data.regionName}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">Country</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${data.country} 
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">Postal Code</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${data.zip}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">Timezone</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${data.timezone}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">ISP</td>
                    <td style="border: 1px solid #ccc; padding: 8px;">${data.isp}</td>
                </tr>
            </table>
            <div id="map" style="height: 400px; margin-top: 20px;"></div>
        `;

        const lat = data.lat;
        const lon = data.lon;

        const map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        L.marker([lat, lon]).addTo(map).bindPopup(`${data.city}, ${data.regionName}, ${data.country}`);

    } catch (error) {
        ipResult.innerText = "Error fetching data. Please try again.";
    }
}


let exchangeRates = {
    AUD: 1.15,
    BND: 1,
    CAD: 1.04,
    CHF: 0.65,
    EUR: 0.69,
    GBP: 0.58,
    HKD: 5.8,
    KRW: 1042.69,
    MMK: 3.64,
    NOK: 8.27,
    NZD: 1.26,
    PHP: 43.92,
    IDR: 11.88,
    RM: 3.30,
    RMB: 5.38,
    SGD: 1,
    SEK: 8.04,
    TB: 25.43,
    TMP: 1,
    USD: 0.75,
    VND: 19096.34,
    YEN: 115.82,
    ZAR: 13.34,
    ZWD: 273.05,
    INR: 63.42,
    DZD: 1,
    CNY: 5.38,
    MYR: 3.30,
    HKD: 5.86,
    RR: 1,
    USDT: 0.75,
    BRL: 4.31
};


// Load exchange rates from CSV (mock implementation)
function loadExchangeRates() {
    // Replace this with actual CSV loading logic
    // For demo, we're using hardcoded rates
    console.log("Exchange rates updated.");
}

function convertCurrency() {
    const currency = document.getElementById("currency").value.toUpperCase();
    const nominal = parseFloat(document.getElementById("nominal").value);
    const rate = exchangeRates[currency];

    if (!nominal || !rate) {
        document.getElementById("conversionResult").innerText = "Please enter valid currency and amount.";
        return;
    }

    const convertedAmount = (nominal / rate).toFixed(2);
    document.getElementById("conversionResult").innerText = `Converted Amount: SGD ${convertedAmount}`;
}

// Call this function on page load or whenever rates are updated
loadExchangeRates();
