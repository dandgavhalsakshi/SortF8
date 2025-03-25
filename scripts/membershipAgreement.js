// scripts/membershipAgreement.js
class MembershipAgreementManager {
    constructor() {
        this.signaturePadContainer = document.getElementById('signature-pad-container');
        this.initializeMembershipAgreement();
    }

    initializeMembershipAgreement() {
        this.renderAgreementForm();
        this.checkExistingAgreement();
    }

    renderAgreementForm() {
        this.signaturePadContainer.innerHTML = `
            <div class="membership-agreement-container">
                <h3>Membership Agreement</h3>
                
                <div class="agreement-text">
                    <h4>Terms of Membership</h4>
                    <p>By signing below, you agree to the following terms:</p>
                    <ul>
                        <li>Maintain confidentiality of membership information</li>
                        <li>Comply with all organizational policies</li>
                        <li>Pay required membership fees</li>
                        <li>Participate in community activities</li>
                        <li>Respect other members and staff</li>
                    </ul>
                </div>

                <div class="signature-section">
                    <h4>Digital Signature</h4>
                    <canvas id="signature-pad" width="500" height="200"></canvas>
                    <div class="signature-actions">
                        <button id="clear-signature">Clear</button>
                        <button id="save-signature">Save Signature</button>
                    </div>
                </div>

                <div class="member-details">
                    <input type="text" id="full-name" placeholder="Full Name" required>
                    <input type="email" id="email" placeholder="Email Address" required>
                    <input type="date" id="agreement-date" placeholder="Date">
                </div>
            </div>
        `;

        this.initializeSignaturePad();
    }

    initializeSignaturePad() {
        const canvas = document.getElementById('signature-pad');
        const clearBtn = document.getElementById('clear-signature');
        const saveBtn = document.getElementById('save-signature');
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Set canvas background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // Drawing events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch events for mobile support
        canvas.addEventListener('touchstart', startDrawingTouch);
        canvas.addEventListener('touchmove', drawTouch);
        canvas.addEventListener('touchend', stopDrawing);

        clearBtn.addEventListener('click', clearSignature);
        saveBtn.addEventListener('click', saveSignature);

        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function draw(e) {
            if (!isDrawing) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function startDrawingTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }

        function drawTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }

        function clearSignature() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function saveSignature() {
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const agreementDate = document.getElementById('agreement-date').value;

            if (!fullName || !email || !agreementDate) {
                alert('Please fill in all required fields');
                return;
            }

            // Check if signature is drawn
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const signatureDrawn = imageData.data.some(pixel => pixel !== 255);

            if (!signatureDrawn) {
                alert('Please provide a signature');
                return;
            }

            // Generate signature data
            const signatureImage = canvas.toDataURL('image/png');
            
            const membershipAgreement = {
                fullName,
                email,
                signatureImage,
                agreementDate: new Date().toISOString(),
                version: '1.0'
            };

            // Store in localStorage
            localStorage.setItem('membershipAgreement', JSON.stringify(membershipAgreement));

            // Log audit trail
            window.logActivity('Membership Agreement Signed', 'MEMBERSHIP');

            alert('Membership Agreement Successfully Signed!');
        }
    }

    checkExistingAgreement() {
        const existingAgreement = localStorage.getItem('membershipAgreement');
        
        if (existingAgreement) {
            const agreementData = JSON.parse(existingAgreement);
            
            // Update UI to show existing agreement
            const agreementStatus = document.createElement('div');
            agreementStatus.classList.add('agreement-status');
            agreementStatus.innerHTML = `
                <h4>Current Membership Agreement</h4>
                <p>Signed by: ${agreementData.fullName}</p>
                <p>Email: ${agreementData.email}</p>
                <p>Date Signed: ${new Date(agreementData.agreementDate).toLocaleString()}</p>
            `;
            
            this.signaturePadContainer.appendChild(agreementStatus);
        }
    }

    exportAgreement() {
        const existingAgreement = localStorage.getItem('membershipAgreement');
        
        if (existingAgreement) {
            const agreementData = JSON.parse(existingAgreement);
            
            // Create a downloadable JSON file
            const blob = new Blob([JSON.stringify(agreementData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `membership_agreement_${agreementData.fullName}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
        } else {
            alert('No existing membership agreement found.');
        }
    }
}

// Initialize Membership Agreement
document.addEventListener('DOMContentLoaded', () => {
    const membershipManager = new MembershipAgreementManager();
    
    // Optional: Add export button if needed
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Agreement';
    exportButton.addEventListener('click', () => membershipManager.exportAgreement());
    document.getElementById('signature-pad-container').appendChild(exportButton);
});