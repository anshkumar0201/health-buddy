import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
  },
  section: {
    marginTop: 16,
    padding: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    marginBottom: 4,
  },
});

export default function AssessmentReportPDF({ disease, score, riskLevel }) {
  return (
    <Document >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{disease} Assessment Report</Text>
        <Text>Completed on {new Date().toLocaleDateString()}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Risk Assessment</Text>
          <Text>Score: {score}</Text>
          <Text>Risk Level: {riskLevel}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Recommendations</Text>
          <Text>- Follow prevention tips</Text>
          {riskLevel !== "LOW RISK" && (
            <Text>- Consult a healthcare professional</Text>
          )}
          <Text>- Maintain a healthy lifestyle</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Disclaimer</Text>
          <Text>
            This report is for informational purposes only and does not constitute
            medical advice.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
