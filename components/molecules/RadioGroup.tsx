import { memo, useMemo } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { Radio } from "../atoms";
import { TextFieldProps } from "./TextField";

type RadioGroupItem<T> = { label: string; value: T };

type RadioGroupProps<T> = {
  data: RadioGroupItem<T>[];
  value?: T;
  disabled?: boolean;
  onChange: (value: T) => void;
} & Pick<TextFieldProps, "label" | "helper" | "status">;

const statusMap = {
  error: {
    color: "red",
    borderColor: "red",
  },
};

const RadioGroupComponent = <T,>(props: RadioGroupProps<T>) => {
  const { data, label, helper, status, disabled = false, onChange, value } = props;

  const renderItem: ListRenderItem<RadioGroupItem<T>> = ({ index, item }) => {
    const selected = item.value === value;

    return (
      <Radio
        {...item}
        selected={selected}
        disabled={disabled}
        onPress={() => onChange(item.value)}
      />
    );
  };

  const validationStatus = useMemo(() => {
    if (!status) {
      return {
        color: "black",
        borderColor: "grey",
      };
    }

    return statusMap[status];
  }, [status]);

  return (
    <View style={{ gap: 4 }}>
      {label && <Text style={{ fontSize: 12 }}>{label}</Text>}
      <FlatList
        data={data}
        extraData={data}
        keyExtractor={(item, index) => `${index}-${item.label}`}
        renderItem={renderItem}
        removeClippedSubviews
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={styles.list}
        scrollEnabled={false}
      />
      {helper && (
        <Text style={{ fontSize: 10, color: validationStatus.color }}>
          {helper}
        </Text>
      )}
    </View>
  );
};

RadioGroupComponent.displayName = "Radio Group";

export const RadioGroup = memo(RadioGroupComponent);

const styles = StyleSheet.create({
  list: { alignItems: "center", gap: 8 },
});
