const express = require('express');
const {fetch_users, display_profile} = require("../profile_controller");


const router = express.Router();
router
    .route('/')
    .post(fetch_users)

router
    .route('/display_profile')
    .post(display_profile)

module.exports = router;