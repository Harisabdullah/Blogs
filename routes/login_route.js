const express = require('express');
const {login} = require("../login_controller");

const router = express.Router();
router
    .route('/')
    .post(login)

module.exports = router;