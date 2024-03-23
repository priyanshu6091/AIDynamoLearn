import React, {useState, useEffect} from 'react'
import {Link } from 'react-router-dom'; 
// import Login from './Login';
// import Signup from './Signup';
import "./style.css";

function Home() {
  
    const [typedText, setTypedText] = useState('');
    const textToType = "AIDynamoLearn: Revolutionizing Learning with Interactive Reading and AI Chatbots";
  
    useEffect(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= textToType.length) {
          setTypedText(textToType.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100); //typing speed 
      return () => clearInterval(typingInterval);
    }, []);
  


  return (
    <div className="split-layout">
      <div className="left-pane">
        <h3>Welcome to AI DynamoLearn</h3>
        <p className='float-text'>{typedText}</p>
      </div>
      <div className="right-pane">
        <div className="auth-pannel">

          <p className='get-started'><strong>Get Started</strong></p>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/signup"><button>Sign up</button></Link>

          <div className="dyno-logo">
        <img src="https://i.ibb.co/FnvkLw6/AI-Dynamo-Learn.png" alt="Logo" style={{ width: '200px', height: '80px'}} />
        </div>

        </div>
      </div>

    </div>
  );
}

export default Home

