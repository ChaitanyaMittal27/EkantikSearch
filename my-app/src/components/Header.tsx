import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const mainContent = document.querySelector(".main-content");

        const handleScroll = () => {
            //console.log("ScrollY Position:", mainContent?.scrollTop); // Debugging
            if (mainContent && mainContent.scrollTop > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        if (mainContent) {
            mainContent.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (mainContent) {
                mainContent.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <header className={`header ${isScrolled ? "shrink" : ""}`}>
            <h1 className="title">Ekantik Question Search</h1>
            <nav className="nav-tabs">
                <ul>
                    <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Search</Link></li>
                    <li><Link to="/results" className={location.pathname === "/results" ? "active" : ""}>Results</Link></li>
                    <li><Link to="/all" className={location.pathname === "/all" ? "active" : ""}>All Questions</Link></li>
                    <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
