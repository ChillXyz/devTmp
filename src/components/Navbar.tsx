import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logowithoutbg.svg';
import arrowIcon from '../assets/images/Frame-405.svg';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isFroqPage = location.pathname === '/froq';
  const isBurnToMintPage = location.pathname === '/burn-to-mint';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-link">
          <img 
            src={logo} 
            alt="Froqorion Logo" 
            className="nav-logo" 
          />
        </Link>
        <div className="nav-links">
          {(isFroqPage || isBurnToMintPage) && (
            <Link to="/" className="nav-link">
              Back
            </Link>
          )}
          <Link to="/froq" className="nav-link">
            $FROQ
          </Link>
          <Link to="/burn-to-mint" className="nav-link">
            Burn to Mint
          </Link>
          <Link to="/froq" className="nav-button">
            <span className="nav-button-text">Get $FROQ</span>
            <img 
              src={arrowIcon} 
              alt="Arrow" 
              className="nav-button-icon" 
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
