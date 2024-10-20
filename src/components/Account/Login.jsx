import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  // Check if user is already logged in
  const checkLogin = () => {
    const localData = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching username and password
    const user = localData.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      // If user exists, set cookies and navigate to home page
      Cookies.set("username", username);
      Cookies.set("password", password);
      toast.success("Logged in successfully", { autoClose: 1000 });
      localStorage.removeItem("redirectAfterLogin");
      navigate("/");
    } else {
      // Show warning if user doesn't exist
      toast.warning("User does not exist, please signup", { autoClose: 1000 });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (checkLogin(username, password)) {
      navigate("/"); // Redirect to home if already logged in
    } else {
      setError("Invalid username or password! Please sign up.");
    }
  };

  return (
    <div className="container-f">
      <div className="form">
        <div className="account-type">Please login</div>
        <div className="input-field">
          <label className="username" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            id="username"
            required
          />
        </div>
        <div className="input-field">
          <label className="password" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            id="password"
            required
          />
        </div>
        <div className={error ? "visible-error" : "invisible-error"}>
          {error}
        </div>
        <button onClick={handleLogin} className="create-button">
          LOGIN
        </button>
        <div className="switch-account">
          <div className="signup-login">
            <div className="exist">
              <Link className="login-link" to="/signup">
                Create Account?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
