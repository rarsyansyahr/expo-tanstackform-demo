import {
  DatePickerProps,
  DatePicker as RNDatePicker,
} from "@/components/molecules";
import { useFieldContext } from "@/hooks";
import React, { FC } from "react";

export const DatePicker: FC<DatePickerProps> = (props) => {
  const { onChange, ...rest } = props;

  const field = useFieldContext<Date>();
  const { state, handleChange } = field;
  const { value, meta } = state;
  const { errors } = meta;

  const onChangeHandle = (val: Date) => {
    handleChange(val);
    if (onChange) onChange(val);
  };

  return (
    <RNDatePicker
      value={value}
      onChange={onChangeHandle}
      status={errors.length ? "error" : undefined}
      helper={errors[0]?.message}
      {...rest}
    />
  );
};
