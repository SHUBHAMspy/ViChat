import React from 'react';
import { HiHome, HiOutlineX, HiTemplate, HiUser } from "react-icons/hi";
import { Link } from 'react-router-dom';
import chatapp from "../../images/chatapp.svg";
import "./sidebar.css";

const SideBar = () => {
  return (
    <div className='sidebar'>
      <div className='top'>
        <div className='logo'>
          <img src={chatapp} alt="chatappLogo" />
        </div>
        <div className='close'>
          <span> <HiOutlineX/> </span>

        </div>
      </div>
      <Link to= "/" >
        <span> <HiHome/> </span>
        <h3>Home</h3>
        
      </Link>
      <Link to= "/" >
        <span> <HiTemplate/> </span>
        <h3>DashBoard</h3>

        
      </Link>
      <Link to= "/" >
        <span> <HiUser/> </span>
        <h3>User</h3>


      </Link>

    </div>
  );
};

export default SideBar;
