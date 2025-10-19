import { BottomSheet, Button, Host, HStack, Picker } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";
import React, { FC, memo, useMemo, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ListPickerItem = { label: string; value: string };

type ListPickerProps = {
  data: ListPickerItem[];
  value?: ListPickerItem;
  onChange: (value: ListPickerItem) => void;
  label?: string;
  placeholder?: string;
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

const ListPickerComponent: FC<ListPickerProps> = (props) => {
  const { data, onChange, value, label, placeholder, disabled = false } = props;
  const { loading = false, helper, status } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpened, setIsOpened] = useState(false);

  const selectedItemIndex = useMemo(() => {
    if (value) return data.indexOf(value);

    return selectedIndex;
  }, [data, value, selectedIndex]);

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
    <View>
      <View style={{ gap: 4 }}>
        {label && <Text style={{ fontSize: 12 }}>{label}</Text>}
        <TouchableOpacity
          disabled={disabled || loading}
          activeOpacity={0.8}
          onPress={() => setIsOpened(true)}
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
          <Text
            style={{
              fontSize: 16,
              color: disabled || loading ? "grey" : "black",
              paddingVertical: 6,
            }}
          >
            {value?.label || placeholder}
          </Text>
          {loading && <ActivityIndicator size="small" />}
        </TouchableOpacity>
        {helper && (
          <Text style={{ fontSize: 10, color: validationStatus.color }}>
            {helper}
          </Text>
        )}
      </View>
      <Host matchContents>
        <BottomSheet
          isOpened={isOpened}
          onIsOpenedChange={(e) => setIsOpened(e)}
          presentationDragIndicator="automatic"
          presentationDetents={[0.3]}
        >
          <Picker
            label={label}
            options={data.map((item) => item.label)}
            selectedIndex={selectedItemIndex}
            onOptionSelected={({ nativeEvent: { index } }) => {
              setSelectedIndex(index);
            }}
            variant="wheel"
          />
          <HStack>
            <Host style={{ width: "100%" }}>
              <Button
                modifiers={[padding({ all: 0 })]}
                onPress={() => setIsOpened(false)}
              >
                Cancel
              </Button>
            </Host>
            <Host style={{ width: "100%" }}>
              <Button
                modifiers={[padding({ all: 0 })]}
                onPress={() => {
                  onChange(data[selectedIndex]);
                  setIsOpened(false);
                }}
              >
                Confirm
              </Button>
            </Host>
          </HStack>
        </BottomSheet>
      </Host>
    </View>
  );
};

ListPickerComponent.displayName = "List Picker";

export const ListPicker = memo(ListPickerComponent);

const styles = StyleSheet.create({});
