import { Characters } from "@/data-access/schemas";
import { getAllCharacters } from "@/data-access/services";
import { PieChart, PieChartProvider, PieChartLegend } from "@/ui/pie";
import { randomColors } from "@/utils/colors";

const colors = randomColors();
const colorsLength = colors.length;

const parseSpeciesCount = (characters: Characters) => {
  return characters.reduce((acc: Record<string, number>, character) => {
    const species = character.species || "Unknown";
    acc[species] = (acc[species] || 0) + 1;
    return acc;
  }, {});
};

const parseData = (speciesCount: Record<string, number>) => {
  return Object.entries(speciesCount)
    .filter(([, count]) => count > 0)
    .map(([species, count], index) => ({
      title: species,
      value: count,
      color: colors[index % colorsLength],
    }))
    .sort((a, b) => b.value - a.value);
};

export default async function PieSpecies() {
  const characters = await getAllCharacters();

  const speciesCount = parseSpeciesCount(characters);
  const dataParsed = parseData(speciesCount);

  return (
    <section className="bg-white rounded-lg p-6 border border-slate-200 w-full">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Species</h2>
      <p className="text-sm text-slate-600 mb-6">
        The species of the characters.
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
