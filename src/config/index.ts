const API_BASE_URL = "https://apitest.vrmasterleague.com";
const BASE_URL = "https://vrmasterleague.com";
const TERMS_AND_CONDITIONS_URL = "https://vrmasterleague.com/TermsOfUse.aspx";
const SUBSTITUTE_URL = "https://api.vrmasterleague.com";

const FILTER_REGIONS = [
  {
    code: "",
    title: "Worldwide",
  },
  {
    code: "NA",
    title: "America East",
  },
  {
    code: "OCE",
    title: "Oceania/Asia",
  },
  {
    code: "EU",
    title: "Europe",
  },
  {
    code: "NW",
    title: "America West",
  },
];

interface IndexRegion {
  [key: string]: string;
}

const indexRegionByName: IndexRegion = FILTER_REGIONS.filter(
  item => !!item.code,
).reduce(
  (acc, cur) => ({
    ...acc,
    [cur.title]: cur.code,
  }),
  {},
);

export {
  API_BASE_URL,
  BASE_URL,
  TERMS_AND_CONDITIONS_URL,
  FILTER_REGIONS,
  SUBSTITUTE_URL,
  indexRegionByName,
};
