import { genders } from "@/data";
import { formCompositionOptions, withForm } from "@/hooks";
import { tanstackFormSchema } from "@/schemas";
import { Gender } from "@/types";
import { StyleSheet, View } from "react-native";
import { SectionTitle } from "./SectionTitle";

export const PersonalForm = withForm({
  ...formCompositionOptions,
  props: {
    title: "Personal Form",
  },
  render: ({ form, title }) => {
    const { AppField } = form;

    return (
      <View style={styles.container}>
        <SectionTitle title={title} />
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

const styles = StyleSheet.create({ container: { gap: 8 } });
