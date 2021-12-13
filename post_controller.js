const fs = require("fs");
const Crypto = require('crypto')


const {verify_session, get_sessions} = require("./user_sessions");
const {create_new_post, del_post, update_post} = require("./db_managers/post");
const {add_new_comment, get_all_comments, del_comment} = require("./db_managers/comment");
const {add_new_like, del_like} = require("./db_managers/like");


exports.create_post = async (req, res, next) =>{
    const sessions = get_sessions();

    if(await verify_session(req.body.key) === 1){
        const post_id = Crypto.randomBytes(10).toString('base64').slice(0, 10);

        // Find data relevant to user and post
        const user_session = await sessions.find(el => el.key === req.body.key);
        const username = await user_session.username;
        const post_title = req.body.p_title
        const post_content = req.body.p_content;
        await create_new_post(post_id, username, post_title, post_content)
        res.sendStatus(201);

    } else {
        res.sendStatus(403);
    }
}

exports.delete_my_post = async (req, res, next) => {

    if(await verify_session(req.body.key) === 1){
        const post_id = req.body.post_id;
        await del_post(post_id)
        res.sendStatus(200);

    } else {
        res.sendStatus(403);
    }
}

exports.update_my_post = async (req, res, next) => {

    if(await verify_session(req.body.key) === 1){
        const post_id = req.body.post_id;
        const new_post_title = req.body.new_post_title;
        const new_post_content = req.body.new_post_content;

        await update_post(post_id, new_post_title, new_post_content);
        res.sendStatus(200);

    } else {
        res.sendStatus(403);
    }
}



////////////////////////////////  Comments  ///////////////////////////////////
exports.get_all_comments = async (req, res, next) => {
    if(await verify_session(req.body.key) === 1){
        const post_id = req.body.post_id;
        const record = await get_all_comments(post_id);
        const comments = record.recordset;
        const tempComment = fs.readFileSync('templates/comment.html', 'utf-8');

        const output = comments.map(el => {
            let temp = tempComment.replace(/{%commentator_name%}/g, el.f_name);
            temp = temp.replace(/{%comment_content%}/g, el.c_content);
            return temp;
        }).join('');
        res.send(`<div><button style ="margin-left: 2rem" id="get_timeline" style="margin-bottom: 1em" class="ui basic black button">Back</button>${output}</div>`);
    } else {
        res.sendStatus(403);
    }
}

exports.add_comment = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 1){
        const post_id = req.body.post_id;
        const c_content = req.body.c_content;

        const user_session = await sessions.find(el => el.key === req.body.key);
        const username = await user_session.username;
        const c_id = Crypto.randomBytes(10).toString('base64').slice(0, 10);
        await add_new_comment(c_id, username, post_id, c_content );
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
}


exports.add_like = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 1){
        const post_id = req.body.post_id;

        const user_session = await sessions.find(el => el.key === req.body.key);
        const username = await user_session.username;
        await add_new_like(username, post_id);
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
}



exports.remove_like = async (req, res, next) => {
    const sessions = get_sessions();
    if(await verify_session(req.body.key) === 1){
        const post_id = req.body.post_id;

        const user_session = await sessions.find(el => el.key === req.body.key);
        const username = await user_session.username;
        await del_like(username, post_id);
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
}


