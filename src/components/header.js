import React from "react";
import '../styles/Header.css';
import { ImHome } from 'react-icons/im';
import { Link } from 'react-router-dom';
import Logo from '../logo.svg'

const Header = () => {
    
    return (
      
<header id="header" className="header">
<div className="d-flex justify-content-between align-items-center w-100 header-padding">
  <Link to="/">
    <img src={Logo} alt={""} className="header-icon" />
  </Link>

  <div className={`d-flex align-items-center`}>
    <span className="header-title">
      FALLOUT 4 COMPANION
    </span>
  </div>

  <div className={`ml-auto `}>
  {/* <img src={Logo} alt={""} className="header-icon" /> */}
  </div>

</div>
</header>

    );
  };
export default Header;