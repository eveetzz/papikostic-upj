export const TraitSection = ({ users, themeColors }) => {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mt-6">
      {/* HEADER UTAMA */}
      <div className="bg-[#1e5a9e] text-white px-6 py-4">
        <h2 className="font-semibold text-lg text-center">
          Kekuatan Utama Kandidat
        </h2>
      </div>

      {/* GRID KANDIDAT */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50">
        {users.map((user, idx) => {
          const theme = themeColors[idx % themeColors.length];
          // Menggunakan topTraits yang sudah ada di data user
          const topTraits = user.topTraits || [];

          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl shadow-sm border ${theme.border} overflow-hidden flex flex-col`}
            >
              {/* HEADER KARTU KANDIDAT */}
              <div
                className={`${theme.bgLight} px-6 py-4 border-b ${theme.border}`}
              >
                <h3 className={`font-bold ${theme.text}`}>
                  {user.displayName || user.nama || `Kandidat ${idx + 1}`}
                </h3>
              </div>

              {/* LIST TRAITS */}
              <div className="p-6 space-y-4 flex-1">
                {topTraits.length > 0 ? (
                  topTraits.map((t, i) => (
                    <div
                      key={i}
                      className="border-b border-slate-50 pb-2 last:border-0"
                    >
                      <div className="inline-flex items-center gap-4 p-3 rounded-lg border border-gray-200 shadow-xs w-full">
                        {/* Kotak khusus untuk Trait agar warnanya kontras */}
                        <span className="p-2 text-xs font-black uppercase rounded bg-[#1e5a9e] text-white">
                          {t.trait}
                        </span>

                        {/* Teks untuk Description dengan warna yang lebih lembut */}
                        <span className="text-sm font-medium text-gray-600">
                          {t.interpretation}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-400 italic text-center py-4">
                    Data kekuatan utama belum tersedia
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
