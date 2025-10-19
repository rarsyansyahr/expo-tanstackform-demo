import React, { FC, memo, useMemo } from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

type TextFieldProps = Omit<TextInputProps, "onChange" | "onChangeText"> & {
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  helper?: string;
  status?: "error";
};

const statusMap = {
  error: {
    color: "red",
    borderColor: "red",
  },
};

const TextFieldComponent: FC<TextFieldProps> = (props) => {
  const {
    onChange,
    label,
    disabled = false,
    loading = false,
    helper,
    status,
    ...rest
  } = props;

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

      <View
        style={{
          borderWidth: 1,
          borderColor: validationStatus.borderColor,
          paddingHorizontal: 8,
          borderRadius: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          editable={!disabled}
          onChangeText={onChange}
          style={{
            fontSize: 16,
            color: disabled || loading ? "grey" : "black",
            paddingVertical: 6,
          }}
          {...rest}
        />
        {loading && <ActivityIndicator size="small" />}
      </View>
      {helper && (
        <Text style={{ fontSize: 10, color: validationStatus.color }}>
          {helper}
        </Text>
      )}
    </View>
  );
};

TextFieldComponent.displayName = "TextField";

export const TextField = memo(TextFieldComponent);
