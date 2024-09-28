//Variable declarations 
let rowToDelete = null
const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
const addNewEntryModal = new bootstrap.Modal(document.getElementById('addNewModal'));
let lastId = 15;
let currentSortColumn = '';
let currentSortOrder = 'asc';
let currentRow = -1;
let highlightTimeout;

// Validation Rules
const namePattern = /^[a-zA-Z\s]+$/;
const numberPattern = /^[+]?\d*\.?\d+$/;
const unitPattern = /^(kg|L)$/;

const validationRules = [
    { name: 'chemicalName', label: 'Chemical Name', pattern: namePattern, required: true },
    { name: 'vendor', label: 'Vendor', pattern: namePattern, required: true },
    { name: 'density', label: 'Density', pattern: numberPattern, required: true, type: 'float' },
    { name: 'viscosity', label: 'Viscosity', pattern: numberPattern, required: true, type: 'float' },
    { name: 'packaging', label: 'Packaging', pattern: namePattern, required: true },
    { name: 'packSize', label: 'Pack Size', pattern: numberPattern, required: true, type: 'float' },
    { name: 'unit', label: 'Unit', pattern: unitPattern, required: true },
    { name: 'quantity', label: 'Quantity', pattern: numberPattern, required: true, type: 'float' }
];

function validateField(fieldName, value) {
    const rule = validationRules.find(r => r.name === fieldName);
    if (!rule) return { isValid: false, error: 'Unknown field' };

    if (rule.required && !value.trim()) {
        return { isValid: false, error: `${rule.label} cannot be empty.` };
    }

    if (!rule.pattern.test(value)) {
        return { isValid: false, error: `${rule.label} has an invalid format.` };
    }

    if (rule.type === 'float') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
            return { isValid: false, error: `${rule.label} must be a positive number.` };
        }
    }

    return { isValid: true, value: rule.type === 'float' ? parseFloat(value) : value };
}

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
                    <button title="Edit data in row" class="edit-btn" onclick="editRow(this)" style="background: none; border: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="#1E90FF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                        </svg>
                    </button>
                    <button title="Save the data in row" class="save-btn" onclick="saveRow(this, ${index})" style="background: none; border: none; display: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </button>
                    <button title="Delete row" class="delete-btn" onclick="deleteRow(this)" style="background: none; border: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
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

let previousValues = [];

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td[contenteditable="false"]');

    // Store previous values
    previousValues = Array.from(cells).map(cell => cell.innerText.trim());

    // Highlight the row and cells
    row.style.backgroundColor = '#e0f7fa';
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'true');
        cell.style.backgroundColor = '#ffe0b2';
    });

    // Show the Save button
    row.querySelector('.save-btn').style.display = 'inline-block';
    button.style.display = 'none';

    // Add keyboard event listeners
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const saveButton = row.querySelector('.save-btn');
            saveRow(saveButton, Array.from(row.parentNode.children).indexOf(row)); // Pass the row index
        }
    };

    row.addEventListener('keypress', handleKeyPress);

    // Click outside to cancel edit
    const handleClickOutside = (event) => {
        if (!row.contains(event.target)) {
            cancelEdit(row);
            document.removeEventListener('click', handleClickOutside);
        }
    };

    document.addEventListener('click', handleClickOutside);
}


function cancelEdit(row) {
    const cells = row.querySelectorAll('td[contenteditable="true"]');
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'false');
        cell.style.backgroundColor = '';
    });

    row.style.backgroundColor = ''; // Reset row background
    row.querySelector('.edit-btn').style.display = 'inline-block';
    row.querySelector('.save-btn').style.display = 'none';

    // Remove the keypress event listener and click outside listener
    row.removeEventListener('keypress', row.dataset.keyPressHandler);
    delete row.dataset.keyPressHandler;
}



// Function to save the changes with validation
function saveRow(button, index) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td[contenteditable]');
    let hasChanges = false;
    const updatedValues = {};

    validationRules.forEach((rule, i) => {
        const value = cells[i].innerText.trim();
        const result = validateField(rule.name, value);

        if (!result.isValid) {
            showToast(result.error, 'blue');
            revertToPreviousValues(cells);
            return;
        }

        if (previousValues[i] !== value) {
            hasChanges = true;
        }

        updatedValues[rule.name] = result.value;
    });

    if (hasChanges) {
        Object.assign(window.invoicesData[index], updatedValues);
        showToast('Data saved successfully!', 'green');
    } else {
        showToast('No changes made to the data.', 'blue');
    }

    // Turn off editable and update UI
    cells.forEach(cell => {
        cell.setAttribute('contenteditable', 'false');
        cell.style.backgroundColor = '';
    });

    // Reset row background
    row.style.backgroundColor = '';

    row.querySelector('.edit-btn').style.display = 'inline-block';
    button.style.display = 'none';

    console.log('Updated data:', window.invoicesData);
}

// Function to revert to previous values
function revertToPreviousValues(cells) {
    cells.forEach((cell, index) => {
        cell.innerText = previousValues[index]; // Restore the previous value
        cell.setAttribute('contenteditable', 'false'); // Set back to non-editable
        cell.style.backgroundColor = ''; 
    });
}


function deleteRow(button) {
    rowToDelete = button.closest('tr');
    deleteModal.show();
}

// Confirm deletion
document.getElementById('confirmDelete').addEventListener('click', function () {
    if (rowToDelete) {
        rowToDelete.remove(); // Delete the stored row
        showToast('Row deleted successfully', 'green');
        deleteModal.hide();
    }
});

// Cancel deletion and hide the modal
document.getElementById('deleteConfirmModal').addEventListener('hidden.bs.modal', function () {
    rowToDelete = null;
});

// Show a toast notification
function showToast(message, color) {
    const toastElement = document.getElementById('liveToast');
    const toastBody = toastElement.querySelector('.toast-body');
    toastBody.textContent = message; // Set the message in the toast

    // Set toast background color based on success or error
    if (color === 'green') {
        toastElement.classList.add('bg-success', 'text-white');
        toastElement.classList.remove('bg-primary');
    } else if (color === 'blue') {
        toastElement.classList.add('bg-primary', 'text-white');
        toastElement.classList.remove('bg-success');
    }

    const toast = new bootstrap.Toast(toastElement, { delay: 3000, autohide: true });
    toast.show();
}


// Create new data entry
function addNewEntry() {
    const saveButton = document.getElementById('saveNewEntry');
    const form = document.getElementById('addNewForm');

    addNewEntryModal.show();

    // Remove previous event listeners
    saveButton.replaceWith(saveButton.cloneNode(true));
    const newSaveButton = document.getElementById('saveNewEntry');

    // Add input event listeners for real-time validation
    validationRules.forEach(rule => {
        const inputElement = document.getElementById(rule.name);
        const errorElement = document.getElementById(`${rule.name}Error`);

        if (inputElement) {
            // On input, validate the field in real-time
            inputElement.addEventListener('input', () => {
                const value = inputElement.value.trim();
                const result = validateField(rule.name, value);

                // Display error message if validation fails
                if (errorElement) {
                    errorElement.innerText = result.isValid ? '' : result.error;
                    errorElement.style.color = 'red'; // Make the error message red
                }
            });
        }
    });

    newSaveButton.addEventListener('click', () => {
        const newEntry = {};
        let isValid = true;

        validationRules.forEach(rule => {
            const inputElement = document.getElementById(rule.name);
            if (!inputElement) {
                console.error(`Input element with id '${rule.name}' not found`);
                isValid = false;
                return;
            }

            const value = inputElement.value.trim();
            const result = validateField(rule.name, value);

            const errorElement = document.getElementById(`${rule.name}Error`);
            if (errorElement) {
                errorElement.innerText = result.isValid ? '' : result.error;
                errorElement.style.color = 'red';
            } else if (!result.isValid) {
                // If there's no error element but the validation failed, show a toast or alert
                showToast(`${rule.label}: ${result.error}`, 'blue');
            }

            if (!result.isValid) {
                isValid = false;
            } else {
                newEntry[rule.name] = result.value;
            }
        });

        if (!isValid) return;

        // Add the new entry to the global data
        newEntry.id = ++lastId;
        window.invoicesData.push(newEntry);

        // Update the table by adding a new row
        const tableBody = document.getElementById('tableBody');
        const newRowHTML = `
            <tr>
                <td>${newEntry.id}</td>
                <td contenteditable="false">${newEntry.chemicalName}</td>
                <td contenteditable="false">${newEntry.vendor}</td>
                <td contenteditable="false">${newEntry.density.toFixed(2)}</td>
                <td contenteditable="false">${newEntry.viscosity.toFixed(2)}</td>
                <td contenteditable="false">${newEntry.packaging}</td>
                <td contenteditable="false">${newEntry.packSize.toFixed(2)}</td>
                <td contenteditable="false">${newEntry.unit}</td>
                <td contenteditable="false">${newEntry.quantity.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" onclick="editRow(this)" style="background: none; border: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="#1E90FF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                        </svg>
                    </button>
                    <button class="save-btn" onclick="saveRow(this, ${window.invoicesData.length - 1})" style="background: none; border: none; display: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </button>
                    <button class="delete-btn" onclick="deleteRow(this)" style="background: none; border: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRowHTML);

        // Hide the modal
        addNewEntryModal.hide();

        // Reset the form
        form.reset();

        // Show success toast
        showToast('New chemical entry added successfully!', 'green');
    });
}


// Function to sort
function sortTable(column) {
    const tableBody = document.getElementById('tableBody');
    const rows = Array.from(tableBody.rows);

    // Determine the sort order
    let sortOrder = 'asc';
    if (currentSortColumn === column && currentSortOrder === 'asc') {
        sortOrder = 'desc';
    }

    // Sort rows based on the column clicked
    rows.sort((a, b) => {
        const cellA = a.cells[getColumnIndex(column)].innerText;
        const cellB = b.cells[getColumnIndex(column)].innerText;

        if (column === 'density' || column === 'viscosity' || column === 'packSize' || column === 'quantity') {
            return sortOrder === 'asc' ? parseFloat(cellA) - parseFloat(cellB) : parseFloat(cellB) - parseFloat(cellA);
        } else if (column === 'unit') {
            return sortOrder === 'asc' ? (cellA === 'kg' ? -1 : 1) : (cellA === 'kg' ? 1 : -1);
        } else {
            return sortOrder === 'asc' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        }
    });

    // Update table body with sorted rows
    rows.forEach(row => tableBody.appendChild(row));

    // Update current sort column and order
    currentSortColumn = column;
    currentSortOrder = sortOrder;

    // Update sort arrows
    updateSortArrows();
}

function getColumnIndex(column) {
    switch (column) {
        case 'chemicalName': return 1;
        case 'vendor': return 2;
        case 'density': return 3;
        case 'viscosity': return 4;
        case 'packaging': return 5;
        case 'packSize': return 6;
        case 'unit': return 7;
        case 'quantity': return 8;
        default: return -1;
    }
}

function updateSortArrows() {
    const arrows = document.querySelectorAll('.sort-arrow');
    arrows.forEach(arrow => {
        arrow.innerText = ''; // Clear previous arrows
    });

    const currentArrow = document.getElementById(`arrow-${currentSortColumn}`);
    currentArrow.innerText = currentSortOrder === 'asc' ? ' ↑' : ' ↓';
}


function highlightRow(index) {
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => row.classList.remove('highlight')); // Remove highlight from all rows
    if (index >= 0 && index < rows.length) {
        rows[index].classList.add('highlight'); 
        rows[index].scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll the highlighted row into view
    }
    clearTimeout(highlightTimeout);
        highlightTimeout = setTimeout(() => {
            rows[index].classList.remove('highlight'); // Remove highlight after timeout
        }, 2000); 
}

// Function to navigate through the table
function navigateTable(direction) {
    const rows = document.querySelectorAll('#tableBody tr');
    if (direction === 'down') {
        currentRow = Math.min(currentRow + 1, rows.length - 1); // Move down
    } else if (direction === 'up') {
        currentRow = Math.max(currentRow - 1, 0); // Move up
    }
    highlightRow(currentRow); // Highlight the current row
}

// Event listener for keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent default scrolling behavior
        navigateTable('down'); 
    } else if (event.key === 'ArrowUp') {
        event.preventDefault(); 
        navigateTable('up'); 
    }
});

function refreshTable() {
    location.reload();
}

// Populate the table on page load
window.onload = populateTable;
