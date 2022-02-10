import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import chatappblue from "../../images/chatappbluelogo.svg";
import './loginPage.css';


const Login = () => {
  const [userName, setUserName] = useState('');
  const history =  useHistory();

  const handleSubmit = ()  => {
    history.push('/dashboard');
  };

  return (
    <div className='login-page_container'>
    <div className='login-page_login_box'>
      <div className='login-page_logo_container'>
        <img src={chatappblue} alt="chatapplogo" />
      </div>
      <div className='login-page_title_container'>
        <h2>Just Login </h2>
      </div>

      <div className='login-page_input_container'>
        <input
          placeholder='Enter your name'
          type='text'
          value={userName}
          onChange={(event) => { setUserName(event.target.value); }}
          className='login-page_input '
        />
    </div>
    <div className='login-page_button_container'>
      <button
        className='login-page_button '
        onClick={handleSubmit}
      >
        Go Chat
      </button>
    </div>

    </div>

      
    </div>
  )
};

export default Login;
