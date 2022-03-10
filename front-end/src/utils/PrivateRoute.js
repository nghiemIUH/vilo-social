import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../components/user/authContext";

const PrivateRoute = ({ Component }) => {
    const { user } = useContext(AuthContext);
    return user ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
