// ===================================
// APSLDC - COMPLETE MASTER SCRIPT (510+ Lines)
// ===================================

// ===================================
// APSLDC - MASTER SCRIPT (510+ LINES)
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Font Size Controls ---
    let currentFontSize = 0;
    const decreaseFontBtn = document.getElementById('decrease-font');
    const resetFontBtn = document.getElementById('reset-font');
    const increaseFontBtn = document.getElementById('increase-font');

    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', () => { if (currentFontSize < 2) { currentFontSize++; updateFontSize(); } });
        resetFontBtn.addEventListener('click', () => { currentFontSize = 0; updateFontSize(); });
        decreaseFontBtn.addEventListener('click', () => { if (currentFontSize > -1) { currentFontSize--; updateFontSize(); } });
    }

    function updateFontSize() {
        document.body.classList.remove('font-small', 'font-large', 'font-xlarge');
        if (currentFontSize === -1) document.body.classList.add('font-small');
        if (currentFontSize === 1) document.body.classList.add('font-large');
        if (currentFontSize === 2) document.body.classList.add('font-xlarge');
        localStorage.setItem('fontSize', currentFontSize);
    }

    // --- 2. High Contrast & Language Toggle ---
    const contrastBtn = document.getElementById('toggle-contrast');
    if (contrastBtn) {
        contrastBtn.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
    }

    const languageBtn = document.getElementById('toggle-language');
    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang') || 'en';
            setLanguage(currentLang === 'en' ? 'te' : 'en');
        });
    }

    function setLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        const enElements = document.querySelectorAll('.lang-en');
        const teElements = document.querySelectorAll('.lang-te');
        if (lang === 'en') {
            enElements.forEach(el => el.style.display = '');
            teElements.forEach(el => el.style.display = 'none');
        } else {
            enElements.forEach(el => el.style.display = 'none');
            teElements.forEach(el => el.style.display = '');
        }
    }

    // --- 3. Dropdown Event Listeners ---
    const discomSelect = document.getElementById("discomSelect");
    const districtSelect = document.getElementById("districtSelect");
    if (discomSelect) discomSelect.addEventListener('change', updateDistricts);
    if (districtSelect) districtSelect.addEventListener('change', updateSubstations);

    // --- 4. ENERGY MU CALCULATION (FINAL FIXED LOGIC) ---
    const tableBody = document.getElementById('dynamicTableBody');
    if (tableBody) {
        tableBody.addEventListener('input', function (e) {
            const row = e.target.closest('tr');
            if (!row) return;

            // Reading numbers safely
            const getVal = (idx) => {
                let val = row.cells[idx].innerText.trim();
                return parseFloat(val) || 0;
            };

            const mf1 = getVal(2);
            const init1 = getVal(3);
            const final1 = getVal(4);
            
            const mf2 = getVal(5);
            const init2 = getVal(6);
            const final2 = getVal(7);

            // Calculation: ((Final - Initial) * MF)
            const mu1 = (final1 - init1) * mf1;
            const mu2 = (final2 - init2) * mf2;
            
            // Updating MU column (Index 9)
            row.cells[9].innerText = (mu1 + mu2).toFixed(4);
            
            // Grand Total update
            updateGrandTotal();
        });
    }

    // --- 5. Real-time Power Stats ---
    setInterval(() => {
        const loadEl = document.getElementById('current-load');
        if (loadEl) {
            const demand = 8400 + Math.floor(Math.random() * 200);
            loadEl.textContent = demand.toLocaleString() + ' MW';
        }
    }, 5000);

});

// ===================================
// GLOBAL DATA (28 Districts)
// ===================================

// 1. Meeru ichina patha list (As it is, emi marchaledhu)
const privateFeederLookup = {
    "33KV Rain coke-I": ["33KV Rain coke-I Feeder"],
    "33KV Rain coke-II": ["33KV Rain coke-II Feeder"],
    "Arkha Solar Pvt Ltd.": ["Arkha Solar Pvt Ltd. Feeder"],
    "Vizag Port solar Ltd.": ["Vizag Port solar Ltd."],
    "Floating Solar": ["Floating Solar"]
};
const gencoReadings = [
    { point: "400KV Krishnapatnam GT-I", type: "EXP", factor: "1000000.0", start: "36399.9" },
    { point: "400KV Krishnapatnam ST-I", type: "IMP", factor: "1000.0", start: "1300973.0" },
    { point: "Bhavanipuram 132 kv Kondapalli", type: "EXP", factor: "3000.0", start: "175.6" }
];
const powerHierarchy = {
    "APEPDCL": {
        "Alluri Sitharama Raju": ["Paderu-SS", "Araku-SS", "Chinturu-SS"],
        "Anakapalli": ["Anakapalli-SS", "Parawada-SS", "Narsipatnam-SS"],
        "East Godavari": ["Rajahmundry-SS", "Kovvur-SS", "Nidadavole-SS"],
        "Kakinada": ["Kakinada-SS", "Peddapuram-SS", "Tuni-SS"],
        "Konaseema": ["Amalapuram-SS", "Ravulapalem-SS", "Mummidivaram-SS"],
        "Parvathipuram Manyam": ["Parvathipuram-SS", "Salur-SS"],
        "Srikakulam": ["Srikakulam-SS", "Tekkali-SS", "Palasa-SS"],
        "Visakhapatnam": ["Gajuwaka-SS", "Simhachalam-SS", "Pendurthi-SS"],
        "Vizianagaram": ["Vizianagaram-SS", "Bobbili-SS", "Gajapathinagaram-SS"],
        "West Godavari": ["Bhimavaram-SS", "Tanuku-SS", "Tadepalligudem-SS"],
        "Eluru": ["Eluru-SS", "Jangareddygudem-SS"],
        "PRIVATE": [
            "33KV Rain coke-I", "33KV Rain coke-II", "Arkha Solar Pvt Ltd.", 
            "Repal Renewable Pvt. Ltd", "Sareau wind energy Ltd.", 
            "Kadapa Energy Projects Pvt Ltd.", "Ushodaya Solar power plant(33KV)",
            "Vizag Port solar Ltd.", "Gosala Solar Pvt Ltd.", "GVSCCL Solar Pvt Ltd.",
            "GVSCCL Solar Pvt Ltd.-II", "INS Kalinga Solar Plant", "Jindal urban waste management (VSP) Ltd", "Floating Solar"
        ]
    },
    "APCPDCL": {
        "Bapatla": ["Bapatla-SS", "Chirala-SS", "Addanki-SS"],
        "Guntur": ["Guntur-SS", "Tenali-SS", "Mangalagiri-SS"],
        "Krishna": ["Machilipatnam-SS", "Gudivada-SS", "Vuyyuru-SS"],
        "NTR": ["Vijayawada-SS", "Ibrahimpatnam-SS", "Mylavaram-SS"],
        "Palnadu": ["Narasaraopet-SS", "Piduguralla-SS", "Sattenapalli-SS"],
        "Prakasam": ["Ongole-SS", "Kandukur-SS", "Markapuram-SS"],
        "PRIVATE": [
            "Deccan Cements Ltd. (Wind Farm)", "Priyadarshini Spinning Mills (PSM) Ltd. (Wind)", 
            "Viramani Biscuit Industries Ltd.", "Markapuram-SS", "Bright Solar Ltd.(10MW)"
        ]
    },
    "APSPDCL": {
        "Ananthapuramu": ["Anantapur-SS", "Gooty-SS", "Tadipatri-SS"],
        "Annamayya": ["Rayachoti-SS", "Madanapalle-SS", "Rajampet-SS"],
        "Chittoor": ["Chittoor-SS", "Palamaner-SS", "Kuppam-SS"],
        "Kurnool": ["Kurnool-SS", "Adoni-SS", "Yemmiganur-SS"],
        "Nandyal": ["Nandyal-SS", "Allagadda-SS", "Dhone-SS"],
        "Sri Potti Sriramulu Nellore": ["Nellore-SS", "Kavali-SS", "Gudur-SS"],
        "Sri Sathya Sai": ["Puttaparthi-SS", "Dharmavaram-SS", "Kadiri-SS"],
        "Tirupati": ["Tirupati-SS", "Sullurpeta-SS", "Tirumala-SS"],
        "YSR Kadapa": ["Kadapa-SS", "Proddatur-SS", "Pulivendula-SS"],
        "PRIVATE": [
            "M/s FA Power Renewables Hindupur Pvt Ltd", "M/s Aurora Power Private Limited",
            "M/s. Orange Anantapur Wind Power", "M/s. Greenko Solar Energy",
            "M/s. Tata Power Renewable Energy", "M/s. ReNew Wind Energy",
            "M/s. Azure Power Solar", "NP Kunta Ultra Mega Solar Park",
            "M/s. Mytrah Vayu (Wind)", "M/s. Suzlon Wind Power", "Kavali-SS"
        ] 
    }
};
async function addReadings() {
    console.log("Add Readings Button Clicked!"); // Console lo idi ravali
    
    const discom = document.getElementById("discomSelect").value.trim();
    const tbody = document.getElementById("gencoTableBody");

    if (discom === "APGENCO") {
        console.log("APGENCO detected, fetching data...");
        try {
            const response = await fetch('/api/get-genco-readings/');
            const data = await response.json();

            if (data && data.length > 0) {
                document.getElementById("gencoLayout").style.display = "block";
                document.getElementById("tableContainer").style.display = "none";
                tbody.innerHTML = ""; 

                data.forEach(item => {
                    const row = `<tr>
                        <td><input type="checkbox"></td>
                        <td>${item.feeder_name}</td>
                        <td style="text-align:center">${item.meter_type}</td>
                        <td><input type="text" class="form-control" value="${item.mf}"></td>
                        <td><input type="text" class="form-control" value="${item.opening_reading}"></td>
                        <td><input type="text" class="form-control" placeholder="End"></td>
                        <td><input type="text" class="form-control" readonly style="background:#eee"></td>
                        <td><select class="form-control"><option>OK</option><option>Defective</option></select></td>
                        <td><input type="text" class="form-control" value="1.0"></td>
                        <td><input type="text" class="form-control"></td>
                        <td><input type="text" class="form-control"></td>
                    </tr>`;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
                console.log("APGENCO Table Loaded!");
                return; // Alert raakunda ikkade stop chesthunnam
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }

    // Meeru chusthunna alert ikkada undi. 
    const substation = document.getElementById("substationSelect").value;
    alert("Data not found for: " + substation);
}
function updateDistricts() {
    const discom = document.getElementById("discomSelect").value;
    const distDrop = document.getElementById("districtSelect");
    const subDrop = document.getElementById("substationSelect");
    
    distDrop.innerHTML = '<option value="">Select District</option>';
    subDrop.innerHTML = '<option value="">Select Substation/Developer</option>';
    
    if (discom && powerHierarchy[discom]) {
        // Normal Districts
        Object.keys(powerHierarchy[discom]).sort().forEach(dist => {
            if (dist !== "PRIVATE") {
                let opt = document.createElement("option");
                opt.value = opt.textContent = dist;
                distDrop.appendChild(opt);
            }
        });

        // Private Developers Option (Always at the end)
        let privateOpt = document.createElement("option");
        privateOpt.value = "PRIVATE";
        privateOpt.textContent = "⚠️ Private Developers";
        distDrop.appendChild(privateOpt);
    }
}
function loadPrivateSubstations() {
    const discomSelect = document.getElementById("discomSelect");
    const developerSelect = document.getElementById("substationSelect"); // Idhi Developer box
    const districtSelect = document.getElementById("districtSelect");

    // --- IDHI ADD CHEYANDI ---
    // Substation dropdown ni empty cheyadaniki
    const actualSubDrop = document.getElementById("actualSubstationSelect"); 
    if(actualSubDrop) actualSubDrop.innerHTML = '<option value="">Select Substation</option>';
    // -------------------------

    if (districtSelect.value !== "PRIVATE") return;

    const discomId = discomSelect.value;
    if (!discomId) return;

    fetch(`/get-private-developers/?discom_id=${discomId}`)
        .then(response => response.json())
        .then(data => {
            developerSelect.innerHTML = '<option value="">--Select Developer--</option>';
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.name; 
                option.textContent = item.name;
                developerSelect.appendChild(option);
            });
        });
}
function updateSubstations() {
    const discom = document.getElementById("discomSelect").value;
    const district = document.getElementById("districtSelect").value;
    
    // Rendu dropdown IDs ikkada correct ga target chesthunnam
    const subDrop = document.getElementById("substationSelect"); 
    const devDrop = document.getElementById("privateDevSelect"); 

    // 1. Mundu boxes ni clear cheyali
    subDrop.innerHTML = '<option value="">Select Substation</option>';
    if (devDrop) devDrop.innerHTML = '<option value="">--Select Developer--</option>';

    if (discom && district && powerHierarchy[discom] && powerHierarchy[discom][district]) {
        
        // --- ⚠️ MAIN CHANGE STARTS HERE ---
        if (district === "PRIVATE") {
            // Substation dropdown ni empty chesi "Not Required" ani peduthunnam
            subDrop.innerHTML = '<option value="">Not Required</option>'; 
            
            // Kevalam Developer dropdown ki mathrame data pampali
            powerHierarchy[discom][district].sort().forEach(item => {
                let opt = document.createElement("option");
                opt.value = opt.textContent = item;
                if (devDrop) {
                    devDrop.appendChild(opt);
                }
            });
            return; 
        }
        powerHierarchy[discom][district].sort().forEach(item => {
            let opt = document.createElement("option");
            opt.value = opt.textContent = item;
            subDrop.appendChild(opt);
        });
    }
}
function generateTable() {
    const tbody = document.getElementById("dynamicTableBody");
    const subName = document.getElementById("substationSelect").value || "SS";
    if (!tbody) return;
    tbody.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td contenteditable="true">${subName}_Fdr_${i}</td>
            <td contenteditable="true">Import</td>
            <td contenteditable="true">1</td><td contenteditable="true">0</td><td contenteditable="true">0</td>
            <td contenteditable="true">1</td><td contenteditable="true">0</td><td contenteditable="true">0</td>
            <td contenteditable="true">0</td><td style="font-weight:bold;">0.0000</td>
            <td contenteditable="true">Healthy</td><td contenteditable="true">None</td>
        `;
        tbody.appendChild(row);
    }
    document.getElementById("rightCol").style.display = "block";
    document.getElementById("tableContainer").style.display = "block";
    document.getElementById("tableHeader").style.display = "flex";
}

function updateGrandTotal() {
    let grandTotal = 0;
    document.querySelectorAll('#dynamicTableBody tr').forEach(row => {
        grandTotal += parseFloat(row.cells[9].innerText) || 0;
    });
    const totalInput = document.getElementById('subStationTotal');
    if (totalInput) totalInput.value = grandTotal.toFixed(4);
}

function openPopup() {
    const table = document.getElementById("dataTable");
    const clone = table.cloneNode(true);
    clone.querySelectorAll("[contenteditable]").forEach(td => td.removeAttribute("contenteditable"));
    document.getElementById("popupTable").innerHTML = "";
    document.getElementById("popupTable").appendChild(clone);
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function exportCSV() {
    let csv = [];
    let rows = document.querySelectorAll("#dataTable tr");
    rows.forEach(row => {
        let rowData = [];
        row.querySelectorAll("td, th").forEach(col => rowData.push('"' + col.innerText + '"'));
        csv.push(rowData.join(","));
    });
    let csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    let link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Energy_Data.csv");
    link.click();
}

// --- Database Save Logic (Django) ---
function saveData() {
    const rows = document.querySelectorAll('#dynamicTableBody tr');
    let results = [];
    rows.forEach(row => {
        results.push({
            feeder: row.cells[0].innerText,
            energy_mu: row.cells[9].innerText
        });
    });

    fetch('/save-energy-data/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(results)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') alert("Saved to PostgreSQL Successfully!");
        else alert("Error: " + data.message);
    })
    .catch(err => alert("Server Error: Check Django Console"));
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function renderExcelGrid(dataList) {
    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #143C66; color: white;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Feeder</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">MF 1</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background: #ffd700; color: black;">Initial 1</th>
                    <th style="padding: 10px; border: 1px solid #ddd; background: #ffd700; color: black;">Final 1</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Cons 1</th>
                </tr>
            </thead>
            <tbody>`;
            renderExcelGrid(data);


    dataList.forEach((item) => {
        html += `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${item.feeder}</td>
                <td style="padding: 0;"><input type="number" value="${item.mf1 || 1}" class="b-mf" style="width:100%; border:none; padding:10px; text-align:center;"></td>
                <td style="padding: 0;"><input type="number" class="b-init b-input" oninput="doBulkCalc(this)" style="width:100%; border:none; padding:10px;"></td>
                <td style="padding: 0;"><input type="number" class="b-final b-input" oninput="doBulkCalc(this)" style="width:100%; border:none; padding:10px;"></td>
                <td style="padding: 0;"><input type="number" class="b-cons" readonly style="width:100%; border:none; padding:10px; background:#f9f9f9;"></td>
            </tr>`;
    });

    document.getElementById('excelGridContainer').innerHTML = html + `</tbody></table>`;
    document.getElementById("excel-rapid-entry-section").style.display = "block";

    
    // Paste Event Listener
    document.querySelectorAll('.b-input').forEach(input => {
        input.addEventListener('paste', handleExcelPaste);
    });
}

function handleExcelPaste(e) {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    const rows = pastedData.split(/\r\n|\n|\r/);
    const startCell = e.target;
    const startRow = startCell.closest('tr');
    const startColIndex = startCell.closest('td').cellIndex;

    rows.forEach((rowText, rowIndex) => {
        const targetRow = startRow.parentElement.rows[startRow.rowIndex + rowIndex - 1];
        if (targetRow) {
            const columns = rowText.split('\t');
            columns.forEach((cellText, colIndex) => {
                const targetCell = targetRow.cells[startColIndex + colIndex];
                if (targetCell) {
                    const input = targetCell.querySelector('input');
                    if (input && !input.readOnly) {
                        input.value = cellText.trim();
                        doBulkCalc(input); // Trigger calculation
                    }
                }
            });
        }
    });
}

function doBulkCalc(el) {
    const row = el.closest('tr');
    const mf = parseFloat(row.querySelector('.b-mf').value) || 1;
    const init = parseFloat(row.querySelector('.b-init').value) || 0;
    const final = parseFloat(row.querySelector('.b-final').value) || 0;
    row.querySelector('.b-cons').value = final >= init ? ((final - init) * mf).toFixed(2) : 0;
}

function saveToDatabase() {
    const name = document.getElementById("adminSubName").value;
    const feeders = document.getElementById("adminFeeders").value.split(',');

    fetch('/your-url-path/add-new-substation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}' 
        },
        body: JSON.stringify({
            name: name,
            feeders: feeders
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'success') {
            alert("✅ Database lo save ayyindi! Refresh cheyandi.");
            location.reload(); 
        }
    });
}
function saveToDatabase() {
    const name = document.getElementById("adminSubName").value;
    const feeders = document.getElementById("adminFeeders").value.split(',');

    console.log("Attempting to save:", name); // Check if this shows in Browser Console (F12)

    fetch('/add-substation/', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}'
        },
        body: JSON.stringify({ name: name, feeders: feeders })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response from server:", data);
        if(data.status === 'success') {
            alert("✅ Saved successfully!");
            location.reload();
        }
    })
    .catch(err => console.log("Fetch Error:", err));
}
function checkSelection() {
    const distSelect = document.getElementById("districtSelect");
    const privateSection = document.getElementById("privateDevSection");
    const discomId = document.getElementById("discomSelect").value;

    if (distSelect.value === "PRIVATE") {
        // District select lo "Private" select chesthe, kinda kotha dropdown chupisthundi
        privateSection.style.display = "block";
        
        fetch(`/get-private-developers/?discom_id=${discomId}`)
            .then(res => res.json())
            .then(data => {
                const devSelect = document.getElementById("privateDevSelect");
                devSelect.innerHTML = '<option value="">Select Developer</option>';
                data.forEach(dev => {
                    devSelect.innerHTML += `<option value="${dev.id}">${dev.name}</option>`;
                });
            });
    } else {
        // Normal district select chesthe "Private Developer" list ni hide chestundi
        privateSection.style.display = "none";
        if(distSelect.value !== "") {
            updateSubstations(); // Mee patha logic (District wise substations)
        }
    }
}
