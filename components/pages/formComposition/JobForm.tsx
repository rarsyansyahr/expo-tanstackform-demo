import { jobs } from "@/data";
import { formCompositionOptions, withForm } from "@/hooks";
import { tanstackFormSchema } from "@/schemas";
import { StyleSheet, View } from "react-native";
import { SectionTitle } from "./SectionTitle";

export const JobForm = withForm({
  ...formCompositionOptions,

  props: {
    title: "Job Form",
  },
  render: ({ form, title }) => {
    return (
      <View style={styles.container}>
        <SectionTitle title={title} />
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

const styles = StyleSheet.create({ container: { gap: 8 } });
