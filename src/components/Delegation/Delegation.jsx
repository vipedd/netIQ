import React, { useEffect, useState, useContext } from "react";
import { myDelegationList, otherDelegationList, usrList } from "../../functions/delegations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import TokenContext from "../../functions/TokenContext";
import { useNavigate } from "react-router-dom";
import "./Delegation.css";
import Header from "../Header/Header";

const Delegation = () => {
    // Access the navigation functionality
    const navigate = useNavigate();

    // Access token context
    const { tokens } = useContext(TokenContext);

    // List of my delegations
    const [myDelegations, setMyDelegations] = useState([]);

    // List of usrs to be selected and see its delegations
    const [userDelegations, setUserDelegations] = useState([]);
    // Filter to search for a specific user
    const [userFilter, setUserFilter] = useState("");
    // User selected
    const [destinDN, setDestinsDN] = useState();

    // List of delegations from the user selected
    const [otherDelegations, setOtherDelegations] = useState([]);
    // Boolean to decide which list of delegations display
    const [buttonFor, setButtonFor] = useState("myself");

    // Index of the delegations displayed
    const [startIndex, setStartIndex] = useState(1);


    useEffect(() => {
        // Fetch and set my delegations
        myDelegationList(tokens.access_token, startIndex, setMyDelegations);
    }, [tokens.access_token, startIndex, buttonFor]);

    useEffect(() => {
        // Fetch user to see its delegations
        if (userFilter) {
            usrList(userFilter, tokens.access_token, setUserDelegations);
        }
    }, [userFilter, tokens.access_token]);

    useEffect(() => {
        if (destinDN) {
            // Fetch the delegations list of the user selected
            otherDelegationList(destinDN, tokens.access_token, setOtherDelegations);
        }
    }, [destinDN, tokens.access_token]);


    // Handle buttons to se request the delegations desired.
    const handleAutoRequest = () => {
        setButtonFor("myself");
        setStartIndex(1);
        setUserFilter('');
    };

    const handleOtherRequest = () => {
        setButtonFor("others");
        setStartIndex(1);
    };

    // Handle buttons for moving to next page and see the remaining delegations on the queue
    const handleNextPage = () => {
        setStartIndex(startIndex + 25);
    };

    const handlePrevPage = () => {
        setStartIndex(Math.max(startIndex - 25, 1));
    };

    // Handle buttons to set the destination values for the fetch request.
    const [selectedUser, setSelectedUser] = useState(null);
    const handleDestinsClick = (user) => {
        setOtherDelegations(null);
        setDestinsDN(user.dn);
        setSelectedUser(user);
    };


    // Constant and Effect to change the charging icon for text after 7 seconds meening the response array is empty  
    const [showLoadingText, setShowLoadingText] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (myDelegations == null || myDelegations.length === 0 || otherDelegations == null || otherDelegations.length === 0) {
                setShowLoadingText(true);
            }
        }, 7000);

        return () => clearTimeout(timer);
    }, [myDelegations, otherDelegations]);

    return (
        <>
            <Header title="Delegation Assignments" />

            <div className="request-box">
                <h4>Request for</h4>
                <button type="button" className={`${buttonFor === "myself" ? "active" : ""}`} onClick={() => { setDestinsDN(""); handleAutoRequest(); }}>Myself</button>
                <button type="button" style={{ marginLeft: "0px" }} className={`${buttonFor === "others" ? "active" : ""}`} onClick={handleOtherRequest}>Others</button>
                <button type="button" style={{ marginLeft: '50px' }} onClick={() => navigate('/delegations/createDelegation')}><FontAwesomeIcon icon={faPlus} /></button>
            </div>

            {buttonFor === "myself" ? (
                <>

                    {myDelegations != null && myDelegations.length > 0 ? (
                        <>
                            <div className="task-box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Delegate For</th>
                                            <th>Delegate Assigned</th>
                                            <th>Expiration Date</th>
                                            <th>Request(s)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myDelegations.map((delegation) => (
                                            <tr key={delegation.id} >
                                                <td>
                                                    {delegation.assignFromUsers.map((user) => (
                                                        <div key={user.id} >
                                                            <p>{user.name},</p>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>
                                                    {delegation.assignToUsers != null ? (
                                                        <p>{delegation.assignToUsers[0].name}</p>
                                                    ) : (
                                                        <p>{delegation.assignToRelationship.displayName}</p>
                                                    )}
                                                </td>
                                                <td>
                                                    <p>{new Date(delegation.expiryDate).toLocaleString()}</p>
                                                </td>
                                                <td>
                                                    {delegation.requestDefs.length > 1 ? (
                                                        <p>{delegation.requestDefs[0].name}, ...</p>
                                                    ) : (
                                                        <p>{delegation.requestDefs[0].name}</p>
                                                    )}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" className="prev-next-button" onClick={handlePrevPage} disabled={startIndex <= 1}>Prev</button>
                            <button type="button" className="prev-next-button" onClick={handleNextPage} disabled={myDelegations.length < 25}>Next</button>

                        </>
                    ) : (
                        showLoadingText ? (
                            <p>No delegation found</p>
                        ) : (
                            <FontAwesomeIcon icon={faSpinner} spin size="1x" />
                        )
                    )}
                </>
            ) : (
                <>
                    <div className="destination-box">
                        <h4>Search User: </h4>
                        <input
                            required
                            type="text"
                            placeholder="Search in users by First Name, Last Name"
                            value={userFilter}
                            onChange={e => setUserFilter(e.target.value)}>
                        </input>
                    </div>

                    <div className="destination-box" >
                        {userDelegations != null ? (
                            <div className="delegation-box" style={{ boxShadow: "none", marginBottom: "0px" }}>
                                <ul>
                                    {userDelegations.map(user => (
                                        <li key={user.id} onClick={() => handleDestinsClick(user)} style={{ fontWeight: selectedUser === user ? 'bold' : 'normal' }}>
                                            {user.fullName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : ("No user found with this name")}
                    </div>

                    {otherDelegations != null && otherDelegations.length > 0 ? (
                        <>
                            <div className="task-box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Delegate For</th>
                                            <th>Delegate Assigned</th>
                                            <th>Expiration Date</th>
                                            <th>Request(s)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {otherDelegations.map(req => (
                                            <tr key={req.id}>
                                                <td>
                                                    {req.assignFromUsers.map((user) => (
                                                        <div key={user.id} >
                                                            <p>{user.name},</p>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>
                                                    {req.assignToUsers != null ? (
                                                        <p>{req.assignToUsers[0].name}</p>
                                                    ) : (
                                                        <p>{req.assignToRelationship.displayName}</p>
                                                    )}
                                                </td>
                                                <td>
                                                    <p>{new Date(req.expiryDate).toLocaleString()}</p>
                                                </td>
                                                <td>
                                                    {req.requestDefs.length > 1 ? (
                                                        <p>{req.requestDefs[0].name}, {req.requestDefs[1].name}, ...</p>
                                                    ) : (
                                                        <p>{req.requestDefs[0].name}</p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div></>
                    ) : (
                        showLoadingText ? (
                            <FontAwesomeIcon icon={faSpinner} spin size="1x" />
                        ) : (
                            <p>No delegation found</p>
                        )
                    )}

                </>
            )}

        </>
    );
};
export default Delegation;