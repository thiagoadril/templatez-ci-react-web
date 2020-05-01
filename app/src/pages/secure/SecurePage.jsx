
import React, { Fragment } from "react";
import { useAuth0 } from "../../hooks/contexts/auth-context";

const SecurePage = () => {
    const { loading, user } = useAuth0();

    if (loading || !user) {
        return "Loading...";
    }

    return (
        <Fragment>
            <h2>Secure Page</h2>
            <div>
                <h3>Hello, {user.name}! You are now on a secure page!</h3>
            </div>
        </Fragment>
    )
};

export default SecurePage;