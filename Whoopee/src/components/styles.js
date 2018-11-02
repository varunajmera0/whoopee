import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";

let styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: "#82E0AA",
        justifyContent: "center",
        alignSelf: "stretch"
    }
});

export default styles;