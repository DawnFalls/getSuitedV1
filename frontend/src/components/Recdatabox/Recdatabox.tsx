import React from "react";
import "./Recdatabox.css";

interface RecdataboxProps {
  header: string;
  data: {
    label: string;
    value: string | number;
  }[];
  footerText: string;
  footerLink: string;
}

const Recdatabox: React.FC<RecdataboxProps> = ({ header, data, footerText, footerLink }) => {
  return (
    <div className="recdatabox">
      <div className="recdatabox-header">{header}</div>
      <div className="recdatabox-content">
      {data.map((item, index) => (
  <div className="recdatabox-item" key={index}>
    <span className="label">{item.label}</span>
    <span className="value">{item.value}</span>
  </div>
))}

      </div>
      <div className="recdatabox-footer">
        <a href={footerLink}>{footerText} →</a>
      </div>
    </div>
  );
};


export default Recdatabox;