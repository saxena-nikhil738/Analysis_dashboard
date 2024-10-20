import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  // Check if user is already logged in
  const checkLogin = () => {
    const storedUsername = Cookies.get("username");
    const storedPassword = Cookies.get("password");
    return storedUsername && storedPassword;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (checkLogin()) {
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
