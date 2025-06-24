import React, { useState } from "react"; //useState is imported from react
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { createLogin } from "../../service/APIservice";
import { array } from "prop-types";




const Login = () => {
  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()
  const [loginData, setLoginData] = useState({
    email: store?.signup.at(-1)?.email || "",
    password: "",
  });
  console.log(store)
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormInput = async (e) => {
    e.preventDefault();

    setError(""); // Clear previous errors before submitting
    setMsg("");

    const response = await createLogin(dispatch, loginData);
    if (response.success) {
      setMsg(response.message || "Login successful...redirecting.");
      //  setMsg(response.message || "Login successful...redirecting."); here there is no response.message so the || would always run.
      setTimeout(() => {
        navigate("/profile"); // Navigate after successful login
      }, 2000);
    } else {
      setError(response.error || "Something went wrong during login."); // Set error message if login isnt successful
    }
  };

  //onChange={(e) => setFormData(prevData => ({...prevData, email:e.target.value}))}
   return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form
        onSubmit={handleFormInput}
        className="p-4 rounded shadow bg-white"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="mb-4 text-center text-primary">Login</h3>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email
          </label>
          <input
            value={loginData.email}
            name="email"
            onChange={handleChange}
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password
          </label>
          <input
            value={loginData.password}
            name="password"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="text-danger small mt-2">{error}</p>}
        {msg && <p className="text-success small mt-2">{msg}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;