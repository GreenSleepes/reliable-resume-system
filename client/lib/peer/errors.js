'use strict';

class UserIDExistError extends Error {
    /** @param {string} userID - The identity of the user. */
    constructor(userID) {
        super(`The User ID "${userID}" already exist.`);
        super.name = 'UserIDExistError';
    }
}

/**
 * The errors in peer module.
 * @module peer/errors
 */
module.exports = { UserIDExistError };
