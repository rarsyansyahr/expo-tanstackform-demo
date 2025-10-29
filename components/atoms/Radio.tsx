import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Text";

type RadioProps<T> = {
  label: string;
  value: T;
  selected: boolean;
  onPress: (value: T) => void;
  disabled?: boolean;
};

const RadioComponent = <T,>(props: RadioProps<T>) => {
  const { label, value, selected, onPress, disabled } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(value)}
      style={styles.container}
      disabled={disabled}
    >
      <MaterialIcons
        name={selected ? "radio-button-checked" : "radio-button-unchecked"}
        size={20}
      />
      <Text text={label} size={14} />
    </TouchableOpacity>
  );
};

RadioComponent.displayName = "Radio";

export const Radio = memo(RadioComponent);

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 3 },
});
