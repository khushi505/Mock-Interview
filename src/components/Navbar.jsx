import React from "react";
import styled from "styled-components";

function Navbar() {
  return (
    <NavStyled>
      <div className="navbar">
        <h1 className="name">Project Name</h1>
      </div>
    </NavStyled>
  );
}

const NavStyled = styled.nav``;

export default Navbar;
