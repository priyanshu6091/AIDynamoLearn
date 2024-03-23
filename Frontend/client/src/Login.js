import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import Validation from './LoginValidation'; 

function Login() {
  const [values, setValues] = useState({
      email: '', 
      password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Updated to useNavigate

  const handleInput = (event) => {
      setValues(prev => ({...prev, [event.target.name]: event.target.value}));
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      // const validationErrors = Validation(values);
      // setErrors(validationErrors);

      // Proceed only if there are no validation errors
      // if (Object.keys(validationErrors).length === 0) {
          try {
              // Adjust the URL to your backend's login endpoint
              const response = await axios.post('http://localhost:5000/login', values);
              
              // Check response. This assumes your backend sends a specific status/message on success
              if (response.data.success) {
                  // Redirect to /select upon successful login
                  navigate('/select'); // Updated to use navigate
              } else {
                  // Handle login failure (e.g., incorrect credentials)
                  // This is simplistic; you might want to set a state to show a login failure message
                  alert('Login failed: Incorrect credentials');
              }
          } catch (error) {
              console.error('Login error:', error);
              // Handle server errors or unreachable server
              // alert('Login failed: Server error or unreachable');
              alert(`Login failed: ${error.response ? error.response.data.error : 'Server error or unreachable'}`);
          }
      // }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 pb-4">
      <div className="bg-white p-3 rounded w-25">

        <div className="logo d-flex justify-content-center pb-3 mb-4">
        <img src="https://i.ibb.co/FnvkLw6/AI-Dynamo-Learn.png" alt="Logo" style={{ width: '200px', height: '80px'}} />
        </div>
        <p></p>

        <h4 className='text-center'>Login</h4>
        <p></p>
        <form action="" onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="email"><strong>Email address</strong></label>
            <input type="email" placeholder="Email" name="email"
            onChange={handleInput} className="form-control "></input>
            {errors.email && <span className="text-danger"> {errors.email}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" placeholder="Password" name="password"
            onChange={handleInput} className="form-control "></input>
            {/* {errors.password && <span className="text-danger"> {errors.password}</span>} */}
          </div>

          <button type="submit" className="btn btn-success w-100"><strong>Log in</strong></button>
          <p></p>
          <div className="text-center">
            <p className=''>Don't have an account?  <Link to="/signup" className=" w-100 bg-light text-decoration-none">Sign Up</Link></p>
          </div>
        
        </form>
      </div>
    </div>
  );
}

export default Login;
