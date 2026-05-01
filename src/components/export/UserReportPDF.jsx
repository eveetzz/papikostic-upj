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

export const UserReportPDF = ({ user, chartImage }) => {
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
      backgroundColor: "#F8FAFC", // Warna background yang sama dengan biodata
      borderLeft: "4pt solid #1A5A9A", // Aksen Biru UPJ yang sama
      borderTop: "1pt solid #E5E7EB",
      borderRight: "1pt solid #E5E7EB",
      borderBottom: "1pt solid #E5E7EB",
      borderRadius: 4, // Gunakan radius kecil agar lebih tegas/profesional
      padding: 15,
      flex: 1,
      marginBottom: 20,
    },
    noteTitle: {
      fontSize: 7,
      fontWeight: "bold",
      color: "#64748B", // Abu-abu yang sama dengan label biodata
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    noteLine: {
      borderBottom: "0.5pt solid #CBD5E1", // Garis bantu tulis yang halus
      marginTop: 20,
      width: "100%",
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

    signatureSection: {
      marginTop: 20,
      // Menarik seluruh kotak ke kanan bawah
      marginLeft: "auto",
      width: 200, // Lebar area tanda tangan (atur sesuai kebutuhan)
      paddingRight: 20,
      wrap: false,
    },
    dateText: {
      fontSize: 10,
      marginBottom: 5,
      textAlign: "left", // Pepet kiri di dalam kotak
    },
    stampPlaceholder: {
      height: 70,
      width: "100%", // Memberikan ruang kosong yang pasti
    },
    psikologName: {
      fontSize: 10,
      fontWeight: "bold",
      borderBottom: "1pt solid #000",
      paddingBottom: 2,
      marginBottom: 4,
      textAlign: "left",
      minHeight: 15, // Supaya kalau kosong, garis tetap ada
    },
    sippText: {
      fontSize: 9,
      borderBottom: "1pt solid #8B0000",
      marginTop: 15,
      paddingBottom: 2,
      textAlign: "left",
      minHeight: 12,
    },

    // BOX MERAH GELAP (Sesuai Gambar)
    alertBox: {
      backgroundColor: "#8B0000", // Merah Tua / Maroon
      paddingVertical: 8,
      paddingHorizontal: 15,
      marginTop: 10,
      marginBottom: 15,
      width: "100%",
    },
    alertText: {
      color: "#FFFFFF",
      fontSize: 8,
      fontWeight: "bold",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 0.5,
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
            <Text style={styles.address}>
              Jalan Boulevard UPJ, Bintaro Jaya, Tangerang Selatan 15413
            </Text>
          </View>
        </View>

        <View style={styles.multiColorBar}>
          <View style={[styles.colorSegment, { backgroundColor: "#009245" }]} />
          <View style={[styles.colorSegment, { backgroundColor: "#ED1C24" }]} />
          <View style={[styles.colorSegment, { backgroundColor: "#0071BC" }]} />
        </View>

        {/* Biodata User */}
        <Text style={styles.sectionTitle}>I. INFORMASI PESERTA</Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F8FAFC",
            padding: 12,
            borderRadius: 8,
            borderLeft: "4pt solid #1A5A9A", // Aksen warna UPJ
            marginBottom: 20,
          }}
        >
          <View style={{ flex: 1.5 }}>
            <Text style={{ fontSize: 7, color: "#64748B", marginBottom: 2 }}>
              NAMA PESERTA
            </Text>
            <Text
              style={{ fontSize: 11, fontWeight: "bold", color: "#1E293B" }}
            >
              {user.displayName}
            </Text>
            <Text
              style={{
                fontSize: 7,
                color: "#64748B",
                marginTop: 8,
                marginBottom: 2,
              }}
            >
              EMAIL
            </Text>
            <Text style={{ fontSize: 10, color: "#1E293B" }}>{user.email}</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 7, color: "#64748B", marginBottom: 2 }}>
              TANGGAL TES
            </Text>
            <Text
              style={{ fontSize: 10, fontWeight: "bold", color: "#1E293B" }}
            >
              {date}
            </Text>
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
                              width: `${(item.score / 9) * 100}%`,
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

        <Text style={styles.sectionTitle}>
          III. PROFIL KOMPETENSI PSIKOLOGIS
        </Text>
        {chartImage ? (
          <Image
            src={chartImage}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
            }}
          />
        ) : (
          <Text>Tidak bisa memuat chart</Text>
        )}

        {/* Interpretasi Note */}
        <Text style={styles.sectionTitle}>IV. INTERPRETASI & REKOMENDASI</Text>

        <View style={styles.noteBox}>
          {/* Label Header Box */}
          <Text style={styles.noteTitle}>Catatan / Rekomendasi Pemeriksa</Text>
        </View>

        {/* --- AREA TANDA TANGAN --- */}
        <View style={styles.signatureSection}>
          {/* Baris Kota & Tanggal */}
          <Text style={styles.dateText}>Tangerang Selatan, </Text>

          {/* Kotak Kosong untuk TTD Manual / Stempel */}
          <View style={styles.stampPlaceholder} />

          {/* Baris Nama Terang */}
          <Text style={styles.psikologName}>NAMA : </Text>

          {/* Baris SIPP */}
          <Text style={styles.sippText}>SIPP : </Text>
        </View>

        {/* --- BOX MERAH PERINGATAN (FULL WIDTH) --- */}
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Profil Evaluasi Psikologis ini hanya berlaku bila telah
            ditandatangani oleh Psikolog
          </Text>
        </View>

        {/* 3. FOOTER PROFESIONAL (Fixed di bawah) */}
        <View style={styles.footer} fixed>
          <Text>PAPI KOSTICK UPJ</Text>
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
