import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { AUTH_ACTIONS, AuthContext } from "../shares/context";

interface LogoutProps {
    logout: () => void;
}

export default function Logout(props: LogoutProps) {

    const { logout } = props;
    const { dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        console.log("Logout button pressed"); // ✅ Debug

        // Si viene por props, úsalo
        if (logout) {
            logout();
        } else {
            // Si no, usa el context
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    };

    return (
        <TouchableOpacity style={{ position: "absolute", right: 10, top: 10 }} onPress={handleLogout} >
            <MaterialIcons
                name="logout"
                size={24}
                color="black"
            />
        </TouchableOpacity>
    );
}

