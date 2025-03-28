import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/dashboard/Dashboad";
import Inventory from "./pages/inventory/Inventory";
import Orders from "./pages/orders/Orders"
import Settings from "./pages/settings/Settings";
import Notifications from "./pages/notifications/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <AdminLayout>
              <Inventory />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <Orders />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <AdminLayout>
              <Notifications />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
