import React, { useEffect, useState } from "react";
import {Container, Spinner, Table} from 'react-bootstrap';
import '../styles/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { MdPassword, MdOutlineTableChart } from "react-icons/md"
import { GrResources } from "react-icons/gr";

function Home() {

return (
<div className="home-background">
  <div className="home-container">
      <Link to="/passwordHacker" className="home-link">
        <MdPassword className="home-icon" />
        <span className="home-text">Password Hacker</span>
      </Link>
      <Link to="/perkTable" className="home-link">
        <MdOutlineTableChart className="home-icon" />
        <span className="home-text">Perks Table</span>
      </Link>
      <Link to="/findMaterials" className="home-link">
        <GrResources className="home-icon" />
        <span className="home-text">Shipments</span>
      </Link>
    </div>
</div>    

);
}  
export default Home;