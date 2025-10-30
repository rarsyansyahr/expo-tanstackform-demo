import { Button, Text } from "@/components/atoms";
import {
  DatePicker,
  ListPicker,
  RadioGroup,
  TextField
} from "@/components/molecules";
import { genders, hobbies, jobs } from "@/data";
import { useTanstackForm } from "@/hooks";
import {
  educationItemSchema,
  tanstackFormSchema
} from "@/schemas";
import { Gender } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FC } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TanstackFormScreen: FC = () => {
  const insets = useSafeAreaInsets();

  const tanstackFormHook = useTanstackForm();
  const { emailRef, birthDatePickerRef, jobPickerRef } = tanstackFormHook;
  const { hobbyPickerRef, subHobbyPickerRef, form } = tanstackFormHook;
  const { subHobbies, isSafeEmail, defaultValues } = tanstackFormHook;
  const { setIsSafeEmail, onHobbyChange, onReset } = tanstackFormHook;
  const { onEmailBlur, onBirthDateChange, checkHaveValues } = tanstackFormHook;

  const { Field, Subscribe } = form;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <ScrollView
        contentContainerStyle={[styles.root, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Name */}
        <Field
          name="name"
          validators={{ onChange: tanstackFormSchema.shape.name }}
        >
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
        <Field
          name="gender"
          validators={{ onChange: tanstackFormSchema.shape.gender }}
        >
          {({
            state: {
              value,
              meta: { errors },
            },
            handleChange,
          }) => (
            <RadioGroup<Gender>
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
            onChange: tanstackFormSchema.shape.email,
            onBlurAsync: onEmailBlur,
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
            onChange: tanstackFormSchema.shape.birthDate,
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
                onBirthDateChange(birthDate);
              }}
              status={errors.length ? "error" : undefined}
              helper={errors[0]?.message}
            />
          )}
        </Field>

        {/* Job */}
        <Field
          name="job"
          validators={{ onChange: tanstackFormSchema.shape.job }}
        >
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
            onChange: tanstackFormSchema.shape.hobby,
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
              validators={{ onChange: tanstackFormSchema.shape.subHobby }}
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
          validators={{ onChange: tanstackFormSchema.shape.educations }}
        >
          {(field) => (
            <FlatList
              data={field.state.value}
              extraData={field.state.value}
              renderItem={({ index }) => (
                <View key={index} style={styles.educations}>
                  <View style={styles.schoolContainer}>
                    <Field
                      name={`educations[${index}].school`}
                      key={`school-${index}`}
                      validators={{
                        onChange: educationItemSchema.shape.school,
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
                    <View style={styles.studyContainer}>
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
                            style={styles.flex}
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
                            style={styles.w40}
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
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={<Text text="Riwayat Pendidikan" size={14} />}
              ListFooterComponentStyle={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
              ListFooterComponent={
                <View>
                  <Button
                    onPress={() => field.pushValue(defaultValues.educations[0])}
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
          {([values]) =>
            checkHaveValues(values) && (
              <Button onPress={onReset} preset="text" title="Reset" />
            )
          }
        </Subscribe>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

TanstackFormScreen.displayName = "Tanstack Form Screen";

export default TanstackFormScreen;

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
});
