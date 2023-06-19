import React, { useEffect, useState, useContext } from "react";
import { allPermissions, requestTeams, requestGroups, requestUsers } from "../../functions/requests";
import TokenContext from "../../functions/TokenContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import "./NewRequest.css";
import Header from "../Header/Header";

const NewRequest = () => {

    const { tokens } = useContext(TokenContext);

    // List of permissions 
    const [permissions, setPermissions] = useState([]);
    // Filter to search for a specific permision 
    const [permissionFilter, setPermissionFilter] = useState(null);

    // List of users
    const [users, setUsers] = useState([]);
    // Filter to search for a specific user
    const [usersFilter, setUsersFilter] = useState(null);

    // List of groups
    const [groups, setGroups] = useState([]);
    // Filter to search for a specific group
    const [groupsFilter, setGroupsFilter] = useState(null);

    // List of teams
    const [teams, setTeams] = useState([]);
    // Filter to search for a specific team
    const [teamsFilter, setTeamsFilter] = useState(null);

    // Name of the user selected to ask for a request
    const [destinName, setDestinsName] = useState();
    // Value to attach at the HTTP request for the specific permission
    const [destinDN, setDestinsDN] = useState();

    // Boolean to decide who is the request for: myslef or someone else
    const [buttonFor, setButtonFor] = useState("myself");
    // Variable to set the destinetion recipient: User, Group, Team
    const [buttonDest, setButtonDest] = useState("");


    useEffect(() => {
        // Fetch all the permissions matching the filter
        allPermissions(permissionFilter, tokens.access_token, setPermissions);
    }, [permissionFilter, tokens.access_token]);

    useEffect(() => {
        // Fetch the users matching the filter
        requestUsers(usersFilter, tokens.access_token, setUsers);
    }, [usersFilter, tokens.access_token]);

    useEffect(() => {
        // Fetch the groups matching the filter
        requestGroups(groupsFilter, tokens.access_token, setGroups);
    }, [groupsFilter, tokens.access_token]);

    useEffect(() => {
        // Search the teams matching the filter
        requestTeams(teamsFilter, tokens.access_token, setTeams);
    }, [teamsFilter, tokens.access_token]);


    // Prepare the scenario for the 'Myself' screen to be displayed
    const handleAutoRequest = () => {
        setButtonFor("myself");
        setPermissions(null);
        setPermissionFilter('');
    };

    // Prepare the scenario for the 'Others' screen to be displayed
    const handleOtherRequest = () => {
        setButtonFor("others");
        setPermissions(null);
        setPermissionFilter('');
    };

    const handleUsersClick = () => {
        setButtonDest("users");
        setGroups(null);
        setTeams(null);
        setDestinsDN(null);
        setDestinsName(null);
        setUsersFilter(null);
        setGroupsFilter(null);
        setTeamsFilter(null);
    };

    const handleGroupsClick = () => {
        setButtonDest("groups");
        setUsers(null);
        setTeams(null);
        setDestinsDN(null);
        setDestinsName(null);
        setUsersFilter(null);
        setGroupsFilter(null);
        setTeamsFilter(null);
    };

    const handleTeamsClick = () => {
        setButtonDest("teams");
        setUsers(null);
        setGroups(null);
        setDestinsDN(null);
        setDestinsName(null);
        setUsersFilter(null);
        setGroupsFilter(null);
        setTeamsFilter(null);
    };

    // Setting the necessary values for others permissions when a user a team or a group is clicked
    const handleDestinsClick = (user, group, team) => {
        if (user) {
            setDestinsDN(user.dn);
            setDestinsName(user.name);
        } else if (group) {
            setDestinsDN(group.dn);
            setDestinsName(group.name);
        } else if (team) {
            setDestinsDN(team.dn);
            setDestinsName(team.name);
        }
    };

    // Constant and Effect to change the charging icon for text after 7 seconds meening the response array is empty  
    const [showLoadingText, setShowLoadingText] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (permissions == null ||permissions.length === 0 ) {
                setShowLoadingText(true);
            }
        }, 7000);
        return () => clearTimeout(timer);
    }, [permissions]);


    return (
        <>
            <Header title="New Request" />
            <div className="request-box">
                <h4>Request for</h4>
                <button type="button" className={`btn btn-light btn-sm ${buttonFor === "myself" ? "active" : ""}`} onClick={() => { setDestinsDN(""); handleAutoRequest(); }}>Myself</button>
                <button type="button" style={{ marginLeft: "0px" }} className={`btn btn-light btn-sm ${buttonFor === "others" ? "active" : ""}`} onClick={handleOtherRequest}>Others</button>
            </div>

            {buttonFor === "myself" ? (
                <></>
            ) : (
                <div className="destination-box">
                    <h4>Destination*</h4>
                    <i className="fas fa-search"></i>

                    <button type="button" className={` ${buttonDest === "users" ? "active" : ""}`} onClick={handleUsersClick}>Users</button>
                    <button type="button" className={` ${buttonDest === "groups" ? "active" : ""}`} onClick={handleGroupsClick}>Groups</button>
                    <button type="button" className={` ${buttonDest === "teams" ? "active" : ""}`} onClick={handleTeamsClick}>Teams</button>

                    {buttonDest === "users" && (
                        <>
                            <input
                                required
                                type="text"
                                placeholder="Search user by First or LastName"
                                value={usersFilter}
                                onChange={e => setUsersFilter(e.target.value)}>
                            </input>

                            {users != null && users.length > 0 ? (
                                <div class="scroll-box">
                                    <h4>Users List:</h4>
                                    <ul>
                                        {users.map(user => (
                                            <li key={user.id} onClick={() => handleDestinsClick(user)} style={{ fontWeight: destinDN === user.dn ? 'bold' : 'normal' }}>
                                                {user.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            ) : (
                                showLoadingText ? (
                                    <p style={{marginLeft: '20px'}}>No user found</p>
                                ) : (
                                    <FontAwesomeIcon icon={faSpinner} spin size="1x" style={{marginLeft: '20px'}} />
                                )
                            )}
                        </>
                    )}

                    {buttonDest === "groups" && (
                        <>
                            <input
                                required
                                type="text"
                                placeholder="Search groups by Description"
                                value={groupsFilter}
                                onChange={e => setGroupsFilter(e.target.value)}>
                            </input>
                            {groups != null ? (
                                <div class="scroll-box">
                                    <h4>Groups List:</h4>
                                    <ul>
                                        {groups.map(group => (
                                            <li key={group.id} onClick={() => handleDestinsClick(group)} style={{ fontWeight: destinDN === group.dn ? 'bold' : 'normal' }}>
                                                {group.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                showLoadingText ? (
                                    <p style={{marginLeft: '20px'}}>No group found</p>
                                ) : (
                                    <FontAwesomeIcon icon={faSpinner} spin size="1x" style={{marginLeft: '20px'}} />
                                )
                            )}
                        </>
                    )}

                    {buttonDest === "teams" && (
                        <>
                            <input
                                required
                                type="text"
                                placeholder="Search teams"
                                value={teamsFilter}
                                onChange={e => setTeamsFilter(e.target.value)}>
                            </input>
                            {teams != null ? (
                                <div class="scroll-box">
                                    <h4>Teams List:</h4>
                                    <ul>
                                        {teams.map(team => (
                                            <li key={team.id} onClick={() => handleDestinsClick(team)} style={{ fontWeight: destinDN === team.dn ? 'bold' : 'normal' }}>
                                                {team.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                showLoadingText ? (
                                    <p style={{marginLeft: '20px'}}>No teams found</p>
                                ) : (
                                    <FontAwesomeIcon icon={faSpinner} spin size="1x" style={{marginLeft: '20px'}} />
                                )
                            )}
                        </>
                    )}
                </div>
            )}


            <div class="permission-box">
                <h4>Permissions*</h4>
                <i className="fas fa-search"></i>
                <h6>{destinName}</h6>
                <input
                    required
                    type="text"
                    placeholder="Search permissions"
                    value={permissionFilter}
                    onChange={e => setPermissionFilter(e.target.value)}>
                </input>

                {permissions != null && permissions.length > 0 ? (
                    <div className="permission-scroll-box">
                        <h4>{permissionFilter}:</h4>
                        <ul>
                            {permissions.map(permission => (
                                <li key={permission.id}>
                                    <a href={`https://172.31.4.88:8543/IDMProv/requestForm.do?uid=${encodeURIComponent(permission.id)}&aqua=true&idmdash=true&recipient=${encodeURIComponent(destinDN || '')}&jsa=%7B%22submit%22%3A%22submitThenOpener(3000)%22%2C%22cancel%22%3A%22window.close()%22%7D`} rel="noreferrer" target="_blank">
                                        <strong style={{ color: "#0b2578" }}>{permission.name}</strong><br />
                                        {permission.categories[0]}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    showLoadingText ? (
                        <p style={{marginLeft: '20px'}}>No permission found</p>
                    ) : (
                        <FontAwesomeIcon icon={faSpinner} spin size="1x" style={{marginLeft: '20px'}} />
                    )
                )}
            </div>

        </>
    )
}

export default NewRequest



