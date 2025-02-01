// About Page - Displays Project Description & GitHub Link
import React from "react";
import "../css/About.css";

const About: React.FC = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">About Ekantik Question Search</h1>
            <p className="about-description">
                Welcome to Ekantik Question Search, a spiritual archive designed to help seekers easily find answers to their queries.  
                This tool allows users to search through past Q&A discussions, ensuring valuable wisdom is never lost.  
                Our goal is to make spiritual knowledge more accessible and organized for everyone.
            </p>
            <p className="about-github">
                View the project on <a href="https://github.com/ChaitanyaMittal27/Ekankik_QS" target="_blank" rel="noopener noreferrer">GitHub</a>
            </p>
        </div>
    );
};

export default About;
