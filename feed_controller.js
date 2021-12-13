const {get_posts_for_me} = require("./db_managers/post");
const fs = require("fs");
const {replace} = require("./replace_templates/post_card_replace_template");
const {get_user} = require("./db_managers/register");
const {verify_session, get_sessions} = require("./user_sessions")
const {get_likes_count, check_if_likes, check_if_liked} = require("./db_managers/like");
exports.display_feed = async (req, res, next) =>{
    const sessions = get_sessions();

    if(await (verify_session(req.body.key) === 0)){
        res.send('<h1>Forbidden</h1>');
    } else {
        if(sessions.length !== 0){
            // Load templates
            const timeLine = fs.readFileSync('templates/timeline.html', 'utf-8');
            const tempCard = fs.readFileSync('templates/post_card.html', 'utf-8');
            let logged_in_as_info = fs.readFileSync('templates/logged_in_as_info.html', 'utf-8');
            const create_new_post = fs.readFileSync('templates/create_new_post.html', 'utf-8');

            // Find data relevant to user
            const user_session = await sessions.find(el => el.key === req.body.key);
            const username = await user_session.username;

            // Find data for posts to show
            const post_rec = await get_posts_for_me(username);
            const user_data = await get_user(username);
            const my_posts = await post_rec.recordset;

            const f_name = user_data.recordset[0].f_name;
            const l_name = user_data.recordset[0].l_name;

            // Replace logged info card
            let prepped_logged_info = logged_in_as_info.replace(/{%f_name%}/g,`${f_name}`);
            prepped_logged_info = prepped_logged_info.replace(/{%l_name%}/g,`${l_name}`);

            // Replace new post input card
            let output = timeLine.replace(/{%logged_in_as%}/g, `${prepped_logged_info}`);
            output = output.replace(/{%new_post_card%}/g, `${create_new_post}`);


            // Replace cards into feed
            if(my_posts.length !== 0){
                let cards = my_posts.map( el => replace(tempCard, el));
                let i = 0;
                for (let card of cards){
                    // Add like count to like button
                    const response = await get_likes_count(my_posts[i].p_id);
                    card = card.replace(/{%num_of_likes%}/g,response.recordset[0].total);

                    // Style according to if liked
                    if(await check_if_liked(username,my_posts[i].p_id) === 1){
                        card = card.replace(/{%like_label%}/g,'Liked');
                        card = card.replace(/{%like_id%}/g,'remove_like');
                        card = card.replace(/{%like_style%}/g,'');
                    } else {
                        card = card.replace(/{%like_label%}/g,'Like');
                        card = card.replace(/{%like_id%}/g,'add_like');
                        card = card.replace(/{%like_style%}/g,'basic');
                    }
                    cards[i] = card;
                    i++;
                }
                cards = cards.join('');
                output = output.replace(/{%Post_cards%}/g, `${cards}`);
            } else {
                output = output.replace(/{%Post_cards%}/g, "<h3>You have no posts available</h3>");
            }
            // Send final feed
            res.send(output);
        }
    }
}