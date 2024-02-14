import React, { useState } from 'react';
import '../../Styles/Pages/Authentication/SignUpStyles.css';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify({ username, password, email })], { type: 'application/json' }));
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log('Registration successful');
        localStorage.setItem('token', response.data.token);
        navigate('/'); // Redirect to home or sign-in page
      } else {
        console.log('Error during registration:', response.statusText);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.response ? error.response.data : 'An error occurred during registration');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <form onSubmit={handleSubmit} className="box" encType="multipart/form-data">
              <h1>Sign Up</h1>
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
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              <input type="submit" value="Sign Up" />
              <p className="text-muted">
                Already have an account? Please <a href="/">Sign In</a>
              </p>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;