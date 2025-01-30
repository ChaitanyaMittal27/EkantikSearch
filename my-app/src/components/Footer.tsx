import "../CSS/Footer.css";

interface FooterProps {
    lastUpdated: string;
    onUpdate: () => void;
}

const Footer: React.FC<FooterProps> = ({ lastUpdated, onUpdate }) => {
    return (
        <footer className="footer">
            <p className="radhe-text">🌸 राधे राधे 🌸</p>
            <div className="update-section">
                <p>Last updated: {lastUpdated}</p>
                <button onClick={onUpdate} className="update-button">Update</button>
            </div>
        </footer>
    );
};

export default Footer;
