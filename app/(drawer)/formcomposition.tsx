import { Button, Text } from "@/components/atoms";
import { TextField as RNTextField } from "@/components/molecules";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import React, { FC } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export function TextField({ label }: { label: string }) {
  // The `Field` infers that it should have a `value` type of `string`
  const field = useFieldContext<string>();
  return (
    <RNTextField
      label={label}
      value={field.state.value}
      onChange={field.handleChange}
    />
  );
}

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          title={label}
          disabled={isSubmitting}
          onPress={form.handleSubmit}
        />
      )}
    </form.Subscribe>
  );
}

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});

const ChildForm = withForm({
  // These values are only used for type-checking, and are not used at runtime
  // This allows you to `...formOpts` from `formOptions` without needing to redeclare the options
  defaultValues: {
    firstName: "John",
    lastName: "Doe",
  },
  // Optional, but adds props to the `render` function in addition to `form`
  props: {
    // These props are also set as default values for the `render` function
    title: "Child Form",
  },
  render: function Render({ form, title }) {
    return (
      <View style={{ gap: 16 }}>
        <Text text={title} />
        <form.AppField
          name="firstName"
          children={(field) => <field.TextField label="First Name" />}
        />
        <form.AppField
          name="lastName"
          children={(field) => <field.TextField label="Last Name" />}
        />
        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </View>
    );
  },
});

const FormCompositionScreen: FC = () => {
  const insets = useSafeAreaInsets();

  const form = useAppForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
    },
    onSubmit: ({ value }) => Alert.alert("Values", JSON.stringify(value)),
  });

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
        <ChildForm form={form} title={"Testing"} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

FormCompositionScreen.displayName = "Form Composition Screen";

export default FormCompositionScreen;
