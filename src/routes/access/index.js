const express = require('express');
const accessController = require('../../controller/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');

const router = express.Router()

router.post('/auth/signup', asyncHandler(accessController.signup))

module.exports = router