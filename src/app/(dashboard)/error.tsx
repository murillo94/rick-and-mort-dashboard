"use client";

import { ErrorCard } from "./_components/error";

export default function Error() {
  return (
    <ErrorCard
      title="Failed to load data..."
      message="We couldn't load the requested data. Please try again later."
    />
  );
}
