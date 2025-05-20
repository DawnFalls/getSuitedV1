/**
 * 🔝 Navbar Component
 *
 * Main navigation bar for the getSuited platform. Displays site logo, links to major modules,
 * and user profile or sign-in button depending on authentication state.
 *
 * 📦 Features:
 * - Shows navigation links: Courses, Interview, Training, Questionnaire
 * - If user is logged in, shows their name and profile picture
 * - If not logged in, shows a Sign In button
 * - Retrieves user from `props` or `localStorage` fallback
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

interface UserProps {
  user?: {
    name: string;
    profilePicture?: string;
  } | null;
}

const Navbar: React.FC<UserProps> = ({ user }) => {
  const [storedUser, setStoredUser] = useState(user || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const localUser = localStorage.getItem("user");
      if (localUser) setStoredUser(JSON.parse(localUser));
    }
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img
            src="/getSuited-04.png"
            alt="getSuited Logo"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/courses">Courses</Link>
        <Link to="/interview">Interview</Link>
        <Link to="/training">Training</Link>
        <Link to="/questionnaire">Questionnaire</Link>
      </div>

      <div className="navbar-right">
        {storedUser ? (
          <div className="profile-wrapper" onClick={() => navigate("/UserProfile")}>
            {storedUser.profilePicture ? (
              <img
                src={storedUser.profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            ) : (
              <div className="default-profile-icon">👤</div>
            )}
            <span className="profile-name">{storedUser.name}</span>
          </div>
        ) : (
          <Link to="/signin" className="sign-in-btn">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
