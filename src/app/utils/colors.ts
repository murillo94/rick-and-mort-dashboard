export const colors = [
  "#d9ed92",
  "#b5e48c",
  "#99d98c",
  "#76c893",
  "#52b69a",
  "#34a0a4",
  "#168aad",
  "#1a759f",
  "#1e6091",
  "#184e77",
  "#edc4b3",
  "#e6b8a2",
  "#deab90",
  "#d69f7e",
  "#cd9777",
  "#c38e70",
  "#b07d62",
  "#9d6b53",
  "#8a5a44",
  "#774936",
  "#0466c8",
  "#0353a4",
  "#023e7d",
  "#002855",
  "#001845",
  "#001233",
  "#33415c",
  "#5c677d",
  "#7d8597",
  "#979dac",
  "#ff6d00",
  "#ff7900",
  "#ff8500",
  "#ff9100",
  "#ff9e00",
  "#240046",
  "#3c096c",
  "#5a189a",
  "#7b2cbf",
  "#9d4edd",
  "#797d62",
  "#9b9b7a",
  "#baa587",
  "#d9ae94",
  "#f1dca7",
  "#ffcb69",
  "#e8ac65",
  "#d08c60",
  "#b58463",
  "#997b66",
  "#54478c",
  "#2c699a",
  "#048ba8",
  "#0db39e",
  "#16db93",
  "#83e377",
  "#b9e769",
  "#efea5a",
  "#f1c453",
  "#f29e4c",
  "#053c5e",
  "#1d3958",
  "#353652",
  "#4c334d",
  "#643047",
  "#7c2e41",
  "#942b3b",
  "#ab2836",
  "#c32530",
  "#db222a",
  "#eb5e28",
  "#f27f34",
  "#f9a03f",
  "#f6b049",
  "#f3c053",
  "#a1c349",
  "#94b33d",
  "#87a330",
  "#799431",
  "#6a8532",
];

/**
 * Shuffles an array using Fisher-Yates algorithm
 * Returns a new shuffled array without modifying the original
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const randomColors = () => {
  return shuffleArray(colors);
};
