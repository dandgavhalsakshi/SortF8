document.addEventListener('DOMContentLoaded', () => {
    const termsForm = document.getElementById('termsForm');

    termsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const acceptanceDate = document.getElementById('acceptanceDate').value;
        const termsAccepted = document.getElementById('termsAccept').checked;

        if (termsAccepted) {
            localStorage.setItem('termsAcceptance', JSON.stringify({
                name: userName,
                email: userEmail,
                date: acceptanceDate
            }));
            alert('Terms and Conditions successfully accepted!');
        } else {
            alert('Please accept the Terms and Conditions');
        }
    });
});