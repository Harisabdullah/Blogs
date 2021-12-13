import {
    watch_control_menu_card,
    watch_get_sign_up,
    watch_login,
    watch_publish,
    watch_sign_up
} from "./event_watchers.js";
import {re_render_page} from "./utilities.js";

export const get_home_page = async () =>{
    let page =  await axios({
        method: 'GET',
        url: 'http://127.0.0.1:3000'
    })
    re_render_page(page);
    watch_login();
    watch_get_sign_up();
}

export const get_sign_up_page = async () => {
    let page =  await axios({
        method: 'GET',
        url: 'http://127.0.0.1:3000/signUp'
    })
    re_render_page(page);
    watch_sign_up();
}

export const get_feed = async ()=>{
    const res =  await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/feed',
        data: {
            key : localStorage.getItem("key")
        }
    })
    if(re_render_page(res)){
        // Watch all event listeners for feed
        watch_publish();
        watch_control_menu_card();
    }
}



/////////////////////////////// POSTS ////////////////////////////
export const get_my_posts = async () => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/my_posts',
        data: {
            key: key
        }
    });
}

export const get_my_post = async (post_id) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/my_post',
        data: {
            key: key,
            post_id: post_id
        }
    });
}

export const send_del_my_post = async (post_id) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post/delete',
        data: {
            key: key,
            post_id: post_id
        }
    });
}

export const send_edit_my_post = async (post_id, new_post_title, new_post_content) => {
    let key = localStorage.getItem("key");
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post/update',
        data: {
            key: key,
            post_id: post_id,
            new_post_title: new_post_title,
            new_post_content: new_post_content
        }
    });
}




//////////////////////////////// COMMENTS //////////////////////////////////
export const send_add_comment = async (post_id, c_content) => {
    let key = localStorage.getItem("key");
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post/add_comment',
        data: {
            key: key,
            post_id: post_id,
            c_content: c_content
        }
    });
}

export const fetch_all_comments = async (post_id) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post/get_comments',
        data: {
            key: key,
            post_id: post_id
        }
    });
}

export const send_delete_comment = async (c_id) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post/del_comment',
        data: {
            key: key,
            c_id: c_id
        }
    });
}




/////////////////////////////// LIKES //////////////////////////////////////
export const send_add_like = async (post_id) => {
    let key = localStorage.getItem("key");
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post/add_like',
        data: {
            key: key,
            post_id: post_id
        }
    });
}

export const send_rem_like = async (post_id) => {
    let key = localStorage.getItem("key");
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post/rem_like',
        data: {
            key: key,
            post_id: post_id
        }
    });
}



///////////////////////////////// USERS ///////////////////////////////////




export const get_users = async (first_name) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/get_users',
        data: {
            key: key,
            first_name: first_name
        }
    });
}


export const fetch_person_profile = async (username) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/get_users/display_profile',
        data: {
            key: key,
            username: username
        }
    });
}

export const fetch_my_profile = async () => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile',
        data: {
            key: key
        }
    });
}

export const fetch_person_profile_from_post = async (post_id) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/get_users/display_profile',
        data: {
            key: key,
            post_id: post_id
        }
    });
}



////////////////////////////////  PROFILE  //////////////////////////////////

export const send_change_name = async (first_name, last_name) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/change_name',
        data: {
            key: key,
            first_name: first_name,
            last_name: last_name
        }
    });
}

export const send_update_pass = async (new_password) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/update_pass',
        data: {
            key: key,
            new_password: new_password
        }
    });
}

export const send_update_bio = async (new_bio) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/update_bio',
        data: {
            key: key,
            new_bio: new_bio
        }
    });
}

export const get_my_bio = async () => {
    let key = localStorage.getItem("key");
    const res = await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/get_bio',
        data: {
            key: key
        }
    });
    return res.data.bio;
}




////////////////////////////////////////// FOLLOWERS //////////////////////////
export const send_follow_req = async (username) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/follow',
        data: {
            key: key,
            username: username
        }
    });
}

export const send_accept_follow_req = async (username) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/accept_follow',
        data: {
            key: key,
            username: username
        }
    });
}


export const send_del_follower = async (username) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/delete_relation',
        data: {
            key: key,
            follower: username
        }
    });
}

export const send_del_following = async (username) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/delete_relation',
        data: {
            key: key,
            following: username
        }
    });
}




export const fetch_followers = async () => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/get_followers',
        data: {
            key: key
        }
    });
}

export const fetch_following = async () => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/get_following',
        data: {
            key: key
        }
    });
}

export const fetch_follow_req = async () => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/my_profile/get_follow_req',
        data: {
            key: key
        }
    });
}