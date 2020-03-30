const express = require('express')
const router = express.Router()
const { sendLogin } = require('@shared')

router.get('/', sendLogin)

module.exports = router
