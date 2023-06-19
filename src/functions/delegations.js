import axios from 'axios'
import { debounce } from 'lodash'

const debounceDelay = 500; // Wait for 500ms after user stops typing

//List of delegation of the user logedin, startIndex to charge the next 25 delegations in the database
const myDelegationList = debounce(async (token, startIndex, state) => {
    let myDelegationList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/delegation?nextIndex=${startIndex}&q=&sortOrder=asc&sortBy=name&size=25`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    state(myDelegationList.data.delegations);
}, debounceDelay);


//List of users depending on the usrFilter
const usrList = debounce(async (usrFilter, token, state) => {
    let usrList = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/users/list?q=${usrFilter}&size=150&nextIndex=1&searchAttr=FirstName,LastName`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    state(usrList.data.usersList);
}, debounceDelay);


//List of delegations of the user selected from the previous function
const otherDelegationList = debounce(async (userDN, token, state) => {
    let otherDelList = await axios
        .post(`https://172.31.4.88:8543/IDMProv/rest/access/delegation/list?size=150`,
            {
                dn: `${userDN}`
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    state(otherDelList.data.delegations);
}, debounceDelay);


//List of reletionship who to delegate to
const delegationRelationship = debounce(async (token, state) => {
    let delRelation = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/delegation/relationships`, {

            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    state(delRelation.data.relationships);
}, debounceDelay);


//List of all the categories containign the different delegations
const delegationCategories = debounce(async (token, state) => {
    let delCategories = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/delegation/category`, {

            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    state(delCategories.data.categoryList);
}, debounceDelay);


//List of delegations out of the category selected
const requestDelegationCategories = debounce(async (filter, token, state) => {
    let delCategories = await axios
        .get(`https://172.31.4.88:8543/IDMProv/rest/access/delegation/requests?category=${filter}`, {

            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    state(delCategories.data.provisioningRequests);
}, debounceDelay);


// Save the delegation created base on a user in the database of the API
const postDelegation = debounce(async (requestAll, delegate4, delegate2, expirationDate, selectedCategories, token, state) => {
    let otherDelList = await axios
        .post(`https://172.31.4.88:8543/IDMProv/rest/access/delegation
        `,
            {
                allRequests: requestAll,
                assignFromUsers: delegate4,
                assignToUsers: delegate2,
                assignmentId: "apwaNewDetailId",
                createAvailability: false,
                ...expirationDate ? { expiryDate: expirationDate } : {},
                isExpires: expirationDate === null, //Si expirationDate==null => isExpire
                isNotificationRequired: "false",
                requestDefs: selectedCategories,
                type: "DELEGATEE_TYPE"

            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    state(otherDelList.data.delegations);
}, debounceDelay);


// Save the delegation created based on the relationship in the database of the API
const postRelationship = debounce(async (requestAll, delegate4, delegate2, expirationDate, selectedCategories, token, state) => {
    let otherDelList = await axios
        .post(`https://172.31.4.88:8543/IDMProv/rest/access/delegation
        `,
            {
                allRequests: requestAll,
                assignFromUsers: delegate4,
                assignToRelationship: delegate2,
                assignmentId: "apwaNewDetailId",
                createAvailability: false,
                ...expirationDate ? { expiryDate: expirationDate } : {},
                isExpires: expirationDate === null, //Si expirationDate==null => isExpire
                isNotificationRequired: "false",
                requestDefs: selectedCategories,
                type: "DELEGATEE_TYPE"

            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    state(otherDelList.data.delegations);
}, debounceDelay);


export {
    myDelegationList,
    usrList,
    otherDelegationList,
    delegationRelationship,
    delegationCategories,
    requestDelegationCategories,
    postDelegation,
    postRelationship
}
