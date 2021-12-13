const {count_like} = require("../db_managers/like");
exports.replace = (temp, post) => {
  let prepped_card = temp.replace(/{%p_title%}/g, `${post.p_title}`);
  prepped_card = prepped_card.replace(/{%f_name%}/g, `${post.f_name}`);

  let date = JSON.stringify(post.p_timestamp);
  date = date.slice(1, 11);



  prepped_card = prepped_card.replace(/{%p_date%}/g, `${date}`);
  prepped_card = prepped_card.replace(/{%p_content%}/g, `${post.p_content}`);
  prepped_card = prepped_card.replace(/{%p_id%}/g, `${post.p_id}`);
  return prepped_card;
}