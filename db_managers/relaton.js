const sql = require('mssql');
const sqlConfig = require('../db_conf').sqlConfig;

const connect = async () => {
    try{
        await sql.connect(sqlConfig);
        await sql.query`use Blogs`;
    } catch (err){
        console.log(err);
    }
}

exports.get_my_followers = async (user_name) => {
    try {
        await connect();
        // return await sql.query(`select r_follower, f_name, user_name from relation, Blog_user where(r_following = '${user_name}' and Blog_user.user_name = r_following and r_accepted = 'Y')`);
        return await sql.query(`select r_follower, f_name, l_name, bio, user_name from relation, Blog_user 
                                    where (r_following = '${user_name}' and r_accepted = 'Y' and Blog_user.user_name = r_follower)`);
    } catch (err){
        console.log(err);
    }
}

exports.get_my_followers_count = async (username) => {
    try {
        await connect();
        return await sql.query(`select count(r_follower) as follower_count from Relation where(r_following = '${username}' and r_accepted = 'Y')`);
    } catch (err){
        console.log(err);
    }
}

exports.check_if_followed = async (r_follower, r_following) => {
    try {
        await connect();
        const res = await sql.query(`select * from relation where(r_following = '${r_following}' and r_follower = '${r_follower}' and r_accepted = 'Y')`);
        return res.recordset[0] ? 1 : 0;
    } catch (err){
        console.log(err);
    }
}

exports.check_if_req_sent = async (r_follower, r_following) => {
    try {
        await connect();
        const res = await sql.query(`select * from relation where(r_following = '${r_following}' and r_follower = '${r_follower}' and r_accepted = 'N')`);
        return res.recordset[0] ? 1 : 0;
    } catch (err){
        console.log(err);
    }
}

exports.get_my_follow_requests = async (user_name) => {
    try {
        await connect();
        return await sql.query(`select r_follower, f_name, l_name, bio, user_name from relation, Blog_user 
                                    where (r_following = '${user_name}' and r_accepted = 'N' and Blog_user.user_name = r_follower)`);
    } catch (err){
        console.log(err);
    }
}

exports.get_my_following = async (user_name) => {
    try {
        await connect();
        return await sql.query(`select r_following, f_name, l_name, bio, user_name from relation, Blog_user
                                where (r_follower = '${user_name}' and r_accepted = 'Y' and Blog_user.user_name = r_following)`);
    } catch (err){
        console.log(err);
    }
}

exports.get_my_following_count = async (username) => {
    try {
        await connect();
        return await sql.query(`select count(r_following) as following_count from Relation where(r_follower= '${username}' and r_accepted = 'Y')`);
    } catch (err){
        console.log(err);
    }
}

exports.request_new_relation = async (follower_user_name, following_user_name) => {
    try {
        await connect();
        await sql.query(`
            insert into relation
            values ('${follower_user_name}',
                    '${following_user_name}',
                    'N')`);
    } catch (err){
        console.log(err);
    }
}

exports.del_relation = async  (follower_user_name, following_user_name) => {
    try {
        await connect();
        await sql.query(`delete from relation where(r_follower = '${follower_user_name}' and r_following = '${following_user_name}')`);
    } catch (err){
        console.log(err);
    }
}

exports.set_approved = async (follower_user_name, following_user_name) => {
    try {
        await connect();
        await sql.query(`
            update relation
            set
                r_accepted= 'Y'
            where(r_follower = '${follower_user_name}' and r_following = '${following_user_name}')`);
    } catch (err){
        console.log(err);
    }
}