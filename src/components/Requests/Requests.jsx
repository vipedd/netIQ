import React, { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faFlask, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import TokenContext from "../../functions/TokenContext";
import "./Requests.css";
import Header from "../Header/Header";


const Requests = () => {

    // Use the TokenContext variable to retrieve the username from the Login
    const { tokens } = useContext(TokenContext);
    const navigate = useNavigate();

    return (
        <>
            <Header title="Requests" />
            
            <div class="button-req-container">
                <button onClick={() => navigate(`/requests/newRequest`)} className="button-new-req"><FontAwesomeIcon icon={faGift} style={{ marginRight: "10px" }} />New Request</button>

                <a href={`https://172.31.4.88:8543/IDMProv/requestForm.do?uid=cn%3Dlabx%2Ccn%3Drequestdefs%2Ccn%3Dappconfig%2Ccn%3Duserapplication%2Ccn%3Ddriverset1%2Co%3Dsystem&aqua=true&idmdash=true&recipient=${encodeURIComponent(tokens.usr || '')}&jsa=%7B%22submit%22%3A%22submitThenOpener(3000)%22%2C%22cancel%22%3A%22window.close()%22%7D`} className="link" target="_blank" rel="noreferrer">
                    <button className="button-pre-def-one">
                        <FontAwesomeIcon icon={faFlask} className="icon-pre-def" /> LabX
                    </button>
                </a>
                <a href={`https://172.31.4.88:8543/IDMProv/requestForm.do?uid=cn%3Diai0607_smcc%2Ccn%3Drequestdefs%2Ccn%3Dappconfig%2Ccn%3Duserapplication%2Ccn%3Ddriverset1%2Co%3Dsystem&aqua=true&idmdash=true&recipient=${encodeURIComponent(tokens.usr || '')}&jsa=%7B%22submit%22%3A%22submitThenOpener(3000)%22%2C%22cancel%22%3A%22window.close()%22%7D`} className="link" target="_blank" rel="noreferrer">
                    <button className="button-pre-def-two">
                        <FontAwesomeIcon icon={faStar} className="icon-pre-def" /> SMCC
                    </button>
                </a>
            </div>

        </>
    )
}

export default Requests