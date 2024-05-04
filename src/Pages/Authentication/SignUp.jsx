import React, { useState } from 'react';
import '../../Styles/Pages/Authentication/SignUpStyles.css';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../Services/Auth/AuthService';
import InputField from '../../Components/Auth/InputField';
import FileInputField from '../../Components/Auth/FileInputField';
import FormCard from '../../Components/Auth/FormCard';

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
      const data = await AuthService.signUp(formData); // Use authService to handle the sign up
      localStorage.setItem('token', data.token); // Store the token if sign-up is successful
      console.log('Registration successful');
      navigate('/'); // Redirect to home or sign-in page
    } catch (error) {
      console.error('Error during registration:', error);
      setError(error.response ? error.response.data : 'An error occurred during registration');
    }
  };

  return (
    <FormCard title="Sign Up">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <InputField type="text" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <InputField type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <InputField type="email" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <FileInputField name="profileImage" accept="image/*" onChange={e => setProfileImage(e.target.files[0])} />
        <input type="submit" value="Sign Up" className="btn btn-primary" />
        <p className="text-muted">
          Already have an account? Please <a href="/">Sign In</a>
        </p>
        {error && <p className="error-message">{error}</p>}
      </form>
    </FormCard>
  );
};

export default SignUp;