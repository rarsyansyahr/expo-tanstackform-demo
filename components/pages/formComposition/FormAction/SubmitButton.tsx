import { Button, ButtonProps } from "@/components/atoms";
import { useFormContext } from "@/hooks";
import { FC } from "react";

export const SubmitButton: FC<ButtonProps> = (props) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          disabled={isSubmitting}
          onPress={form.handleSubmit}
          {...props}
        />
      )}
    </form.Subscribe>
  );
};
