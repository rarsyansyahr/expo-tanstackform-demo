import { Button, ButtonProps, Text } from "@/components/atoms";
import {
    DatePickerProps,
    ListPickerItem,
    ListPickerProps,
    RadioGroupProps,
    DatePicker as RNDatePicker,
    ListPicker as RNListPicker,
    RadioGroup as RNRadioGroup,
    TextField as RNTextField,
    TextFieldProps,
} from "@/components/molecules";
import { genders, hobbies, jobs, tanstackFormDefaultValues } from "@/data";
import { checkHaveValues } from "@/hooks";
import {
    educationItemSchema,
    tanstackFormSchema,
    TanstackFormValues,
} from "@/schemas";
import { Gender } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
    createFormHook,
    createFormHookContexts,
    formOptions,
} from "@tanstack/react-form";
import React, { FC, useCallback } from "react";
import {
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

const TextField: FC<TextFieldProps> = (props) => {
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

const RadioGroup = <T,>(props: RadioGroupProps<T>) => {
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

const DatePicker: FC<DatePickerProps> = (props) => {
  const { onChange, ...rest } = props;

  const field = useFieldContext<Date>();
  const { state, handleChange } = field;
  const { value, meta } = state;
  const { errors } = meta;

  const onChangeHandle = (val: Date) => {
    handleChange(val);
    if (onChange) onChange(val);
  };

  return (
    <RNDatePicker
      value={value}
      onChange={onChangeHandle}
      status={errors.length ? "error" : undefined}
      helper={errors[0]?.message}
      {...rest}
    />
  );
};

const ListPicker: FC<ListPickerProps> = (props) => {
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

function SubmitButton(props: ButtonProps) {
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
}

const Title = (props: { text: string }) => (
  <View style={styles.titleContainer}>
    <Text text={props.text} size={14} weight="600" />
    <View style={styles.line} />
  </View>
);

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    RadioGroup,
    DatePicker,
    ListPicker,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

const tanstackFormOptions = formOptions({
  defaultValues: tanstackFormDefaultValues,
});

const PersonalForm = withForm({
  ...tanstackFormOptions,
  props: {
    title: "Personal Form",
  },
  render: ({ form, title }) => {
    const { AppField, AppForm } = form;

    return (
      <View style={styles.childForm}>
       <Title text={title} />
        <AppField
          name="name"
          validators={{ onChange: tanstackFormSchema.shape.name }}
        >
          {(field) => (
            <field.TextField label="Nama" placeholder="Masukan Nama" />
          )}
        </AppField>
        <AppField
          name="gender"
          validators={{ onChange: tanstackFormSchema.shape.gender }}
        >
          {(field) => (
            <field.RadioGroup<Gender> label="Jenis Kelamin" data={genders} />
          )}
        </AppField>
        <AppField
          name="email"
          validators={{
            onChange: tanstackFormSchema.shape.email,
          }}
        >
          {(field) => (
            <field.TextField
              label="Email"
              placeholder="Masukan Email"
              keyboardType="email-address"
              inputMode="email"
              autoCapitalize="none"
            />
          )}
        </AppField>
        <AppField
          name="birthDate"
          validators={{ onChange: tanstackFormSchema.shape.birthDate }}
        >
          {(field) => (
            <field.DatePicker
              label="Tanggal Lahir"
              placeholder="Pilih Tanggal Lahir"
            />
          )}
        </AppField>
      </View>
    );
  },
});

const JobForm = withForm({
  ...tanstackFormOptions,

  props: {
    title: "Job Form",
  },
  render: ({ form, title }) => {
    return (
      <View style={styles.childForm}>
        <Title text={title} />
        <form.AppField
          name="job"
          validators={{ onChange: tanstackFormSchema.shape.job }}
        >
          {(field) => (
            <field.ListPicker
              label="Pekerjaan"
              placeholder="Pilih Pekerjaan"
              data={jobs}
            />
          )}
        </form.AppField>
      </View>
    );
  },
});

const OtherForm = withForm({
  defaultValues: tanstackFormDefaultValues,
  props: {
    title: "Other Form",
  },
  render: ({ form, title }) => {
    return (
      <View style={styles.childForm}>
        <Title text={title} />
        <form.AppField
          name="hobby"
          validators={{ onChange: tanstackFormSchema.shape.hobby }}
        >
          {(field) => (
            <field.ListPicker
              label="Hobi"
              placeholder="Pilih Hobi"
              data={hobbies}
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(state) => state.values.hobby}>
          {(hobby) => (
            <form.AppField
              name="subHobby"
              validators={{ onChange: tanstackFormSchema.shape.subHobby }}
            >
              {(field) => (
                <field.ListPicker
                  label="Sub Hobi"
                  placeholder="Pilih Sub Hobi"
                  data={
                    hobbies.find((item) => item.value === hobby?.value)
                      ?.items || []
                  }
                  disabled={!hobby}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </View>
    );
  },
});

const EducationForm = withForm({
  defaultValues: tanstackFormDefaultValues,
  props: {
    title: "Education Form",
  },
  render: ({ form, title }) => {
    return (
      <View style={styles.childForm}>
        <Title text={title} />
        <form.AppField
          name="educations"
          mode="array"
          validators={{ onChange: tanstackFormSchema.shape.educations }}
        >
          {(field) => (
            <FlatList
              data={field.state.value}
              extraData={field.state.value}
              renderItem={({ index }) => (
                <View key={index} style={styles.educations}>
                  <View style={styles.schoolContainer}>
                    <form.AppField
                      name={`educations[${index}].school`}
                      key={`school-${index}`}
                      validators={{
                        onChange: educationItemSchema.shape.school,
                      }}
                    >
                      {(field) => (
                        <field.TextField
                          label="Instansi Pendidikan"
                          placeholder="Masukan Instansi Pendidikan"
                        />
                      )}
                    </form.AppField>
                    <View style={styles.studyContainer}>
                      <form.AppField
                        name={`educations[${index}].degree`}
                        key={`degree-${index}`}
                        validators={{
                          onChange: educationItemSchema.shape.degree,
                        }}
                      >
                        {(field) => (
                          <field.TextField
                            label="Program Studi"
                            placeholder="Masukan Program Studi"
                            style={styles.flex}
                          />
                        )}
                      </form.AppField>
                      <form.AppField
                        name={`educations[${index}].yearRange`}
                        key={`yearRange-${index}`}
                        validators={{
                          onChange: educationItemSchema.shape.yearRange,
                        }}
                      >
                        {(field) => (
                          <field.TextField
                            label="Tahun Pendidikan"
                            placeholder="Masukan Tahun Pendidikan"
                            style={styles.w40}
                          />
                        )}
                      </form.AppField>
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
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={<Text text="Riwayat Pendidikan" size={14} />}
              ListFooterComponentStyle={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
              ListFooterComponent={
                <View>
                  <Button
                    onPress={() =>
                      field.pushValue(tanstackFormDefaultValues.educations[0])
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
        </form.AppField>
      </View>
    );
  },
});

const FormCompositionScreen: FC = () => {
  const insets = useSafeAreaInsets();

  const form = useAppForm({
    defaultValues: tanstackFormDefaultValues,
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

  const onReset = useCallback(
    () => form.reset(tanstackFormDefaultValues),
    [form]
  );

  const ResetButton = () => (
    <form.Subscribe selector={(state) => [state.values]}>
      {([values]) =>
        checkHaveValues(values as unknown as TanstackFormValues) && (
          <Button onPress={onReset} preset="text" title="Reset" />
        )
      }
    </form.Subscribe>
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
          padding: 16,
          paddingBottom: insets.bottom,
        }}
      >
        <PersonalForm form={form} title="Pribadi" />
        <JobForm form={form} title="Pekerjaan" />
        <OtherForm form={form} title="Lainnya" />
        <EducationForm form={form} title="Pendidikan" />

        <form.AppForm>
          <form.SubmitButton title="Submit" />
        </form.AppForm>
        <ResetButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

FormCompositionScreen.displayName = "Form Composition Screen";

export default FormCompositionScreen;

const styles = StyleSheet.create({
  root: {
    padding: 16,
    gap: 16,
  },

  flex: { flex: 1 },

  educations: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },

  schoolContainer: { flex: 1, gap: 6 },

  studyContainer: {
    flexDirection: "row",
    gap: 6,
  },

  w40: { width: "40%" },

  separator: {
    borderWidth: 0.3,
    borderColor: "black",
    marginTop: 6,
  },

  childForm: { gap: 8 },

  line: { backgroundColor: "#0C2B4E", height: 0.5, flex: 1 },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
});
