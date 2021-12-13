const sessions = [];

exports.create_new_session = (username, key) =>{
    sessions.push({username, key})
}
exports.get_sessions = () => {
    return sessions;
}
exports.verify_session = async (key) => {
    let found = 0
    sessions.forEach((el)=>{
        if(key === el.key){
            found = 1
        }
    })
    return found;
}