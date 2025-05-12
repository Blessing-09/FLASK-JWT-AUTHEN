import React, { useState } from "react"; //useState is imported from react
import { useNavigate } from "react-router-dom"; //useParam, useLocation, Link, useNavigate de react-dom
import useGlobalReducer from "../hooks/useGlobalReducer";
import { createSignup } from "../../service/APIservice";




const SignUp = () => {
  const navigate = useNavigate()
  const {store, dispatch} = useGlobalReducer()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("")

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormInput = async (e) => {
    e.preventDefault();
    
    setError(""); // Clear previous errors before submitting

    if(formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return; //to stop the function
    }

    // Now send to backend (optional: remove confirmPassword from the payload)
  const { confirmPassword, ...dataToSend } = formData;

   const response = await createSignup(dispatch, dataToSend);
    // Check if the response indicates success
    if (response.success) {
      navigate("/login"); // Navigate after successful signup
    } else {
      setError(response.message || "Something went wrong during signup.");
    }
  };
  //onChange={(e) => setFormData(prevData => ({...prevData, email:e.target.value}))}
  return (
    <form onSubmit={handleFormInput}>
      <div>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput" className="form-label">
            Email
          </label>
          <input
            value={formData.email}
            name="email"
            onChange={handleChange}
            type="text"
            className="form-control"
            id="formGroupExampleInput"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput2" className="form-label">
            Password
          </label>
          <input
            value={formData.password}
            name="password"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Enter password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput2" className="form-label">
            Confirm password
          </label>
          <input
            value={formData.confirmPassword}
            name="confirmPassword"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Confirm password"
          />
        </div>
        {/* Show error message from the setError update*/}
        {error && <p style = {{color: "red"}}>{error}</p>} 
        <button type= "submit">Sign Up</button>
      </div>
    </form>
  );
};

export default SignUp;
