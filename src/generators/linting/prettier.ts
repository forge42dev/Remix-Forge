export const generatePrettierIgnore = () => {
  return ["node_modules", "/build"].join("\n");
};

export const generatePrettierRc = () => {
  return ["{", "  ", "}"].join("\n");
};
