import { ListPicker, TextField } from "@/components/molecules";
import { hobbies, jobs } from "@/data";
import { Button, Host } from "@expo/ui/swift-ui";
import { useForm } from "@tanstack/react-form";
import { FC, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { z } from "zod";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama harus diisi")
      .min(5, "Nama minimal 5 karakter"),
    email: z.email("Format email salah").min(1, "Email harus diisi"),
    job: z.object(
      {
        label: z.string(),
        value: z.string(),
      },
      { error: "Pekerjaan harus diisi" }
    ),
    hobby: z
      .object(
        {
          label: z.string(),
          value: z.string(),
        }
        // { error: "Hobi tidak valid" }
      )
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
  })
  // .refine(
  //   (data) => {
  //     // ✅ If hobby is chosen, subHobby must exist
  //     if (data.hobby) {
  //       return !!data.subHobby;
  //     }
  //     return true;
  //   },
  //   {
  //     message: "Sub Hobi harus diisi jika memilih Hobi",
  //     path: ["subHobby"], // attach error to subHobby field
  //   }
  // );
  // .refine(
  //   (data) => {
  //     if (data.hobby && !data.subHobby) return false;

  //     return true;
  //   },
  //   {
  //     message: "Sub Hobi harus diisi jika memilih hobi",
  //     path: ["subHobby"],
  //   }
  // );
  // .superRefine((data, ctx) => {
  //   if (data.hobby && !data.subHobby) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "Sub Hobi harus diisi jika memilih hobi",
  //       path: ["subHobby"],
  //     });
  //   }
  // });

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  email: "andi@rubin.com",
  job: jobs[0],
  hobby: undefined as any,
  subHobby: undefined as any,
};

const TanstackFormScreen: FC = () => {
  const [subHobbyLoading, setSubHobbyLoading] = useState(false);

  // @ts-ignore
  const form = useForm<FormValues>({
    defaultValues,
    // validators: {
    //   onSubmit: async (values) => {
    //     // console.log("onSubmit values:", values);
    //     const result = await formSchema.safeParseAsync(values);
    //     console.log("result:", result);
    //     return result.success ? undefined : result.error;
    //   },
    // },
    onSubmit: async ({ value }) => {
      Alert.alert("Values", JSON.stringify(value));
    },
  });

  const { state, Field } = form;

  // Derived subHobby options
  const subHobbies = useMemo(() => {
    const hobby = state.values.hobby;
    return hobbies.find((h) => h.value === hobby?.value)?.items || [];
  }, [state.values.hobby]);

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
          />
        )}
      </Field>

      {/* Email */}
      <Field name="email" validators={{ onChange: formSchema.shape.email }}>
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
        }) => (
          <TextField
            label="Email"
            placeholder="Masukan Email"
            keyboardType="email-address"
            inputMode="email"
            autoCapitalize="none"
            value={value}
            onChange={handleChange}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
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
      <Field name="hobby" validators={{ onChange: formSchema.shape.hobby }}>
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
            onChange={(v) => {
              setSubHobbyLoading(true);
              handleChange(v);
              form.setFieldValue("subHobby", null);
              setTimeout(() => setSubHobbyLoading(false), 1000);
            }}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
          />
        )}
      </Field>

      {/* Sub Hobby */}
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
            disabled={!form.state.values.hobby}
            loading={subHobbyLoading}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
          />
        )}
      </Field>

      <Host matchContents>
        <Button variant="borderedProminent" onPress={() => form.handleSubmit()}>
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
