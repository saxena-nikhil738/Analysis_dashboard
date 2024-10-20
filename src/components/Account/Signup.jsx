import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Cookies from "js-cookie";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }

    // Save user data in cookies
    Cookies.set("username", username, { expires: 1 }); // 1-day expiration
    Cookies.set("password", password, { expires: 1 }); // 1-day expiration

    // Redirect to the home page after signup
    navigate("/");
  };

  return (
    <div className="container-f">
      <div className="form">
        <div className="account-type">Create Account</div>
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
        <button onClick={handleSignup} className="create-button">
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default Signup;
