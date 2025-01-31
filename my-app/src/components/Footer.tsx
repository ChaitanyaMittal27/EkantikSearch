import React, { useState, useEffect } from "react";
import "../css/Footer.css";

const Footer: React.FC = () => {
    const [showFooter, setShowFooter] = useState(false);
    const [showGoToTop, setShowGoToTop] = useState(false);

    useEffect(() => {
        const mainContent = document.querySelector(".main-content");

        const handleScroll = () => {
            if (!mainContent) return;

            const scrollPosition = mainContent.scrollTop + mainContent.clientHeight;
            const pageHeight = mainContent.scrollHeight;

            // Show footer only when scrolled to bottom
            if (scrollPosition >= pageHeight - 10) {
                setShowFooter(true);
            } else {
                setShowFooter(false);
            }

            // Show "Go to Top" button after scrolling 200px
            if (mainContent.scrollTop > 200) {
                setShowGoToTop(true);
            } else {
                setShowGoToTop(false);
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

    // Scroll to top function
    const scrollToTop = () => {
        const mainContent = document.querySelector(".main-content");
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <>
            {/* Footer - Hidden until user reaches bottom */}
            <footer className={`footer ${showFooter ? "visible" : "hidden"}`}>
                <p className="radhe-text">राधे राधे</p>
                <p className="footer-text">© 2025 Ekantik Question Search</p>
            </footer>

            {/* "Go to Top" Button - Shows after scrolling 200px */}
            {showGoToTop && (
                <button className="go-to-top" onClick={scrollToTop}>
                    ⬆ Go to Top
                </button>
            )}
        </>
    );
};

export default Footer;
