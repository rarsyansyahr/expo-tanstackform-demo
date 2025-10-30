import z from "zod";

export const educationItemSchema = z.object({
  school: z.string("Instansi Pendidikan harus diisi"),
  degree: z.string("Gelar harus diisi"),
  yearRange: z.string("Tahun Pendidikan harus diisi"),
});

const labelValueItem = {
  label: z.string(),
  value: z.string(),
};

export const personalFormSchema = z.object({
  name: z.string("Nama harus diisi").min(5, "Nama minimal 5 karakter"),
  birthDate: z
    .date("Tanggal lahir harus diisi")
    .max(new Date(), "Tanggal Lahir harus di bawah hari ini"),
  email: z.string("Email harus diisi").email("Format email salah"),
  gender: z.enum(["male", "female"], "Jenis Kelamin harus diisi"),
});

export type PersonalFormValues = z.infer<typeof personalFormSchema>;

const jobFormSchema = z.object({
  job: z.object(labelValueItem, { error: "Pekerjaan harus diisi" }),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

const otherFormSchema = z.object({
  hobby: z.object(labelValueItem).optional(),
  subHobby: z
    .object(labelValueItem, { error: "Sub Hobi harus diisi" })
    .optional(),
});

export type OtherFormValues = z.infer<typeof otherFormSchema>;

const educationFormSchema = z.object({
  educations: z.array(educationItemSchema, "Riwayat Pendidikan harus diisi"),
});

export type EducationFormValues = z.infer<typeof educationFormSchema>;

export const tanstackFormSchema = personalFormSchema
  .merge(jobFormSchema)
  .merge(otherFormSchema)
  .merge(educationFormSchema);

export type TanstackFormValues = z.infer<typeof tanstackFormSchema>;
