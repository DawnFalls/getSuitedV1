import React from "react";
import "./SliderBar.css";

interface SliderBarProps {
  children: React.ReactNode;
}

const SliderBar: React.FC<SliderBarProps> = ({ children }) => {
  return (
    <div className="slider-bar">
      {children}
    </div>
  );
};

export default SliderBar;