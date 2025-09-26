import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface LogoutProps {
    logout: () => void;
}

export default function Logout(props: LogoutProps) {

    const { logout } = props;

    return (
        <TouchableOpacity style={{ position: "absolute", right: 10, top: 10 }} onPress={logout} >
            <MaterialIcons
                name="logout"
                size={24}
                color="black"
            />
        </TouchableOpacity>
    );
}

