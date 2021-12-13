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

exports.update_comment = async (c_id,c_content) => {
    try {
        await connect();
        await sql.query(`
            update comment
            set
                c_content= '${c_content}'
            where (c_id = '${c_id}')`);
    } catch (err){
        console.log(err);
    }
}

exports.add_new_comment = async (c_id, user_name, p_id, c_content) => {
    try {
        await connect();
        await sql.query(`
            insert into comment (c_id, c_content,user_name, p_id)
            values ('${c_id}',
                    '${c_content},',
                    '${user_name}',
                    '${p_id}')`);
    } catch (err){
        console.log(err);
    }
}

exports.del_comment = async  (c_id) => {
    try {
        await connect();
        await sql.query(`delete from comment where(c_id = '${c_id}')`);
    } catch (err){
        console.log(err);
    }
}

exports.get_all_comments = async (post_id) => {
    try{
        await connect();
        return await sql.query(`select c_id, c_content, f_name from comment, Blog_user where (Blog_user.user_name = comment.user_name and p_id = '${post_id}')`);
    } catch (err){
        console.log(err);
    }
}
