import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../../utils/constant";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    let [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens")).user
            : null
    );

    let [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    let loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch(url + "/user/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            }),
        });
        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(data.user);
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/");
        } else {
            alert("Something went wrong!");
        }
    };

    let signupUser = async (e, input_file) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", e.target.username.value);
        formData.append("password", e.target.password.value);
        formData.append("email", e.target.email.value);
        formData.append("first_name", e.target.first_name.value);
        formData.append("last_name", e.target.last_name.value);
        formData.append("avatar", input_file.files[0]);

        let response = await fetch(url + "/user/signup/", {
            method: "POST",
            body: formData,
        });
        if (response.status === 201) {
            navigate("/login");
        } else {
            alert("Loi tao tai khoan");
        }
    };

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    let updateToken = async () => {
        let response = await fetch(url + "/user/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: authTokens?.refresh }),
        });

        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens({
                user: user,
                access: data.access,
                refresh: data.refresh,
            });
            localStorage.setItem(
                "authTokens",
                JSON.stringify({
                    user: user,
                    access: data.access,
                    refresh: data.refresh,
                })
            );
        } else {
            logoutUser();
        }

        if (loading) {
            setLoading(false);
        }
    };

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        signupUser: signupUser,
        logoutUser: logoutUser,
    };

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        let minutes = 1000 * 60 * 4;

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, minutes);
        return () => clearInterval(interval);
    }, [authTokens, loading, updateToken]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
