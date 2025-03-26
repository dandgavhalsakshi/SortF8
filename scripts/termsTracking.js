document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('termsAcceptanceForm');
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const acceptButton = document.getElementById('acceptTerms');
    const declineButton = document.getElementById('declineTerms');
    const termsLogBody = document.getElementById('termsLogBody');

    // Load existing logs from localStorage
    function loadTermsLogs() {
        const existingLogs = JSON.parse(localStorage.getItem('termsAcceptanceLogs') || '[]');
        termsLogBody.innerHTML = '';
        existingLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${log.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${log.email}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${log.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${log.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${log.date}</td>
            `;
            termsLogBody.appendChild(row);
        });
    }

    // Add log entry to the table and localStorage
    function addLogEntry(logData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${logData.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${logData.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${logData.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${logData.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${logData.date}</td>
        `;
        termsLogBody.appendChild(row);

        // Update localStorage
        const existingLogs = JSON.parse(localStorage.getItem('termsAcceptanceLogs') || '[]');
        existingLogs.push(logData);
        localStorage.setItem('termsAcceptanceLogs', JSON.stringify(existingLogs));
    }

    // Validate form before submission
    function validateForm() {
        if (!nameInput.value.trim()) {
            alert('Please enter your full name');
            return false;
        }
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            alert('Please enter a valid email address');
            return false;
        }
        if (!termsCheckbox.checked) {
            alert('You must check the terms and conditions box');
            return false;
        }
        return true;
    }

    // Email validation function
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    // Handle Terms Acceptance
    acceptButton.addEventListener('click', () => {
        if (validateForm()) {
            const logData = {
                name: nameInput.value,
                email: emailInput.value,
                status: 'Accepted',
                date: new Date().toLocaleString()
            };
            addLogEntry(logData);
            alert('Terms and Conditions Accepted Successfully!');
            
            // Reset form
            form.reset();
        }
    });

    // Handle Terms Decline
    declineButton.addEventListener('click', () => {
        if (validateForm()) {
            const logData = {
                name: nameInput.value,
                email: emailInput.value,
                status: 'Declined',
                date: new Date().toLocaleString()
            };
            addLogEntry(logData);
            alert('Terms and Conditions Declined. You may not proceed.');
            
            // Reset form
            form.reset();
        }
    });

    // Load existing logs on page load
    loadTermsLogs();
});