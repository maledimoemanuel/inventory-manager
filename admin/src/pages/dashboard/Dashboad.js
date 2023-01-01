import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate counts from data
  const totalProducts = data.length;
  /*const ordersToday = data.filter(item => {
    const today = new Date().toISOString().split('T')[0];
    return new Date(item.orderDate).toISOString().split('T')[0] === today;
  }).length;*/
  //const activeUsers = data.filter(item => item.status === 'active').length;
  //const revenue = data.reduce((sum, item) => sum + (item.price || 0), 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/products");
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="dashboard">Loading...</div>;
  if (error) return <div className="dashboard error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome to the Admin Dashboard</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Orders Today</h3>
          <p>22</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>22</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>R963{/*revenue.toLocaleString()*/}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;