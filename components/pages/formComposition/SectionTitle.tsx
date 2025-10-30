import { Text } from "@/components/atoms";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

type SectionTitleProps = { title: string };

export const SectionTitle: FC<SectionTitleProps> = (props) => (
  <View style={styles.container}>
    <Text text={props.title} size={14} weight="600" />
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },

  line: { backgroundColor: "#0C2B4E", height: 0.5, flex: 1 },
});
