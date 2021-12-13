import {get_feed, get_home_page, get_sign_up_page, send_edit_my_post} from "./data_fetchers.js";
import {
    accept_follow,
    add_comment, add_like,
    change_name, change_pass,
    del_my_post, delete_comment, delete_follower, delete_following, display_add_comment,
    display_change_name, display_comments, display_control_menu_success, display_edit_post,
    display_find_someone, display_follow_req, display_following,
    display_manage_followers,
    display_manage_post, display_my_profile, display_person_profile, display_person_profile_by_post,
    display_update_bio,
    display_update_pass, edit_post, follow_user,
    publish, remove_like, search_person,
    sign_up, update_bio
} from "./controllers.js";
import {login} from "./controllers.js";



//////////////////////////////////////////// LOGIN PAGE ///////////////////////////////////////////////////////////////////



export const watch_login = () =>{
    document.getElementById("login").addEventListener("click", ()=>{
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        login(username , password);
    })
}

export const watch_get_homepage = () =>{
    document.getElementById("get_log_in").addEventListener("click", get_home_page)
}

export const watch_get_sign_up = () =>{
    document.getElementById("get_sign_up_page").addEventListener("click", ()=>{
        get_sign_up_page();
    })
}






//////////////////////////////////////////// SIGN UP PAGE ////////////////////////////////////////////////////////////////////





export const watch_sign_up = () => {
    document.getElementById("sign_up").addEventListener("click", ()=>{
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const first_name = document.getElementById("first_name").value;
        const last_name = document.getElementById("last_name").value;
        const date_of_birth = document.getElementById("date_of_birth").value;
        const gender = document.getElementById("Gender").value;

        if(!(username && password && first_name && last_name && date_of_birth && Gender)){
            document.getElementById("err_empty_fields").classList.remove("hidden");
        } else {
            document.getElementById("err_empty_fields").classList.add("hidden");
            sign_up(username,password,first_name,last_name,date_of_birth,gender);
        }

    })
}




//////////////////////////////////////////// FEED ///////////////////////////////////////////////////////////////////////


////////////////////////////////// CREATE NEW POST CARD ///////////////////////////

export const watch_publish = () => {
    document.getElementById("publish").addEventListener('click',  async (event) => {
        const p_title = document.getElementById("new_post_title").value;
        const p_content = document.getElementById("new_post_content").value;

        if (!p_title) {
            document.getElementById("err_new_post_title_empty").classList.remove("hidden");
        } else {
            const create_new_post_card = document.getElementById("create_new_post_card").children;
            const res = await publish(p_title, p_content);

            // Display publish message
            if(res.status === 201){
                document.getElementById("new_post_success").classList.remove("hidden");
                document.getElementById("create_new_post_card").classList.add("hidden");

                setTimeout(()=>{
                    // Recover hidden cards
                    document.getElementById("new_post_success").classList.add("hidden");
                    document.getElementById("create_new_post_card").classList.remove("hidden");
                    document.getElementById("err_new_post_title_empty").classList.add("hidden");

                    // Clean the inputs
                    document.getElementById("new_post_title").value = '';
                    document.getElementById("new_post_content").value = '';
                }, 2000)
            }
        }
    })
}





///////////////////////////////////////////////// CONTROL MENU /////////////////////////////////////////////////////////////////////





export const watch_control_menu_card = () => {
    document.getElementById("control_menu").addEventListener('click', (event)=>{
        const id = event.target.id;

        switch (id){
            case "visit_my_profile":
                console.log('My profile');
                display_my_profile();
                break;

            case "change_name":
                display_change_name();
                break;
            case "get_timeline":
                // Brings TimeLine
                get_feed();
                break;
            case "update_pass":
                display_update_pass();
                break;
            case "update_bio":
                display_update_bio();
                break;
            case "manage_posts":
                display_manage_post();
                break;
            case "manage_followers":
                display_manage_followers();
                break;
            case "manage_following":
                display_following();
                break;
            case "view_follow_req":
                display_follow_req();
                break;
            case "find_someone":
                display_find_someone();
                break;

        }
    })


    //////////////// CONTROL MENU EXTENDED ///////////////


    document.getElementById("post_cards").addEventListener('click',  (event) => {
        const id = event.target.id;

        switch (id) {
            /////////////////// Following / Followers
            case "follow_user":
                follow_user(event.target.parentElement.parentElement.id);
                break;
            case "accept_follow":
                accept_follow(event.target.parentElement.previousElementSibling.id);
                break;

            case "del_follower":
                delete_follower(event.target.parentElement.previousElementSibling.id);
                break;

            case "del_following":
                delete_following(event.target.parentElement.parentElement.id);
                display_person_profile(event.target.parentElement.parentElement.id);
                break;

            case "del_following_from_menu":
                delete_following(event.target.parentElement.previousElementSibling.id);
                setTimeout(display_following, 20) ;
                break;

            ////////////////// POSTS

            case "del_post":
                del_my_post(event.target.parentElement.previousElementSibling.id);
                break;
            case "edit_post":
                display_edit_post(event.target.parentElement.previousElementSibling.id);
                break;
            case "update_post":
                const post_id = event.target.parentElement.parentElement.parentElement.id;
                const post_title = document.getElementById("new_post_title").value;
                const post_content = document.getElementById("new_post_content").value;
                send_edit_my_post(post_id, post_title, post_content);

                display_control_menu_success();
                setTimeout(display_manage_post, 2000);

                break;

            /////////////////////// COMMENTS
            case "view_add_comment":
                display_add_comment(event.target.parentElement.previousElementSibling.id);
                break;

            case "add_comment":
                add_comment(
                    event.target.parentElement.parentElement.id,
                    document.getElementById("c_content").value
                )
                break;

            case "del_comment":
                delete_comment(event.target.parentElement.parentElement.id);
                break;

            case "view_comments":
                display_comments(event.target.parentElement.previousElementSibling.id);
                break;
            case "get_timeline":
                // Brings TimeLine
                get_feed();
                break;
            /////////////////////// likes
            case "add_like":
                add_like(event.target.parentElement.previousElementSibling.id);
                break;

            case "remove_like":
                remove_like(event.target.parentElement.previousElementSibling.id);
                break;

            ///////////////// PROFILE
            case "update_name":
                change_name();
                break;
            case "update_pass":
                change_pass();
                break;

            case "update_bio":
                update_bio();
                break;

            /////////// Find someone

            case "search_name":
                search_person();
                break;
            case "visit_profile":
                display_person_profile(event.target.parentElement.previousElementSibling.id)
                break;

            case "visit_profile_by_post":
                display_person_profile_by_post(event.target.parentElement.previousElementSibling.id)
                break;
        }
    })
}