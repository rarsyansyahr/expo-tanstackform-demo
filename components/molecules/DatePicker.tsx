import {
  BottomSheet,
  Button,
  DateTimePicker,
  Host,
  HStack,
} from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";
import dayjs from "dayjs";
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

export type DatePickerProps = {
  value?: Date;
  initialDate?: Date;
  onChange?: (value: Date) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  helper?: string;
  status?: "error";
};

export type DatePickerRef = {
  open: () => void;
  close: () => void;
};

const statusMap = {
  error: {
    color: "red",
    borderColor: "red",
  },
};

const DatePickerComponent = (
  props: DatePickerProps,
  ref: Ref<DatePickerRef>
) => {
  const { onChange, value, label, placeholder, disabled = false } = props;
  const { loading = false, helper, status, initialDate = new Date() } = props;

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isOpened, setIsOpened] = useState(false);

  const validationStatus = useMemo(() => {
    if (!status) {
      return {
        color: "#0C2B4E",
        borderColor: "#1A3D64",
      };
    }
    return statusMap[status];
  }, [status]);

  const dateValue = useMemo(
    () => (value ? new Date(value).toISOString() : initialDate.toISOString()),
    [value, initialDate]
  );

  // open / close callbacks
  const openSheet = useCallback(() => {
    setIsOpened(true);
  }, []);

  const closeSheet = useCallback(() => setIsOpened(false), []);

  const onConfirm = useCallback(() => {
    if (selectedDate && onChange) onChange(selectedDate);
    closeSheet();
  }, [selectedDate, onChange, closeSheet]);

  // expose methods via ref
  useImperativeHandle(ref, () => ({
    open: openSheet,
    close: closeSheet,
  }));

  useEffect(() => {
    return () => {
      setSelectedDate(undefined);
      if (isOpened) setIsOpened(false);
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
            style={{
              fontSize: 16,
              paddingVertical: 6,
              ...(disabled && { color: "grey" }),
            }}
            text={value ? dayjs(value).format("DD MMMM YYYY") : placeholder}
          />
          {loading && <ActivityIndicator size="small" />}
        </TouchableOpacity>
        {helper && (
          <Text size={10} text={helper} color={validationStatus.color} />
        )}
      </View>

      <Host matchContents>
        <BottomSheet
          isOpened={isOpened}
          onIsOpenedChange={setIsOpened}
          presentationDragIndicator="automatic"
          presentationDetents={[0.6]}
        >
          <DateTimePicker
            onDateSelected={setSelectedDate}
            displayedComponents="date"
            initialDate={dateValue}
            variant="graphical"
          />
          <HStack>
            <Host style={styles.w100}>
              <Button modifiers={[padding({ all: 0 })]} onPress={closeSheet}>
                Batal
              </Button>
            </Host>
            <Host style={styles.w100}>
              <Button modifiers={[padding({ all: 0 })]} onPress={onConfirm}>
                Konfirmasi
              </Button>
            </Host>
          </HStack>
        </BottomSheet>
      </Host>
    </View>
  );
};

DatePickerComponent.displayName = "Date Picker";

export const DatePicker = memo(
  forwardRef<DatePickerRef, DatePickerProps>(DatePickerComponent)
);

const styles = StyleSheet.create({
  textfieldContainer: { gap: 4 },

  label: { fontSize: 12 },

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
