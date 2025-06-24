import React, { useEffect } from "react"
 import rigoImageUrl from "../assets/img/rigo-baby.jpg";
 import {loadMessage} from "../../service/APIservice";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Home = () => {
const { store, dispatch } = useGlobalReducer()

/*const info = {
    password: "password123",
    email: "user@example.com",
  };*/

	/*useEffect(() => {
		createSignup(dispatch)
	}, [])*/

	const email = store?.signup[0]?.email || ""
	


	useEffect(() => {
		loadMessage(dispatch)
	}, [])

	return (
	<div className="text-center mt-5">
		<h1 className="display-4">{email}</h1>
		<p className="lead">
			<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
		</p>
		<div className="alert alert-info">
			{store.message ? (
				<span>{store.message}</span>
			) : (
				<span className="text-danger">
					Loading message from the backend (make sure your python 🐍 backend is running)...
				</span>
			)}
		</div>
	</div>
)}; 

