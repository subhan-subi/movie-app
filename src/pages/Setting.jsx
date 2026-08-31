import React from "react";
import "./Settings.css";

export function Settings() {
  const handleClearCache = () => {
    localStorage.clear();
    alert("App Cache and Local Data cleared successfully!");
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">⚙️ App Settings</h2>

      {/* App Info Card */}
      <div className="settings-card">
        <h3>App Information</h3>
        <div className="settings-row">
          <span className="settings-label">App Name</span>
          <span className="settings-val">Cineverse</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Version</span>
          <span className="settings-val">v1.0.0 (Latest)</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Server Status</span>
          <span className="settings-val status-badge">● Online</span>
        </div>
      </div>

      {/* APK Download Card */}
      <div className="settings-card">
        <h3>Official Android App</h3>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "10px" }}>
          Get the mobile app for full HD streaming and direct access.
        </p>
        <a 
          href="https://drive.google.com/file/d/1qwpKtXfkkWnirLxxnN8sY1_I02EjBVfy/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="download-apk-btn"
        >
          📱 Download Cineverse APK
        </a>
      </div>

      {/* Storage & Utility */}
      <div className="settings-card">
        <h3>Storage & Data</h3>
        <div className="settings-row">
          <span className="settings-label">Clear App Cache</span>
          <button onClick={handleClearCache} className="action-btn">
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}