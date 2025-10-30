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
      { label: "Novel", value: "Novel" },
      { label: "Komik", value: "Komik" },
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

export const genders: { label: string; value: "male" | "female" }[] = [
  { label: "Laki-laki", value: "male" },
  { label: "Perempuan", value: "female" },
];
