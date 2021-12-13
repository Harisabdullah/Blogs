import {watch_get_homepage} from "./event_watchers.js";
import {re_render_component} from "./utilities.js";
import {
    fetch_all_comments,
    fetch_follow_req,
    fetch_followers,
    fetch_following, fetch_my_profile, fetch_person_profile, fetch_person_profile_from_post,
    get_feed,
    get_my_bio,
    get_my_post,
    get_my_posts,
    get_users, send_accept_follow_req,
    send_add_comment,
    send_add_like,
    send_change_name, send_del_follower, send_del_following,
    send_del_my_post,
    send_delete_comment, send_follow_req,
    send_rem_like,
    send_update_bio,
    send_update_pass
} from "./data_fetchers.js";

////////////////////////////////// UTILITIES /////////////////////////////////////////////

export const display_control_menu_success = async ()=>{
    const success_card = await fetch('./success_card.html');
    re_render_component("post_cards", await success_card.text());
}


///////////////////////////////////////////////////////////////// LOGIN PAGE ////////////////////////////////////




export const login = async (username, password) => {
    let key = localStorage.getItem("key");
    const res =  await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/login',
        data: {
            key:key,
            username: username,
            password:password
        }
    })
    key = res.data.key;
    if(key !== 0){
        localStorage.setItem("key",key);
        await get_feed();
    } else {
        document.getElementById("err_incorrect_user_pass").classList.remove("hidden");
    }
}







///////////////////////////////////////////////////////////////// SIGN UP PAGE ////////////////////////////////////






export const sign_up = async (username, password, first_name, last_name, date_of_birth, gender) => {
    let key = localStorage.getItem("key");
    const res =  await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/signUp',
        data: {
            key:key,
            username: username,
            password:password,
            first_name: first_name,
            last_name: last_name,
            date_of_birth: date_of_birth,
            gender:gender
        }
    })
    if(await res.data.err === 2627){
        document.getElementById("err_username_taken").classList.remove("hidden");
    } else if(await res.data.err === 0){
        console.log(res.data.message);
        if(re_render_component("sign_up_card_container", res.data.message)){
            watch_get_homepage();
        }
    }
}





///////////////////////////////////////////////////////////////// FEED  ////////////////////////////////////



//////////////////////////// CREATE NEW POST //////////////////

export const publish = async (p_title, p_content) => {
    let key = localStorage.getItem("key");
    return await axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/post',
        data: {
            key: key,
            p_title: p_title,
            p_content: p_content
        }
    });
}

//////////////////////////////// ADD NEW COMMENT //////////////
export const display_add_comment = async (post_id) => {
    const card = await fetch('./add_comment.html')
    re_render_component("post_cards", await card.text());
    document.getElementById("dummy_id").id = post_id;
}

export const add_comment = async (post_id, c_content) => {
    await send_add_comment(post_id, c_content);
    await display_control_menu_success();
    setTimeout(get_feed, 2000);
}

export const display_comments = async (post_id) => {
    const comments = await fetch_all_comments(post_id);
    re_render_component("post_cards", await comments.data);
}

export const delete_comment = async (c_id) => {
    await send_delete_comment(c_id);
    await display_control_menu_success();
    setTimeout(get_feed, 2000);
}


///////////////////////////// ADD LIKE /////////////////////

export const add_like = async (post_id) => {
    await send_add_like(post_id);
    get_feed();
}

export const remove_like = async (post_id) => {
    await send_rem_like(post_id);
    get_feed();
}


//////////////////////////// MENU CONTROLLERS //////////////////
/////////////////////// Profile /////////////
export const display_change_name = async () => {
    const card = await fetch('./update_name.html')
    re_render_component("post_cards", await card.text());
}


export const change_name = async () => {
    const new_f_name = document.getElementById("new_f_name").value;
    const new_l_name = document.getElementById("new_l_name").value;

    await send_change_name(new_f_name, new_l_name);
    await display_control_menu_success();
    setTimeout(get_feed, 2000);
}



export const display_update_pass = async () => {
    const card = await fetch('./update_pass.html')
    re_render_component("post_cards", await card.text());
}

export const change_pass = async () => {
    const new_pass = document.getElementById("new_pass").value;
    await send_update_pass(new_pass);
    await display_control_menu_success();
    setTimeout(get_feed, 2000);
}

export const update_bio = async () => {
    const new_bio = document.getElementById("new_bio").value;
    await send_update_bio(new_bio);
    await display_control_menu_success();
    setTimeout(get_feed, 2000);
}

export const display_update_bio = async () => {
    const card = await fetch('./update_bio.html')
    re_render_component("post_cards", await card.text());
    document.getElementById("new_bio").value = await get_my_bio();
}


/////////////////////// Posts /////////////


export const display_manage_post = async () => {
    const posts = await get_my_posts();
    re_render_component("post_cards",posts.data);
}

export const del_my_post = async (post_id) => {
    await send_del_my_post(post_id);
    await display_control_menu_success();
    setTimeout(display_manage_post, 2000);
}

export const edit_post = async (post_id) => {
    console.log(post_id)
    await display_edit_post(post_id);
}

export const display_edit_post = async (post_id) => {
    // Display new card
    const card = await fetch('./edit_post.html')
    re_render_component("post_cards", await card.text());
    // Get post data
    const res = await get_my_post(post_id);

    const p_id = res.data.post_id;
    const post_title = res.data.post_title;
    const post_content = res.data.post_content;
    // Display in place holders
    document.getElementById("new_post_title").value = post_title;
    document.getElementById("new_post_content").value = post_content;
    document.getElementById("dummy_id").id = p_id;
}




/////////////////////// Followers /////////////

export const follow_user = async (username) => {
    await send_follow_req(username);
    await display_person_profile(username);
}

export const accept_follow = async (username) => {
    await send_accept_follow_req(username);
    await display_follow_req();
}

export const delete_follower = async (username) => {
    await send_del_follower(username);
}

export const delete_following = async (username) => {
    console.log(username);
    await send_del_following(username);
}

export const display_manage_followers = async () => {
    const followers_card = await fetch_followers()
    re_render_component("post_cards", followers_card.data);
}

export const display_follow_req = async () => {
    const follow_req_card = await fetch_follow_req()
    re_render_component("post_cards", follow_req_card.data);
}

export const display_following = async () => {
    const follow_req_card = await fetch_following()
    re_render_component("post_cards", follow_req_card.data);
}


export const display_find_someone = async () => {
    const card = await fetch('./find_someone.html')
    re_render_component("post_cards", await card.text());
}


/////////////////////////// SEARCH PERSON
export const search_person = async () => {
    const query_name = document.getElementById("query_name").value;
    if(!query_name){
        document.getElementById("err_query_empty").classList.remove("hidden");
    } else {
        const result = await get_users(query_name);
        re_render_component("query_result", result.data);
    }
}



export const display_person_profile =  async (username) => {
    const res = await fetch_person_profile(username);
    re_render_component("post_cards", res.data);

}

export const display_person_profile_by_post =  async (post_id) => {
    const res = await fetch_person_profile_from_post(post_id);
    re_render_component("post_cards", res.data);
}

export const display_my_profile = async () => {
    const res = await fetch_my_profile();
    re_render_component("post_cards", res.data);
}