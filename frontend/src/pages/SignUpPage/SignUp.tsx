/**
 * 🆕 SignUp Page
 *
 * This page handles user registration using:
 * - Name, email, password, and confirmation
 * - Google OAuth signup
 * - LinkedIn OAuth signup
 *
 * 📦 Features:
 * - Client-side password confirmation check
 * - Stores JWT token and user data on success
 * - Redirects user to homepage after signup
 * - Includes social authentication buttons
 */
import React, { useState } from "react";
import "./SignUp.css";
// import { FaGoogle } from "react-icons/fa6";
// import { FaLinkedin } from 'react-icons/fa';
import { FaCheck as RawFaCheck, FaLinkedin as RawFaLinkedin } from "react-icons/fa";
import { FaGoogle as RawFaGoogle } from "react-icons/fa6";

interface SignUpProps {
  onSignUp?: (name: string, email: string, password: string) => void;
}

const FaCheck = RawFaCheck as unknown as React.FC;
const FaLinkedin = RawFaLinkedin as unknown as React.FC;
const FaGoogle = RawFaGoogle as unknown as React.FC;

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => setShowPassword((prev) => !prev);

   /**
   * 🧾 Handle form submission
   * - Validates passwords match
   * - Sends signup request
   * - Stores token & user
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register");
      }

      const { token, user } = await response.json();
      console.log(user);
      console.log(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>
        <p className="sub-header">
          Already have an account? <a href="/signin">Sign in here</a>
        </p>

        <div className="social-buttons">
          <button className="google-btn" onClick={handleGoogleSignup}>
            <FaGoogle /> Sign up with Google
          </button>
          <button className="linkedin-btn" onClick={() => window.location.href = "http://localhost:5001/auth/linkedin"}>
          <FaLinkedin /> Continue with LinkedIn
        </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={handleToggleShowPassword}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span onClick={handleToggleShowPassword}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;