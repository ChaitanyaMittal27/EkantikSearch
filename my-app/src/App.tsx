// Main Application - Routes & Layout Wrapper for Pages
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Search from "./components/Search";
import Results from "./components/Results";
import About from "./components/About";
import Footer from "./components/Footer";
import AllQuestions from "./components/AllQuestions";
import "./CSS/App.css";

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Search />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/all" element={<AllQuestions />} />
                </Routes>
            </div>
            <Footer/>
        </Router>
    );
};

export default App;
