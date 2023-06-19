import React, {useContext} from "react";
import logo from '../../assets/img/logo.png';
import "../Dashboard/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ChatbotButton from "../ChatBot/ChatbotButton";
import TokenContext from "../../functions/TokenContext";
import "./Header.css"

const Header = ({ title }) => {
  // Access the navigation functionality
  const navigate = useNavigate(); 

  const { tokens } = useContext(TokenContext);

  return (
    <>
      <div className="header-container">        
        <div className="username">
          <img className="image" src={logo} alt="" />
          <span>{tokens.usr}</span>
        </div>
        <h1>{title}</h1>
        <div className="links">
          <button onClick={() => navigate(`/Dashboard`)}>Dashboard<FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "10px", marginRight: "-15px" }} /></button>
          <button onClick={() => navigate(`/users`)}>Users<FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "10px", marginRight: "-15px" }} /></button>
          <button onClick={() => navigate(`/requests`)}>Requests<FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "10px", marginRight: "-15px" }} /></button>
          <button onClick={() => navigate(`/historyRequests`)}>History Requests<FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "10px", marginRight: "-15px" }} /></button>
          <button onClick={() => navigate(`/tasks`)}>Tasks<FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "10px", marginRight: "-15px" }} /></button>
          <button onClick={() => navigate(`/delegations`)}>Delegations<FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "10px", marginRight: "-15px" }} /></button>
        </div>
      </div>  
      
      <ChatbotButton />

    </>
  )
}

export default Header


