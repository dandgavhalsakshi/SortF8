// scripts/auditLog.js
class AuditLogManager {
    constructor() {
        this.auditLogTableBody = document.getElementById('audit-log-body');
        this.initializeAuditLog();
    }

    initializeAuditLog() {
        // Render existing audit logs
        this.renderAuditLogs();
    }

    renderAuditLogs() {
        // Retrieve audit logs from localStorage
        const auditLog = JSON.parse(localStorage.getItem('auditLog') || '[]');
        
        // Clear existing table rows
        this.auditLogTableBody.innerHTML = '';

        // Limit to last 50 logs
        const displayLogs = auditLog.slice(-50);

        // Render logs in reverse chronological order
        displayLogs.reverse().forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(log.timestamp).toLocaleString()}</td>
                <td>${log.activity}</td>
                <td>${log.type || 'SYSTEM'}</td>
            `;
            this.auditLogTableBody.appendChild(row);
        });
    }

    static logActivity(activity, type = 'SYSTEM', details = {}) {
        const auditLog = JSON.parse(localStorage.getItem('auditLog') || '[]');
        
        const newLogEntry = {
            timestamp: new Date().toISOString(),
            activity,
            type,
            details: JSON.stringify(details)
        };

        auditLog.push(newLogEntry);
        
        // Keep only last 100 logs
        const trimmedLog = auditLog.slice(-100);
        
        localStorage.setItem('auditLog', JSON.stringify(trimmedLog));
    }

    clearAuditLogs() {
        localStorage.removeItem('auditLog');
        this.renderAuditLogs();
    }
}

// Static method to log activities from other modules
window.logActivity = AuditLogManager.logActivity;

// Initialize Audit Log
document.addEventListener('DOMContentLoaded', () => {
    new AuditLogManager();
});