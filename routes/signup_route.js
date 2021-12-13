const express = require('express');
const {get_signup_page, register_new} = require("../signup_controller");


const router = express.Router();


router
    .route('/')
    .get(get_signup_page)
    .post(register_new)

module.exports = router;