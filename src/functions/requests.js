import axios from 'axios'
import { debounce } from 'lodash'

const debounceDelay = 500; // Wait for 500ms after user stops typing


// List of all the permission available to the user who wants to make a request
const allPermissions = debounce(async(permissionFilter, token, state) => {    
    
    let permissionsList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/permissions?q=${permissionFilter}&size=50&nextIndex=1&sortByName=false&column=name&column=description&column=categories&type=PRD`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });   
    state(permissionsList.data.permissions);
    
}, debounceDelay);


// List of users who you want to make a request to
const requestUsers = debounce(async(usersFilter, token, state) => {    
    //tokenData = await GetTokens() 
    let usersList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/teams/recipients/userlist/v2?client=1&q=${usersFilter}&size=50`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });      
    
    state(usersList.data.recipients);
}, debounceDelay);


// List of groups who you want to make a request to
const requestGroups = debounce(async(groupsFilter, token, state) => {    
    let groupsList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/teams/recipients/groups?q=${groupsFilter}&size=50`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });      
    
    state(groupsList.data.recipients);
}, debounceDelay);


// List of teams who you want to make a request to
const requestTeams = debounce(async(teamsFilter, token, state) => {    
    //tokenData = await GetTokens() 
    let teamsList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/teams/managelist?q=${teamsFilter}&size=50&nextIndex=1&sortOrder=asc&forceRefresh=false`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });      
    
    state(teamsList.data.recipients);
}, debounceDelay);


export {
    allPermissions,
    requestTeams,
    requestGroups, 
    requestUsers
}

