const {register_new_user} = require("./db_managers/register");
const fs = require("fs");

exports.get_signup_page = async (req, res, next) => {
    res.sendFile(__dirname +'/templates/signUp.html');
}
exports.register_new =  async (req, res, next) => {
    // const username = req.body.username;
    // const password = req.body.password;
    // const first_name = req.body.first_name;
    // const last_name = req.body.last_name;
    // const date_of_birth = req.body.date_of_birth
    // const gender = req.body.gender

    const{username, password, first_name, last_name, date_of_birth, gender} = req.body;
    console.log(username);
    try{
        const result = await register_new_user(username,password,first_name,last_name,date_of_birth,gender);
        if(result === 2627){
            res.send(JSON.stringify({
                err:2627,
                message: "Username is already taken"
            }
            ));
        } else if (result === 0) {
            console.log("User entered");
            const signUp_successful_card = fs.readFileSync('templates/signUp_successful_card.html', 'utf-8');
            console.log(signUp_successful_card);

            res.send(JSON.stringify({
                    err:0,
                    message: signUp_successful_card
                }
            ));
        }
    } catch (err){
        console.log(err)
    }

    next();
}

