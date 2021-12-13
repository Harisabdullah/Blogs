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

exports.add_new_like = async (user_name, p_id) => {
    try {
        await connect();
        await sql.query(`
            insert into likes (user_name, p_id)
            values ('${user_name}',
                    '${p_id}')`);
    } catch (err){
        console.log(err);
    }
}

exports.del_like = async  (user_name, p_id) => {
    try {
        await connect();
        await sql.query(`delete from likes where(p_id = '${p_id}' and user_name = '${user_name}')`);
    } catch (err){
        console.log(err);
    }
}

exports.get_likes_count = async (post_id) => {
    try {
         await connect();
         return await sql.query(`SELECT count(user_name) as total from likes where (p_id = '${post_id}')`);

    } catch (err){
        console.log(err);
    }
}

exports.check_if_liked = async (user_name, post_id) => {
    try {
        await connect();
        const res = await sql.query(`select * from likes where(p_id = '${post_id}' and user_name = '${user_name}')`);
        return res.recordset[0] ? 1 : 0;
    } catch (err){
        console.log(err);
    }
}
