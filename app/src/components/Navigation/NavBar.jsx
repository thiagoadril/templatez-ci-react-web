import React from "react";
import { useAuth0 } from "../../hooks/contexts/auth-context";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const logoutWithRedirect = () =>
        logout({
            returnTo: window.location.origin
        });

    return (
        <div style={{ padding: 20 }}>
            {!isAuthenticated && (
                <div>
                    <div>
                        <button onClick={() => loginWithRedirect({})}>Log in</button>
                    </div>
                </div>
            )}
            {isAuthenticated && (
                <div>
                    <div>
                        <nav>
                            <NavLink to="/secure/profile" style={{ padding: 10 }}>Profile</NavLink>
                            <NavLink to="/secure/customer" style={{ padding: 10 }}>Customer</NavLink>
                            <button onClick={() => logoutWithRedirect({})}> Logout </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;