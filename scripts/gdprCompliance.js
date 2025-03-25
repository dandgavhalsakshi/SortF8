// scripts/gdprCompliance.js
class GDPRComplianceManager {
    constructor() {
        this.gdprConsentFormElement = document.getElementById('gdpr-consent-form');
        this.initializeGDPRConsent();
    }

    initializeGDPRConsent() {
        // Render GDPR consent form
        this.renderConsentForm();
        
        // Check existing consent
        this.checkExistingConsent();
    }

    renderConsentForm() {
        this.gdprConsentFormElement.innerHTML = `
            <form id="gdpr-consent-form">
                <h3>Data Privacy Consent</h3>
                <div class="consent-section">
                    <input type="checkbox" id="essential-data" checked disabled>
                    <label for="essential-data">Essential Data Collection (Required)</label>
                </div>
                <div class="consent-section">
                    <input type="checkbox" id="analytics-consent" name="analytics">
                    <label for="analytics-consent">Allow Analytics Tracking</label>
                </div>
                <div class="consent-section">
                    <input type="checkbox" id="marketing-consent" name="marketing">
                    <label for="marketing-consent">Allow Marketing Communications</label>
                </div>
                <div class="consent-section">
                    <input type="checkbox" id="third-party-consent" name="third-party">
                    <label for="third-party-consent">Allow Third-Party Data Sharing</label>
                </div>
                <button type="button" id="save-gdpr-consent">Save Preferences</button>
            </form>
        `;

        // Add event listener for consent saving
        const saveConsentButton = document.getElementById('save-gdpr-consent');
        saveConsentButton.addEventListener('click', () => this.saveGDPRConsent());
    }

    saveGDPRConsent() {
        const consentData = {
            timestamp: new Date().toISOString(),
            consents: {
                analytics: document.getElementById('analytics-consent').checked,
                marketing: document.getElementById('marketing-consent').checked,
                thirdParty: document.getElementById('third-party-consent').checked
            }
        };

        // Store consent in localStorage
        localStorage.setItem('gdprConsent', JSON.stringify(consentData));

        // Log audit trail
        this.logGDPRConsent(consentData);

        // Provide user feedback
        alert('GDPR Consent Preferences Saved');
    }

    checkExistingConsent() {
        const existingConsent = localStorage.getItem('gdprConsent');
        
        if (existingConsent) {
            const parsedConsent = JSON.parse(existingConsent);
            
            // Restore previous consent settings
            document.getElementById('analytics-consent').checked = 
                parsedConsent.consents.analytics;
            document.getElementById('marketing-consent').checked = 
                parsedConsent.consents.marketing;
            document.getElementById('third-party-consent').checked = 
                parsedConsent.consents.thirdParty;
        }
    }

    logGDPRConsent(consentData) {
        const auditLog = JSON.parse(localStorage.getItem('auditLog') || '[]');
        auditLog.push({
            timestamp: consentData.timestamp,
            activity: 'GDPR Consent Updated',
            details: JSON.stringify(consentData.consents),
            type: 'GDPR_COMPLIANCE'
        });
        localStorage.setItem('auditLog', JSON.stringify(auditLog));
    }
}

// Initialize GDPR Compliance
document.addEventListener('DOMContentLoaded', () => {
    new GDPRComplianceManager();
});