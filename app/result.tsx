import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function HighlightComponent() {
  const { request } = useLocalSearchParams<{ request: string }>();
  const prettierRequest = JSON.stringify(JSON.parse(request), null, 2);

  return (
    <ScrollView
      contentContainerStyle={styles.flex}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      bounces={false}
    >
      <CodeHighlighter
        hljsStyle={atomOneDarkReasonable}
        containerStyle={styles.container}
        style={oneDark}
        textStyle={styles.text}
        language="json"
        scrollViewProps={{ showsHorizontalScrollIndicator: false }}
      >
        {prettierRequest}
      </CodeHighlighter>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    minWidth: "100%",
  },
  text: {
    fontSize: 16,
  },

  flex: { flex: 1 },
});
