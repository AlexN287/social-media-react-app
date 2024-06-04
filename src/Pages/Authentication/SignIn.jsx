import React, { useState } from 'react';
import AuthService from '../../Services/Auth/AuthService';
import { useNavigate } from 'react-router-dom';
import InputField from '../../Components/Common/InputField';
import FormCard from '../../Components/Auth/FormCard';
import '../../Styles/Pages/Authentication/SignInStyles.css';
import MessageBanner from '../../Components/Common/MessageBanner';
import Button from '../../Components/Common/Button';

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
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Failed to log in. Please try again later.');
      }
      console.error(error);
    }
  };

  return (
    <div className='auth-container'>
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
        <Button type="submit" color="green">Sign In</Button>
        <p className="text-muted">
          Don't have an account? Please <a href="/signup">Sign Up</a>
        </p>
        {error && <MessageBanner message={error} type={'error'}/>}
      </form>
    </FormCard>
    </div>
   
  );
};

export default SignIn;
