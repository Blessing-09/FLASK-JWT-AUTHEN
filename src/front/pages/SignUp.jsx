import React, { useState } from "react"; //useState is imported from react
import { useNavigate } from "react-router-dom"; //useParam, useLocation, Link, useNavigate de react-dom
import useGlobalReducer from "../hooks/useGlobalReducer";
import { createSignup } from "../../service/APIservice";




const SignUp = () => {

  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormInput = async (e) => {
    e.preventDefault();

    setError(""); // Clear previous errors before submitting
    setMsg("");

    const { email, password, confirmPassword } = formData;

    // Check for empty fields
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      return;
    }
    if (!email.includes("@") || !email.includes(".") || !email.includes("com")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    //DESTRUCTURING ALLOW US TO GO FROM formData.password to password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return; //to stop the function
    }

    // Now send to backend (optional: remove confirmPassword from the payload)
    //Takes the value of confirmPassword and store it in confirmPword variable to avoid conflict from scope in line 34
    const { confirmPassword: confirmPword, ...dataToSend } = formData;

    const response = await createSignup(dispatch, dataToSend);
    // Check if the response indicates success
    if (response.success) {
      setMsg(response.message);
      setTimeout(() => {
        navigate("/login"); // Navigate after successful signup
      }, 3000);
    } else {
      setError(response.message || "Something went wrong during signup.");
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
        <h3 className="mb-4 text-center text-success">Sign Up</h3>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email
          </label>
          <input
            value={formData.email}
            name="email"
            onChange={handleChange}
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password
          </label>
          <input
            value={formData.password}
            name="password"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label fw-semibold">
            Confirm Password
          </label>
          <input
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm password"
            required
          />
        </div>

        {error && <p className="text-danger small mt-2">{error}</p>}
        {msg && <p className="text-success small mt-2">{msg}</p>}

        <button type="submit" className="btn btn-success w-100 mt-3">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
