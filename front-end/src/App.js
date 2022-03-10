import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/menu/menu";
import Social from "./components/social/social";
import Login from "./components/user/login";
import AuthContext from "./components/user/authContext";
import PrivateRoute from "./utils/PrivateRoute";
import ListFriend from "./components/chat/listFriend";
import Signup from "./components/user/signup";

function App() {
    const { user } = useContext(AuthContext);
    return (
        <div className="App">
            {user ? <Menu /> : ""}
            <Routes>
                <Route
                    path="/"
                    exact
                    element={<PrivateRoute Component={<ListFriend />} />}
                ></Route>

                <Route path="/login" element={<Login />} exact />
                <Route path="/signup" element={<Signup />} exact />

                <Route path="/social" element={<Social />} exact />
            </Routes>
        </div>
    );
}

export default App;
