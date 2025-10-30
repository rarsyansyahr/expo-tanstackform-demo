import { DatePickerRef, ListPickerRef } from "@/components/molecules";
import { hobbies, LabelValue } from "@/data";
import { tanstackFormSchema, TanstackFormValues } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Keyboard, TextInput } from "react-native";

const defaultValues: TanstackFormValues = {
  name: "",
  email: "",
  gender: undefined as any,
  birthDate: undefined as any,
  educations: [
    {
      school: "",
      degree: "",
      yearRange: "",
    },
  ],
  job: undefined as any,
  hobby: undefined as any,
  subHobby: undefined as any,
};

export const useTanstackForm = () => {
  const emailRef = useRef<TextInput>(null);
  const birthDatePickerRef = useRef<DatePickerRef>(null);
  const jobPickerRef = useRef<ListPickerRef>(null);
  const hobbyPickerRef = useRef<ListPickerRef>(null);
  const subHobbyPickerRef = useRef<ListPickerRef>(null);

  const [subHobbies, setSubHobbies] = useState<LabelValue[]>([]);
  const [isSafeEmail, setIsSafeEmail] = useState(false);

  // @ts-ignore
  const form = useForm<TanstackFormValues>({
    defaultValues,
    onSubmitInvalid: ({ value, formApi }) => {
      const { hobby, subHobby } = value;

      formApi.validateAllFields("blur");

      if (hobby && !subHobby) return form.setFieldValue("subHobby", null);
    },
    onSubmit: async ({ value }) => {
      const { hobby, subHobby } = value;

      if (hobby && !subHobby) return form.setFieldValue("subHobby", null);

      Alert.alert("Values", JSON.stringify(value));

      Keyboard.dismiss();
    },
  });

  const onHobbyChange = async ({ fieldApi, value }) => {
    const formApi = fieldApi.form;
    if (formApi.state.isSubmitting) return;

    await new Promise((r) => setTimeout(r, 1000));

    const matched = hobbies.find((h) => h.value === value?.value);
    setSubHobbies(matched?.items ?? []);

    formApi.setFieldValue("subHobby", undefined);
    subHobbyPickerRef.current?.open();
  };

  const onBirthDateChange = (value: Date) => {
    const { success } = tanstackFormSchema.shape.birthDate.safeParse(value);

    if (success) jobPickerRef.current?.open();
  };

  const onEmailBlur = async ({ value, fieldApi }) => {
    const formApi = fieldApi.form;
    if (
      !value ||
      isSafeEmail ||
      formApi.state.isSubmitting ||
      !formApi.getFieldMeta("email")?.isValid
    )
      return;

    await new Promise((r) => setTimeout(r, 1500));

    const isDuplicated = value.toLowerCase() === "andi@rubin.com";

    if (!isSafeEmail) setIsSafeEmail(!isDuplicated);

    if (isDuplicated) {
      throw new Error("Email sudah terdaftar");
    }
  };

  const onReset = useCallback(() => {
    setIsSafeEmail(false);
    form.reset(defaultValues);
  }, [form]);

  const checkHaveValues = (values: TanstackFormValues) =>
    Object.values(values).some((val) => {
      if (Array.isArray(val)) return val.length > 1;

      if (typeof val === "object" && !(val instanceof Date)) {
        return Object.values(val).some((sub) => !!sub);
      }

      return !!val;
    });

  useEffect(() => {
    return () => {
      setSubHobbies([]);
      setIsSafeEmail(false);
    };
  }, []);

  const refs = {
    emailRef,
    birthDatePickerRef,
    jobPickerRef,
    hobbyPickerRef,
    subHobbyPickerRef,
  };

  const states = { subHobbies, isSafeEmail };

  const actions = {
    setSubHobbies,
    setIsSafeEmail,
    onHobbyChange,
    onReset,
    onEmailBlur,
    onBirthDateChange,
    checkHaveValues,
  };

  return { ...refs, ...states, ...actions, form, defaultValues };
};
