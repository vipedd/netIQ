import React, { useEffect, useState, useContext } from "react";
import { historyRequest, usrRequest } from '../../functions/history';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faExclamationTriangle, faCheckCircle, faTimesCircle, faSpinner, faExclamationCircle, faPlusCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TokenContext from "../../functions/TokenContext";
import "./HistoryRequests.css";
import Header from "../Header/Header";



const HistoryRequests = () => {
    const { tokens } = useContext(TokenContext);
    const [buttonFor, setButtonFor] = useState("myself");

    // List of my history request
    const [myHistoryReq, setMyHistoryReq] = useState(null);
    // Filter to display a specific type of request
    const [myHistoryFilter, setMyHistoryFilter] = useState('*');

    // List of users to fetch theyre history request
    const [usr, setUsr] = useState(null);
    // Selected user from the list 
    const [usrFilter, setUsrFilter] = useState(null);
    // Filter to fetch the history request list of the user selected
    const [usrID, setUserID] = useState('');

    // Filter to fetch the history list of someone else 
    const [typeFilter, setTypeFilter] = useState(null);
    // History list of the filter selected
    const [historyForUsr, setHistoryForUsr] = useState(null);


    useEffect(() => {
        // Fetch my history request list 
        historyRequest(myHistoryFilter, tokens.access_token, setMyHistoryReq)
    }, [myHistoryFilter, tokens.access_token,])

    useEffect(() => {
        // Fetch the list of users to fetch their history request
        usrRequest(usrFilter, tokens.access_token, setUsr)
    }, [usrFilter, tokens.access_token,])


    const handleMyReqClick = (req) => {
        // When a request is clicked open a popup window with certain information
        const popup = window.open("", "Popup", "width=400, height=700");
        // Ensure the popup window was opened correctly
        if (popup) {
            // Calculate the width and height of the screen and the popup window
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const popupWidth = 400;
            const popupHeight = 700;

            // Divide by two to finde the center of the screen
            const left = (screenWidth - popupWidth) / 2;
            const top = (screenHeight - popupHeight) / 2;

            // Move the popup window to the desired position
            popup.moveTo(left, top);
        }

        // Fetch the information of the request
        fetch('https://172.31.4.88:8543/IDMProv/rest/access/requests/history/item?includeSystemComments=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokens.access_token,
            },
            // Setting the request id and entity type to fetch the info
            body: JSON.stringify({
                'id': req.id,
                'entityType': req.entityType
            })
        })
            .then(res => res.json())
            .then(result => {
                // Access the name and status properties of the result object
                const name = result.name
                const recipient = result.recipientName
                const reqBy = result.requesterName
                const reqDate = result.requestDate
                const effDate = result.effectiveDate
                const confNum = result.confirmationNumber
                const comments = result.comments

                // Insert the name and status into the HTML content of the popup window
                popup.document.body.innerHTML = `
                    <h2 style="color: blue"><strong>${name}</strong></h2>
                    <p><strong>Status</strong> ${req.status}</p>
                    <p><strong>Recipient</strong> ${recipient}</p>
                    <p><strong>Requested by</strong> ${reqBy}</p>
                    <p><strong>Request Date</strong> ${new Date(reqDate).toDateString()}</p>
                    <p><strong>Effective Date</strong> ${new Date(effDate).toDateString()}</p>
                    <p><strong>Reason</strong> ${req.reason}</p>
                    <p><strong>Confirmation Number</strong> ${confNum}</p>
                    <br></br>
                    <p style="color: blue">Comments</p>
                    ${comments && comments.length > 0 ? comments.map(comment => `
                        <p><i>${new Date(comment.date).toLocaleString()}</i><br>
                        Comment from <strong>${comment.user}</strong>                      
                        <strong>${comment.commentFullName}</strong><br>                      
                        ${comment.comment}<br>
                        <strong>Activity: </strong>${comment.activity}<br></p>`).join('') : 'No comments'}`
            })
            .catch(error => error)
    }

    // User selesected to fetch its history request
    const [selectedUser, setSelectedUser] = useState(null);
    const handleUserClick = (user) => {
        // Fetch the history request list of the user selected by attaching the dn of the user selected in the fetch call
        setSelectedUser(user);
        setUserID(user.dn);

        fetch(`https://172.31.4.88:8543/IDMProv/rest/access/requests/historyForUser?nextIndex=1&size=100&q=*&sortOrder=desc&sortBy=requestDate&item=*&type=*&status=*&cn=*&startDate=0&endDate=0&action=*`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokens.access_token,
            },
            body: JSON.stringify({
                'dn': user.dn
            })
        })
            .then(res => res.json())
            .then(data => {
                setHistoryForUsr(data.requests)
            })
            .catch(error => console.error(error))
    }

    const handleTypeFilter = (typeFilter) => {
        // Fetch the history request list of the user selected when the type filter changes
        fetch(`https://172.31.4.88:8543/IDMProv/rest/access/requests/historyForUser?nextIndex=1&size=25&q=*&sortOrder=desc&sortBy=requestDate&item=*&type=${typeFilter}&status=*&cn=*&startDate=0&endDate=0&action=*`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokens.access_token,
            },
            body: JSON.stringify({
                'dn': usrID
            })
        })
            .then(res => res.json())
            .then(data => {
                setHistoryForUsr(data.requests)
            })
            .catch(error => console.error(error))
    }

    // Popup window with the information of the request out of the history request list of the user selected
    const handleOtherReqClick = (req) => {
        const popup = window.open("", "Popup", "width=400, height=700");
        // Ensuring the popup window opened correcty and setting its height, width and position
        if (popup) {
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const popupWidth = 400;
            const popupHeight = 700;

            const left = (screenWidth - popupWidth) / 2;
            const top = (screenHeight - popupHeight) / 2;

            popup.moveTo(left, top);
        }
        // Fetching the specific data of the request clicked
        fetch('https://172.31.4.88:8543/IDMProv/rest/access/requests/history/item?includeSystemComments=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokens.access_token,
            },
            body: JSON.stringify({
                'id': req.id,
                'entityType': req.entityType
            })
        })
            .then(res => res.json())
            .then(result => {
                // Access the name and status properties of the result object
                const name = result.name
                const recipient = result.recipientName
                const reqBy = result.requesterName
                const reqDate = result.requestDate
                const effDate = result.effectiveDate
                const confNum = result.confirmationNumber
                const comments = result.comments

                // Insert the name and status into the HTML content of the popup window
                popup.document.body.innerHTML = `
                    <h2 style="color: blue"><strong>${name}</strong></h2>
                    <p><strong>Status</strong> ${req.status}</p>
                    <p><strong>Recipient</strong> ${recipient}</p>
                    <p><strong>Requested by</strong> ${reqBy}</p>
                    <p><strong>Request Date</strong> ${new Date(reqDate).toDateString()}</p>
                    <p><strong>Effective Date</strong> ${new Date(effDate).toDateString()}</p>
                    <p><strong>Reason</strong> ${req.reason}</p>
                    <p><strong>Confirmation Number</strong> ${confNum}</p>
                    <br></br>
                    <p style="color: blue">Comments</p>
                    ${comments && comments.length > 0 ? comments.map(comment => `
                        <p><i>${new Date(comment.date).toLocaleString()}</i><br>
                        Comment from <strong>${comment.user}</strong>                      
                        <strong>${comment.commentFullName}</strong><br>                      
                        ${comment.comment}<br>
                        <strong>Activity: </strong>${comment.activity}<br></p>`).join('') : 'No comments'}`;
            })
            .catch(error => error);

    }

    const retractMyReq = (req) => {
        // DELETE call to finish a request, only processing request can be deleted
        fetch(`https://172.31.4.88:8543/IDMProv/rest/access/requests/history`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + tokens.access_token,
            },
            body: JSON.stringify({
                'requests': req
            })
        })
            .then(res => res.json())
            .catch(error => console.error(error))
    }

    // Constant and Effect to change the charging icon for text after 7 seconds meening the response array is empty  
    const [showLoadingText, setShowLoadingText] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (myHistoryReq == null || myHistoryReq.length === 0 || historyForUsr == null || historyForUsr.length === 0) {
                setShowLoadingText(true);
            }
        }, 7000);

        return () => clearTimeout(timer);
    }, [myHistoryReq, historyForUsr]);

    return (
        <>
            <Header title="History Requests" />

            <div className="request-box">
                <h4>Request for</h4>
                <button type="button" className={`btn btn-light btn-sm ${buttonFor === "myself" ? "active" : ""}`} onClick={() => setButtonFor("myself")}>Myself</button>
                <button type="button" style={{ marginLeft: "0px" }} className={`btn btn-light btn-sm ${buttonFor === "others" ? "active" : ""}`} onClick={() => setButtonFor("others")}>Others</button>
            </div>

            {buttonFor === "myself" ? (
                <>
                    <div className="hist-req-box" >
                        <div>
                            <FontAwesomeIcon icon={faFilter} style={{ marginRight: '10px', align: 'left', color: '#587df8' }} />
                            <select style={{ marginRight: '30px' }} value={myHistoryFilter} onChange={e => setMyHistoryFilter(e.target.value)}>
                                <option value="*">All</option>
                                <option value="role">Role</option>
                                <option value="prd">PRD</option>
                                <option value="resource">Resource</option>
                            </select>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Request</th>
                                    <th>Patition Date</th>
                                    <th>Petition State</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {myHistoryReq != null ? (
                                <tbody>
                                    {myHistoryReq.map(req => (
                                        <tr key={req.id} className="link-item" onClick={() => handleMyReqClick(req)}>
                                            <td>
                                                <p>{req.entityType.toUpperCase()}</p>
                                            </td>
                                            <td>
                                                <p style={{
                                                    color: req.status === "Provisionado" ? "orange" :
                                                        req.status === "Approved" ? "green" :
                                                            req.status === "Retracted" ? "blue" :
                                                                req.status === "Retrayendo" ? "blue" :
                                                                    req.status === "Processing" ? "purple" :
                                                                        req.status === "Error" ? "red" :
                                                                            req.status === "Nueva petición" ? "orange" :
                                                                                req.status === "Denied" ? "black" :
                                                                                    "black"
                                                }}> {req.status === "Provisionado" && <>&nbsp;<FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: "10px" }} /></>}
                                                    {req.status === "Approved" && <>&nbsp;<FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "10px" }} /></>}
                                                    {req.status === "Processing" && <>&nbsp;<FontAwesomeIcon icon={faSpinner} style={{ marginRight: "10px" }} /></>}
                                                    {req.status === "Error" && <>&nbsp;<FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "10px" }} /></>}
                                                    {req.status === "Nueva petición" && (<>&nbsp;<FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: "10px" }} /></>)}
                                                    {req.status === "Retrayendo" && (<>&nbsp;<FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "10px" }} /></>)}
                                                    {req.status === "Retracted" && <>&nbsp;<FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "10px" }} /></>}
                                                    {req.status === "Denied" && (<>&nbsp;<FontAwesomeIcon icon={faTimesCircle} style={{ marginRight: "10px" }} /></>)}
                                                    {req.name}
                                                </p>
                                            </td>
                                            <td>
                                                <p>{new Date(req.requestDate).toLocaleString()}</p>
                                            </td>
                                            <td>
                                                <p style={{
                                                    color: req.status === "Provisionado" ? "orange" :
                                                        req.status === "Approved" ? "green" :
                                                            req.status === "Retracted" ? "blue" :
                                                                req.status === "Retrayendo" ? "blue" :
                                                                    req.status === "Processing" ? "purple" :
                                                                        req.status === "Error" ? "red" :
                                                                            req.status === "Nueva petición" ? "orange" :
                                                                                req.status === "Denied" ? "black" :
                                                                                    "black"
                                                }}>
                                                    {req.status}
                                                </p>
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <button style={{ fontSize: '12px', padding: '3px 7px', borderRadius: '5px' }} onClick={() => retractMyReq(req)} disabled={req.status !== "Processing"}>RETRACT</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                showLoadingText ? (
                                    <tbody >
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                                <p>No request found</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody >
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                                <FontAwesomeIcon icon={faSpinner} spin size="1x" style={{ marginRight: '10px' }} />
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            )}
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <div className="destination-box">
                        <h4>Search User: </h4>
                        <input
                            required
                            type="text"
                            placeholder="Search in users by First Name, Last Name"
                            value={usrFilter}
                            onChange={e => setUsrFilter(e.target.value)}>
                        </input>
                    </div>
                    {usr != null ? (
                        <div className="hist-req-box" >
                            <div style={{ textAlign: 'left' }}>
                                <ul>
                                    {usr.map(user => (
                                        <li key={user.id} onClick={() => handleUserClick(user)} style={{ fontWeight: selectedUser === user ? 'bold' : 'normal' }}>
                                            {user.fullName}
                                        </li>
                                    ))}
                                </ul>

                                <FontAwesomeIcon icon={faFilter} style={{ marginRight: '20px', color: '#587df8' }} />
                                <select value={typeFilter} onClick={e => handleTypeFilter(e.target.value)}>
                                    <option value="*">All</option>
                                    <option value="role">Role</option>
                                    <option value="prd">PRD</option>
                                    <option value="resource">Resource</option>
                                </select>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Request</th>
                                        <th>Petition Date</th>
                                        <th>Petition State</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                {historyForUsr != null ? (
                                    <tbody>
                                        {historyForUsr.map(req => (
                                            <tr key={req.id} onClick={() => handleOtherReqClick(req)}>
                                                <td>
                                                    <p>{req.entityType.toUpperCase()}</p>
                                                </td>
                                                <td>
                                                    <p style={{
                                                        color: req.status === "Provisionado" ? "orange" :
                                                            req.status === "Approved" ? "green" :
                                                                req.status === "Retracted" ? "blue" :
                                                                    req.status === "Retrayendo" ? "blue" :
                                                                        req.status === "Processing" ? "purple" :
                                                                            req.status === "Error" ? "red" :
                                                                                req.status === "Nueva petición" ? "orange" :
                                                                                    req.status === "Denied" ? "black" :
                                                                                        "black"
                                                    }}>
                                                        {req.status === "Provisionado" && <>&nbsp;<FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: "10px" }} /></>}
                                                        {req.status === "Approved" && <>&nbsp;<FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "10px" }} /></>}
                                                        {req.status === "Retracted" && <>&nbsp;<FontAwesomeIcon icon={faTimesCircle} style={{ marginRight: "10px" }} /></>}
                                                        {req.status === "Processing" && <>&nbsp;<FontAwesomeIcon icon={faSpinner} style={{ marginRight: "10px" }} /></>}
                                                        {req.status === "Error" && <>&nbsp;<FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: "10px" }} /></>}
                                                        {req.status === "Nueva petición" && (<>&nbsp;<FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: "10px" }} /></>)}
                                                        {req.status === "Retrayendo" && (<>&nbsp;<FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "10px" }} /></>)}
                                                        {req.status === "Denied" && (<>&nbsp;<FontAwesomeIcon icon={faTimesCircle} style={{ marginRight: "10px" }} /></>)}
                                                        {req.name}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p>{new Date(req.requestDate).toLocaleString()}</p>
                                                </td>
                                                <td>
                                                    <p style={{
                                                        color: req.status === "Provisionado" ? "orange" :
                                                            req.status === "Approved" ? "green" :
                                                                req.status === "Retracted" ? "blue" :
                                                                    req.status === "Processing" ? "purple" :
                                                                        req.status === "Error" ? "red" :
                                                                            req.status === "Nueva petición" ? "orange" :
                                                                                req.status === "Retrayendo" ? "blue" :
                                                                                    req.status === "Denied" ? "black"
                                                                                        : "black"
                                                    }}>
                                                        {req.status}

                                                    </p>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()}>
                                                    <button style={{ fontSize: '12px', padding: '3px 7px' }} onClick={() => retractMyReq(req)} disabled={req.status !== "Processing"}>RETRACT</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    showLoadingText ? (
                                        <tbody >
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                                    <p>No request found</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ) : (
                                        <tbody >
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                                    <FontAwesomeIcon icon={faSpinner} spin size="1x" style={{ marginRight: '10px' }} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                )}
                            </table>
                        </div>
                    ) : (
                        ''
                    )}
                </>
            )
            }
        </>
    )
}

export default HistoryRequests