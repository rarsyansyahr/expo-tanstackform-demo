import { ListPickerItem } from "@/components/molecules";
import { LabelValue, hobbies } from "@/data";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErrorValidationFormSchema = {
  name?: string;
  email?: string;
  job?: string;
  hobby?: string;
  subHobby?: string;
};

const defaultErrorValidationValues: ErrorValidationFormSchema = {
  name: undefined,
  email: undefined,
  job: undefined,
  hobby: undefined,
  subHobby: undefined,
};

export const useManualForm = () => {
  const [job, setJob] = useState<LabelValue>();
  const [hobby, setHobby] = useState<LabelValue>();
  const [subHobby, setSubHobby] = useState<LabelValue>();
  const [subHobbyLoading, setSubHobbyLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorValidation, setErrorValidation] =
    useState<ErrorValidationFormSchema>(defaultErrorValidationValues);

  const subHobbies = useMemo(
    () =>
      hobbies.find(({ items, ...rest }) => rest.value === hobby?.value)
        ?.items || [],
    [hobby],
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
    [errorValidation.name],
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
    [errorValidation.email],
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

  const onSubHobbyChange = useCallback((value: ListPickerItem) => {
    setSubHobby(value);
    setErrorValidation((prev) => ({ ...prev, subHobby: undefined }));
  }, []);

  const onJobChange = useCallback((value: ListPickerItem) => {
    setJob(value);
    setErrorValidation((prev) => ({ ...prev, job: undefined }));
  }, []);

  const isCanSubmit = useMemo(
    () => job && hobby && subHobby && name && email && !subHobbyLoading,
    [job, hobby, subHobby, subHobbyLoading, name, email],
  );

  const onSubmit = useCallback(() => {
    if (isCanSubmit) {
      return router.push({
        pathname: "/result",
        params: {
          request: JSON.stringify({ name, email, job, hobby, subHobby }),
        },
      });
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

  useEffect(() => {
    return () => {
      setJob(undefined);
      setHobby(undefined);
      setSubHobby(undefined);
      setSubHobbyLoading(false);
      setName("");
      setEmail("");
      setErrorValidation(defaultErrorValidationValues);
    };
  }, []);

  return {
    onNameChange,
    name,
    errorValidation,
    onEmailChange,
    email,
    job,
    onJobChange,
    hobby,
    onHobbyChange,
    subHobbies,
    subHobby,
    onSubHobbyChange,
    subHobbyLoading,
    onSubmit,
  };
};
