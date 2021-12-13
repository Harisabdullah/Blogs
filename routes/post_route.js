const express = require('express');
const {create_post, delete_my_post, update_my_post, get_all_comments, add_comment, add_like, remove_like
} = require("../post_controller");


const router = express.Router();
router
    .route('/')
    .post(create_post)

router
    .route('/delete')
    .post(delete_my_post)

router
    .route('/update')
    .post(update_my_post)

router
    .route('/get_comments')
    .post(get_all_comments)

router
    .route('/add_comment')
    .post(add_comment)

router
    .route('/add_like')
    .post(add_like)

router
    .route('/rem_like')
    .post(remove_like)

module.exports = router;