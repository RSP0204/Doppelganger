const Footer = () => {
    return (
        <footer className="py-8 text-center text-sm text-muted-foreground">
            <div className="flex justify-center space-x-4">
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                {/* Social media icons placeholder */}
                <a href="#">X</a>
                <a href="#">LinkedIn</a>
            </div>
            <p className="mt-4">&copy; 2025 Your Company. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
