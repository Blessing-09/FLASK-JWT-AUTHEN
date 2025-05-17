
// Get the backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Check if the backend URL is defined
if (!backendUrl) {
    throw new Error("VITE_BACKEND_URL is not defined in .env file");
}

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
         console.log(response)

        if (response.ok) {
            const data = await response.json()
            // Store the token in localStorage
            /*const user = {
                   token: data.token,
                   userId: data.user_id
                   };*/
            //console.log(user)
            localStorage.setItem("authToken", JSON.stringify(data));
            console.log(data)

            dispatch({ type: "login", payload: data });
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

    const token = localStorage.getItem("authToken");

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