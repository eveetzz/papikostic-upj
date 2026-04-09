import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Komponen Tooltip Kustom
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #1A5A9A",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{ fontWeight: "bold", margin: 0, color: "#1A5A9A" }}
        >{`Trait: ${data.trait}`}</p>
        <p
          style={{ margin: "4px 0", fontSize: "14px" }}
        >{`Skor: ${data.score}`}</p>
        <p
          style={{ margin: 0, fontSize: "14px", color: "#666" }}
        >{`Kategori: ${data.category || "-"}`}</p>
      </div>
    );
  }
  return null;
};

export const ScoreRadar = ({ results }) => {
  // Transformasi data sama seperti logika sebelumnya
  const processedData = results.map((item) => ({
    ...item,
    displayScore: ["K", "Z"].includes(item.trait)
      ? 10 - item.score
      : item.score,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
          <PolarGrid stroke="#8E8E93" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: "#000", fontSize: 12, fontWeight: 500 }}
          />
          {/* Sembunyikan angka di sumbu radius agar bersih */}
          <PolarRadiusAxis
            angle={90} // Menentukan di garis mana angka akan muncul (90 derajat = garis tegak lurus ke atas)
            domain={[0, 9]} // Range angka 0 sampai 9
            tickCount={10} // Jumlah titik angka (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
            axisLine={false} // Menghilangkan garis sumbu utama agar tidak double dengan grid
            tick={{
              fontSize: 10,
              fill: "#8E8E93",
              fontWeight: "bold",
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Radar
            name="Skor Psikotes"
            dataKey="displayScore"
            stroke="#1A5A9A"
            fill="#1A5A9A"
            fillOpacity={0.2}
            dot={{ r: 4, fill: "#1A5A9A" }} // Titik tetap ada
            activeDot={{ r: 6 }} // Membesar saat di-hover
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
