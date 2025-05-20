/**
 * 🎓 Courses Page
 *
 * Displays all available courses for authenticated users.
 * If the user is not signed in, shows a modal prompting login.
 *
 * 📦 Features:
 * - Verifies user authentication via token
 * - Fetches all courses from backend
 * - Dynamically builds and filters category tabs
 * - Displays grouped and horizontally scrollable courses by category
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Recdatabox from "../../components/Recdatabox/Recdatabox";
import Navbar from "../../components/Navbar/Navbar";
import "./Courses.css";

interface Course {
  _id: string;
  Title: string;
  Description: string;
  Category: string;
}

interface UserData {
  name: string;
  profilePicture?: string;
}

/**
 * 🔐 Modal shown if user is not authenticated
 */
const RegisterPromptModal: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Please Sign In or Register</h2>
      <p>You must be signed in to view courses.</p>
      <button className="modal-btn" onClick={onRedirect}>Go to Login</button>
    </div>
  </div>
);

/**
 * 🎓 Courses Page Component
 * Authenticates user → Fetches courses → Filters by category → Displays grouped results
 */
const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [step, setStep] = useState<'checking' | 'prompt' | 'allowed'>('checking');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.status === 200) return res.json();
          throw new Error('Unauthorized');
        })
        .then(data => {
          if (data?.decoded) {
            setUser({
              name: data.decoded.name,
              profilePicture: data.decoded.profilePicture,
            });
            setStep('allowed');

            fetch("http://localhost:5001/courses")
              .then(res => res.json())
              .then(data => setCourses(data))
              .catch(err => console.error("Failed to fetch courses", err));
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setStep('prompt');
        });
    } else {
      setStep('prompt');
    }
  }, []);

  const allCategories = ["All", ...Array.from(new Set(courses.map(c => c.Category)))];

  const filteredCourses = selectedCategory === "All"
    ? courses
    : courses.filter(course => course.Category === selectedCategory);

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    if (!acc[course.Category]) acc[course.Category] = [];
    acc[course.Category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="courses-page">
      <Navbar user={user} />

      {step === 'prompt' && (
        <RegisterPromptModal onRedirect={() => navigate('/signin')} />
      )}

      {step === 'allowed' && (
        <div className="courses-container">
          <h1 className="courses-heading">Featured Courses</h1>

          {/* Category Tabs */}
          <div className="category-tabs">
            {allCategories.map((category) => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {Object.entries(groupedCourses).map(([category, group], index) => (
            <div
              key={category}
              className="category-group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <h2 className="category-title">{category}</h2>
              <div className="horizontal-courses-scroll">
              {group.map((course, i) => (
                <div
                  key={course._id}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  className="recdatabox fade-in"
                >
                  <div className="recdatabox-content">
                    <h3>{course.Title}</h3>
                    <p className="recdatabox-description">{course.Description}</p>
                    <div className="recdatabox-meta">
                      <span className="label">Category:</span>
                      <span className="value">{course.Category}</span>
                    </div>
                  </div>
                  <div className="recdatabox-footer">
                    View Course →
                  </div>
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
