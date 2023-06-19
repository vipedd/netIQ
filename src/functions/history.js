import axios from 'axios'
import { debounce } from 'lodash'

const debounceDelay = 500; // Wait for 500ms after user stops typing


// List of the history requests of the user loged in, possibility to apply a filter depending on the Role, PRD or Resource.
const historyRequest = debounce(async(historyFilter, token, state) => {    
    
    let historyList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/requests/historylist?nextIndex=1&size=100&q=*&sortOrder=desc&sortBy=requestDate&item=*&type=${historyFilter}&status=*&cn=*&startDate=0&endDate=0&action=*`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });      
    
    state(historyList.data.requests);
}, debounceDelay);


// List of users of who you want to see the history request list
const usrRequest = debounce(async(usrFilter, token, state) => {    
    
    let usrList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/users/list?q=${usrFilter}&size=150&nextIndex=1&searchAttr=FirstName,LastName,FullName`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });      
    
    state(usrList.data.usersList);
}, debounceDelay);

export {
    historyRequest,
    usrRequest
}