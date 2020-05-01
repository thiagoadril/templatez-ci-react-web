import React from "react";
import { Router, Route, Switch } from "react-router-dom";

/**
 * Contexts
 */
import { useAuth0 } from "./hooks/contexts/auth-context";

/**
 * History
 */
import history from "./utils/history";

/**
 * Components
 */
import NavBar from "./components/Navigation/NavBar"

/** 
 * Routes
 * */
import PrivateRoute from "./components/routes/PrivateRoute";

/** 
 * Pages
 * */
import HomePage from "./pages/HomePage";
import SecurePage from "./pages/secure/SecurePage";
import ProfilePage from "./pages/secure/ProfilePage";
import CustomerPage from "./pages/secure/CustomerPage";

/**
 * Styles
 */
import './App.css';

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return "Loading...";
  }

  return (
    <Router history={history}>
      <div style={{ padding: 20, textAlign: "center" }}>
        <NavBar />
        <div>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <PrivateRoute path="/secure" exact component={SecurePage} />
            <PrivateRoute path="/secure/profile" exact component={ProfilePage} />
            <PrivateRoute path="/secure/customer" exact component={CustomerPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
