import {get_home_page} from "./data_fetchers.js";

const load_main = async () => {
    localStorage.clear();
    get_home_page();
}

load_main();



// REMAINING FOR NOW
// Implement
// 1 ==>  Read more
// 2 ==>  Visit profile
// 3 ==>  Menu Card Functionalities
// 4 ==> Think of new URL for controller > change_name and manage routes in backend too