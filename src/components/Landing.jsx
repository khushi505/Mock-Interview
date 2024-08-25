import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import logo from "../../public/assets/free_test.png";
import mock from "../../public/assets/mock.jpg";

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="landing_nav">
        <div className="logo">
          <img src={logo} alt="" />
        </div>

        <h1>Resume Based Mock Interview</h1>

        <div className="right_panel">
          <div className="profile">Profile</div>
          <div className="login">Login</div>
        </div>
      </div>

      <div className="about">
        <div className="about_left">
          Practice Smarter, <br />
          Ace Your Next Interview
          <div className="start">
            <Link to="/app">
              <button className="start-button">Start Your Interview</button>
            </Link>
          </div>
        </div>
        <div className="about_right">
          <img src={mock} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Landing;