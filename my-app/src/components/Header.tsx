import { Link } from "react-router-dom";
import "../CSS/Header.css";

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1 className="title">
               Ekankik Question Search
            </h1>
            <nav className="nav-tabs">
                <ul>
                    <li><Link to="/">Search</Link></li>
                    <li><Link to="/results">Results</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/all">All Questions</Link></li>
                    <li>
                        <button className="lang-button">
                            {/* {language === "en" ? "हिंदी" : "English"} */}
                            English | हिंदी
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
