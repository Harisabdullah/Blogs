const {get_my_posts, get_posts_for_me} = require("./db_managers/post");
const fs = require("fs");
const {replace} = require("./replace_templates/post_card_replace_template");
const {get_user, query_users_by_name, get_username_by_post} = require("./db_managers/register");
const {use} = require("express/lib/router");
const {get_sessions, verify_session} = require("./user_sessions");
const {get_my_following, check_if_followed, get_my_followers, get_my_followers_count, get_my_following_count,
    check_if_req_sent
} = require("./db_managers/relaton");
const {get_likes_count, check_if_liked} = require("./db_managers/like");

exports.fetch_users = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        let output;
        if (sessions.length !== 0) {
            const response = await query_users_by_name(req.body.first_name);
            const users = response.recordset;

            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            let temp_user = fs.readFileSync('templates/person_card.html', 'utf-8');
            const cards = [];

            if(users.length !== 0) {
                for (let el of users) {
                    // Add like count to like button
                    let card = temp_user.replace(/{%f_name%}/g, el.f_name);
                    card = card.replace(/{%l_name%}/g, el.l_name);
                    card = card.replace(/{%bio%}/g, el.bio);
                    card = card.replace(/{%f_id%}/g, el.user_name);

                    cards.push(card);
                }
                output = cards.join('');
                res.send(`<div>${output}</div>`)
            } else {
                res.send('<h4 class="ui segments"><i class="ui icon frown outline"></i>Maybe try another name</h4>')
            }
        }
    }
}



exports.display_profile = async (req, res, next) =>{
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_profile_template = fs.readFileSync('templates/profile_template.html', 'utf-8');
            const tempCard = fs.readFileSync('templates/post_card.html', 'utf-8');

            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            let user;
            if(req.body.username){
                const response = await get_user(req.body.username);
                user = response.recordset[0];
            } else {
                const response = await get_username_by_post(req.body.post_id);
                const target_user_name = response.recordset[0].user_name;
                const user_res = await get_user(target_user_name);
                user = user_res.recordset[0];
            }

            const followers = await get_my_followers_count(user.user_name);
            const followers_count = followers.recordset[0].follower_count;

            const follwoing = await get_my_following_count(user.user_name);
            const following_count = follwoing.recordset[0].following_count;



            let output = user_profile_template.replace(/{%f_name%}/g, user.f_name);
            output = output.replace(/{%l_name%}/g, user.l_name);
            output = output.replace(/{%bio%}/g, user.bio);
            output = output.replace(/{%num_of_followers%}/g, followers_count);
            output = output.replace(/{%num_of_following%}/g, following_count);
            output = output.replace(/{%username%}/g, user.user_name);

            if (await check_if_followed(username, user.user_name)) {
                output = output.replace(/{%follow_action%}/g, 'del_following');
                output = output.replace(/{%follow_style%}/g, 'basic orange');
                output = output.replace(/{%follow_label%}/g, 'Unfollow');
            } else if(await check_if_req_sent(username, user.user_name)) {
                output = output.replace(/{%follow_action%}/g, 'nothing');
                output = output.replace(/{%follow_style%}/g, 'green');
                output = output.replace(/{%follow_label%}/g, 'Request sent ->');
            } else {
                output = output.replace(/{%follow_action%}/g, 'follow_user');
                output = output.replace(/{%follow_style%}/g, 'teal');
                output = output.replace(/{%follow_label%}/g, 'Follow');
            }

            if(user.user_name === 1){
                output = output.replace(/{%follow_btn_hidden%}/g, 'hidden');
            }

            //  Ready Posts

            const post_rec = await get_my_posts(user.user_name);
            const posts = await post_rec.recordset;

            if(posts.length !== 0) {
                let cards = posts.map(el => replace(tempCard, el));
                let i = 0;
                for (let card of cards) {
                    // Add like count to like button
                    const response = await get_likes_count(posts[i].p_id);
                    card = card.replace(/{%num_of_likes%}/g, response.recordset[0].total);

                    // Style according to if liked
                    if (await check_if_liked(username, posts[i].p_id) === 1) {
                        card = card.replace(/{%like_label%}/g, 'Liked');
                        card = card.replace(/{%like_id%}/g, 'remove_like');
                        card = card.replace(/{%like_style%}/g, '');
                    } else {
                        card = card.replace(/{%like_label%}/g, 'Like');
                        card = card.replace(/{%like_id%}/g, 'add_like');
                        card = card.replace(/{%like_style%}/g, 'basic');
                    }
                    cards[i] = card;
                    i++;
                }
                cards = cards.join('');
                output = output.replace(/{%Post_cards%}/g, `${cards}`);
            } else {
                output = output.replace(/{%Post_cards%}/g, '<div class="ui segment">So empty in here</div>');
            }
            res.send(output);
        }
    }

}


exports.get_my_profile = async (req, res, next) =>{
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_profile_template = fs.readFileSync('templates/profile_template.html', 'utf-8');
            const tempCard = fs.readFileSync('templates/post_card.html', 'utf-8');

            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            const user_res = await get_user(username);
            const user = user_res.recordset[0];

            const followers = await get_my_followers_count(username);
            const followers_count = followers.recordset[0].follower_count;

            const follwoing = await get_my_following_count(username);
            const following_count = follwoing.recordset[0].following_count;



            let output = user_profile_template.replace(/{%f_name%}/g, user.f_name);
            output = output.replace(/{%l_name%}/g, user.l_name);
            output = output.replace(/{%bio%}/g, user.bio);
            output = output.replace(/{%num_of_followers%}/g, followers_count);
            output = output.replace(/{%num_of_following%}/g, following_count);
            output = output.replace(/{%follow_btn_hidden%}/g, 'hidden');


            //  Ready Posts
            const post_rec = await get_my_posts(username);
            const posts = await post_rec.recordset;

            if(posts.length !== 0) {
                let cards = posts.map(el => replace(tempCard, el));
                let i = 0;
                for (let card of cards) {
                    // Add like count to like button
                    const response = await get_likes_count(posts[i].p_id);
                    card = card.replace(/{%num_of_likes%}/g, response.recordset[0].total);

                    // Style according to if liked
                    if (await check_if_liked(username, posts[i].p_id) === 1) {
                        card = card.replace(/{%like_label%}/g, 'Liked');
                        card = card.replace(/{%like_id%}/g, 'remove_like');
                        card = card.replace(/{%like_style%}/g, '');
                    } else {
                        card = card.replace(/{%like_label%}/g, 'Like');
                        card = card.replace(/{%like_id%}/g, 'add_like');
                        card = card.replace(/{%like_style%}/g, 'basic');
                    }
                    cards[i] = card;
                    i++;
                }
                cards = cards.join('');
                output = output.replace(/{%Post_cards%}/g, `${cards}`);
            } else {
                output = output.replace(/{%Post_cards%}/g, '<div class="ui segment">So empty in here</div>');

            }
            res.send(output);
        }
    }

}