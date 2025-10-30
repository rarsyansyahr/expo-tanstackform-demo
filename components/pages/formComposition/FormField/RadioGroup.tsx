import {
  RadioGroup as RNRadioGroup,
  RadioGroupProps,
} from "@/components/molecules";
import { useFieldContext } from "@/hooks";

export const RadioGroup = <T,>(props: RadioGroupProps<T>) => {
  const { onChange, ...rest } = props;

  const field = useFieldContext<T>();
  const { state, handleChange } = field;
  const { value, meta } = state;
  const { errors } = meta;

  const onChangeHandle = (val: T) => {
    handleChange(val);
    if (onChange) onChange(val);
  };

  return (
    <RNRadioGroup<T>
      onChange={onChangeHandle}
      value={value}
      status={errors.length ? "error" : undefined}
      helper={errors[0]?.message}
      {...rest}
    />
  );
};
