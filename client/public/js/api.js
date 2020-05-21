'use strict';

class UserIDExistError extends Error {
    /** @param {string} userID - The identity of the user. */
    constructor(userID) {
        super(`The User ID "${userID}" already exist.`);
        super.name = 'UserIDExistError';
    }
}

/**
 * Send a http request to the server.
 * @param {string} url - The URL of the request.
 * @param {string} [method] - The method of the request.
 * @param {object} [body] - The body of the request.
 */
const httpReq = (url, method, body) => fetch(url, {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method
});

class API {

    /**
     * @typedef QueryItemForm
     * @property {string} issuer
     * @property {string} contentHash
     */

    /**
     * Search for a certificate.
     * @param {QueryItemForm} form - The form of the query.
     * @returns {Promise<object>} The certificate.
     */
    static async queryItem(form) {
        const { issuer, contentHash } = form;
        const res = await httpReq(`/api/peer/certificate?owner=${owner}&contentHash=${contentHash}`);
        if (res.ok) return await res.json();
        else throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
    }

    /**
     * @typedef IssueCertificateForm
     * @property {string} issuer
     * @property {string} owner
     * @property {string} issueDate
     * @property {string} itemType
     * @property {string} contentHash
     * @property {string} pwd
     */

    /**
     * Issue a new certificate.
     * @param {IssueCertificateForm} form - The form of the issuance.
     * @returns {Promise<object>} The certificate.
     */
    static async issueCertificate(form) {
        const res = await httpReq('/api/peer/certificate', 'POST', form);
        if (res.ok) return await res.json();
        else throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
    }

    /**
     * @typedef UpdateHashForm
     * @property {string} issuer
     * @property {string} owner
     * @property {string} contentHash
     * @property {string} currentPwd
     * @property {string} newPwd
     */

    /**
     * Update the hash of the certificate.
     * @param {UpdateHashForm} form - The form of the update.
     * @returns {Promise<object>} The certificate.
     */
    static async updateHash(form) {
        const res = await httpReq('/api/peer/certificate', 'PATCH', form);
        if (res.ok) return await res.json();
        else throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
    }

    /**
     * @typedef UserRegistrationForm
     * @property {string} userID - The identity of the user.
     * @property {string} password - The password for login.
     * @property {string} [role=client] - The role of the user.
     * @property {string} [affiliation=applicant.main] - The affiliation that the user associated.
     */

    /**
     * Register a new user.
     * @param {UserRegistrationForm} form - The form of the registration.
     */
    static async register(form) {
        const { userID, password, role, affiliation } = form;
        const res = await httpReq('/api/peer/register', 'POST', {
            userID,
            password,
            role: role || 'client',
            affiliation: affiliation || 'applicant.main'
        });
        if (!res.ok) {
            if (res.status === 409) throw new UserIDExistError(userID);
            else throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
        }
    }

}
