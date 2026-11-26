// ==========================================
// PHISHGUARD - URL SCANNER
// ==========================================

async function checkURL() {

    const urlInput = document.getElementById("urlInput");
    const result = document.getElementById("result");

    const url = urlInput.value.trim();

    // ==========================================
    // EMPTY URL
    // ==========================================

    if (url === "") {

        result.className = "result-card";

        result.innerHTML = `
            <div class="result-icon">⚠️</div>

            <div>
                <h3>Please enter a URL</h3>

                <p>
                    Enter a website address to start
                    the security scan.
                </p>
            </div>
        `;

        return;
    }


    // ==========================================
    // SCANNING
    // ==========================================

    result.className = "result-card scanning";

    result.innerHTML = `
        <div class="result-icon">🔍</div>

        <div>
            <h3>Scanning URL...</h3>

            <p>
                PhishGuard is analyzing the website.
            </p>
        </div>
    `;


    try {

        // ==========================================
        // SEND URL TO FLASK
        // ==========================================

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: url
                })
            }
        );


        const data = await response.json();


        console.log("Backend response:", data);


        // ==========================================
        // BACKEND ERROR
        // ==========================================

        if (!response.ok) {

            result.className = "result-card danger";

            result.innerHTML = `
                <div class="result-icon">❌</div>

                <div>
                    <h3>Scan Error</h3>

                    <p>
                        ${data.error ||
                        "Unable to analyze this URL."}
                    </p>
                </div>
            `;

            return;
        }


        // ==========================================
        // GET DATA
        // ==========================================

        const confidence = data.confidence;

        const features = data.features;


        // ==========================================
        // SAVE SCAN
        // ==========================================

        saveScan(
            data.url,
            data.prediction,
            data.risk,
            data.confidence
        );


        // ==========================================
        // UPDATE DASHBOARD
        // ==========================================

        updateStatistics();


        // ==========================================
        // FEATURE NAMES
        // ==========================================

        const featureNames = [

            "URL Length",

            "Number of Dots",

            "Number of Hyphens",

            "Special Characters",

            "Subdomains",

            "HTTPS",

            "@ Symbol",

            "IP Address",

            "Suspicious Words"

        ];


        // ==========================================
        // CREATE FEATURE HTML
        // ==========================================

        let featureHTML = "";


        for (
            let i = 0;
            i < featureNames.length;
            i++
        ) {

            let value = features[i];


            // HTTPS
            if (
                featureNames[i] === "HTTPS"
            ) {

                value =
                    value == 1
                        ? "Yes"
                        : "No";
            }


            // YES / NO FEATURES
            else if (

                featureNames[i] === "@ Symbol" ||

                featureNames[i] === "IP Address" ||

                featureNames[i] === "Suspicious Words"

            ) {

                value =
                    value == 1
                        ? "Yes"
                        : "No";
            }


            featureHTML += `

                <div class="feature-row">

                    <span>
                        ${featureNames[i]}
                    </span>

                    <strong>
                        ${value}
                    </strong>

                </div>

            `;
        }


        // ==========================================
        // PHISHING RESULT
        // ==========================================

        if (
            data.prediction === "Phishing"
        ) {

            result.className =
                "result-card phishing";


            result.innerHTML = `

                <div class="result-icon">
                    🚨
                </div>


                <div class="result-content">


                    <span class="result-label">

                        SECURITY ALERT

                    </span>


                    <h3>

                        Phishing Website Detected

                    </h3>


                    <p class="scanned-url">

                        ${data.url}

                    </p>


                    <div class="risk">

                        <strong>
                            Risk Level:
                        </strong>

                        <span>
                            HIGH
                        </span>

                    </div>


                    <!-- CONFIDENCE -->

                    <div class="confidence-box">


                        <div class="confidence-title">

                            <span>
                                ML Confidence
                            </span>

                            <strong>
                                ${confidence}%
                            </strong>

                        </div>


                        <div class="confidence-bar">

                            <div

                                class="confidence-fill phishing-fill"

                                style="width: ${confidence}%">

                            </div>

                        </div>

                    </div>


                    <!-- WARNING -->

                    <p class="warning">

                        ⚠️ Do not enter passwords,
                        banking details, OTPs or
                        personal information on
                        this website.

                    </p>


                    <!-- FEATURE ANALYSIS -->

                    <div class="feature-analysis">


                        <h3>

                            🔎 URL Feature Analysis

                        </h3>


                        <p class="feature-description">

                            Features extracted from
                            the URL and analyzed by
                            the machine-learning model.

                        </p>


                        <div class="feature-grid">

                            ${featureHTML}

                        </div>


                    </div>


                </div>

            `;

        }


        // ==========================================
        // SAFE RESULT
        // ==========================================

        else {

            result.className =
                "result-card safe";


            result.innerHTML = `

                <div class="result-icon">
                    ✅
                </div>


                <div class="result-content">


                    <span class="result-label">

                        SECURITY CHECK COMPLETE

                    </span>


                    <h3>

                        Website Appears Safe

                    </h3>


                    <p class="scanned-url">

                        ${data.url}

                    </p>


                    <div class="risk">

                        <strong>
                            Risk Level:
                        </strong>

                        <span>
                            LOW
                        </span>

                    </div>


                    <!-- CONFIDENCE -->

                    <div class="confidence-box">


                        <div class="confidence-title">

                            <span>
                                ML Confidence
                            </span>

                            <strong>
                                ${confidence}%
                            </strong>

                        </div>


                        <div class="confidence-bar">

                            <div

                                class="confidence-fill safe-fill"

                                style="width: ${confidence}%">

                            </div>

                        </div>

                    </div>


                    <!-- SAFE MESSAGE -->

                    <p class="safe-message">

                        ✓ No phishing classification
                        was detected by the current
                        machine-learning model.

                    </p>


                    <!-- FEATURE ANALYSIS -->

                    <div class="feature-analysis">


                        <h3>

                            🔎 URL Feature Analysis

                        </h3>


                        <p class="feature-description">

                            Features extracted from
                            the URL and analyzed by
                            the machine-learning model.

                        </p>


                        <div class="feature-grid">

                            ${featureHTML}

                        </div>


                    </div>


                </div>

            `;

        }

    }


    // ==========================================
    // CONNECTION ERROR
    // ==========================================

    catch (error) {

        console.log(error);


        result.className =
            "result-card danger";


        result.innerHTML = `

            <div class="result-icon">
                🔌
            </div>


            <div>

                <h3>
                    Backend Connection Error
                </h3>


                <p>

                    Please make sure the
                    PhishGuard Flask backend
                    is running.

                </p>

            </div>

        `;

    }

}



// ==========================================
// SAVE SCAN HISTORY
// ==========================================

function saveScan(
    url,
    prediction,
    risk,
    confidence
) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "phishguardHistory"
            )
        ) || [];


    const scan = {

        url: url,

        prediction: prediction,

        risk: risk,

        confidence: confidence,

        time:
            new Date().toLocaleString()

    };


    history.unshift(scan);


    // Keep only latest 10 scans

    history =
        history.slice(0, 10);


    localStorage.setItem(

        "phishguardHistory",

        JSON.stringify(history)

    );


    displayHistory();

}



// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {

        return;

    }


    let history =
        JSON.parse(
            localStorage.getItem(
                "phishguardHistory"
            )
        ) || [];


    if (history.length === 0) {

        historyList.innerHTML = `

            <p class="no-history">

                No scans yet.
                Your scanned URLs will
                appear here.

            </p>

        `;

        return;

    }


    historyList.innerHTML = "";


    history.forEach(
        function(scan) {

            const icon =
                scan.prediction === "Phishing"
                    ? "🚨"
                    : "✅";


            const resultClass =
                scan.prediction === "Phishing"
                    ? "history-phishing"
                    : "history-safe";


            historyList.innerHTML += `

                <div class="history-item">


                    <div class="history-icon">

                        ${icon}

                    </div>


                    <div class="history-details">


                        <div class="history-url">

                            ${scan.url}

                        </div>


                        <div class="history-time">

                            ${scan.time}

                        </div>


                    </div>


                    <div
                        class="history-result
                        ${resultClass}">


                        <strong>

                            ${scan.prediction}

                        </strong>


                        <span>

                            ${scan.risk}

                        </span>


                        <span>

                            ${scan.confidence}%

                        </span>


                    </div>


                </div>

            `;

        }
    );

}



// ==========================================
// CLEAR HISTORY
// ==========================================

function clearHistory() {

    localStorage.removeItem(
        "phishguardHistory"
    );


    displayHistory();


    updateStatistics();

}



// ==========================================
// STATISTICS DASHBOARD
// ==========================================

function updateStatistics() {

    let history =
        JSON.parse(
            localStorage.getItem(
                "phishguardHistory"
            )
        ) || [];


    const total =
        history.length;


    const safe =
        history.filter(
            function(scan) {

                return scan.prediction === "Safe";

            }
        ).length;


    const phishing =
        history.filter(
            function(scan) {

                return scan.prediction === "Phishing";

            }
        ).length;


    let safePercentage = 0;


    if (total > 0) {

        safePercentage =
            Math.round(
                (safe / total) * 100
            );

    }


    // ==========================================
    // UPDATE HTML
    // ==========================================

    const totalElement =
        document.getElementById(
            "totalScans"
        );


    const safeElement =
        document.getElementById(
            "safeScans"
        );


    const phishingElement =
        document.getElementById(
            "phishingScans"
        );


    const percentageElement =
        document.getElementById(
            "safePercentage"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (safeElement) {

        safeElement.textContent =
            safe;

    }


    if (phishingElement) {

        phishingElement.textContent =
            phishing;

    }


    if (percentageElement) {

        percentageElement.textContent =
            safePercentage + "%";

    }

}



// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

displayHistory();

updateStatistics();