import React, {
  ForwardedRef,
  forwardRef,
  memo,
  ReactNode,
  useMemo,
} from "react";
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
  EndComponent?: ReactNode;
};

const statusMap = {
  error: {
    color: "red",
    borderColor: "red",
  },
};

const TextFieldComponent = (
  props: TextFieldProps,
  ref: ForwardedRef<TextInput>
) => {
  const {
    onChange,
    label,
    disabled = false,
    loading = false,
    helper,
    status,
    EndComponent,
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
          ref={ref}
          editable={!disabled && !loading}
          onChangeText={onChange}
          style={{
            flex: 1,
            fontSize: 16,
            color: disabled || loading ? "grey" : "black",
            paddingVertical: 6,
          }}
          {...rest}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 4,
          }}
        >
          {loading && <ActivityIndicator size="small" />}
          {EndComponent}
        </View>
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

export const TextField = memo(
  forwardRef<TextInput, TextFieldProps>(TextFieldComponent)
);
