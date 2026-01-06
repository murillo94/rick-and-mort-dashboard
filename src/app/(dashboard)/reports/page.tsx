import { Suspense } from "react";

import PieLocation from "./_components/pie-location";
import PieSpecies from "./_components/pie-species";
import { LoadingCard } from "../_components/loading";

export default function Reports() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Suspense
        fallback={
          <div className="bg-white rounded-lg p-6 border border-slate-200 w-full">
            <LoadingCard message="Loading species data..." />
          </div>
        }
      >
        <PieSpecies />
      </Suspense>
      <Suspense
        fallback={
          <div className="bg-white rounded-lg p-6 border border-slate-200 w-full">
            <LoadingCard message="Loading location data..." />
          </div>
        }
      >
        <PieLocation />
      </Suspense>
    </div>
  );
}
