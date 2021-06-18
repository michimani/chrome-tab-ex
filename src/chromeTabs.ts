import {getDomainName, getDomainNameIgnoreSubDomain} from "./url"

/**
 * sortTabsByURL sorts tabs by URL
 * @param tabs
 * @returns
 */
export function sortTabsByURL(tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] {
  tabs.sort((a, b) => {
    const urlA = a.url === undefined ? '' : a.url.toLowerCase()
    const urlB = b.url === undefined ? '' : b.url.toLowerCase()
    if (urlA < urlB) {
      return -1
    }
    if (urlA > urlB) {
      return 1
    }
    return 0
  })
  return tabs
}

/**
 * sortTabsByDomainName sorts tabs by domain name.
 * @param tabs
 * @returns
 */
export function sortTabsByDomainName(tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] {
  tabs.sort((a, b) => {
    const grpupTitleA = a.url === undefined ? '' : getDomainName(a.url.toLowerCase())
    const grpupTitleB = b.url === undefined ? '' :  getDomainName(b.url.toLowerCase())
    if ( grpupTitleA < grpupTitleB) {
      return -1
    }
    if ( grpupTitleA > grpupTitleB) {
      return 1
    }
    return 0
  })
  return tabs
}

/**
 * sortTabsByDomainNameIgnoreSubDomain sorts tabs by domain name.
 * @param tabs
 * @returns
 */
 export function sortTabsByDomainNameIgnoreSubDomain(tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] {
  tabs.sort((a, b) => {
    const grpupTitleA = a.url === undefined ? '' : getDomainNameIgnoreSubDomain(a.url.toLowerCase())
    const grpupTitleB = b.url === undefined ? '' :  getDomainNameIgnoreSubDomain(b.url.toLowerCase())
    if ( grpupTitleA < grpupTitleB) {
      return -1
    }
    if ( grpupTitleA > grpupTitleB) {
      return 1
    }
    return 0
  })
  return tabs
}

/**
 * moveTabs moves tabs.
 * @param tabs
 */
export function moveTabs(tabs: chrome.tabs.Tab[]): void {
  let i = 0
  tabs.forEach(tab => {
    if (tab.id === undefined) {
      return
    }
    chrome.tabs.move(tab.id, {index: i})
    i++
  })
}

export function groupTabs(tabIDs: number[]): void {

}