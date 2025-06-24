import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { logoutUser } from "../../service/APIservice";



export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	// Get token directly from sessionStorage
	const [token, setToken] = useState(() => {
		const tokenData = sessionStorage.getItem("authToken");
		return tokenData ? JSON.parse(tokenData)?.token : null;
	});

	useEffect(() => {
		// Watch session storage changes (optional, for more advanced use)
		const interval = setInterval(() => {
			const tokenData = sessionStorage.getItem("authToken");
			const token = tokenData ? JSON.parse(tokenData)?.token : null;
			setToken(token);
		}, 500); // Check every 500ms (optional)

		return () => clearInterval(interval);
	}, []);

	const handleLogout = async () => {
		const response = await logoutUser(dispatch);
		if (response.success) {
			setToken(null);
			navigate("/login");
		} else {
			alert(response.message || "Logout failed");
		}
	};


	return (
		<nav className="navbar navbar-light bg-dark">
			<div className="container">

				<div className="ml-auto">
					<Link to="/signup">
						<button className="btn btn-success">SIGN UP</button>
					</Link>
				</div>
				{!token ? (
					<>
						<div className="ml-auto">
							<Link to="/login">
								<button className="btn btn-primary">LOG IN</button>
							</Link>
						</div> </>) : (
					<button className="btn btn-danger" onClick={handleLogout}>
						LOG OUT
					</button>
				)}

			</div>
		</nav>
	);
};