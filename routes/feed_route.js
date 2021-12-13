const express = require('express');
const {display_feed} = require("../feed_controller");

const router = express.Router();
router
    .route('/')
    .post(display_feed)
    .get((req,res,next)=>{
        res.send('<h1>Forbidden route</h1>')
    })

module.exports = router;