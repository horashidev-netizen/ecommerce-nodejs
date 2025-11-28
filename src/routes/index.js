'use strict'

const express = require('express');

const router = express.Router();

router.use('/api/shop', require('./access/index'))

router.get('v1/api', (req, res, next) => {
    return res.status(200).json({
        message: 'you got this page',
        body: "Xin chao bdan nhe"
    })
})

module.exports = router