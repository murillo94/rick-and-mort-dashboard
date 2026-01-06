import PieLocation from "./_components/pie-location";
import PieSpecies from "./_components/pie-species";

export default function Reports() {
  return (
    <div className="flex flex-col gap-4 w-full sm:w-auto">
      <PieSpecies />
      <PieLocation />
    </div>
  );
}
