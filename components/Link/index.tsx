import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { materialColors } from "../../utils/colors";

interface IProps {
  link: string,
  isSubmitting?: boolean,
  onPress?: () => void
}

export default function Link(props: IProps) {

  const { link, onPress, isSubmitting } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isSubmitting}
      onPress={onPress}
    >
      <Text style={styles.linkText}>{link}</Text>
    </TouchableOpacity>
  )

}

const styles = StyleSheet.create({
  linkText: {
    color: materialColors.schemes.dark.onPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
})