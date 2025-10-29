import { FC, memo } from "react";
import {
  ColorValue,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

type TextProps = RNTextProps & {
  text?: string;
  color?: ColorValue;
  size?: number;
  weight?: TextStyle["fontWeight"];
};

const TextComponent: FC<TextProps> = (props) => {
  const {
    children,
    text,
    style,
    color = "#0C2B4E",
    size = 12,
    weight = "400",
    ...rest
  } = props;

  const textStyle = {
    color,
    fontSize: size,
    fontWeight: weight,
  } as TextStyle;

  return (
    <RNText style={[textStyle, style]} {...rest}>
      {text || children}
    </RNText>
  );
};

TextComponent.displayName = "Text";

export const Text = memo(TextComponent);
