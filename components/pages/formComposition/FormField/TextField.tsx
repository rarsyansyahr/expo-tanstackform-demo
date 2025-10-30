import {
  TextField as RNTextField,
  TextFieldProps,
} from "@/components/molecules";
import { useFieldContext } from "@/hooks";
import { FC } from "react";

export const TextField: FC<TextFieldProps> = (props) => {
  const { onChange, ...rest } = props;

  const field = useFieldContext<string>();
  const { state, handleChange, handleBlur } = field;
  const { value, meta } = state;
  const { errors } = meta;

  const onChangeHandle = (val: string) => {
    handleChange(val);
    if (onChange) onChange(val);
  };

  return (
    <RNTextField
      value={value}
      onChange={onChangeHandle}
      onBlur={handleBlur}
      status={errors.length ? "error" : undefined}
      helper={errors[0]?.message}
      {...rest}
    />
  );
};
