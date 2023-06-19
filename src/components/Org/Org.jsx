import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getOrg, viewOrgRelationship } from "../../functions/users";
import TokenContext from "../../functions/TokenContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faSitemap, faSpinner } from '@fortawesome/free-solid-svg-icons';
import "./Org.css";
import Header from "../Header/Header";

const Org = () => {
  // Hook to obtein the params from the user clicked in the parent componet (Users)
  const par = useParams();
  const { tokens } = useContext(TokenContext);
  const navigate = useNavigate();

  // Information of the user inside the organization and list of the children
  const [org, setOrg] = useState(null);
  // Value to display my superior
  const [myJerarqui, setMyJerarqui] = useState(null);
  // List of childs 
  const [childJerarqui, setChildJerarqui] = useState(null);

  const [myRelationButton, setMyRelationButton] = useState('off');
  const [childRelationButton, setChildRelationButton] = useState('off');

  // Retrieve the user selected Organization Chart
  useEffect(() => {
    getOrg(par.dn, tokens.access_token, setOrg);
  }, [])

  // Check for the department and title and in case it is null, display a blank space
  const department = org?.primaryAttributes?.[0]?.attributeValues?.[0]?.$ || '';
  const title = org?.primaryAttributes?.[1]?.attributeValues?.[0]?.$ || '';

  // Redirects you to a new organization chart where you are the parent and you can see your childs
  function orgRelationship(dn) {
    navigate(`/users/org/${dn}`);
    getOrg(dn, tokens.access_token, setOrg);
    setMyRelationButton('off');
  }

  // View your superior in case you want to see his organization chart
  function listMySuperior(dn) {
    if (myRelationButton === 'off') {
      setMyRelationButton('on');
      viewOrgRelationship(dn, tokens.access_token, (response) => {
        setMyJerarqui(response);
      });
    }
    else {
      setMyRelationButton('off');
    }
  };
  
  // Constant and Effect to change the charging icon for text after 7 seconds meening the response array is empty  
  const [showLoadingText, setShowLoadingText] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (org == null || org.length === 0) {
        setShowLoadingText(true);
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [org]);

  return (
    <>
      <Header title="Organization Chart" />
      {org !== null ? (
        <>
          <div className="org-chart">

            <div className="top-container">
                <div className="root-box">
                  <img src={org.image} alt="Profile Image" />
                  <div className="parent-info">
                    <b onClick={() => navigate(`/users/user/${org.entityKey}`)}>{org.fullName}</b>
                    <p>{department}</p>
                    <p>{title}</p>
                  </div>
                  <button onClick={() => listMySuperior(org.entityKey)}><FontAwesomeIcon icon={faArrowUp} /></button>

                  <div className="parent-buttons">
                    {myRelationButton === 'on' && myJerarqui !== null ? (
                      <ul>
                        {myJerarqui?.entityList?.[0]?.relationshipDisplayName ? (
                          <li onClick={() => orgRelationship(myJerarqui.entityList[0].dn)}>
                            {`${myJerarqui.entityList[0]?.relationshipDisplayName}: ${myJerarqui.entityList[0]?.fullName}`}
                          </li>
                        ) : (
                          <div>No parent</div>
                        )}
                      </ul>
                    ) : ('')}
                  </div>
                </div>
            </div>

            {org.targets[0].total !== 0 ? (
              <div className="org-row">
                {org.targets[0].orgChartEntityNodes.map(child => (
                  <div className="org-column" key={child.id}>

                    <div className="child-box">
                      <img src={child.image} alt="Profile Image" />
                      <div className="child-info">
                        <b onClick={() => navigate(`/users/user/${child.entityKey}`)}>{child.fullName}</b>
                        <p>{child?.primaryAttributes?.[0]?.attributeValues?.[0]?.$ || ''}</p>
                      </div>
                      <button onClick={() => orgRelationship(child.entityKey)}><FontAwesomeIcon icon={faSitemap} /></button>
                      {childJerarqui !== null && childRelationButton === 'on' ? (
                        <ul>
                          <li>{childJerarqui.entityList[0]?.fullName}</li>
                        </ul>
                      ) : null}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: '250px' }}>
                <p style={{ marginLeft: '600px' }}>No org childs</p>
              </div>

            )}

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

export default Org

