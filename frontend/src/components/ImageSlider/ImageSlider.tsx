import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSlider.css";
/**
 * 📸 ImageSlide Interface
 * Defines the structure of each image object used in the slider.
 *
 * @property src - The image URL to display.
 * @property heading - The title or caption shown on the image.
 * @property buttonText - Text shown on the button overlay.
 * @property link - Route or URL to navigate when the button is clicked.
 */
interface ImageSlide {
  src: string;
  heading: string;
  buttonText: string;
  link: string;
}
/**
 * Props for the ImageSlider component
 *
 * @property images - An array of image slide objects that define the slider content.
 */
interface Props {
  images: ImageSlide[];
}
/**
 * 🖼️ ImageSlider Component
 *
 * An auto-advancing image carousel with overlayed text and button per image.
 * Each image transitions every 5 seconds and includes a button that routes to a given link.
 *
 * ## Example Usage:
 * ```tsx
 * const slides = [
 *   {
 *     src: "/images/interview.jpg",
 *     heading: "Ace Your Interviews",
 *     buttonText: "Start Now",
 *     link: "/interview",
 *   },
 *   {
 *     src: "/images/courses.jpg",
 *     heading: "Explore Our Courses",
 *     buttonText: "Browse",
 *     link: "/courses",
 *   },
 * ];
 *
 * <ImageSlider images={slides} />
 * ```
 */
const ImageSlider: React.FC<Props> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container">
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === current ? "active" : ""}`}
        >
          <img src={img.src} alt={`Slide ${index}`} />
          <div className="overlay">
            <h2>{img.heading}</h2>
            <button onClick={() => navigate(img.link)}>{img.buttonText}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;
