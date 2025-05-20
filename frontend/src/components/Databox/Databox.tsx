import React from "react";
import "./Databox.css";
/**
 * 📦 DataBox Component
 *
 * A reusable UI box that displays a header, a list of labeled values (which can be strings, numbers, or JSX),
 * and a footer link. Commonly used to display summarized data or stats.
 *
 * ## Example Usage:
 * ```tsx
 * <DataBox
 *   header="Profile Info"
 *   data={[
 *     { label: "Name", value: "Alex Khoury" },
 *     { label: "Website", value: <a href="https://example.com">Visit</a> },
 *   ]}
 *   footerText="View Full Profile"
 *   footerLink="/profile"
 * />
 * ```
 */

/**
 * Props for the DataBox component
 * @property header - The main title displayed at the top of the box
 * @property data - An array of objects, each with a `label` and a `value`. 
 *                  The value can be a string, number, or JSX (e.g., a link or styled span).
 * @property footerText - The text displayed in the footer area, typically a call to action
 * @property footerLink - The URL path or link to navigate when the footer is clicked
 */
interface DataBoxProps {
  header: string;
  data: {
    label: string;
    value: string | number | React.ReactNode;
  }[];
  footerText: string;
  footerLink: string;
}

const DataBox: React.FC<DataBoxProps> = ({ header, data, footerText, footerLink }) => {
  return (
    <div className="databox">
      <div className="databox-header">{header}</div>
      <div className="databox-content">
        {data.map((item, index) => (
          <div className="databox-item" key={index}>
            <span>{item.label}</span>
            <div className="databox-item-value">
              {/* Render value safely whether it's text or JSX */}
              {typeof item.value === 'string' || typeof item.value === 'number'
                ? item.value
                : item.value}
            </div>
          </div>
        ))}
      </div>
      <div className="databox-footer">
        <a href={footerLink}>{footerText} →</a>
      </div>
    </div>
  );
};

export default DataBox;