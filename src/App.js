import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loginResult, setLoginResult] = useState("");
  const [dashboardData, setDashboardData] = useState({});
  const [showDashboard, setShowDashboard] = useState(false);

  const handleAction = () => {
    if (isLogin) {
      handleLogin();
    } else {
      handlePost();
    }
  };

  const handlePost = () => {
    axios.post('http://localhost:5000/register', { name, email })
      .then((response) => {
        const result = response.data;
        if (result) {
          alert("Data saved successfully");
          setEmail("");
          setName("");
        }
      })
      .catch((error) => {
        console.error("POST request error:", error);
        alert(`${error}`);
      });
  }

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { name, email })
      .then((response) => {
        const result = response.data;
        setLoginResult(result.success ? "Login successful" : "Login unsuccessful");
        if (result.success) {
          // If login is successful, fetch dashboard data
          fetchDashboardData();
          setShowDashboard(true);
        }
      })
      .catch((error) => {
        console.error("Login request error:", error);
        alert("Something went wrong during login.");
      });
  }

  const fetchDashboardData = () => {
    axios.get(`http://localhost:5000/dashboard?name=${name}`)
      .then((response) => {
        const data = response.data;
        setDashboardData(data);
      })
      .catch((error) => {
        console.error("Dashboard data request error:", error);
        alert("Failed to fetch dashboard data.");
      });
  }

  return (
    <div className="container">
      {showDashboard ? (
        <div>
          <h1>Welcome to Your Dashboard, {name}!</h1>
          <p>Dashboard Data:</p>
          <ul>
            {Object.entries(dashboardData).map(([key, value]) => (
              <li key={key}>{`${key}: ${value}`}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(f) => setName(f.target.value)}
            />
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={handleAction}>
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <p>{loginResult}</p>
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
