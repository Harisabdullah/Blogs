const express = require('express');
const {my_posts, update_name, update_password, update_bio_content, get_bio_content, my_post, get_my_followers,
    get_my_follow_req, get_my_following, do_follow_req, accept_follow, del_relation
} = require("../my_profile_controller");
const {get_my_profile} = require("../profile_controller");

const router = express.Router();
router
    .route('/')
    .post(get_my_profile)

router
    .route('/follow')
    .post(do_follow_req)

router
    .route('/accept_follow')
    .post(accept_follow)

router
    .route('/delete_relation')
    .post(del_relation)

router
    .route('/my_posts')
    .post(my_posts)
router
    .route('/my_post')
    .post(my_post)

router
    .route('/change_name')
    .post(update_name)

router
    .route('/update_pass')
    .post(update_password)

router
    .route('/get_bio')
    .post(get_bio_content)

router
    .route('/update_bio')
    .post(update_bio_content)

router
    .route('/get_followers')
    .post(get_my_followers)

router
    .route('/get_follow_req')
    .post(get_my_follow_req)


router
    .route('/get_following')
    .post(get_my_following)



module.exports = router;