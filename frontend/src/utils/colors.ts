export const COLORS = {
  PURPLE: "#6B32F3",
  BLUE: "#408FF8",
  RED: "#F32D27",
  GREEN: "#6FCB12",
  GOLD: "#A89D6C",
  PINK: "#EB29DA",
  MINT: "#19CB87",
  RED_LIGHT: "#ED7878",
  CYAN: "#02CBF6",
  RED_DARK: "#BA1555",
  ORANGE: "#FF7300",
};

const COLORS_ARRAY = [...Object.values(COLORS)];

export const getNextColor = (color?: string) => {
  const index = COLORS_ARRAY.findIndex((colorArr) => colorArr === color);

  if (index === -1) return COLORS_ARRAY[0];

  return COLORS_ARRAY[(index + 1) % COLORS_ARRAY.length];
};
