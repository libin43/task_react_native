import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Button, ThemeBase } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";


interface CustomButtonProps {
  mode?: "text" | "outlined" | "contained"; // Button mode
  onPress: (event: GestureResponderEvent) => void; // onPress event handler
  style?: StyleProp<ViewStyle>; // Style for the button container
  labelStyle?: StyleProp<TextStyle>; // Style for the button label
  children: React.ReactNode; // Button text or content
  loading?: boolean; // Whether the button is in a loading state
  disabled?: boolean; // Whether the button is disabled
  theme?: ThemeProp; // Custom theme for the button
}


export const CustomButton: React.FC<CustomButtonProps> = ({
  mode = "text",
  onPress,
  style,
  labelStyle,
  children,
  theme,
  disabled,
  loading,
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={style}
      labelStyle={labelStyle}
      theme={theme}
      disabled={disabled}
      loading={loading}
    >
      {children}
    </Button>
  )
}