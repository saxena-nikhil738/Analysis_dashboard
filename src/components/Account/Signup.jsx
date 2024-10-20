import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const localData = JSON.parse(localStorage.getItem("users")) || []; // Parse localStorage data as an array
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    // Validate that both username and password fields are filled
    if (username === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }

    // Check if user already exists
    const userExists = localData.some((user) => user.username === username);

    if (userExists) {
      // If user exists, show warning and redirect to login page
      toast.warning("User already exists, please login", { autoClose: 1000 });
      navigate("/login");
    } else {
      // If new user, add to localData
      const newUser = {
        username: username,
        password: password,
      };

      // Add new user and save updated list to localStorage
      localData.push(newUser);
      localStorage.setItem("users", JSON.stringify(localData)); // Store as a JSON string

      // Save user credentials in cookies
      Cookies.set("username", username, { expires: 1 }); // 1-day expiration
      Cookies.set("password", password, { expires: 1 }); // 1-day expiration

      // Redirect to home page after signup
      navigate("/");
    }
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
