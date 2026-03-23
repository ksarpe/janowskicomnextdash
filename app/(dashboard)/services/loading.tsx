export default function ServicesLoading() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 w-full mx-auto">
        {/* Szkielet Nagłówka (Header) */}
        <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4 animate-pulse">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-8 bg-dash-border rounded-sm" />
            </div>
            <div className="w-80 max-w-full h-4 bg-dash-border rounded-md mt-3 opacity-50" />
            <div className="w-64 max-w-full h-4 bg-dash-border rounded-md mt-1 opacity-50" />
          </div>

          {/* Szkielet Przycisku "Dodaj" */}
          <div className="w-36 h-10 bg-dash-border rounded-sm" />
        </div>

        {/* Szkielet Listy Usług (np. 3 elementy) */}
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-sm border bg-dash-card border-dash-border animate-pulse flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap"
            >
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  {/* Szkielet Ikony */}
                  <div className="w-9 h-9 bg-dash-border rounded-sm opacity-70" />

                  {/* Szkielet Nazwy i Opisu */}
                  <div className="flex flex-col gap-1.5 ml-1">
                    <div className="w-40 h-5 bg-dash-border rounded-md" />
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-16 h-4 bg-dash-bg rounded-md" />
                      <div className="w-20 h-4 bg-dash-bg rounded-md" />
                      <div className="w-12 h-4 bg-dash-border rounded-md opacity-40 ml-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Szkielet Akcji (Przyciski "Edytuj", "Zawieś") */}
              <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0 justify-end opacity-70">
                <div className="w-16 h-8 bg-dash-border rounded-sm" />
                <div className="w-24 h-8 bg-dash-border rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
