import axios from 'axios'
import { debounce } from 'lodash'

const debounceDelay = 500; // Wait for 500ms after user stops typing


// List of tasks of the user loged in
const myTasks = debounce(async(myTaskFilter, startIndex, token, state) => {    
    let myTaskList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/tasks/list?fromIndex=${startIndex}&q=${myTaskFilter}&sortOrder=desc&sortBy=createTime&assignedTo=assignedTo&recipient=recipientAsMe&proxyUser=&delegatedTasks=false&onlyHelpdeskTasks=false&assignStatus=&size=25&expireUnit=weeks&expireWithin=&status=`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });   
    state(myTaskList.data.tasks);
    
}, debounceDelay);


// List of task of a especific user you have selected previously
const otherTasks = debounce(async(otherTasksFilter, startIndex, token, state) => { 
    let otherTaskList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/tasks/list/others?fromIndex=${startIndex}&q=${otherTasksFilter}&sortOrder=desc&sortBy=createTime&assignedTo=assignedTo&recipient=recipientAsMe&proxyUser=&delegatedTasks=false&onlyHelpdeskTasks=false&assignStatus=&size=25&expireUnit=weeks&expireWithin=&status=`, {
        headers:{            
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
                }
        });   
    state(otherTaskList.data.tasks);
    
}, debounceDelay);


export {
    myTasks,
    otherTasks
}