import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate(); // Updated to useNavigate

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Make POST request to store user data in MongoDB
      const response = await axios.post('/signup', values);
      
      if (response.status === 201) {
        // Clear form values if user created successfully
        setValues({ name: '', email: '', password: '' });
        alert('User created successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div className="bg-white p-3 rounded w-25">
        <div className="logo d-flex justify-content-center">
          <img src="https://i.ibb.co/FnvkLw6/AI-Dynamo-Learn.png" alt="Logo" style={{ width: '200px', height: '80px' }} />
        </div>
        <h4 className='text-center'>Sign-Up</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username"><strong>Username</strong></label>
            <input type="text" placeholder="Enter username" name='name'
              value={values.name} onChange={handleInput} className="form-control" />
          </div>  
          <div className="mb-3">
            <label htmlFor="email"><strong>Email address</strong></label>
            <input type="email" placeholder="Email" name='email'
              value={values.email} onChange={handleInput} className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" placeholder="Password" name='password'
              value={values.password} onChange={handleInput} className="form-control" />
          </div>
          <button type='submit' className="btn btn-success w-100"><strong>Sign Up</strong></button>
          <div className="text-center">
            <p className=''>Already have an account? <Link to="/login" className=" w-100 bg-light text-decoration-none">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
