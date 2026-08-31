import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="cineverse-footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/settings">Settings</Link>
          <a 
            href="https://drive.google.com/file/d/1qwpKtXfkkWnirLxxnN8sY1_I02EjBVfy/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download APK
          </a>
        </div>

        <p className="footer-disclaimer">
          <strong>Disclaimer:</strong> Cineverse does not host, upload, or store any media files on its servers. All content is provided by non-affiliated third parties. Cineverse simply indexes content found publicly on the internet.
        </p>

        <p className="footer-copyright">
          © 2026 <span>Cineverse</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}