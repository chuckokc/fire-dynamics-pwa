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
    
    // Update which navigation button is highlighted
    document.querySelectorAll('.sheet-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Create a table to display the data
    const table = document.createElement('table');
    sheet.data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            // Create header cells for text content, regular cells for numbers
            const td = document.createElement(
                typeof cell === 'string' && cell.trim().length > 0 ? 'th' : 'td'
            );
            td.textContent = cell || ''; // Handle empty cells gracefully
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    
    // Clear the previous content and show the new table
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