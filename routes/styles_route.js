const express = require('express');
const {send_main_file} = require("../styles_controller");
const router = express.Router();
router
    .route('/styles.css')
    .get(send_main_file)

module.exports = router;