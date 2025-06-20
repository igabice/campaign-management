// country emoji using char code https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
export const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const countriesOptions = [
  { value: "EE", label: `${getFlagEmoji("EE")} Estonia` },
  { value: "US", label: `${getFlagEmoji("US")} United States` },
  { value: "CA", label: `${getFlagEmoji("CA")} Canada` },
  { value: "GB", label: `${getFlagEmoji("GB")} United Kingdom` },
  { value: "AU", label: `${getFlagEmoji("AU")} Australia` },
  { value: "DE", label: `${getFlagEmoji("DE")} Germany` },
  { value: "FR", label: `${getFlagEmoji("FR")} France` },
  { value: "JP", label: `${getFlagEmoji("JP")} Japan` },
  { value: "IN", label: `${getFlagEmoji("IN")} India` },
  { value: "BR", label: `${getFlagEmoji("BR")} Brazil` },
  { value: "CN", label: `${getFlagEmoji("CN")} China` },
];