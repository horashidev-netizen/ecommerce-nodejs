const express = require('express');
const accessController = require('../../controller/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

const router = express.Router()

//Login/Signin
router.post('/auth/signup', asyncHandler(accessController.signup))
router.post('/auth/login', asyncHandler(accessController.login))

//Authentication
router.use(authentication);
router.post('/auth/logout', asyncHandler(accessController.logout))

module.exports = router