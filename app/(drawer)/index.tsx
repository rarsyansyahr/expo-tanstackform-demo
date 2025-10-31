import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { ListPicker, TextField } from "@/components/molecules";
import { hobbies, jobs } from "@/data";
import { useManualForm } from "@/hooks";
import { Button, Host } from "@expo/ui/swift-ui";
import { FC } from "react";

const HomeScreen: FC = () => {
  const manualFormHook = useManualForm();
  const { name, email, job, hobby, subHobby } = manualFormHook;
  const { errorValidation, subHobbies, subHobbyLoading } = manualFormHook;
  const { onNameChange, onEmailChange, onHobbyChange } = manualFormHook;
  const { onJobChange, onSubHobbyChange, onSubmit } = manualFormHook;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.root}
        showsVerticalScrollIndicator={false}
      >
        <TextField
          onChange={onNameChange}
          label="Nama"
          placeholder="Masukan Nama"
          value={name}
          status={errorValidation.name ? "error" : undefined}
          helper={errorValidation.name}
        />
        <TextField
          onChange={onEmailChange}
          label="Email"
          placeholder="Masukan Email"
          value={email}
          keyboardType="email-address"
          inputMode="email"
          status={errorValidation.email ? "error" : undefined}
          helper={errorValidation.email}
        />
        <ListPicker
          data={jobs}
          value={job}
          onChange={onJobChange}
          label="Pekerjaan"
          placeholder="Pilih Pekerjaan"
          status={errorValidation.job ? "error" : undefined}
          helper={errorValidation.job}
        />
        <ListPicker
          data={hobbies}
          value={hobby}
          onChange={onHobbyChange}
          label="Hobi"
          placeholder="Pilih Hobi"
          status={errorValidation.hobby ? "error" : undefined}
          helper={errorValidation.hobby}
        />
        <ListPicker
          data={subHobbies}
          value={subHobby}
          onChange={onSubHobbyChange}
          label="Sub Hobi"
          placeholder="Pilih Sub Hobi"
          disabled={!hobby}
          loading={subHobbyLoading}
          status={errorValidation.subHobby ? "error" : undefined}
          helper={errorValidation.subHobby}
        />
        <Host matchContents>
          <Button variant="borderedProminent" onPress={onSubmit}>
            Submit
          </Button>
        </Host>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: { flex: 1, padding: 16, gap: 8 } as ViewStyle,

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
