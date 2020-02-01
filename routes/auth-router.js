'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth-middleware.js');


/**
 * @route POST /signin
 * @group users - user related routes
 * @param {String} req.headers.authorization - Basic encoded user email and password
 * @returns {JWT} 200 - A token for the authenticated user
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.post('/signin', auth, (req, res, next) => {

    res.send({
        token: req.token,
    });
});

/**
 * @route POST /signup
 * @group users - user related routes
 * @param {String} req.headers.authorization - Basic encoded user email and password
 * @returns {JWT} 200 - A token for the authenticated user
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.post('/signup', auth, (req, res, next) => {

    res.send({ token: req.token });
});

module.exports = router;
