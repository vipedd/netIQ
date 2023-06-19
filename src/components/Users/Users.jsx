import React, { useEffect, useState, useContext } from "react";
import { allUsers, numUsers } from "../../functions/users";
import org from '../../assets/img/orgicon.png';
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import TokenContext from "../../functions/TokenContext";
import "./Users.css";
import Header from "../Header/Header";

const Users = () => {
  // Context variable to retrieve the access token
  const { tokens } = useContext(TokenContext);
  // Access the navigation functionality 
  const navigate = useNavigate();

  // Users list
  const [users, setUsers] = useState([]);
  // Index of the actual page
  const [startIndex, setStartIndex] = useState(1);
  // Filter to search for a specific user
  const [filter, setFilter] = useState('');

  const [numUsr, setNumUsers] = useState('');


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
      if (users == null || users.length === 0) {
        setShowLoadingText(true);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [users]);


  return (
    <>
      <Header title="Users List" />
      <div className="user-destinetion-box">
        <input
          type="text"
          placeholder="Type user name, last name, email to search..."
          value={filter}
          onChange={e => { setFilter(e.target.value); setStartIndex(1) }}>
        </input>
        <h4>Mostrando {startIndex} - {startIndex + 24} de {numUsr} usuarios encontrados:</h4>
      </div>

      {users != null && users.length > 0 ? (
        <>
          <table className="users-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Organization Chart</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.dn}>
                  <td>
                    <p className="user-button" onClick={() => navigate(`/users/user/${user.dn}`)}>{user.fullName}</p>
                  </td>
                  <td>{user.secondaryAttributes[0].attributeValues !== undefined ? (
                    <p>{user.secondaryAttributes[0].attributeValues[0].$}</p>
                  ) : ('x')}</td>
                  <td>{user.secondaryAttributes[2].attributeValues !== undefined ? (
                    <p>{user.secondaryAttributes[2].attributeValues[0].$}</p>
                  ) : ('x')}</td>
                  <td>{user.secondaryAttributes[1].attributeValues !== undefined ? (
                    <p>{user.secondaryAttributes[1].attributeValues[0].$}</p>
                  ) : ('x')} </td>
                  <td>
                    <img src={org} onClick={() => navigate(`/users/org/${user.dn}`)} alt="Organigrama Icon" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }}>
            <button type="button" className="prev-next-button" onClick={handlePrevPage} disabled={startIndex <= 1}>Prev</button>
            <button type="button" className="prev-next-button" onClick={handleNextPage} disabled={users.length < 25}>Next</button>
          </div>
        </>
      ) : (
        showLoadingText ? (
          <p>No user found</p>
        ) : (
          <FontAwesomeIcon icon={faSpinner} spin size="1x" />
        )
      )}

    </>
  );
};

export default Users;