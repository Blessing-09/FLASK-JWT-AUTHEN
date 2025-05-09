import React, { useState } from "react"; //useState is imported from react
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { createLogin } from "../../service/APIservice";




const Login = () => {
  const navigate = useNavigate()
  const {store, dispatch} = useGlobalReducer()
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("")
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormInput = async (e) => {
    e.preventDefault();
    const success = await createLogin(dispatch, formData);
        if (success) {
          navigate("/"); // Navigate after successful signup
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
            value={loginData.email}
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
            value={loginData.password}
            name="password"
            onChange={handleChange}
            type="password"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="enter password"
          />
        </div>
        {/*If error is truthy (i.e., has a value like a non-empty string), then it renders the <p> tag with the error message inside it.*/}
        {error && <p style = {{color: "red"}}>{error}</p>}
        <button type= "submit">Login</button>
      </div>
    </form>
  );
};

export default Login;
