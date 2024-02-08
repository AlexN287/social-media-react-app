import React, { useState } from 'react';
import '../../Styles/Pages/Authentication/SignInStyles.css';
import { request } from '../../Helper/AxiosHelper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/signin', {
                username,
                password
            });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token); // Store the token
        navigate('/home'); // Navigate to the home page
      } else {
        console.log('Invalid username or password');
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError(error.response ? error.response.data : 'An error occurred during authentication');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <form onSubmit={handleSubmit} className="box">
              <h1>Sign In</h1>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input type="submit" value="Sign In" />
              <p className="text-muted">
                Don't have an account? Please <a href="/signup">Sign Up</a>
              </p>
              {error && <p className="error-message">Invalid username or password</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;