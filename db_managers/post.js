const sql = require('mssql');
const {use} = require("express/lib/router");
const sqlConfig = require('../db_conf').sqlConfig;

const connect = async () => {
    try{
        await sql.connect(sqlConfig);
        await sql.query`use Blogs`;
    } catch (err){
        console.log(err);
    }
}

exports.update_post = async (p_id, p_title, p_content) => {
    try {
        await connect();
        await sql.query(`
            update Post
            set 
                p_title= '${p_title}',
                p_content = '${p_content}'
            where (p_id = '${p_id}')`);
    } catch (err){
        console.log(err);
    }
}

exports.create_new_post = async (p_id, user_name, p_title, p_content) => {
    try {
        await connect();
        await sql.query(`
            insert into Post (p_id, user_name, p_title, p_content)
            values ('${p_id}',
                    '${user_name}',
                    '${p_title}',
                    '${p_content}')`);
    } catch (err){
        console.log(err);
    }
}

exports.get_all_posts = async () => {
    try {
        await connect();
        return await sql.query(`select * from Post`);
    } catch (err){
        console.log(err);
    }
}

exports.get_my_posts = async (username) => {
    try {
        await connect();
        return await sql.query(`select * from Post where (user_name='${username}')`);
    } catch (err){
        console.log(err);
    }
}

exports.get_posts_for_me = async (username) => {
    try {
        await connect();
        return await sql.query(`select * from Post, Blog_user where post.user_name in 
                                    (select r_following from Relation 
                                    where(r_follower = '${username}' and r_accepted = 'Y') and 
                                          Post.user_name = Blog_user.user_name)`);
    } catch (err){
        console.log(err);
    }
}

exports.get_post = async (p_id) => {
    try {
        await connect();
        return await sql.query(`select * from Post where (p_id = '${p_id}')`);
    } catch (err){
        console.log(err);
    }
}

exports.del_post = async  (p_id) => {
    try {
        await connect();
        return await sql.query(`delete from Post where(p_id = '${p_id}')`);
    } catch (err){
        console.log(err);
    }
}




