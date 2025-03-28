import React from "react";
import "./settings.css";

const Settings = () => {
  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="settings-options">
        <div>
          <label>Dark Mode</label>
          <input type="checkbox" />
        </div>
        <div>
          <label>Notifications</label>
          <input type="checkbox" />
        </div>
        <button>Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;
