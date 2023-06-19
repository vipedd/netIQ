import axios from 'axios';
import { debounce } from 'lodash';


const debounceDelay = 500; // Wait for 500ms after user stops typing

// List of all the users available in the organization, you have a filter to search for a especific user
const allUsers = debounce(async (startIndex, filter, token, state) => {
    const usersList = await axios
        .get(`/IDMProv/rest/access/users/list?q=${filter}&clientId=1&nextIndex=${startIndex}&size=25&sortOrder=asc&sortBy=&searchAttr=FirstName,LastName,Email&advSearch=`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    state(usersList.data.usersList);
}, debounceDelay);

const numUsers = debounce(async (token, state) => {
    const usersList = await axios
        .get(`/IDMProv/rest/access/counts?users=true&clientId=1`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    state(usersList.data.usersCount);
}, debounceDelay);


// Details of the user selected from the allUsers function display
const oneUser = debounce(async (dn, token, state) => {
    const userInfo = await axios.get(`/IDMProv/rest/access/users/details?userDn=${dn}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    state(userInfo.data);
},debounceDelay);


// Organization chart of all the user selected from the allUsers function display
const getOrg = debounce(async (dn, token, state) => {
    const org = await axios.get(`/IDMProv/rest/access/orgChart/v2?relationshipKeys=user2users&entityDN=${dn}&entityDefKey=user&clientId=1&nextIndex=1&size=25`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    state(org.data);
},debounceDelay);


// Button to see the parent of the member selected from the organization chart component
const viewOrgRelationship = debounce(async (dn, token, state) => {
    const org = await axios.get(`/IDMProv/rest/access/orgChart/target/list?dn=${dn}&relationshipkey=user2users&clientId=1`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    state(org.data);
}, debounceDelay);

export {
    allUsers,
    numUsers,
    oneUser,
    getOrg,
    viewOrgRelationship
}