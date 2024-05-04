import React, { useState } from 'react';
import AuthService from '../../Services/Auth/AuthService';
import { useNavigate } from 'react-router-dom';
import InputField from '../../Components/Auth/InputField';
import FormCard from '../../Components/Auth/FormCard';
import '../../Styles/Pages/Authentication/SignInStyles.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthService.signIn(username, password);
      navigate('/home'); // Navigate to the homepage upon successful login
    } catch (error) {
      setError('Failed to log in');
      console.error(error);
    }
  };

  return (
    <FormCard title="Sign In">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <InputField
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <InputField
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input type="submit" value="Sign Up" className="btn btn-primary" />
        <p className="text-muted">
          Don't have an account? Please <a href="/signup">Sign Up</a>
        </p>
        {error && <p className="error-message">{error}</p>}
      </form>
    </FormCard>
  );
};

export default SignIn;
