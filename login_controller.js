const {authenticate_user, get_all_users} = require("./db_managers/register");
const path = require("path");
const fs = require("fs");
const {get_all_posts} = require("./db_managers/post");
const {displayTimeLine} = require("./feed_controller");
const Crypto = require('crypto')

const {create_new_session, get_sessions} = require("./user_sessions")

exports.login = async (req, res,next) => {
    //console.log(req.body);
    if(await authenticate_user(req.body.username, req.body.password)){
        const key = Crypto.randomBytes(50).toString('base64').slice(0, 50);
        const sessions = get_sessions();
        let already_present = false;
        sessions.forEach(el => {
            if(el.key ===  req.body.key){
                already_present = true;
                res.status(200);
                res.end(JSON.stringify({key:el.key}))
            }
        })
        if(!already_present){
            create_new_session(req.body.username, key);
            res.status(200);
            res.end(JSON.stringify({key:key}));
        }
    } else {
        res.status(200);
        res.end(JSON.stringify({key:0}))
    }
}

