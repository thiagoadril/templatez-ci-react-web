
import React from "react";
import { useAuth0 } from "../../hooks/contexts/auth-context";

const ProfilePage = () => {
    const { loading, user } = useAuth0();

    if (loading || !user) {
        return "Loading...";
    }

    return (
        <div style={{ margin: "0 auto", width: "50%" }}>
            <div>
                <img
                    src={user.picture}
                    alt="Profile"
                    style={{ maxWidth: 120 }}
                />
            </div>
            <div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>

            <div>
                <div style={{ display: "grid" }}>
                    <div style={{ display: "flex" }}>
                        <h2>User Information</h2>
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
                                {Object.entries(user).map((item, index) =>
                                    <tr key={"row" + index}>
                                        <td key={"row-name" + index}>{item[0]}</td>
                                        <td key={"row-email" + index}>{item[1].toString()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <h4>Raw User Information</h4>
            <p>
                {JSON.stringify(user, null, 2)}
            </p>
        </div>
    );
};

export default ProfilePage;