'use strict';

// Create a router.
const router = require('express').Router();

// Set up the routing of peer API.
router.use('/peer', require('./peer/routes'));

// Return a 400 response if the API request is unavailable.
router.all('*', (req, res) => res.sendStatus(400));

module.exports = router;
