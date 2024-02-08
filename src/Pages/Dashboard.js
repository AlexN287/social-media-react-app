import React, { useState } from 'react';
import axios from 'axios';
import { request } from '../Helper/AxiosHelper';
import Menu from './Menu';

const Dashboard = () => {
  const [user, setUser] = useState(null); // Changed to a single user object
  const [error, setError] = useState('');

  const fetchLoggedInUser = async () => {
    try {
      const response = await request('GET', 'http://localhost:8080/user'); // Adjusted URL to '/user'

      if (response.status === 200) {
        setUser(response.data); // Set the single user object
        console.log(user);
      } else {
        console.log('Error fetching user:', response.statusText);
        setError('An error occurred while fetching user data');
      }
    } catch (error) {
      console.error('Error during user fetch:', error);
      setError('An error occurred while fetching user data');
    }
  };

  return (
    <div>
      <Menu/>
      <h1>Dashboard Page</h1>
      <button onClick={fetchLoggedInUser}>Fetch Logged In User</button>
      {error && <p>Error: {error}</p>}
      {user && (
        <div>
          <h2>User Details</h2>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          {/* Display other user properties as needed */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
