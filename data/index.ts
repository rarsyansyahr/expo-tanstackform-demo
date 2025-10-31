import {
  EducationFormValues,
  JobFormValues,
  OtherFormValues,
  PersonalFormValues,
  TanstackFormValues,
} from "@/schemas";
import { Gender } from "@/types";

export type LabelValue = { label: string; value: string };

type LabelValueItem = LabelValue & { items: LabelValue[] };

export const jobs: LabelValue[] = [
  { label: "TNI", value: "tni" },
  { label: "Polisi", value: "polisi" },
  { label: "Guru", value: "guru" },
  { label: "Petani", value: "petani" },
];

export const hobbies: LabelValueItem[] = [
  {
    label: "Membaca",
    value: "membaca",
    items: [
      { label: "Novel", value: "novel" },
      { label: "Komik", value: "komik" },
    ],
  },
  {
    label: "Game",
    value: "game",
    items: [
      { label: "E-Sport", value: "esport" },
      { label: "Sepak Bola", value: "sepak-bola" },
    ],
  },
];

export const genders: { label: string; value: Gender }[] = [
  { label: "Laki-laki", value: "male" },
  { label: "Perempuan", value: "female" },
];

export const personalDefaultValues: PersonalFormValues = {
  name: undefined as any,
  email: undefined as any,
  gender: undefined as any,
  birthDate: undefined as any,
};

export const jobDefaultValues: JobFormValues = {
  job: undefined as any,
};

export const otherDefaultValues: OtherFormValues = {
  hobby: undefined as any,
  subHobby: undefined as any,
};

export const educationDefaultValues: EducationFormValues = {
  educations: [
    {
      school: undefined as any,
      degree: undefined as any,
      yearRange: undefined as any,
    },
  ],
};

export const tanstackFormDefaultValues: TanstackFormValues = {
  ...personalDefaultValues,
  ...jobDefaultValues,
  ...otherDefaultValues,
  ...educationDefaultValues,
};

export const registeredEmail = "andi@rubin.com";
