// 1. Show/hide custom input fields based on dropdown selection
function setupCustomInputHandlers() {
  const dropdowns = [
    { id: 'color', customDiv: 'customColorDiv', customInput: 'customColor' },
    { id: 'originCountry', customDiv: 'customOriginCountryDiv', customInput: 'customOriginCountry' },
    { id: 'insert', customDiv: 'customInsertDiv', customInput: 'customInsert' },
    { id: 'sample', customDiv: 'customSampleDiv', customInput: 'customSample' }
  ];

  dropdowns.forEach(({ id, customDiv, customInput }) => {
    const dropdown = document.getElementById(id);
    const customDivElement = document.getElementById(customDiv);
    const customInputElement = document.getElementById(customInput);

    dropdown.addEventListener('change', function () {
      if (this.value === 'Other') {
        customDivElement.style.display = 'block';
        customInputElement.required = true;
      } else {
        customDivElement.style.display = 'none';
        customInputElement.required = false;
        customInputElement.value = ''; // Clear custom input
      }
    });
  });
}

// 2. Convert array of objects to CSV
function convertToCSV(dataArray) {
  if (dataArray.length === 0) return '';

  const headers = Object.keys(dataArray[0]);
  const rows = dataArray.map(obj => headers.map(h => `"${obj[h] || ''}"`).join(','));

  return [headers.join(','), ...rows].join('\n');
}

// 3. Trigger download
function downloadCSV(data, filename = 'jewellery_data.csv') {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// 4. Auto-download at 23:59
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 23 && now.getMinutes() === 59) {
    const data = JSON.parse(localStorage.getItem('jewelleryEntries') || '[]');
    if (data.length > 0) {
      downloadCSV(data, `jewellery_data_${now.toISOString().split('T')[0]}.csv`);
      localStorage.removeItem('jewelleryEntries');
      console.log('CSV downloaded at 23:59 and data cleared.');
    }
  }
}, 60 * 1000); // check every minute

// 5. Manual download button handler
document.getElementById('downloadButton').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('jewelleryEntries') || '[]');
  if (data.length === 0) {
    alert('No data to download.');
  } else {
    const now = new Date();
    downloadCSV(data, `jewellery_data_${now.toISOString().split('T')[0]}.csv`);
    localStorage.removeItem('jewelleryEntries');
    alert('Manual CSV downloaded and data cleared.');
  }
});

// 6. Handle form submission and save to localStorage
document.getElementById('dataEntryForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};

  for (let [key, value] of formData.entries()) {
    if (value === 'Other') {
      const customInputKey = `custom${key.charAt(0).toUpperCase() + key.slice(1)}`;
      value = formData.get(customInputKey) || value;
    }
    data[key] = value;
  }

  const entries = JSON.parse(localStorage.getItem('jewelleryEntries') || '[]');
  entries.push(data);
  localStorage.setItem('jewelleryEntries', JSON.stringify(entries));

  alert('Form submitted and stored!');
});

// 7. Initialize custom input logic after DOM loads
document.addEventListener('DOMContentLoaded', setupCustomInputHandlers);
    