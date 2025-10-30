import { FormAction, FormField } from "@/components/pages/formComposition";
import { tanstackFormDefaultValues } from "@/data";
import {
    createFormHook,
    createFormHookContexts,
    formOptions,
} from "@tanstack/react-form";
import { useCallback } from "react";
import { Alert, Keyboard } from "react-native";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: FormField,
  formComponents: FormAction,
  fieldContext,
  formContext,
});

export const formCompositionOptions = formOptions({
  defaultValues: tanstackFormDefaultValues,
});

export const useFormComposition = () => {
  const form = useAppForm({
    defaultValues: tanstackFormDefaultValues,
    onSubmitInvalid: ({ value, formApi }) => {
      const { hobby, subHobby } = value;

      formApi.validateAllFields("blur");

      //   @ts-ignore
      if (hobby && !subHobby) return form.setFieldValue("subHobby", null);
    },
    onSubmit: async ({ value }) => {
      const { hobby, subHobby } = value;

      //   @ts-ignore
      if (hobby && !subHobby) return form.setFieldValue("subHobby", null);

      Alert.alert("Values", JSON.stringify(value));

      Keyboard.dismiss();
    },
  });

  const onReset = useCallback(
    () => form.reset(tanstackFormDefaultValues),
    [form]
  );

  return { form, onReset };
};
