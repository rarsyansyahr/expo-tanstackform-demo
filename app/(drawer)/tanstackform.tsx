import { ListPicker, TextField } from "@/components/molecules";
import { hobbies, jobs, LabelValue } from "@/data";
import { Button, Host } from "@expo/ui/swift-ui";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useForm } from "@tanstack/react-form";
import { FC, useRef, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").min(5, "Nama minimal 5 karakter"),
  email: z.email("Format email salah").min(1, "Email harus diisi"),
  job: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { error: "Pekerjaan harus diisi" }
  ),
  hobby: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional(),
  subHobby: z
    .object(
      {
        label: z.string(),
        value: z.string(),
      },
      { error: "Sub Hobi harus diisi" }
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  email: "andi@rubin.com",
  job: jobs[0],
  hobby: undefined as any,
  subHobby: undefined as any,
};

const TanstackFormScreen: FC = () => {
  const emailRef = useRef<TextInput>(null);

  const [subHobbies, setSubHobbies] = useState<LabelValue[]>([]);
  const [isSafeEmail, setIsSafeEmail] = useState(false);

  // @ts-ignore
  const form = useForm<FormValues>({
    defaultValues,
    onSubmit: async ({ value }) => {
      const { hobby, subHobby } = value;

      if (hobby && !subHobby) return form.setFieldValue("subHobby", null);

      Alert.alert("Values", JSON.stringify(value));
    },
  });

  const { Field, Subscribe } = form;

  const onHobbyChange = async ({ fieldApi, value }) => {
    const formApi = fieldApi.form;
    if (formApi.state.isSubmitting) return;

    await new Promise((r) => setTimeout(r, 1000));

    const matched = hobbies.find((h) => h.value === value?.value);
    setSubHobbies(matched?.items ?? []);

    formApi.setFieldValue("subHobby", undefined);
  };

  return (
    <View style={styles.root}>
      {/* Name */}
      <Field name="name" validators={{ onChange: formSchema.shape.name }}>
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
        }) => (
          <TextField
            label="Nama"
            placeholder="Masukan Nama"
            value={value}
            onChange={handleChange}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        )}
      </Field>

      {/* Email */}
      <Field
        name="email"
        validators={{
          onChange: formSchema.shape.email,
          onBlurAsync: async ({ value, fieldApi }) => {
            const formApi = fieldApi.form;
            if (!value || formApi.state.isSubmitting) return;

            await new Promise((r) => setTimeout(r, 1500));

            const isDuplicated = value.toLowerCase() === "andi@rubin.com";

            if (!isSafeEmail) setIsSafeEmail(!isDuplicated);

            if (isDuplicated) {
              throw new Error("Email sudah terdaftar");
            }
          },
        }}
      >
        {({
          state: {
            value,
            meta: { errors, isValidating, isValid },
          },
          handleChange,
          handleBlur,
        }) => (
          <TextField
            ref={emailRef}
            label="Email"
            placeholder="Masukan Email"
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
            value={value}
            onChange={(value) => {
              if (isSafeEmail) setIsSafeEmail(false);
              handleChange(value);
            }}
            onBlur={handleBlur}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
            loading={isValidating}
            returnKeyType="next"
            EndComponent={
              isValid &&
              !isValidating &&
              isSafeEmail && (
                <MaterialIcons name="verified" color="green" size={20} />
              )
            }
          />
        )}
      </Field>

      {/* Job */}
      <Field name="job" validators={{ onChange: formSchema.shape.job }}>
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
        }) => (
          <ListPicker
            label="Pekerjaan"
            placeholder="Pilih Pekerjaan"
            data={jobs}
            value={value}
            onChange={handleChange}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
          />
        )}
      </Field>

      {/* Hobby */}
      <Field
        name="hobby"
        validators={{
          onChange: formSchema.shape.hobby,
          onChangeAsyncDebounceMs: 100,
          onChangeAsync: onHobbyChange,
        }}
      >
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
        }) => (
          <ListPicker
            label="Hobi"
            placeholder="Pilih Hobi"
            data={hobbies}
            value={value}
            onChange={handleChange}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
          />
        )}
      </Field>

      {/* Sub Hobby */}
      <Subscribe
        selector={(state) => [
          state.fieldMeta.hobby?.isValidating,
          state.values.hobby,
          state.isSubmitting,
        ]}
      >
        {([isValidating, hobby, isSubmitting]) => (
          <Field
            name="subHobby"
            validators={{ onChange: formSchema.shape.subHobby }}
          >
            {({
              state: {
                value,
                meta: { errors },
              },
              handleChange,
            }) => (
              <ListPicker
                label="Sub Hobi"
                placeholder="Pilih Sub Hobi"
                data={subHobbies}
                value={value}
                onChange={handleChange}
                loading={isValidating && !isSubmitting}
                status={errors.length ? "error" : undefined}
                helper={errors[0]?.message}
                disabled={!hobby}
              />
            )}
          </Field>
        )}
      </Subscribe>

      <Host matchContents>
        <Button variant="borderedProminent" onPress={form.handleSubmit}>
          Submit
        </Button>
      </Host>
    </View>
  );
};

TanstackFormScreen.displayName = "Tanstack Form Screen";

export default TanstackFormScreen;

const styles = StyleSheet.create({
  root: {
    padding: 16,
    gap: 12,
  },
});
