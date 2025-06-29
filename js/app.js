// First, we set up our access control - like having a security guard at the entrance
const VALID_ACCESS_CODE = 'FIRE2024'; // You can change this to any code you prefer
let workbookData = null; // This will store your Excel data once loaded

// This function checks if the entered access code is correct
async function validateAccess() {
    const accessCode = document.getElementById('access-code').value;
    if (accessCode === VALID_ACCESS_CODE) {
        // If the code is correct, save this information and show the main screen
        localStorage.setItem('authenticated', 'true');
        showMainScreen();
        await loadData();
    } else {
        // If the code is wrong, show an error message
        alert('Invalid access code');
    }
}

// This function switches from the login screen to the main content
function showMainScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
}

// This important function loads and processes your Excel data
async function loadData() {
    try {
        // Fetch the converted Excel data from our JSON file
        const response = await fetch('/data/firedata.json');
        workbookData = await response.json();
        setupNavigation();
        showSheet(0); // Show the first sheet by default
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please try again.');
    }
}

// This creates the navigation buttons for switching between different sheets
function setupNavigation() {
    const nav = document.getElementById('sheet-navigation');
    workbookData.sheets.forEach((sheet, index) => {
        const button = document.createElement('button');
        button.className = 'sheet-button';
        button.textContent = sheet.name;
        button.onclick = () => showSheet(index);
        nav.appendChild(button);
    });
}

// This function displays the selected sheet's data in a neat table format
function showSheet(index) {
    const sheet = workbookData.sheets[index];
    const content = document.getElementById('content');
    
    // Update navigation buttons
    document.querySelectorAll('.sheet-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Create table
    const table = document.createElement('table');
    sheet.data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        // Check if this is a row that needs full highlighting
        let isHeaderRow = false;
        
        // For the first sheet (Energy Release Properties)
        if (sheet.name.includes("Energy Release Properties")) {
            // Handle category headers and their "Heat of Combustion" cells
            const categoryHeaders = [
                'Gases', 'Liquids', 'High-Temp Polymers & Composites',
                'Textiles', 'Composites', 'Ordinary polymers', 'Wood'
            ];
            row.forEach((cell, cellIndex) => {
                const td = document.createElement(
                    typeof cell === 'string' && cell.trim().length > 0 ? 'th' : 'td'
                );
                td.textContent = cell || '';
                
                if (categoryHeaders.includes(cell) || 
                    (cell === 'Heat of Combustion' && categoryHeaders.includes(row[cellIndex - 1]))) {
                    td.classList.add('category-header');
                }
                tr.appendChild(td);
            });
        } else {
            // For all other sheets, check if this is the third row (index 2)
            isHeaderRow = rowIndex === 2;
            
            // Create cells for this row
            row.forEach(cell => {
                const td = document.createElement(
                    typeof cell === 'string' && cell.trim().length > 0 ? 'th' : 'td'
                );
                td.textContent = cell || '';
                
                // If this is a header row, highlight all cells
                if (isHeaderRow) {
                    td.classList.add('category-header');
                }
                tr.appendChild(td);
            });
        }
        
        table.appendChild(tr);
    });
    
    if (sheet.name === "Greek Alphabet" || sheet.name === "Alt & Symbol Codes") {
        table.classList.add('reference-table'); // Add a class to the whole table

        // Go through each row to add a class to the symbol cells
        table.querySelectorAll('tr').forEach((tr, rowIndex) => {
            if (rowIndex > 2) { // Skip the header rows
                const firstCell = tr.querySelector('td, th');
                if (firstCell) {
                    firstCell.classList.add('symbol-cell');
                }
            }
        });
    }

    content.innerHTML = '';
    content.appendChild(table);
}

// When the page loads, check if the user is already authenticated
window.onload = () => {
    if (localStorage.getItem('authenticated') === 'true') {
        showMainScreen();
        loadData();
    }
};