import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { logoutUser } from "../../service/APIservice";



export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	// Get token directly from sessionStorage
	const tokenData = sessionStorage.getItem("authToken");
	const token = tokenData ? JSON.parse(tokenData)?.token : null;

	const handleLogout = async () => {
		const response = await logoutUser(dispatch);
		if (response.success) {
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