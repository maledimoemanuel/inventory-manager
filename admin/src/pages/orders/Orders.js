import React from "react";
import "./orders.css";

const Orders = () => {
  const orders = [
    { id: 1, customer: "John Doe", amount: "$250", status: "Pending" },
    { id: 2, customer: "Jane Smith", amount: "$120", status: "Shipped" },
    { id: 3, customer: "Michael Brown", amount: "$320", status: "Delivered" },
  ];

  return (
    <div className="orders">
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.amount}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
