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

exports.authenticate_user = async (user_name, password) => {
    try {
        await connect();
        const query = `select *
                       from Blog_user
                       where (user_name = '${user_name}' and password = '${password}')`;
        const authorized = await sql.query(query);
        return authorized.recordset[0] ? 1 : 0;
    } catch (err){
        console.log(err);
    }
}

exports.register_new_user = async (user_name, password, f_name, l_name, date_of_birth, gender, bio) => {
    try {
        await connect();
        const res = await sql.query(`
                    BEGIN TRY
                        insert into Blog_user
                        values ('${user_name}',
                                '${f_name}',
                                '${l_name}',
                                '${date_of_birth}',
                                '${gender}', '${bio}',
                                '${password}'
                                )
                    END TRY 
                    BEGIN CATCH  
                        select ERROR_NUMBER() AS ErrorNumber    
                    END CATCH
        `);
        if(res.recordset){
            return res.recordset[0].ErrorNumber;
        } else {
            return 0;
        }
    } catch (err){
        console.log(err);
    }
}

// exports.update_user = async (user_name, password, f_name, l_name, date_of_birth, gender, bio) => {
//     try {
//         await connect();
//         await sql.query(`
//             update Blog_user
//             set
//                 f_name = '${f_name}',
//                 l_name= '${l_name}',
//                 date_of_birth = '${date_of_birth}',
//                 gender = '${gender}',
//                 bio = '${bio}',
//                 password = '${password}'
//             where (user_name = '${user_name}')`);
//     } catch (err){
//         console.log(err);
//     }
// }

exports.del_user = async (user_name) => {
    try {
        await connect();
        await sql.query(`delete from Blog_user where(user_name = '${user_name}')`);
    } catch (err){
        console.log(err);
    }
}

// exports.get_all_users = async () => {
//     try {
//         await connect();
//         return await sql.query(`select user_name, f_name, l_name, gender, date_of_birth , bio from Blog_user`);
//     } catch (err){
//         console.log(err);
//     }
// }

exports.query_users_by_name = async (first_name) => {
    try {
        await connect();
        return await sql.query(`select user_name, f_name, l_name, bio from Blog_user where (f_name = '${first_name}')`);
    } catch (err){
        console.log(err);
    }
}


exports.get_user = async (username) => {
    try {
        await connect();
        return await sql.query(`select user_name, f_name, l_name, gender, date_of_birth , bio from Blog_user where (user_name = '${username}')`);
    } catch (err){
        console.log(err);
    }
}

exports.get_username_by_post = async (post_id) => {
    try {
        await connect();
        return await sql.query(`select Post.user_name from Post where (Post.p_id = '${post_id}')`);
    } catch (err){
        console.log(err);
    }
}

exports.update_name = async (username ,first_name, last_name) => {
    try {
        await connect();
        return await sql.query(`update Blog_user set f_name = '${first_name}', l_name = '${last_name}' where user_name = '${username}'`);
    } catch (err){
        console.log(err);
    }
}


exports.update_pass = async (username ,new_password) => {
    try {
        await connect();
        return await sql.query(`update Blog_user set password = '${new_password}' where user_name = '${username}'`);
    } catch (err){
        console.log(err);
    }
}


exports.update_bio = async (username ,new_bio) => {
    try {
        await connect();
        return await sql.query(`update Blog_user set bio = '${new_bio}' where user_name = '${username}'`);
    } catch (err){
        console.log(err);
    }
}

exports.get_bio = async (username) => {
    try {
        await connect();
        return await sql.query(`select bio from Blog_user where user_name = '${username}'`);
    } catch (err){
        console.log(err);
    }
}


