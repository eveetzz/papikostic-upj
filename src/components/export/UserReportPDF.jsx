import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import logoImg from "../../assets/864.jpg";
import { submitDate } from "../../utils/formatDate";
import { getDisplayReport } from "../../services/fetchData";

export const UserReportPDF = ({ user }) => {
  const date = submitDate(user);

  const report = getDisplayReport(user.report);

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily: "Helvetica",
      flexDirection: "column",
    },

    mainContent: {
      flex: 0, // Biarkan konten ini mengambil ruang sesuai isinya
    },

    // 1. Tambahkan style ini di StyleSheet
    noteLine: {
      borderBottom: "0.5pt solid #EEE",
      marginTop: 20, // Jarak antar garis untuk tulisan tangan
      width: "100%",
    },
    // Tambahkan sedikit line height di biodata agar lebih enak dibaca
    bioText: {
      marginBottom: 4,
      color: "#333",
    },

    // kop surat
    letterText: {
      flexDirection: "row",
      // borderBottom: "2pt solid #1A5A9A",
      paddingBottom: 5,
      marginBottom: 10,
      alignItems: "center",
    },

    // Container garis tiga warna
    multiColorBar: {
      flexDirection: "row",
      height: 2, // Ketebalan garis
      width: "100%",
      marginBottom: 20,
    },
    colorSegment: {
      flex: 1, // Membagi rata ruang
      height: "100%",
    },

    logo: {
      width: 60,
      height: 60,
      backgroundColor: "#eee",
    },
    headerText: {
      marginLeft: 10,
      flex: 1,
    },
    institutionName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#1A5A9A",
    },
    address: {
      fontSize: 10,
      color: "#666",
      marginTop: 2,
    },

    // biodata user
    biodataSection: {
      flexDirection: "row",
      marginBottom: 20,
      padding: 10,
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
    },

    // hasil tes user
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    // Kartu Panel
    panel: {
      width: "48.5%",
      marginBottom: 20,
      paddingLeft: 10, // Ruang untuk garis vertikal
    },
    panelHeaderContainer: {
      borderLeft: "3pt solid #1A5A9A", // Garis vertikal tebal di kiri
      paddingLeft: 8,
      marginBottom: 10,
    },
    panelHeader: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: "#000",
    },

    // Progress Bar Minimalis (Sesuai Gambar)
    itemBox: { marginBottom: 12 },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    traitText: { fontSize: 9, color: "#333", flex: 1 },
    scoreBox: {
      backgroundColor: "#E5E7EB",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 9,
      fontWeight: "bold",
    },

    barBg: {
      height: 5,
      backgroundColor: "#E5E7EB",
      borderRadius: 2,
      marginVertical: 4,
    },
    barFill: {
      height: "100%",
      borderRadius: 2,
    },

    // Label teks di bawah bar
    statusLabel: {
      fontSize: 8,
      fontWeight: "bold",
    },

    // interpretasi note section
    noteBox: {
      border: "1pt solid #ccc",
      borderRadius: 15,
      padding: 10,
      minHeight: 100,
      flex: 1, // KUNCINYA DI SINI: Akan mengambil semua sisa ruang yang ada
      marginBottom: 30, // Jarak ke footer
    },

    noteTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#666",
      marginBottom: 5,
      textTransform: "uppercase",
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#1A5A9A",
      marginBottom: 20,
      marginTop: 10,
      borderBottom: "1pt solid #1A5A9A",
      paddingBottom: 2,
      width: "100%",
    },

    footer: {
      position: "absolute",
      bottom: 30,
      left: 40,
      right: 40,
      borderTop: "1pt solid #EEE",
      paddingTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#999",
      fontSize: 8,
    },
  });

  return (
    <Document title={`laporan ${user.displayName}`}>
      <Page size="A4" style={styles.page}>
        {/* KOP SURAT */}

        <View style={styles.letterText}>
          {/* <View style={styles.logo}/> */}
          <Image src={logoImg} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.institutionName}>
              Universitas Pembangunan Jaya
            </Text>
            <Text style={styles.address}>Jl. Cendrawasih No. 1, Jakarta</Text>
          </View>
        </View>

        <View style={styles.multiColorBar}>
          <View style={[styles.colorSegment, { backgroundColor: "#009245" }]} />{" "}
          {/* Biru UPJ */}
          <View
            style={[styles.colorSegment, { backgroundColor: "#ED1C24" }]}
          />{" "}
          {/* Orange */}
          <View
            style={[styles.colorSegment, { backgroundColor: "#0071BC" }]}
          />{" "}
          {/* Toska */}
        </View>

        {/* Biodata User */}
        <Text style={styles.sectionTitle}>I. INFORMASI PESERTA</Text>
        <View style={styles.biodataSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bioText}>Nama: {user.displayName}</Text>
            <Text style={styles.bioText}>Email: {user.email}</Text>
          </View>
          <View style={{ flex: 1, textAlign: "right" }}>
            <Text style={styles.bioText}>Tanggal Pengerjaan: {date}</Text>
          </View>
        </View>

        {/*  Hasil tes user */}
        <Text style={styles.sectionTitle}>II. DETAIL HASIL EVALUASI</Text>
        <View style={styles.gridContainer}>
          {Object.entries(report).map(([category, items], index) => (
            <View key={index} style={styles.panel} wrap={false}>
              {/* Header Kategori dengan Garis Kiri */}
              <View style={styles.panelHeaderContainer}>
                <Text style={styles.panelHeader}>{category}</Text>
              </View>

              <View style={styles.contentWrapper}>
                {items.map((item, idx) => {
                  // Logika warna berdasarkan label/skor
                  const isHigh = item.label === "HIGH ANALYSIS";
                  const themeColor = isHigh ? "#0D9488" : "#F59E0B"; // Toska vs Orange

                  return (
                    <View key={idx} style={styles.itemBox}>
                      <View style={styles.itemRow}>
                        <Text style={styles.traitText}>
                          {item.traitName || item.description}
                        </Text>
                        <Text style={styles.scoreBox}>{item.score}</Text>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.barBg}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${(Math.max(0, Number(item.score) || 0) / 9) * 100}%`,
                              backgroundColor: themeColor,
                            },
                          ]}
                        />
                      </View>

                      {/* Label Status (Tanpa Background/Badge, cuma Teks) */}
                      <Text style={[styles.statusLabel, { color: themeColor }]}>
                        {item.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Interpretasi Note */}
        <Text style={styles.sectionTitle}>III. INTERPRETASI & REKOMENDASI</Text>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>Catatan / Rekomendasi Pemeriksa:</Text>
          {/* Biarkan kosong atau isi garis-garis tipis untuk ditulis tangan */}
        </View>

        {/* 3. FOOTER PROFESIONAL (Fixed di bawah) */}
        <View style={styles.footer} fixed>
          <Text>
            Dokumen ini dihasilkan secara otomatis oleh Sistem Evaluasi UPJ
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Halaman ${pageNumber} dari ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};
