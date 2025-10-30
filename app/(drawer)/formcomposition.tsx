import { Button } from "@/components/atoms";
import {
    EducationForm,
    JobForm,
    OtherForm,
    PersonalForm,
} from "@/components/pages/formComposition";
import { checkHaveValues, useFormComposition } from "@/hooks";
import { TanstackFormValues } from "@/schemas";
import React, { FC } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FormCompositionScreen: FC = () => {
  const insets = useSafeAreaInsets();

  const $rootStyle = [styles.root, { paddingBottom: insets.bottom }];

  const { form, onReset } = useFormComposition();
  const { AppForm, SubmitButton, Subscribe } = form;

  const ResetButton = () => (
    <Subscribe selector={(state) => [state.values]}>
      {([values]) =>
        checkHaveValues(values as unknown as TanstackFormValues) && (
          <Button onPress={onReset} preset="text" title="Reset" />
        )
      }
    </Subscribe>
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.flex}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={$rootStyle}
      >
        <PersonalForm form={form} title="Pribadi" />
        <JobForm form={form} title="Pekerjaan" />
        <OtherForm form={form} title="Lainnya" />
        <EducationForm form={form} title="Pendidikan" />

        <AppForm>
          <SubmitButton title="Submit" />
        </AppForm>
        <ResetButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

FormCompositionScreen.displayName = "Form Composition Screen";

export default FormCompositionScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: {
    gap: 16,
    padding: 16,
  },
});
