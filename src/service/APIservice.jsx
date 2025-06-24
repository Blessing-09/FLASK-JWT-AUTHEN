
// Get the backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Check if the backend URL is defined
if (!backendUrl) {
    throw new Error("VITE_BACKEND_URL is not defined in .env file");
}

export const loadMessage = async (dispatch) => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${backendUrl}/hello`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({ type: "set_hello", payload: data.message });
        }
        return data;

    } catch (error) {
        throw new Error(
            `Could not fetch the message from the backend. Please check if the backend is running and the backend port is public.`
        );
    }
};


export const createSignup = async (dispatch, info) => {
    try {
        const response = await fetch(`${backendUrl}/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info) //!will send infos in dataToSend!
            }
        );
        if (response.status === 201) {
            const data = await response.json()
            console.log(data)
            dispatch({ type: "signup", payload: data.user });
            return { success: true, message: "Signup successful! Please login." };
        }
        else if (response.status === 400) {
            const errorMsg = await response.json()
            return {
                success: false,
                message: errorMsg.Error
            };

        } else {
            const errorData = await response.json();
            console.error("Signup failed:", errorData);
            return {
                success: false, message: errorData.Msg
            };
        }
    } catch (error) {
        console.error("Network error:", error);
        return { success: false, message: "Network error. Please try again later." };
    }
};


export const createLogin = async (dispatch, info) => {
    try {
        const response = await fetch(`${backendUrl}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            }
        );


        if (response.ok) {
            const data = await response.json()
            // Store the token in sessionStorage
            /*const user = {
                   token: data.token,
                   userId: data.user_id
                   };*/
            //console.log(user)
            sessionStorage.setItem("authToken", JSON.stringify(data));
            console.log(data)

            // Save login to store
            dispatch({ type: "login", payload: data });

            // Save profile to store (important!)
            dispatch({
                type: "profile", payload: {
                    id: data.user_id,
                    email: data.email,     // or data.user.email, depending on backend
                    // name: data.name || "User", // add more fields if needed
                    // token: data.token
                }
            });
            return { success: true };
        }
        else {
            const errorMsg = await response.json()
            return {
                success: false,
                error: errorMsg.msg
            };
        }

    } catch (error) {
        console.error("Network error:", error);
        return { success: false, error: "Network error. Please try again later." };
    }
};



export const createProfile = async (dispatch) => {

    // const token = sessionStorage.getItem("authToken");
    const storedData = sessionStorage.getItem("authToken");

    let token = null;

    if (storedData) {
        try {
            const parsed = JSON.parse(storedData);
            token = parsed.token; // extract the token string only
        } catch {
            token = null; // fallback, just in case
        }
    }

    if (!token) {
        return { success: false, message: "No authentication token found." };
    }

    try {
        const response = await fetch(`${backendUrl}/profile`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        if (response.status === 200) {
            const data = await response.json()
            console.log(data)

            dispatch({ type: "profile", payload: data.user });
            return { success: true };
        }
        else {
            const errorMsg = await response.json()
            return {
                success: false,
                message: errorMsg.msg
            };
        }

    } catch (error) {
        console.error("Network error:", error);
        return { success: false, message: "Network error. Please try again later." };
    }
};


export const logoutUser = async (dispatch) => {
  const storedData = sessionStorage.getItem("authToken");

  if (!storedData) {
    return { success: false, message: "No token found in session." };
  }

  let token = null;
  try {
    const parsed = JSON.parse(storedData);
    token = parsed.token;
  } catch {
    return { success: false, message: "Invalid token format." };
  }

  try {
    const response = await fetch(`${backendUrl}/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Clear session data and update global state
      sessionStorage.removeItem("authToken");
      
      dispatch({ type: "login", payload: [] });   // Reset login
      dispatch({ type: "profile", payload: null }); // Clear profile
      return { success: true, message: "Logged out successfully." };
    } else {
      return { success: false, message: "Logout unsuccessful." };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Network error during logout." };
  }
};
