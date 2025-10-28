import {
  DatePicker,
  DatePickerRef,
  ListPicker,
  ListPickerRef,
  RadioGroup,
  TextField,
} from "@/components/molecules";
import { hobbies, jobs, LabelValue } from "@/data";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useForm } from "@tanstack/react-form";
import { FC, useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const educationItemSchema = z.object({
  school: z.string().min(5, "Instansi Pendidikan harus diisi"),
  degree: z.string().min(5, "Gelar harus diisi"),
  yearRange: z.string().min(5, "Tahun Pendidikan harus diisi"),
});

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama harus diisi")
      .min(5, "Nama minimal 5 karakter"),
    birthDate: z.object(
      {
        label: z.string(),
        value: z
          .date()
          .max(new Date(), "Tanggal Lahir harus di bawah hari ini"),
      },
      { error: "Tanggal Lahir harus diisi" }
    ),
    email: z.email("Format email salah").min(1, "Email harus diisi"),
    gender: z.enum(["male", "female"], "Jenis Kelamin harus diisi"),
    educations: z
      .array(educationItemSchema)
      .min(1, "Riwayat Pendidikan harus diisi"),
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
  })
  // .refine((values) => {
  //   if (values.hobby && !values.subHobby) {
  //     val
  //   }
  // });

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  email: "andi@rubin.com",
  gender: undefined as any,
  birthDate: undefined as any,
  educations: [
    {
      school: "",
      degree: "",
      yearRange: "",
    },
  ],
  job: jobs[0],
  hobby: undefined as any,
  subHobby: undefined as any,
};

const TanstackFormScreen: FC = () => {
  const emailRef = useRef<TextInput>(null);
  const birthDatePickerRef = useRef<DatePickerRef>(null);
  const jobPickerRef = useRef<ListPickerRef>(null);
  const hobbyPickerRef = useRef<ListPickerRef>(null);
  const subHobbyPickerRef = useRef<ListPickerRef>(null);

  const [subHobbies, setSubHobbies] = useState<LabelValue[]>([]);
  const [isSafeEmail, setIsSafeEmail] = useState(false);

  const insets = useSafeAreaInsets();

  // @ts-ignore
  const form = useForm<FormValues>({
    defaultValues,
    onSubmit: async ({ value }) => {
      const { hobby, subHobby } = value;

      if (hobby && !subHobby) return form.setFieldValue("subHobby", null);

      Alert.alert("Values", JSON.stringify(value));

      Keyboard.dismiss();
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
    subHobbyPickerRef.current?.open();
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.root, { paddingBottom: insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
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
            onSubmitEditing={() => birthDatePickerRef.current?.open()}
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

      {/* Gender */}
      <Field name="gender" validators={{ onChange: formSchema.shape.gender }}>
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
        }) => (
          <RadioGroup
            label="Jenis Kelamin"
            data={[
              { label: "Laki-laki", value: "male" },
              { label: "Perempuan", value: "female" },
            ]}
            onChange={handleChange}
            value={value}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
          />
        )}
      </Field>

      {/* Birth Date */}
      <Field
        name="birthDate"
        validators={{
          onChange: formSchema.shape.birthDate,
        }}
      >
        {({
          state: {
            value,
            meta: { errors },
          },
          handleChange,
        }) => (
          <DatePicker
            ref={birthDatePickerRef}
            label="Tanggal Lahir"
            placeholder="Pilih Tanggal Lahir"
            value={value}
            onChange={(birthDate) => {
              handleChange(birthDate);

              const { success } =
                formSchema.shape.birthDate.safeParse(birthDate);

              if (success) jobPickerRef.current?.open();
            }}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
          />
        )}
      </Field>

      {/* Educations */}
      <Field
        name="educations"
        mode="array"
        validators={{ onChange: formSchema.shape.educations }}
      >
        {(field) => (
          <FlatList
            data={field.state.value}
            extraData={field.state.value}
            renderItem={({ index, item }) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  flex: 1,
                }}
              >
                <View style={{ flex: 1, gap: 6 }}>
                  <Field
                    name={`educations[${index}].school`}
                    key={`school-${index}`}
                    validators={{ onChange: educationItemSchema.shape.school }}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      state: {
                        value,
                        meta: { errors },
                      },
                    }) => (
                      <TextField
                        label="Instansi Pendidikan"
                        placeholder="Masukan Instansi Pendidikan"
                        onChange={handleChange}
                        value={value}
                        onBlur={handleBlur}
                        status={errors.length ? "error" : undefined}
                        helper={errors[0]?.message}
                      />
                    )}
                  </Field>
                  <View
                    style={{
                      flexDirection: "row",
                      // alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Field
                      name={`educations[${index}].degree`}
                      key={`degree-${index}`}
                      validators={{
                        onChange: educationItemSchema.shape.degree,
                      }}
                    >
                      {({
                        handleChange,
                        handleBlur,
                        state: {
                          value,
                          meta: { errors },
                        },
                      }) => (
                        <TextField
                          label="Program Studi"
                          placeholder="Masukan Program Studi"
                          onChange={handleChange}
                          value={value}
                          style={{ flex: 1 }}
                          onBlur={handleBlur}
                          status={errors.length ? "error" : undefined}
                          helper={errors[0]?.message}
                        />
                      )}
                    </Field>
                    <Field
                      name={`educations[${index}].yearRange`}
                      key={`yearRange-${index}`}
                      validators={{
                        onChange: educationItemSchema.shape.yearRange,
                      }}
                    >
                      {({
                        handleChange,
                        handleBlur,
                        state: {
                          value,
                          meta: { errors },
                        },
                      }) => (
                        <TextField
                          label="Tahun Pendidikan"
                          placeholder="Masukan Tahun Pendidikan"
                          onChange={handleChange}
                          value={value}
                          style={{ width: "40%" }}
                          onBlur={handleBlur}
                          status={errors.length ? "error" : undefined}
                          helper={errors[0]?.message}
                        />
                      )}
                    </Field>
                  </View>
                </View>
                <TouchableOpacity
                  style={{ alignItems: "center", justifyContent: "center" }}
                  activeOpacity={0.8}
                  onPress={() =>
                    field.state.value.length > 1 && field.removeValue(index)
                  }
                >
                  <MaterialIcons name="close" size={20} />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ gap: 6 }}
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View
                style={{ borderWidth: 0.3, borderColor: "black", marginTop: 6 }}
              />
            )}
            ListHeaderComponent={<Text>Riwayat Pendidikan</Text>}
            ListFooterComponent={
              <Button
                onPress={() =>
                  field.pushValue({ school: "", degree: "", yearRange: "" })
                }
                title="Tambah Pendidikan"
              />
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
            ref={jobPickerRef}
            label="Pekerjaan"
            placeholder="Pilih Pekerjaan"
            data={jobs}
            value={value}
            onChange={(job) => {
              handleChange(job);
              hobbyPickerRef.current?.open();
            }}
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
            ref={hobbyPickerRef}
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
                ref={subHobbyPickerRef}
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

      <Button onPress={form.handleSubmit} title="Submit" />
    </ScrollView>
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
