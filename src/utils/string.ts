export function uppercaseFirstLetter(string: string): string {
  if (string.length > 0) {
    return string[0].toUpperCase() + string.substring(1);
  }
  return string;
}
