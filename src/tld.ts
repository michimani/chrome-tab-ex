const ATTRIBUTE_TYPE_DOMAIN_JP: string[] = [
  ".co",
  ".or",
  ".ne",
  ".ac",
  ".ad",
  ".ed",
  ".go",
  ".gr",
  ".lg",
  ".hokkaido",
  ".aomori",
  ".iwate",
  ".miyagi",
  ".akita",
  ".yamagata",
  ".fukushima",
  ".ibaraki",
  ".tochigi",
  ".gunma",
  ".saitama",
  ".chiba",
  ".tokyo",
  ".kanagawa",
  ".niigata",
  ".yamanashi",
  ".nagano",
  ".toyama",
  ".ishikawa",
  ".fukui",
  ".gifu",
  ".shizuoka",
  ".aichi",
  ".mie",
  ".shiga",
  ".kyoto",
  ".osaka",
  ".hyogo",
  ".nara",
  ".wakayama",
  ".tottori",
  ".shimane",
  ".okayama",
  ".hiroshima",
  ".yamaguchi",
  ".tokushima",
  ".kagawa",
  ".ehime",
  ".kochi",
  ".fukuoka",
  ".saga",
  ".nagasaki",
  ".kumamoto",
  ".oita",
  ".miyazaki",
  ".kagoshima",
  ".okinawa",
];

const LOCALIZED_DOMAIN: { [key: string]: string[] } = {
  ".jp": ATTRIBUTE_TYPE_DOMAIN_JP,
};

export type RemoveResult = {
  removed: boolean;
  result: string;
};

export function removeAttributeTypeDomain(domain: string): RemoveResult {
  const tld = domain.substr(domain.lastIndexOf("."));
  const attributeDomainList = LOCALIZED_DOMAIN[tld];
  if (attributeDomainList === undefined) {
    return { removed: false, result: domain };
  }

  for (let i = 0; i < attributeDomainList.length; i++) {
    const localiedAttributeTypeDomain = `${attributeDomainList[i]}${tld}`;
    if (domain.lastIndexOf(localiedAttributeTypeDomain) > 0) {
      domain.replace(localiedAttributeTypeDomain, "");
      return { removed: true, result: domain };
    }
  }

  return { removed: false, result: domain };
}
