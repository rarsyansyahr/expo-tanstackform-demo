import { ListPickerItem, ListPickerProps, ListPicker as RNListPicker } from "@/components/molecules";
import { useFieldContext } from "@/hooks";
import React, { FC } from "react";

export const ListPicker: FC<ListPickerProps> = (props) => {
  const { onChange, ...rest } = props;

  const field = useFieldContext<ListPickerItem>();
  const { state, handleChange } = field;
  const { value, meta } = state;
  const { errors } = meta;

  const onChangeHandle = (val: ListPickerItem) => {
    handleChange(val);
    if (onChange) onChange(val);
  };

  return (
    <RNListPicker
      value={value}
      onChange={onChangeHandle}
      status={errors.length ? "error" : undefined}
      helper={errors[0]?.message}
      {...rest}
    />
  );
};
