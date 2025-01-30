import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Search from "./components/Search";
import Results from "./components/Results";
import About from "./components/About";
import Footer from "./components/Footer";
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
                </Routes>
            </div>
            <Footer lastUpdated="Video 8000 on 2025-01-25" onUpdate={() => alert("Updating database...")} />
        </Router>
    );
};

export default App;
