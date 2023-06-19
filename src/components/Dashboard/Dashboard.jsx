import React, { useEffect, useState, useContext } from "react";
import TokenContext from "../../functions/TokenContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faClock, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { dashboardInfo, userInfo } from "../../functions/dashboard";
import Header from "../Header/Header";
import "./Dashboard.css";

const Dashboard = () => {
    // Context variable to retrieve the access token
    const { tokens } = useContext(TokenContext);
    // Access the navigation functionality 
    const navigate = useNavigate();

    const [dashInfo, setDashInfo] = useState(null);
    const [usInf, setUsInf] = useState([]);

    useEffect(() => {
        // Fetch the list of all the users in the organization
        dashboardInfo(tokens.access_token, setDashInfo);
    }, [tokens.access_token]);

    useEffect(() => {
        // Fetch the list of all the users in the organization
        userInfo(tokens.access_token, setUsInf);
    }, [tokens.access_token]);

    // Constant and Effect to change the charging icon for text after 7 seconds meening the response array is empty  
    const [showLoadingText, setShowLoadingText] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (dashInfo == null || dashInfo.length === 0 ) {
                setShowLoadingText(true);
            }
        }, 7000);
        return () => clearTimeout(timer);
    }, [dashInfo]);

    return (
        <>
            <Header title="Dashboard" />
            {dashInfo != null ? (
                <>
                    <div className="dash-container">
                        <div className="dash-header">
                            <img src={usInf.image} alt="Profile Image" />
                            <h1>Welcome {tokens.usr}</h1>
                        </div>

                        <div className="elements">
                            <div className="dash-tasks">
                                <div className="dash-elements-header">
                                    <h2>Tasks</h2>
                                </div>
                                <div className="dash-elements-body">
                                    <div className="row">
                                        <div className="column3" style={{ borderRight: "solid 1px gray" }}>
                                            <h5>New Tasks</h5>
                                            <h3 style={{ color: "blue" }}>{dashInfo.tasksData.newTasks}</h3>
                                        </div>
                                        <div className="column3" style={{ borderRight: "solid 1px gray" }}>
                                            <h5>Expire Soon</h5>
                                            <h3 style={{ color: "orange" }}>{dashInfo.tasksData.expiryTasksCount}</h3>
                                        </div>
                                        <div className="column3">
                                            <h5>Claimed</h5>
                                            <h3 style={{ color: "blue" }}>{dashInfo.tasksData.cliamedTasks}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="dash-my-req">
                                <div className="dash-elements-header">
                                    <h2>Self Requests</h2>
                                </div>
                                <div className="dash-elements-body">
                                    <div className="row">
                                        <div className="column2" style={{ borderRight: "solid 1px gray" }}>
                                            <h5>Pending</h5>
                                            <h3 style={{ color: "blue" }}>
                                                <FontAwesomeIcon icon={faClock} className="icon-clock" />
                                                {dashInfo.requestData.requestPending}
                                            </h3>
                                        </div>
                                        <div className="column2">
                                            <h5>Denied</h5>
                                            <h3 style={{ color: "red" }}>
                                                <FontAwesomeIcon icon={faTimesCircle} className="icon-denied" />
                                                {dashInfo.requestData.requestDenied}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="dash-others-req">
                                <div className="dash-elements-header">
                                    <h2>Requests For Others</h2>
                                </div>
                                <div className="dash-elements-body">
                                    <div className="row">
                                        <div className="column2" style={{ borderRight: "solid 1px gray" }}>
                                            <h5>Pending</h5>
                                            <h3 style={{ color: "blue" }}>
                                                <FontAwesomeIcon icon={faClock} className="icon-clock" />
                                                {dashInfo.requestData.requestForOthersPending}
                                            </h3>
                                        </div>
                                        <div className="column2">
                                            <h5>Denied</h5>
                                            <h3 style={{ color: "red" }}>
                                                <FontAwesomeIcon icon={faTimesCircle} className="icon-denied" />
                                                {dashInfo.requestData.requestForOthersDenied}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    );
};

export default Dashboard;