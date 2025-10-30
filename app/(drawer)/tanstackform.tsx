import { Button, Text } from "@/components/atoms";
import {
  DatePicker,
  DatePickerRef,
  ListPicker,
  ListPickerRef,
  RadioGroup,
  TextField,
} from "@/components/molecules";
import { genders, hobbies, jobs, LabelValue } from "@/data";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useForm } from "@tanstack/react-form";
import { FC, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
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

const labelValueItem = {
  label: z.string(),
  value: z.string(),
};

const formSchema = z.object({
  name: z.string("Nama harus diisi").min(5, "Nama minimal 5 karakter"),
  birthDate: z
    .date("Tanggal lahir harus diisi")
    .max(new Date(), "Tanggal Lahir harus di bawah hari ini"),
  email: z.email("Format email salah").min(1, "Email harus diisi"),
  gender: z.enum(["male", "female"], "Jenis Kelamin harus diisi"),
  educations: z.array(educationItemSchema, "Riwayat Pendidikan harus diisi"),
  job: z.object(labelValueItem, { error: "Pekerjaan harus diisi" }),
  hobby: z.object(labelValueItem).optional(),
  subHobby: z
    .object(labelValueItem, { error: "Sub Hobi harus diisi" })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
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

  const onReset = () => {
    setIsSafeEmail(false);
    form.reset(defaultValues);
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
            // onSubmitEditing={() => emailRef.current?.focus()}
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
          <RadioGroup<z.infer<typeof formSchema.shape.gender>>
            label="Jenis Kelamin"
            data={genders}
            onChange={handleChange}
            value={value}
            status={errors.length ? "error" : undefined}
            helper={errors[0]?.message}
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
            loading={isValidating && !isSafeEmail}
            returnKeyType="next"
            onSubmitEditing={() => birthDatePickerRef.current?.open()}
            EndComponent={
              isValid &&
              isSafeEmail && (
                <MaterialIcons name="verified" color="green" size={20} />
              )
            }
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
            ListHeaderComponent={<Text text="Riwayat Pendidikan" size={14} />}
            ListFooterComponentStyle={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
            ListFooterComponent={
              <View>
                <Button
                  onPress={() =>
                    field.pushValue({ school: "", degree: "", yearRange: "" })
                  }
                  title="Tambah Pendidikan"
                  preset="text"
                />
                {field.state.meta.errors.length > 0 &&
                  field.state.value.length < 1 && (
                    <Text
                      text={field.state.meta.errors[0]?.message}
                      color="red"
                      size={10}
                    />
                  )}
              </View>
            }
          />
        )}
      </Field>

      <Button onPress={form.handleSubmit} title="Submit" />
      <Subscribe selector={(state) => [state.values]}>
        {([values]) => {
          const isHaveValues = Object.values(values).some((val) => {
            if (Array.isArray(val)) return val.length > 1;

            if (typeof val === "object" && !(val instanceof Date)) {
              return Object.values(val).some((sub) => !!sub);
            }

            return !!val;
          });

          return (
            isHaveValues && (
              <Button onPress={onReset} preset="text" title="Reset" />
            )
          );
        }}
      </Subscribe>
    </ScrollView>
  );
};

TanstackFormScreen.displayName = "Tanstack Form Screen";

export default TanstackFormScreen;

const styles = StyleSheet.create({
  root: {
    padding: 16,
    gap: 16,
  },
});
