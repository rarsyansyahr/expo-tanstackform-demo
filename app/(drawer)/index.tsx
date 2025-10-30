import { Alert, StyleSheet, View, ViewStyle } from "react-native";

import { ListPicker, ListPickerItem, TextField } from "@/components/molecules";
import { hobbies, jobs, LabelValue } from "@/data";
import { Button, Host } from "@expo/ui/swift-ui";
import { useCallback, useMemo, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function HomeScreen() {
  const [job, setJob] = useState<LabelValue>();
  const [hobby, setHobby] = useState<LabelValue>();
  const [subHobby, setSubHobby] = useState<LabelValue>();
  const [subHobbyLoading, setSubHobbyLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorValidation, setErrorValidation] = useState<{
    name?: string;
    email?: string;
    job?: string;
    hobby?: string;
    subHobby?: string;
  }>({
    name: undefined,
    email: undefined,
    job: undefined,
    hobby: undefined,
    subHobby: undefined,
  });

  const subHobbies = useMemo(
    () =>
      hobbies.find(({ items, ...rest }) => rest.value === hobby?.value)
        ?.items || [],
    [hobby]
  );

  const onNameChange = useCallback(
    (value: string) => {
      setName(value);

      if (value.length < 1) {
        setErrorValidation((prev) => ({ ...prev, name: "Nama harus diisi" }));
        return;
      }

      if (value.length < 5) {
        setErrorValidation((prev) => ({
          ...prev,
          name: "Nama minimal 5 karakter",
        }));
        return;
      }

      if (errorValidation.name) {
        setErrorValidation((prev) => ({ ...prev, name: undefined }));
      }
    },
    [errorValidation.name]
  );

  const onEmailChange = useCallback(
    (value: string) => {
      setEmail(value);

      if (value.length < 1) {
        setErrorValidation((prev) => ({ ...prev, email: "Email harus diisi" }));
        return;
      }

      if (!emailRegex.test(value)) {
        setErrorValidation((prev) => ({
          ...prev,
          email: "Format email salah",
        }));
        return;
      }

      if (errorValidation.email) {
        setErrorValidation((prev) => ({ ...prev, email: undefined }));
      }
    },
    [errorValidation.email]
  );

  const onHobbyChange = useCallback((value: ListPickerItem) => {
    setSubHobbyLoading(true);
    setHobby(value);
    setSubHobby(undefined);
    setErrorValidation((prev) => ({ ...prev, hobby: undefined }));
    setTimeout(() => {
      setSubHobbyLoading(false);
    }, 1000);
  }, []);

  const isCanSubmit = useMemo(
    () => job && hobby && subHobby && name && email && !subHobbyLoading,
    [job, hobby, subHobby, subHobbyLoading, name, email]
  );

  const onSubmit = useCallback(() => {
    if (isCanSubmit) {
      return Alert.alert(
        "Values",
        JSON.stringify({ name, email, job, hobby, subHobby })
      );
    }

    if (!name) {
      setErrorValidation((prev) => ({ ...prev, name: "Nama harus diisi" }));
    }

    if (!email) {
      setErrorValidation((prev) => ({ ...prev, email: "Email harus diisi" }));
    }

    if (!job) {
      setErrorValidation((prev) => ({ ...prev, job: "Pekerjaan harus diisi" }));
    }

    if (!hobby) {
      setErrorValidation((prev) => ({ ...prev, hobby: "Hobi harus diisi" }));
    }

    if (hobby && !subHobby) {
      setErrorValidation((prev) => ({
        ...prev,
        subHobby: "Sub Hobi harus diisi",
      }));
    }
  }, [isCanSubmit, name, email, job, hobby, subHobby]);

  return (
    <View style={styles.root}>
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
        onChange={setJob}
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
        onChange={setSubHobby}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
