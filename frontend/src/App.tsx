/**
 * 📱 App.tsx
 *
 * This is the root component of the getSuited frontend.
 * It defines all frontend routes using React Router and sets up global state
 * like the loading screen before initial rendering.
 *
 * 📦 Features:
 * - 2-second splash loader (can be customized or removed)
 * - Full route mapping to all major pages and components
 * - Fallback route to redirect unknown URLs to `/`
 */
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Global styles
import "./App.css";

// Pages
import LandingPage from "./pages/LandingPage/LandingPage";
import SignIn from "./pages/SignInPage/SignIn";
import SignUp from "./pages/SignUpPage/SignUp";
import CourseDetails from "./pages/CourseDetailsPage/CourseDetails";
import Courses from "./pages/CoursesPage/Courses";
import OAuthSuccess from "./pages/OAuthSuccess";
import InterviewHome from "./pages/Interview/InterviewHome";
import TrainingChatbot from "./pages/TrainingChatbot/TrainingChatbot";

// Components
import Loading from "./components/Loading/Loading";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import UserProfile from "./pages/UserProfile/UserProfile";
import EvaluationPage from "./components/Interview/EvaluationPage/EvaluationPage";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

    /**
   * ⏱️ Fake splash screen delay (2 seconds)
   * This simulates a loading experience — optional.
   */
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000); // 2s loader
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Loading />;

  /**
   * 🗺️ Main Route Definitions
   * Each route maps to a specific page or feature
   */
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetails />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/interview" element={<InterviewHome />} />
      <Route path="/evaluation" element={<EvaluationPage />} />
      <Route path="/training" element={<TrainingChatbot/>} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
