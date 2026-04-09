import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend, // <--- Tambahkan ini
} from "recharts";

export const RadarSection = ({ users, colors, activeTraits }) => {
  const chartData = useMemo(() => {
    // 1. Dapatkan semua trait unik (seperti yang kamu lakukan sebelumnya)
    const traitSet = new Set();
    users.forEach((u) => u.report?.forEach((r) => traitSet.add(r.trait)));
    const traitArray = Array.from(traitSet);

    // 2. Format ulang menjadi objek yang dipahami Recharts
    return traitArray.map((traitName) => {
      // Subject adalah label yang muncul di ujung jaring
      const dataPoint = { subject: traitName };

      // Masukkan score tiap user ke dalam objek ini
      users.forEach((user, index) => {
        const userScore =
          user.report?.find((r) => r.trait === traitName)?.score || 0;

        // reverse score untuk trait K dan Z

        dataPoint[`user_${index}`] = ["K", "Z"].includes(traitName)
          ? 10 - userScore
          : userScore;
      });

      return dataPoint;
    });
  }, [users]);

  return (
    <section className="h-[600px] bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-[#1e5a9e] text-white p-5">
        <h2 className="font-semibold text-lg text-center">Jaring Laba-Laba</h2>
      </div>
      <div className="w-full h-[450px] flex justify-center items-center aspect-square">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="subject"
              tick={(props) => {
                const { x, y, payload, textAnchor } = props;
                const isHighlighted = activeTraits.includes(payload.value);

                return (
                  <g>
                    {isHighlighted && (
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="#1e5a9e"
                        fillOpacity="0.15"
                        className="animate-pulse"
                      />
                    )}
                    <text
                      x={x}
                      y={y}
                      dy={4}
                      textAnchor={textAnchor}
                      fill={isHighlighted ? "#1e5a9e" : "#94a3b8"}
                      fontSize={isHighlighted ? 12 : 10}
                      fontWeight={isHighlighted ? "800" : "500"}
                      className="transition-all duration-500"
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <PolarRadiusAxis
              angle={90} // Menentukan di garis mana angka akan muncul (90 derajat = garis tegak lurus ke atas)
              domain={[0, 9]} // Range angka 0 sampai 9
              tickCount={10} // Jumlah titik angka (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
              axisLine={false} // Menghilangkan garis sumbu utama agar tidak double dengan grid
              tick={{
                fontSize: 7,
                fill: "#8E8E93",
                fontWeight: "bold",
              }}
            />
            <RechartsTooltip
              formatter={(value, name, props) => {
                const traitName = props.payload?.subject;
                if (["K", "Z"].includes(traitName)) {
                  return [10 - value, name];
                }
                return [value, name];
              }}
            />

            {/* Tambahkan Legend di sini */}
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
            />

            {users.map((u, i) => {
              const theme = colors[i % colors.length];

              return (
                <Radar
                  key={i}
                  name={u.nama || `User ${i + 1}`} // Nama ini yang akan muncul di Legend
                  dataKey={`user_${i}`}
                  stroke={theme.stroke}
                  fill={theme.fill}
                  fillOpacity={0.2}
                />
              );
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
