import { FC, memo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Text } from "./Text";

type ButtonProps = Omit<TouchableOpacityProps, "children"> & {
  title: string;
  preset?: "primary" | "text";
};

const buttonPresetStyle = {
  primary: {
    backgroundColor: "#0C2B4E",
  },
  text: {},
};

const textPresetStyle = {
  primary: {
    color: "#F4F4F4",
  },
  text: {
    color: "#0C2B4E",
  },
};

const ButtonComponent: FC<ButtonProps> = (props) => {
  const { title, style, preset = "primary", ...rest } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.root, buttonPresetStyle[preset], style]}
      {...rest}
    >
      <Text
        text={title}
        color={textPresetStyle[preset].color}
        weight="500"
        size={14}
      />
    </TouchableOpacity>
  );
};

ButtonComponent.displayName = "Button";

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
