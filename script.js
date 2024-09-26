// Function to fetch JSON data and populate the table
async function populateTable() {
    try {
        const response = await fetch('https://sawalikorde.github.io/JavascriptTask/invoices.json');
        const invoicesData = await response.json();

        const tableBody = document.getElementById('tableBody');

        invoicesData.forEach((invoice, index) => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${invoice.id}</td>
                <td contenteditable="false">${invoice.chemicalName}</td>
                <td contenteditable="false">${invoice.vendor}</td>
                <td contenteditable="false">${invoice.density.toFixed(2)}</td>
                <td contenteditable="false">${invoice.viscosity.toFixed(2)}</td>
                <td contenteditable="false">${invoice.packaging}</td>
                <td contenteditable="false">${invoice.packSize ? invoice.packSize.toFixed(2) : 'N/A'}</td>
                <td contenteditable="false">${invoice.unit}</td>
                <td contenteditable="false">${invoice.quantity.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" onclick="editRow(this)" style="background: none; border: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                        </svg>
                    </button>
                    <button class="save-btn" onclick="saveRow(this, ${index})" style="background: none; border: none; display: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </button>
                    <button class="delete-btn" onclick="deleteRow(this)" style="background: none; border: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
                        </svg>
                    </button>
                </td>
            `;
        });

        
        window.invoicesData = invoicesData;

    } catch (error) {
        console.error('Error loading the JSON data:', error);
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="9">Error loading data. Please try again later.</td></tr>';
    }
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td[contenteditable="false"]');
    
    // Highlight the row and cells
    row.style.backgroundColor = '#e0f7fa'; // Light blue background for row
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'true');
        cell.style.backgroundColor = '#ffe0b2'; // Light orange for cells
    });

    // Show the Save button
    row.querySelector('.save-btn').style.display = 'inline-block';
    button.style.display = 'none';

    // Add keyboard event listeners
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent new line on Enter
            const saveButton = row.querySelector('.save-btn');
            saveRow(saveButton, Array.from(row.parentNode.children).indexOf(row)); // Pass the row index
        } else if (event.key === 'Escape') {
            cancelEdit(row);
        }
    };

    // Attach the keypress event listener to the row
    row.addEventListener('keypress', handleKeyPress);

    // Store the event listener reference to remove it later
    row.dataset.keyPressHandler = handleKeyPress;
}

// Function to cancel the editing mode
function cancelEdit(row) {
    const cells = row.querySelectorAll('td[contenteditable="true"]');
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'false');
        cell.style.backgroundColor = ''; // Reset cell background
    });

    row.style.backgroundColor = ''; // Reset row background
    row.querySelector('.edit-btn').style.display = 'inline-block';
    row.querySelector('.save-btn').style.display = 'none';

    // Remove the keypress event listener
    const keyPressHandler = row.dataset.keyPressHandler;
    if (keyPressHandler) {
        row.removeEventListener('keypress', keyPressHandler);
        delete row.dataset.keyPressHandler; // Clean up
    }
}

// Function to save the changes with validation
function saveRow(button, index) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td[contenteditable="true"]');

    // Define regex patterns
    const namePattern = /^[a-zA-Z\s]+$/;
    const numberPattern = /^[+]?\d*\.?\d+$/;
    const unitPattern = /^(kg|L)$/;

    // Define validation rules
    const validationRules = [
        { name: 'Chemical Name', pattern: namePattern, required: true },
        { name: 'Vendor', pattern: namePattern, required: true },
        { name: 'Density', pattern: numberPattern, required: true },
        { name: 'Viscosity', pattern: numberPattern, required: true },
        { name: 'Packaging', pattern: namePattern, required: true },
        { name: 'Pack Size', pattern: numberPattern, required: true },
        { name: 'Unit', pattern: unitPattern, required: true },
        { name: 'Quantity', pattern: numberPattern, required: true }
    ];

    // Validate and extract values
    const updatedValues = {};
    for (let i = 0; i < cells.length; i++) {
        const value = cells[i].innerText.trim();
        const rule = validationRules[i];

        if (rule.required && !value) {
            showError(row, rule.name, 'cannot be empty.');
            return;
        }

        if (!rule.pattern.test(value)) {
            showError(row, rule.name, 'has an invalid format.');
            return;
        }

        updatedValues[rule.name] = rule.pattern === numberPattern ? parseFloat(value) : value;
    }

    // Update the global data object
    Object.assign(window.invoicesData[index], updatedValues);

    // Turn off editable and update UI
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'false');
        cell.style.backgroundColor = ''; // Reset cell background
    });
    
    // Reset row background
    row.style.backgroundColor = ''; 

    row.querySelector('.edit-btn').style.display = 'inline-block';
    button.style.display = 'none';

    console.log('Updated data:', window.invoicesData);
}

// Function to show error messages
function showError(row, fieldName, message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerText = `${fieldName} ${message}`;
    row.appendChild(error);

    // Automatically remove error after a few seconds
    setTimeout(() => {
        if (error.parentNode) {
            error.parentNode.removeChild(error);
        }
    }, 3000);
}


// Function to delete a row
function deleteRow(button) {
    const row = button.closest('tr');
    alert('Are you sure you want to delete the data?')
    row.remove();
}

// Populate the table on page load
window.onload = populateTable;
