// import { Button, Text } from "@/components/atoms";
// import { tanstackFormDefaultValues } from "@/data";
// import { formCompositionOptions, withForm } from "@/hooks";
// import { educationItemSchema, tanstackFormSchema } from "@/schemas";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
// import { SectionTitle } from "./SectionTitle";

// export const EducationForm = withForm({
//   ...formCompositionOptions,
//   props: {
//     title: "Education Form",
//   },
//   render: ({ form, title }) => {
//     return (
//       <View style={styles.container}>
//         <SectionTitle title={title} />
//         <form.AppField
//           name="educations"
//           mode="array"
//           validators={{ onChange: tanstackFormSchema.shape.educations }}
//         >
//           {(field) => (
//             <FlatList
//               data={field.state.value}
//               extraData={field.state.value}
//               renderItem={({ index }) => (
//                 <View key={index} style={styles.educations}>
//                   <View style={styles.schoolContainer}>
//                     <form.AppField
//                       name={`educations[${index}].school`}
//                       key={`school-${index}`}
//                       validators={{
//                         onChange: educationItemSchema.shape.school,
//                       }}
//                     >
//                       {(field) => (
//                         <field.TextField
//                           label="Instansi Pendidikan"
//                           placeholder="Masukan Instansi Pendidikan"
//                         />
//                       )}
//                     </form.AppField>
//                     <View style={styles.studyContainer}>
//                       <form.AppField
//                         name={`educations[${index}].degree`}
//                         key={`degree-${index}`}
//                         validators={{
//                           onChange: educationItemSchema.shape.degree,
//                         }}
//                       >
//                         {(field) => (
//                           <field.TextField
//                             label="Program Studi"
//                             placeholder="Masukan Program Studi"
//                             style={styles.flex}
//                           />
//                         )}
//                       </form.AppField>
//                       <form.AppField
//                         name={`educations[${index}].yearRange`}
//                         key={`yearRange-${index}`}
//                         validators={{
//                           onChange: educationItemSchema.shape.yearRange,
//                         }}
//                       >
//                         {(field) => (
//                           <field.TextField
//                             label="Tahun Pendidikan"
//                             placeholder="Masukan Tahun Pendidikan"
//                             style={styles.w40}
//                           />
//                         )}
//                       </form.AppField>
//                     </View>
//                   </View>
//                   <TouchableOpacity
//                     style={{ alignItems: "center", justifyContent: "center" }}
//                     activeOpacity={0.8}
//                     onPress={() =>
//                       field.state.value.length > 1 && field.removeValue(index)
//                     }
//                   >
//                     <MaterialIcons name="close" size={20} />
//                   </TouchableOpacity>
//                 </View>
//               )}
//               contentContainerStyle={{ gap: 6 }}
//               removeClippedSubviews
//               showsVerticalScrollIndicator={false}
//               scrollEnabled={false}
//               ItemSeparatorComponent={() => <View style={styles.separator} />}
//               ListHeaderComponent={<Text text="Riwayat Pendidikan" size={14} />}
//               ListFooterComponentStyle={{
//                 justifyContent: "flex-end",
//                 alignItems: "flex-end",
//               }}
//               ListFooterComponent={
//                 <View>
//                   <Button
//                     onPress={() =>
//                       field.pushValue(tanstackFormDefaultValues.educations[0])
//                     }
//                     title="Tambah Pendidikan"
//                     preset="text"
//                   />
//                   {field.state.meta.errors.length > 0 &&
//                     field.state.value.length < 1 && (
//                       <Text
//                         text={field.state.meta.errors[0]?.message}
//                         color="red"
//                         size={10}
//                       />
//                     )}
//                 </View>
//               }
//             />
//           )}
//         </form.AppField>
//       </View>
//     );
//   },
// });

// const styles = StyleSheet.create({
//   container: { gap: 8 },

//   flex: { flex: 1 },

//   educations: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     flex: 1,
//   },

//   schoolContainer: { flex: 1, gap: 6 },

//   studyContainer: {
//     flexDirection: "row",
//     gap: 6,
//   },

//   w40: { width: "40%" },

//   separator: {
//     borderWidth: 0.3,
//     borderColor: "black",
//     marginTop: 6,
//   },
// });
