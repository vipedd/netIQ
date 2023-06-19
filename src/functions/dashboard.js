import axios from 'axios'
import { debounce } from 'lodash'

const debounceDelay = 500; // Wait for 500ms after user stops typing

//List of delegation of the user logedin, startIndex to charge the next 25 delegations in the database
const dashboardInfo = debounce(async (token, state) => {
    let dashboardInfo = await axios
        .get(`/IDMProv/rest/access/dashboard?isNewlyAssignedCount=false`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    state(dashboardInfo.data);
}, debounceDelay);


const userInfo = debounce(async (token, state) => {
    let userInfo = await axios
        .get(`/IDMProv/rest/access/users/userDefaults`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    state(userInfo.data);
}, debounceDelay);


export {
    dashboardInfo,
    userInfo
}