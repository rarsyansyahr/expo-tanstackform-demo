import { hobbies } from "@/data";
import { formCompositionOptions, withForm } from "@/hooks";
import { tanstackFormSchema } from "@/schemas";
import { StyleSheet, View } from "react-native";
import { SectionTitle } from "./SectionTitle";

export const OtherForm = withForm({
  ...formCompositionOptions,
  props: {
    title: "Other Form",
  },
  render: ({ form, title }) => {
    return (
      <View style={styles.container}>
        <SectionTitle title={title} />
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

const styles = StyleSheet.create({ container: { gap: 8 } });
