import React from "react";
import styled from "styled-components";
import logo from "../../public/assets/free_test.png"; // Update the path to your actual logo

function Navbar() {
  return (
    <NavStyled>
      <div className="landing_nav">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <h1>Resume Based Mock Interview</h1>
        <div className="right_panel">
          <div className="profile">Profile</div>
          <div className="login">Login</div>
        </div>
      </div>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  .landing_nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #000000;
    color: #fff;
  }

  .logo img {
    height: 50px; /* Adjust the height as needed */
  }

  h1 {
    flex-grow: 1;
    text-align: center;
    font-size: 24px;
  }

  .right_panel {
    display: flex;
    gap: 20px;
  }

  .profile,
  .login {
    cursor: pointer;
    font-size: 18px;
    color: #fff;
  }

  .profile:hover,
  .login:hover {
    text-decoration: underline;
  }
`;

export default Navbar;
