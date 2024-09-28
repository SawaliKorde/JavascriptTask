let rowToDelete = null
const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
const addNewEntryModal = new bootstrap.Modal(document.getElementById('addNewModal'));
let lastId = 15;

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
            showToast(`${rule.name} cannot be empty.`, 'blue');
            return;
        }

        if (!rule.pattern.test(value)) {
            showToast(`${rule.name} has an invalid format.`, 'blue');
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

    // Show success toast in green
    showToast('Data saved successfully!', 'green');

    console.log('Updated data:', window.invoicesData);
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

    // Clear previous event listeners to avoid multiple triggers
    saveButton.replaceWith(saveButton.cloneNode(true)); // This resets the button
    const newSaveButton = document.getElementById('saveNewEntry');

    newSaveButton.addEventListener('click', () => {
        // Gather input values
        const chemicalName = document.getElementById('chemicalName').value.trim();
        const vendor = document.getElementById('vendor').value.trim();
        const density = parseFloat(document.getElementById('density').value.trim());
        const viscosity = parseFloat(document.getElementById('viscosity').value.trim());
        const packaging = document.getElementById('packaging').value.trim();
        const packSize = parseFloat(document.getElementById('packSize').value.trim());
        const unit = document.getElementById('unit').value;
        const quantity = parseFloat(document.getElementById('quantity').value.trim());

        // Define validation patterns
        const namePattern = /^[a-zA-Z\s]+$/;
        const numberPattern = /^[+]?\d*\.?\d+$/;
        const unitPattern = /^(kg|L)$/;

        // Perform validation
        if (!namePattern.test(chemicalName)) {
            showToast('Chemical Name is invalid', 'blue');
            return;
        }
        if (!namePattern.test(vendor)) {
            showToast('Vendor is invalid', 'blue');
            return;
        }
        if (!numberPattern(density) || density <= 0) {
            showToast('Density must be a positive number', 'blue');
            return;
        }
        if (!numberPattern(viscosity) || viscosity <= 0) {
            showToast('Viscosity must be a positive number', 'blue');
            return;
        }
        if (!namePattern.test(packaging)) {
            showToast('Packaging is invalid', 'blue');
            return;
        }
        if (!numberPattern(packSize) || packSize <= 0) {
            showToast('Pack Size must be a positive number', 'blue');
            return;
        }
        if (!unitPattern.test(unit)) {
            showToast('Unit must be either "kg" or "L"', 'blue');
            return;
        }
        if (!numberPattern(quantity) || quantity <= 0) {
            showToast('Quantity must be a positive number', 'blue');
            return;
        }

        // If validation passes, create a new entry object with an auto-incremented ID
        const newEntry = {
            'ID': ++lastId, // Increment lastId and assign it to the new entry
            'Chemical Name': chemicalName,
            'Vendor': vendor,
            'Density': density,
            'Viscosity': viscosity,
            'Packaging': packaging,
            'Pack Size': packSize,
            'Unit': unit,
            'Quantity': quantity
        };

        // Add the new entry to the global data
        window.invoicesData.push(newEntry);

        // Update the table by adding a new row
        const tableBody = document.getElementById('tableBody');
        const newRowHTML = `
            <tr>
                <td>${newEntry.ID}</td>
                <td contenteditable="true">${chemicalName}</td>
                <td contenteditable="true">${vendor}</td>
                <td contenteditable="true">${density}</td>
                <td contenteditable="true">${viscosity}</td>
                <td contenteditable="true">${packaging}</td>
                <td contenteditable="true">${packSize}</td>
                <td contenteditable="true">${unit}</td>
                <td >${quantity}</td>
                <td>
                    <button class="edit-btn" onclick="editRow(this)" style="background: none; border: none; cursor: pointer;">
                        <svg fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                        </svg>
                    </button>
                    <button class="save-btn" onclick="saveRow(this, ${window.invoicesData.length - 1})" style="background: none; border: none; display: none; cursor: pointer;">
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



// Populate the table on page load
window.onload = populateTable;
