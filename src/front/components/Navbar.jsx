import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-dark">
			<div className="container">
				<div className="ml-auto">
				<Link to="/signup">
					<button className="btn btn-success">SIGN UP</button>
				</Link>
				</div>
				<div className="ml-auto">
					<Link to="/login">
						<button className="btn btn-primary">LOG IN</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};