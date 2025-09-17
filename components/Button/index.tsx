import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { materialColors } from "../../utils/colors";


interface IProps {
  onPress: () => void;
  disabled?: boolean,
  title?: string,
  isSubmitting?: boolean
}


export default function Button(props: IProps) {

  const { onPress, disabled, title } = props

  return (
    <TouchableOpacity
      style={[
        styles.loginButton,
        (disabled) && styles.loginButtonDisabled
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.loginButtonText,
        (disabled) && styles.loginButtonTextDisabled
      ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: materialColors.schemes.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: materialColors.schemes.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: materialColors.palettes.neutral[90],
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButtonTextDisabled: {
    color: '#9CA3AF',
  },
})
