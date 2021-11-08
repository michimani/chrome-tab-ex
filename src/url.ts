import * as tld from "./tld";

/**
 * getDomain returns domain name part of the url.
 * - ignore `www`
 * @param url
 * @returns
 */
export function getDomainName(url: string): string {
  let domainName = "";
  if (url === "") {
    return domainName;
  }

  const m = url.match(/https?:\/\/(.*)$/);
  if (m === null || m[1] === undefined || m[1] === "") {
    return domainName;
  }
  domainName = m[1];

  domainName = domainName.replace(/^www\d?\./i, "");

  const idx = domainName.indexOf("/");
  if (idx > 0) {
    domainName = domainName.substr(0, idx);
  }

  let removeRes = tld.removeSecondLevelDomain(domainName);
  if (removeRes.removed) {
    return removeRes.result;
  }

  removeRes = tld.removeAttributeTypeDomain(domainName);
  if (removeRes.removed) {
    return removeRes.result;
  }

  const lastDotIdx = domainName.lastIndexOf(".");
  if (lastDotIdx > 0) {
    domainName = domainName.substr(0, lastDotIdx);
  }

  return domainName;
}

/**
 * getDomainNameIgnoreSubDomain returns domain name part ignored sub-domain of the url.
 * - ignore `www`
 * - ignore sub-domain part
 * @param url
 * @returns
 */
export function getDomainNameIgnoreSubDomain(url: string): string {
  const fullDomainName = getDomainName(url);

  const lastDotIdx = fullDomainName.lastIndexOf(".");
  if (lastDotIdx < 0) {
    return fullDomainName;
  }
  return fullDomainName.substr(lastDotIdx + 1);
}
