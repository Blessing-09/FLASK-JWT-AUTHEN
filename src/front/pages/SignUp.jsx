import React, { useState } from "react"; //useState is imported from react
import { useNavigate } from "react-router-dom"; //useParam, useLocation, Link, useNavigate de react-dom
import useGlobalReducer from "../hooks/useGlobalReducer";
import { createSignup } from "../../service/APIservice";
//import Login from "../pages/Login";




const SignUp = () => {
  const navigate = useNavigate()
  const {store, dispatch} = useGlobalReducer()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("")
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormInput = async (e) => {
    e.preventDefault();
    const success = await createSignup(dispatch, formData);
    if (success) {
      navigate("/login"); // Navigate after successful signup
    } else {
      setError("Something went wrong during signup."); // Set error message if signup isnt successful
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
            placeholder="enter email"
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
            placeholder="enter password"
          />
        </div>
        {error && <p style = {{color: "red"}}>{error}</p>} {/* Show error message from the setError update*/}
        <button type= "submit">Register</button>
      </div>
    </form>
  );
};

export default SignUp;
