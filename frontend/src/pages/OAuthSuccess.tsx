/**
 * ✅ OAuthSuccess.tsx
 *
 * Handles post-OAuth login redirection.
 * After authentication via Google or LinkedIn, the backend redirects the user here
 * with a JWT token as a URL parameter (`?token=...`).
 *
 * 📦 Features:
 * - Extracts token from URL query string
 * - Verifies token with backend
 * - Saves token and decoded user info in localStorage
 * - Redirects to homepage if successful, or to `/signin` on error
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.decoded) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(data.decoded));
            navigate("/");
          } else {
            navigate("/signin");
          }
        })
        .catch(() => navigate("/signin"));
    } else {
      navigate("/signin");
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default OAuthSuccess;