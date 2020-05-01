import React, { useState } from "react";
import { useAuth0 } from "../../hooks/contexts/auth-context";
import { ApiConfig } from "../../configs/api-config";

const apiURL = `${ApiConfig.baseURL}/api/v1`

const CustomerPage = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [showResult, setShowResult] = useState(false);
  const [customers, setCustomers] = useState([]);

  if (loading || !user) {
    return "Loading...";
  }

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`${apiURL}/customer`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      setShowResult(true);
      setCustomers(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: "inline-table" }}>
      <div>
        <button onClick={callApi}>API customers information</button>
      </div>
      {showResult ? (
        Array.isArray(customers) ? (
          <div style={{ display: "grid" }}>
            <div style={{ display: "flex" }}>
              <h2>Customer Information</h2>
            </div>
            <div style={{ display: "flex" }}>
              <table style={{ textAlign: "left", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((value, index) =>
                    <tr key={"row" + index}>
                      <td key={"row-name" + index}>{value.name}</td>
                      <td key={"row-email" + index}>{value.email}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : <div>No existing customers</div>
      ) :
        <div>No loaded customers</div>}
    </div>
  );
};

export default CustomerPage;