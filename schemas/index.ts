import z from "zod";

export const educationItemSchema = z.object({
  school: z.string().min(5, "Instansi Pendidikan harus diisi"),
  degree: z.string().min(5, "Gelar harus diisi"),
  yearRange: z.string().min(5, "Tahun Pendidikan harus diisi"),
});

const labelValueItem = {
  label: z.string(),
  value: z.string(),
};

export const tanstackFormSchema = z.object({
  name: z.string("Nama harus diisi").min(5, "Nama minimal 5 karakter"),
  birthDate: z
    .date("Tanggal lahir harus diisi")
    .max(new Date(), "Tanggal Lahir harus di bawah hari ini"),
  email: z.email("Format email salah").min(1, "Email harus diisi"),
  gender: z.enum(["male", "female"], "Jenis Kelamin harus diisi"),
  educations: z.array(educationItemSchema, "Riwayat Pendidikan harus diisi"),
  job: z.object(labelValueItem, { error: "Pekerjaan harus diisi" }),
  hobby: z.object(labelValueItem).optional(),
  subHobby: z
    .object(labelValueItem, { error: "Sub Hobi harus diisi" })
    .optional(),
});

export type TanstackFormValues = z.infer<typeof tanstackFormSchema>;
