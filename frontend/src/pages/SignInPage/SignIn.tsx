/**
 * 🔐 SignIn Page
 *
 * This component handles user login via:
 * - Email & password
 * - Google OAuth
 * - LinkedIn OAuth
 *
 * 📦 Features:
 * - Authenticates via local backend (`/auth/login`)
 * - Supports toggling password visibility
 * - Stores JWT token and user data in localStorage
 * - Redirects user on successful login
 */
import React, { useState } from "react";
import "./SignIn.css";
import { FaCheck as RawFaCheck, FaLinkedin as RawFaLinkedin } from "react-icons/fa";
import { FaGoogle as RawFaGoogle } from "react-icons/fa6";
// import { FaCheck } from "react-icons/fa";
// import { FaLinkedin } from 'react-icons/fa';
interface SignInProps {
  onSignIn?: (email: string, password: string) => void;
}

const FaCheck = RawFaCheck as unknown as React.FC;
const FaLinkedin = RawFaLinkedin as unknown as React.FC;
const FaGoogle = RawFaGoogle as unknown as React.FC;

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const { token, user } = await response.json();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
    } catch (err: any) {
      alert(err.message);
    }
  };

  /** 🧠 Trigger Google OAuth flow */
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Log in</h2>
        <p className="sub-header">
          New to Design Space? <a href="/signup">Sign up for free</a>
        </p>

        <div className="social-buttons">
          <button className="google-btn" onClick={handleGoogleLogin}>
            <FaCheck /> Continue with Google
          </button>
          <button className="linkedin-btn" onClick={() => window.location.href = "http://localhost:5001/auth/linkedin"}>
          <FaLinkedin /> Continue with LinkedIn
        </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={handleToggleShowPassword}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;