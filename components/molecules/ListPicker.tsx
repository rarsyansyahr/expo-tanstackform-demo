import { BottomSheet, Button, Host, HStack, Picker } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";
import React, {
  forwardRef,
  memo,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../atoms";

export type ListPickerItem = { label: string; value: string };

export type ListPickerProps = {
  data: ListPickerItem[];
  value?: ListPickerItem;
  onChange?: (value: ListPickerItem) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  helper?: string;
  status?: "error";
};

export type ListPickerRef = {
  open: () => void;
  close: () => void;
};

const statusMap = {
  error: {
    color: "red",
    borderColor: "red",
  },
};

const ListPickerComponent = (
  props: ListPickerProps,
  ref: Ref<ListPickerRef>
) => {
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
        color: "#0C2B4E",
        borderColor: "#1A3D64",
      };
    }
    return statusMap[status];
  }, [status]);

  // open / close callbacks
  const openSheet = useCallback(() => {
    setIsOpened(true);
  }, []);
  const closeSheet = useCallback(() => setIsOpened(false), []);

  // expose methods via ref
  useImperativeHandle(ref, () => ({
    open: openSheet,
    close: closeSheet,
  }));

  useEffect(() => {
    return () => {
      setSelectedIndex(0);
      setIsOpened(false);
    };
  }, []);

  return (
    <View>
      <View style={styles.textfieldContainer}>
        {label && <Text text={label} />}
        <TouchableOpacity
          disabled={disabled || loading}
          activeOpacity={0.8}
          onPress={openSheet}
          style={[
            styles.inputContainer,
            { borderColor: validationStatus.borderColor },
          ]}
        >
          <Text
            style={[
              styles.value,
              disabled && {
                color: "grey",
              },
            ]}
            text={value?.label || placeholder}
          />
          {loading && <ActivityIndicator size="small" />}
        </TouchableOpacity>
        {helper && (
          <Text size={10} color={validationStatus.color} text={helper} />
        )}
      </View>

      <Host matchContents>
        <BottomSheet
          isOpened={isOpened}
          onIsOpenedChange={setIsOpened}
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
            <Host style={styles.w100}>
              <Button modifiers={[padding({ all: 0 })]} onPress={closeSheet}>
                Batal
              </Button>
            </Host>
            <Host style={styles.w100}>
              <Button
                modifiers={[padding({ all: 0 })]}
                onPress={() => {
                  if (onChange) onChange(data[selectedIndex]);
                  closeSheet();
                }}
              >
                Konfirmasi
              </Button>
            </Host>
          </HStack>
        </BottomSheet>
      </Host>
    </View>
  );
};

ListPickerComponent.displayName = "List Picker";

export const ListPicker = memo(
  forwardRef<ListPickerRef, ListPickerProps>(ListPickerComponent)
);

const styles = StyleSheet.create({
  textfieldContainer: { gap: 4 },

  label: { fontSize: 12 },

  value: { fontSize: 16, paddingVertical: 6 },

  inputContainer: {
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  w100: { width: "100%" },
});
