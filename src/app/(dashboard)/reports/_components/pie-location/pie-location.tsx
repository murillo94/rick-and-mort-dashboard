import { Locations } from "@/data-access/schemas";
import { getAllLocations } from "@/data-access/services";
import { PieChart, PieChartProvider, PieChartLegend } from "@/ui/pie";
import { randomColors } from "@/utils/colors";

const colors = randomColors();
const colorsLength = colors.length;

const parseData = (locations: Locations) => {
  return locations
    .filter((location) => location.residents.length > 0)
    .map((location, index) => ({
      title: location.name,
      value: location.residents.length,
      color: colors[index % colorsLength],
    }))
    .sort((a, b) => b.value - a.value);
};

export default async function PieLocation() {
  const locations = await getAllLocations();

  const dataParsed = parseData(locations);

  return (
    <section className="bg-white rounded-lg p-6 border border-slate-200 w-full">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Location</h2>
      <p className="text-sm text-slate-600 mb-6">
        The location of the characters.
      </p>
      <PieChartProvider>
        <div className="flex flex-col gap-8">
          <PieChart data={dataParsed} />
          <PieChartLegend
            data={dataParsed}
            orientation="vertical"
            columns={3}
          />
        </div>
      </PieChartProvider>
    </section>
  );
}
