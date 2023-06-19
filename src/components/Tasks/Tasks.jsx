import React, { useEffect, useState, useContext } from "react";
import { myTasks, otherTasks } from '../../functions/tasks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Header from "../Header/Header";
import TokenContext from "../../functions/TokenContext";
import "./Tasks.css";

const Tasks = () => {

    // Token context variable to retrieve the access token
    const { tokens } = useContext(TokenContext);

    // Index of the different pages after the task list display
    const [startIndex, setStartIndex] = useState(1);
    // Boolean to decide which list to retrieve, myself or someone else
    const [buttonFor, setButtonFor] = useState("myself");

    // List of my tasks
    const [myTask, setMyTask] = useState([]);
    // Filter to retrieve a specific tasl
    const [myTaskFilter, setMyTaskFilter] = useState('');

    // List of someone elses tasks
    const [otherTask, setOtherTask] = useState([]);
    // Filter to set the user to retrieve the task from
    const [otherTaskFilter, setOtherTaskFilter] = useState(null);   

    

    useEffect(() => {
        // Fetch of my own task list
        myTasks(myTaskFilter, startIndex, tokens.access_token, setMyTask)
    }, [myTaskFilter, startIndex, tokens.access_token, buttonFor])

    useEffect(() => {
        // Fetch of someone elses task list
        otherTasks(otherTaskFilter, startIndex, tokens.access_token, setOtherTask)
    }, [otherTaskFilter, startIndex, tokens.access_token])

    // Set the parameters for the display of my tasks list
    const handleAutoRequest = () => {
        setButtonFor("myself");
        setStartIndex(1);
        setOtherTaskFilter('');
        setMyTask(null);
    }

    // Set the parameters to display someone elses tasks list
    const handleOtherRequest = () => {
        setButtonFor("others")
        setStartIndex(1);
        setMyTaskFilter('');
        setOtherTask(null);
    }

    // Handle buttons to move bacck and forward the pages of the list
    const handleNextPage = () => {
        setStartIndex(startIndex + 25);
    }
    const handlePrevPage = () => {
        setStartIndex(Math.max(startIndex - 25, 1));
    }

    // Constant and Effect to change the charging icon for text after 7 seconds meening the response array is empty  
  const [showLoadingText, setShowLoadingText] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (myTask == null || myTask.length === 0 || otherTask == null || otherTask.length === 0) {
        setShowLoadingText(true);
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [myTask, otherTask]);


    return (
        <>
            <Header title="Tasks"/>

            <div className="request-box">
                <h4>Request for</h4>
                <button type="button" className={`btn btn-light btn-sm ${buttonFor === "myself" ? "active" : ""}`} onClick={handleAutoRequest}>Myself</button>
                <button type="button" style={{ marginLeft: "0px" }} className={`btn btn-light btn-sm ${buttonFor === "others" ? "active" : ""}`} onClick={handleOtherRequest}>Others</button>
            </div>

            {buttonFor === "myself" ? (
                <>
                    <div className="user-destinetion-box">
                        <input
                            required
                            type="text"
                            placeholder="Search request, task, destination o asignation"
                            value={myTaskFilter}
                            onChange={e => setMyTaskFilter(e.target.value)}>
                        </input>
                    </div>

                    {myTask != null ? (
                        <>
                            <div className="task-box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Request</th>
                                            <th>Destination</th>
                                            <th>Initiator</th>
                                            <th>Patition Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myTask.map(task => (
                                            <tr key={task.id} className="link-item">
                                                <td>
                                                    <p>{task.activityName}</p>
                                                </td>
                                                <td>
                                                    <a href={`https://172.31.4.88:8543/IDMProv/approvalForm.do?aqua=true&idmdash=true&jsa=%257B%2522approve%2522%3A%2522submitThenOpener%28%27approve%27%2C%2B3000%29%2522%2C%2522deny%2522%3A%2522submitThenOpener%28%27deny%27%2C%2B3000%29%2522%2C%2522refuse%2522%3A%2522submitThenOpener%28%27refuse%27%2C%2B3000%29%2522%2C%2522cancel%2522%3A%2522cancelForm%28%29%2522%2C%2522claim%2522%3A%2522submitOnlyAction%28%27claim%27%29%2522%2C%2522release%2522%3A%2522submitOnlyAction%28%27release%27%29%2522%2C%2522update%2522%3A%2522submitThenOpener%28%27update%27%2C%2B3000%29%2522%2C%2522comments%2522%3A%2522window.close%28%29%2522%257D&proxyFor=&weId=${task.taskId}`} className="link" target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{task.processName}</a>
                                                </td>
                                                <td>
                                                    <p>{task.recipientName}</p>
                                                </td>
                                                <td>
                                                    <p>{task.assignedTo}</p>
                                                </td>
                                                <td>
                                                    <p>{new Date(task.createTime).toLocaleString()}</p>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" className="prev-next-button" onClick={handlePrevPage} disabled={startIndex <= 1}>Prev</button>
                            <button type="button" className="prev-next-button" onClick={handleNextPage} disabled={myTask.length < 25}>Next</button>
                        </>
                    ) : (
                        showLoadingText ? (
                            <p>No tasks found</p>
                        ) : (
                            <FontAwesomeIcon icon={faSpinner} spin size="1x" />
                        )
                    )}
                </>
            ) : (
                <>
                    <div className="user-destinetion-box">
                        <input
                            required
                            type="text"
                            placeholder="Search user"
                            value={otherTaskFilter}
                            onChange={e => setOtherTaskFilter(e.target.value)}>
                        </input>
                    </div>
                    {otherTask != null ? (
                        <>
                            <div className="task-box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Request</th>
                                            <th>Destination</th>
                                            <th>Initiator</th>
                                            <th>Patition Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {otherTask.map(task => (
                                            <tr key={task.id} className="link-item">
                                                <td>
                                                    <p>{task.activityName}</p>
                                                </td>
                                                <td>
                                                    <a href={`https://172.31.4.88:8543/IDMProv/approvalForm.do?weId=${task.taskId}&aqua=true&idmdash=true&jsa=%257B%2522approve%2522%3A%2522submitThenOpener(%27approve%27%2C%2B3000)%2522%2C%2522deny%2522%3A%2522submitThenOpener(%27deny%27%2C%2B3000)%2522%2C%2522refuse%2522%3A%2522submitThenOpener(%27refuse%27%2C%2B3000)%2522%2C%2522cancel%2522%3A%2522cancelForm()%2522%2C%2522claim%2522%3A%2522submitOnlyAction(%27claim%27)%2522%2C%2522release%2522%3A%2522submitOnlyAction(%27release%27)%2522%2C%2522update%2522%3A%2522submitThenOpener(%27update%27%2C%2B3000)%2522%2C%2522comments%2522%3A%2522window.close()%2522%257D&proxyFor=`} className="link" target="_blank" rel="noreferrer" style={{ color: 'blue' }}>{task.processName}</a>

                                                </td>
                                                <td>
                                                    <p>{task.recipientName}</p>
                                                </td>
                                                <td>
                                                    <p>{task.assignedTo}</p>
                                                </td>
                                                <td>
                                                    <p>{new Date(task.createTime).toDateString()}</p>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" className="prev-next-button" onClick={handlePrevPage} disabled={startIndex <= 1}>Prev</button>
                            <button type="button" className="prev-next-button" onClick={handleNextPage} disabled={otherTask.length < 25}>Next</button>
                        </>
                    ) : (
                        showLoadingText ? (
                            <p>No tasks found</p>
                        ) : (
                            <FontAwesomeIcon icon={faSpinner} spin size="1x" />
                        )
                    )}
                </>
            )}


        </>
    )
}

export default Tasks