/**
 * 👤 UserProfile Page
 *
 * This page displays and manages the authenticated user’s profile.
 * It supports:
 * - Viewing and editing name and profile picture
 * - Viewing evaluation reports (uploaded interview PDFs)
 * - Displaying questionnaire score and interview count
 * - Logging out
 *
 * 📦 Features:
 * - Profile picture upload with live preview
 * - Name editing with backend update
 * - Fetches evaluation PDFs
 * - Dynamic DataBoxes for progress and interviews
 */

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import DataBox from "../../components/Databox/Databox";
import { FaCheck as RawFaCheck, FaLinkedin as RawFaLinkedin, FaEdit as RawFaEdit } from "react-icons/fa";
import { FaGoogle as RawFaGoogle } from "react-icons/fa6";
import "./UserProfile.css";
import { Link, useNavigate } from "react-router-dom";

const FaCheck = RawFaCheck as unknown as React.FC;
const FaLinkedin = RawFaLinkedin as unknown as React.FC;
const FaEdit = RawFaEdit as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const FaGoogle = RawFaGoogle as unknown as React.FC;

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editingName, setEditingName] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  const navigate = useNavigate();

  /**
   * 🧠 On page load — Load user from localStorage
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNameInput(parsedUser.name);
    }
    setLoading(false);
  }, []);

  /**
   * 📥 Fetch evaluation PDF reports
   */
  useEffect(() => {
    const fetchEvaluations = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:5001/users/evaluations?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch evaluations");
        const data = await res.json();
        setEvaluations(data);
      } catch (err) {
        console.error("Error fetching evaluations:", err);
      }
    };

    if (user?.email) {
      fetchEvaluations();
    }
  }, [user]);

  /**
   * ✏️ Save edited user name to backend
   */
  const handleNameUpdate = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5001/users/${user._id}/name`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: nameInput }),
        }
      );

      if (!res.ok) throw new Error("Failed to update name");

      const { user: updated } = await res.json();
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setEditingName(false);
    }
  };

  /**
   * 📤 Upload a new profile picture
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("profilePicture", e.target.files[0]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5001/users/${user._id}/profilePicture`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to upload profile picture: ${errorText}`);
      }

      const data = await res.json();
      const updatedProfilePicture = data.user.profilePicture;

      if (updatedProfilePicture !== user.profilePicture) {
        const updatedUser = { ...user, profilePicture: updatedProfilePicture };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      setEditingImage(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  /**
   * 🔓 Sign out user
   */
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  if (loading || !user) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="profile-container">
        <div className="profile-banner" />

        <div className="profile-info">
          <img
            src={user.profilePicture || "/default-avatar.png"}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
            alt="Profile"
            className="profile-pic"
          />

          {editingImage ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="upload-input"
            />
          ) : (
            <button
              onClick={() => setEditingImage(true)}
              className="edit-img-btn"
            >
              Change Picture
            </button>
          )}

          <div className="profile-name-edit">
            {editingName ? (
              <>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="edit-input"
                />
                <button onClick={handleNameUpdate} className="save-btn">
                  Save
                </button>
              </>
            ) : (
              <>
                <h2>{user.name}</h2>
                <FaEdit
                  onClick={() => setEditingName(true)}
                  className="edit-icon"
                />
                <button className="signout-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        <div className="databoxes-wrapper">
          <DataBox
            header="Your Progress"
            data={[{ label: "Score", value: user.score || 0 }]}
            footerText="View More"
            footerLink="/progress"
          />

          <DataBox
            header="Evaluation Reports"
            data={
              evaluations.length > 0
                ? evaluations.map((evalItem, index) => ({
                    label: evalItem.fileName || `Evaluation ${index + 1}`,
                    value: (
                      <a
                        href={evalItem.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-link"
                        style={{ color: '#0066cc', textDecoration: 'underline' }}
                      >
                        View
                      </a>
                    ),
                  }))
                : [{ label: 'No reports yet', value: '-' }]
            }
            footerText="Upload More"
            footerLink="/interview"
          />

          <DataBox
            header="Interviews"
            data={[{ label: "Completed", value: evaluations.length }]}
            footerText="View Interviews"
            footerLink="/interview"
          />
        </div>
      </div>
    </>
  );
};

export default UserProfile;
