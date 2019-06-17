export interface ISumsubCreateApplicantAddress {
  country?: string; // Alpha-3 country code. https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  postCode?: string;
  town?: string;
  street?: string;
  subStreet?: string;
  state?: string;
  buildingName?: string;
  flatNumber?: string;
  buildingNumber?: string;
  startDate?: string; // NOTE: format YYYY-mm-dd
  endDate?: string; // NOTE: format YYYY-mm-dd
}