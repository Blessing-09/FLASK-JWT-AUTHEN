import React, { useState } from "react"; //useState is imported from react
import useGlobalReducer from "../hooks/useGlobalReducer";
import { createLogin } from "../../service/APIservice";




const Login = () => {
  const {store, dispatch} = useGlobalReducer()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormInput = (e) => {
    e.preventDefault();
    createLogin(dispatch, formData)
 
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
        <button type= "submit">Register</button>
      </div>
    </form>
  );
};

export default Login;
