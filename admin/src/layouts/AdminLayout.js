import React from "react";
import Sidebar from "../components/Sidebar"
import "./adminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
