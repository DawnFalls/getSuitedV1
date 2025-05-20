/**
 * 📚 LeftSideBar Component
 *
 * This component renders a sidebar navigation menu for a course details page.
 * It displays the course title and anchors to key sections on the page.
 *
 * 📦 Features:
 * - Dynamically shows the current course title
 * - Provides anchor links to jump to video, learning goals, and content sections
 * - Includes a link back to the main Courses page
 *
 * 📍 Intended to be used on the Course Details page.
 */
import React from "react";
import { Link } from "react-router-dom";
import "./LeftSideBar.css";


/**
 * Props for the LeftSideBar component
 * @property courseTitle - Optional course title to display at the top of the sidebar
 */
interface SidebarProps {
  courseTitle?: string;
}

const LeftSideBar: React.FC<SidebarProps> = ({ courseTitle }) => {
  return (
    <div className="left-sidebar">
      <div className="sidebar-course-name">
        {courseTitle || "Course"}
      </div>
      <ul className="sidebar-links">
        <li><a href="#video">▶ Preview Video</a></li>
        <li><a href="#learn">📘 What You'll Learn</a></li>
        <li><a href="#contents">📂 Course Contents</a></li>
        <li><Link to="/courses">← Back to Courses</Link></li>
      </ul>
    </div>
  );
};

export default LeftSideBar;
