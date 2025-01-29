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
    sheet.data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            // Create header cells for text content, regular cells for numbers
            const td = document.createElement(
                typeof cell === 'string' && cell.trim().length > 0 ? 'th' : 'td'
            );
            td.textContent = cell || '';

            // Add category-header class to specific cells
            const categoryHeaders = [
                'Gases', 'Liquids', 'High-Temp Polymers & Composites',
                'Textiles', 'Composites', 'Ordinary polymers', 'Wood'
            ];
            
            // Check if this cell is a category header or its corresponding "Heat of Combustion"
            if (categoryHeaders.includes(cell)) {
                td.classList.add('category-header');
                // Also style the "Heat of Combustion" cell next to it
                if (row[cellIndex + 1] === 'Heat of Combustion') {
                    const nextCell = document.createElement('th');
                    nextCell.textContent = 'Heat of Combustion';
                    nextCell.classList.add('category-header');
                    tr.appendChild(nextCell);
                    return; // Skip the next cell since we've already added it
                }
            }
            
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    
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