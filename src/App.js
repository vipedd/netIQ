import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard'
import Users from './components/Users/Users'
import User from './components/User/User'
import Requests from './components/Requests/Requests';
import NewRequest from './components/NewRequest/NewRequest';
import HistoryRequests from './components/HistoryRequests/HistoryRequests';
import Tasks from './components/Tasks/Tasks';
import Org from './components/Org/Org';
import Login from './components/Login/Login';
import Delegation from './components/Delegation/Delegation';
import CreateDelegation from './components/Delegation/CreateDelegation';
import TokenContext from './functions/TokenContext';
import './App.css';
import Chatbot from './components/ChatBot/Chatbox';


function App() {
  
  let [tokens, setTokens] = useState({
    access_token: 'null',
    refresh_token: 'null',
    usr: 'null',
    psw: 'null'    
  }); 

  useEffect(() => {
    const minut = 1000 * 60;
    function refreshToken() {
      if (tokens.refresh_token !== 'null') {
        const url = 'https://172.31.4.88:8543/idmdash/RefreshTokenServlet';
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then((result) => {
            setTokens((prevTokens) => ({
              ...prevTokens,
              access_token: result.access_token
            }));
          })
          .catch(error => error)
      }
    }
    setInterval(refreshToken, 1*minut);
  }, [tokens]);


  return (
    <div className="App">
      <TokenContext.Provider value={{ tokens, setTokens }}>
        <BrowserRouter basename={'/netiq'}>
          <Routes>
            <Route path='/' element={<Login></Login>}></Route>
            <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
            <Route path='/users' element={<Users></Users>}></Route>
            <Route path='/users/org/:dn' element={<Org></Org>}></Route>
            <Route path='/users/user/:dn' element={<User></User>}></Route>
            <Route path='/requests' element={<Requests></Requests>}></Route>
            <Route path='/requests/newRequest' element={<NewRequest></NewRequest>}></Route>
            <Route path='/historyRequests' element={<HistoryRequests></HistoryRequests>}></Route>
            <Route path='/tasks' element={<Tasks></Tasks>}></Route>
            <Route path='/delegations' element={<Delegation></Delegation>}></Route>
            <Route path='/delegations/createDelegation' element={<CreateDelegation></CreateDelegation>}></Route>
            <Route path='/chatbot' element={<Chatbot></Chatbot>}></Route>
          </Routes>
        </BrowserRouter>
      </TokenContext.Provider>
    </div>
  );
}

export default App;
