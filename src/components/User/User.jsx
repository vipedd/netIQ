import React from "react";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { oneUser, allUsers, numUsers } from "../../functions/users";
import TokenContext from "../../functions/TokenContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Header from "../Header/Header";
import "./User.css";

const User = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [user, setUser] = useState();
    const { tokens } = useContext(TokenContext);

    // Users list
    const [users, setUsers] = useState([]);
    // Index of the actual page
    const [startIndex, setStartIndex] = useState(1);
    // Filter to search for a specific user
    const [filter, setFilter] = useState('');
    // Fetch total number of users in the organisation
    const [numUsr, setNumUsers] = useState('');



    useEffect(() => {
        //Fetch users details
        oneUser(params.dn, tokens.access_token, setUser);
    }, [params.dn, tokens.access_token]);


    useEffect(() => {
        // Fetch the list of all the users in the organization
        allUsers(startIndex, filter, tokens.access_token, setUsers);
    }, [startIndex, filter, tokens.access_token]);

    useEffect(() => {
        // Fetch number of users in the organization
        numUsers(tokens.access_token, setNumUsers);
    }, [tokens.access_token]);


    // Handle turning pages on the display of users list
    const handleNextPage = () => {
        setStartIndex(startIndex + 25);
    };
    const handlePrevPage = () => {
        setStartIndex(Math.max(startIndex - 25, 1));
    };

    // Constant and Effect to change the charging icon for text after 7 seconds meening the response array is empty  
    const [showLoadingText, setShowLoadingText] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user == null || user.length === 0 || users == null ) {
                setShowLoadingText(true);
            }
        }, 7000);

        return () => clearTimeout(timer);
    }, [user, users]);

    return (
        <>
            <Header title="User Information" />

            {user != null ? (
                <>
                    <div className="user-header">
                        <img className="image" src={user.image} alt="Profile Image" />
                        <div className="attribute-values">
                            <h1>{user.fullName}</h1>
                            {user.primaryAttributes[0].attributeValues !== undefined ? (
                                <h3>{user.primaryAttributes[0].attributeValues[0].$}</h3>
                            ) : ('')}

                            {user.primaryAttributes[1].attributeValues !== undefined ? (
                                <h3>{user.primaryAttributes[1].attributeValues[0].$}</h3>
                            ) : ('')}
                        </div>
                    </div>

                    <div className="users-container">
                        <div className="users-list">
                            <div className="search-section">
                                <div className="input-section">
                                    <input
                                        className="search-input"
                                        type="text"
                                        placeholder="Type user name, last name, email to search..."
                                        value={filter}
                                        onChange={e => { setFilter(e.target.value); setStartIndex(1) }}
                                    />
                                    <div className="pagination-buttons">
                                        <button type="button" onClick={handlePrevPage} disabled={startIndex <= 1}>Prev</button>
                                        <button type="button" onClick={handleNextPage} disabled={users.length < 25}>Next</button>
                                    </div>
                                </div>
                                <h4>Mostrando {startIndex} - {startIndex + 24} de {numUsr} usuarios encontrados:</h4>
                            </div>

                            <div className="user-list-container">
                                {users != null && users.length > 0 ? (
                                    <table className="scroll-users">
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.dn}>
                                                    <td>
                                                        <p onClick={() => navigate(`/users/user/${user.dn}`)}>{user.fullName}</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    ''
                                )}
                            </div>

                        </div>
                    </div>



                    <div className="user-container">
                        <div className="user-info">
                            <h5>{user.secondaryAttributes[2].displayLabel}</h5>
                            {user.secondaryAttributes[2].attributeValues !== undefined ? (
                                <p>{user.secondaryAttributes[2].attributeValues[0].$}</p>
                            ) : ('')}

                            <h5>{user.secondaryAttributes[0].displayLabel}</h5>
                            {user.secondaryAttributes[0].attributeValues !== undefined ? (
                                <p>{user.secondaryAttributes[0].attributeValues[0].$}</p>
                            ) : ('')}

                            <h5>{user.secondaryAttributes[1].displayLabel}</h5>
                            {user.secondaryAttributes[1].attributeValues !== undefined ? (
                                <p>{user.secondaryAttributes[1].attributeValues[0].$}</p>
                            ) : ('')}
                        </div>

                        <div className="user-subinfo">
                            <h5>{user.otherAttributes[0].displayLabel}</h5>
                            {user.otherAttributes[0].attributeValues !== undefined ? (
                                <p>{user.otherAttributes[0].attributeValues[0].$}</p>
                            ) : ('')}

                            <h5>{user.otherAttributes[1].displayLabel}</h5>
                            {user.otherAttributes[1].attributeValues !== undefined ? (
                                <p>{user.otherAttributes[1].attributeValues[0].value}</p>
                            ) : ('')}

                            <h5>{user.otherAttributes[2].displayLabel}</h5>
                            {user.otherAttributes[2].attributeValues !== undefined ? (
                                user.otherAttributes[2].attributeValues.map((item, index) => (
                                    <p key={index}>{item.value}</p>
                                ))

                            ) : ('')}
                        </div>
                    </div>
                </>
            ) : (
                showLoadingText ? (
                    <p>Error! No info found</p>
                ) : (
                    <FontAwesomeIcon icon={faSpinner} spin size="1x" />
                )
            )
            }
        </>
    )
}

export default User

