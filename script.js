// Function to fetch JSON data and populate the table
async function populateTable() {
    try {
        // Use the full GitHub Pages URL to your json file
        const response = await fetch('https://sawalikorde.github.io/JavascriptTask/invoices.json');
        const invoicesData = await response.json();

        const tableBody = document.getElementById('tableBody');
        
        invoicesData.forEach(invoice => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${invoice.id}</td>
                <td>${invoice.chemicalName}</td>
                <td>${invoice.vendor}</td>
                <td>${invoice.density.toFixed(2)}</td>
                <td>${invoice.viscosity.toFixed(2)}</td>
                <td>${invoice.packaging}</td>
                <td>${invoice.packSize ? invoice.packSize.toFixed(2) : 'N/A'}</td>
                <td>${invoice.unit}</td>
                <td>${invoice.quantity.toFixed(2)}</td>
            `;
        });
    } catch (error) {
        console.error('Error loading the JSON data:', error);
        document.getElementById('tableBody').innerHTML = '<tr><td colspan="9">Error loading data. Please try again later.</td></tr>';
    }
}


window.onload = populateTable;