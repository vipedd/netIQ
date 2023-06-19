import React, { useState, useEffect, useContext } from 'react'
import logo from '../../assets/img/logo.png'
import { useNavigate } from 'react-router-dom';
import { GetTokens } from '../../functions/getTokens';
import TokenContext from '../../functions/TokenContext';
import './Login.css';


const Login = () => {
    // State variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Access the navigation functionality
    const navigate = useNavigate();

     // Access token context
    const tokenContext = useContext(TokenContext);

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            // Call the GetTokens function to retrieve tokens      
            const response = await GetTokens(username, password);
            if (response.access_token) {
                // Set the access token and refresh token in the token context
                tokenContext.setTokens({
                    access_token: response.access_token,
                    refresh_token: response.refresh_token,
                    usr: username,
                    psw: password
                });                   
                // Navigate to the dashboard
                navigate('/dashboard');
            } else {
                // Display error message and handle login failure
                setErrorMessage('Login failed. Please try again.');
                setIsLoading(false);
                localStorage.setItem('errorMessage', 'Login failed. Please try again.');
                window.location.reload();
            }

        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // Retrieve stored error message from local storage on component mount
    useEffect(() => {
        const storedErrorMessage = localStorage.getItem('errorMessage');
        if (storedErrorMessage) {
            setErrorMessage(storedErrorMessage);
            localStorage.removeItem('errorMessage');
        }
    }, []);



    return (
        <div className="login-wrapper">
            <img src={logo} alt="" />
            <form onSubmit={onSubmit}>
                <input type="text" id="username" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />

                <input type="password" id="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
            {errorMessage && (
                <div className='error-message'>
                    <h2>{errorMessage}</h2>
                </div>
            )}
        </div>
    );
};

export default Login;