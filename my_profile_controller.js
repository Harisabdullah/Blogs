const {get_my_posts, get_post} = require("./db_managers/post");
const fs = require("fs");
const {replace} = require("./replace_templates/post_card_replace_template");
const {get_user, update_name, update_pass, get_bio, update_bio} = require("./db_managers/register");
const {use} = require("express/lib/router");
const {get_sessions, verify_session} = require("./user_sessions");
const {get_my_followers, get_my_follow_requests, get_my_following, request_new_relation, set_approved, del_relation} = require("./db_managers/relaton");
const {compile} = require("morgan");


exports.my_posts = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.send('<h1>Forbidden</h1>');
    } else {
        if (sessions.length !== 0) {
            // Find data relevant to user
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;
            const record = await get_my_posts(username);
            const my_posts = record.recordset;

            const tempCard = fs.readFileSync('templates/my_post_card.html', 'utf-8');
            const cardsHtml = my_posts.map(el => replace(tempCard, el)).join('');

            res.send(`<div>${cardsHtml}</div>`);
        }
    }
}


exports.my_post = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.send('<h1>Forbidden</h1>');
    } else {
        if (sessions.length !== 0) {
            const record = await get_post(req.body.post_id);
            let my_post = record.recordset;
            res.send({
                post_id: req.body.post_id,
                post_title: my_post[0].p_title,
                post_content: my_post[0].p_content
            });
        }
    }
}

exports.update_name = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const new_first_name = req.body.first_name;
            const new_last_name = req.body.last_name;

            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            await update_name(username, new_first_name, new_last_name);
            return res.sendStatus(201);
        }
    }
}


exports.update_password = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const new_password = req.body.new_password;

            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            await update_pass(username, new_password);
            return res.sendStatus(201);
        }
    }
}

exports.update_bio_content = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const new_bio = req.body.new_bio;
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;
            await update_bio(username, new_bio);
            return res.sendStatus(201);
        }
    }
}

exports.get_bio_content = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            const bio = await get_bio(username);
            return res.send(bio.recordset[0]);
        }
    }
}

exports.do_follow_req = async (req,res,next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;
            const target_username = req.body.username;

            console.log(username, target_username);

            await request_new_relation(username, target_username);
            res.sendStatus(200);
        }
    }
}

exports.del_relation = async (req,res,next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            console.log(req.body.following)
            if(req.body.following){
                console.log("hello");
                await del_relation(username, req.body.following);
            }else {
                await del_relation(req.body.follower, username);
            }

            res.sendStatus(200);
        }
    }
}

exports.accept_follow = async (req,res,next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            console.log("Hello");
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            const target_username = req.body.username;
            await set_approved(target_username, username);
            res.sendStatus(200);
        }
    }
}


exports.get_my_followers = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            const response = await get_my_followers(username);
            const followers = response.recordset;

            const temp_follower = fs.readFileSync('templates/my_follower.html', 'utf-8');

            const output = followers.map(el => {
                let temp = temp_follower.replace(/{%f_id%}/g, el.user_name);
                temp = temp.replace(/{%f_name%}/g, el.f_name);
                temp = temp.replace(/{%l_name%}/g, el.l_name);
                temp = temp.replace(/{%bio%}/g, el.bio);
                return temp;
            }).join('');
            res.send(`<div>${output}</div>`)
        }
    }
}

exports.get_my_following = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;
            const response = await get_my_following(username);
            const following = response.recordset;

            const temp_follower = fs.readFileSync('templates/my_following.html', 'utf-8');

            const output = following.map(el => {
                let temp = temp_follower.replace(/{%f_id%}/g, el.user_name);
                temp = temp.replace(/{%f_name%}/g, el.f_name);
                temp = temp.replace(/{%l_name%}/g, el.l_name);
                temp = temp.replace(/{%bio%}/g, el.bio);
                return temp;
            }).join('');
            //console.log(output);
            res.send(`<div>${output}</div>`)
        }
    }
}

exports.get_my_follow_req = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 0){
        res.sendStatus(403);
    } else {
        if (sessions.length !== 0) {
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            const response = await get_my_follow_requests(username);
            const followers = response.recordset;

            const temp_follower = fs.readFileSync('templates/follow_req.html', 'utf-8');

            const output = followers.map(el => {
                let temp = temp_follower.replace(/{%f_id%}/g, el.user_name);
                temp = temp.replace(/{%f_name%}/g, el.f_name);
                temp = temp.replace(/{%l_name%}/g, el.l_name);
                temp = temp.replace(/{%bio%}/g, el.bio);
                return temp;
            }).join('');
            res.send(`<div>${output}</div>`)
        }
    }
}

