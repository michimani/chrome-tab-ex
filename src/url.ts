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

  const idx = domainName.indexOf("/");
  if (idx > 0) {
    domainName = domainName.substr(0, idx);
  }

  const lastDotIdx = domainName.lastIndexOf(".");
  if (lastDotIdx > 0) {
    domainName = domainName.substr(0, lastDotIdx);
  }

  domainName = domainName.replace(/^www\d?\./i, "");

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
  let domainName = "";
  const fullDomainName = getDomainName(url);

  const lastDotIdx = fullDomainName.lastIndexOf(".");
  if (lastDotIdx > 0) {
    domainName = domainName.substr(lastDotIdx);
  }

  return domainName;
}
