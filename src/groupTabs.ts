import * as url from "./url";
import * as ct from "./chromeTabs";
import * as ctg from "./chromeTabGroups";

function groupTabs() {
  const sortTabs = <HTMLElement>document.getElementById("sortTabs");
  const groupTabs = <HTMLElement>document.getElementById("groupTabs");
  const groupTabsIgnoreSubDomain = <HTMLElement>(
    document.getElementById("groupTabsIgnoreSubDomain")
  );
  const ungroupTabs = <HTMLElement>document.getElementById("ungroupTabs");
  const removeDupTabs = <HTMLElement>document.getElementById("removeDupTabs");
  const targetTabConditions: chrome.tabs.QueryInfo = {
    currentWindow: true,
    pinned: false,
    url: ["http://*/*", "https://*/*"],
    groupId: chrome.tabGroups.TAB_GROUP_ID_NONE,
  };

  /**
   * action for "Sort Tabs (not to group)"
   */
  sortTabs.addEventListener("click", async () => {
    sortTabsByURL();
  });

  /**
   * action for "Group Tabs by Domain"
   */
  groupTabs.addEventListener("click", async () => {
    sortTabsByDomainName();
    const tabs = await ct.queryTabs(targetTabConditions);
    const [activeTab] = await ct.getActiveTab();
    const pinnedTabs = await ct.getPinnedTabs();

    const domainMap: { [key: string]: number[] } = {};
    const domains: string[] = Array();
    for (let i = 0; i < tabs.length; i++) {
      const domain = url.getDomainName(<string>tabs[i].url);
      if (domain === "") {
        continue;
      }

      if (domainMap[domain] === undefined) {
        domainMap[domain] = Array();
        domains.push(domain);
      }

      domainMap[domain].push(<number>tabs[i].id);
    }

    runGroupTabs(domains, domainMap, pinnedTabs, activeTab);
  });

  /**
   * action for "Group Tabs by Domain (ignore sub-domain)"
   */
  groupTabsIgnoreSubDomain.addEventListener("click", async () => {
    sortTabsByDomainNameIgnoreSubDomain();
    const tabs = await ct.queryTabs(targetTabConditions);
    const [activeTab] = await ct.getActiveTab();
    const pinnedTabs = await ct.getPinnedTabs();

    const domainMap: { [key: string]: number[] } = {};
    const domains: string[] = Array();
    for (let i = 0; i < tabs.length; i++) {
      const domain = url.getDomainNameIgnoreSubDomain(<string>tabs[i].url);
      if (domain === "") {
        continue;
      }

      if (domainMap[domain] === undefined) {
        domainMap[domain] = Array();
        domains.push(domain);
      }

      domainMap[domain].push(<number>tabs[i].id);
    }

    runGroupTabs(domains, domainMap, pinnedTabs, activeTab);
  });

  /**
   * action for "Ungroup"
   */
  ungroupTabs.addEventListener("click", async () => {
    const tabs = await ct.queryTabs({
      currentWindow: true,
      pinned: false,
      url: ["http://*/*", "https://*/*"],
    });

    const tabIDs: number[] = Array();
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].groupId === undefined) {
        continue;
      }
      tabIDs.push(<number>tabs[i].id);
    }
    ct.ungroupTabs(tabIDs);
  });

  /**
   * action for "Remove duplicated tabs
   */
  removeDupTabs.addEventListener("click", async () => {
    removeDuplicatedTabs();
  });

  const sortTabsByURL = async () => {
    const tabs = await ct.queryTabs(targetTabConditions);
    const sorted = ct.sortTabsByURL(tabs);
    ct.moveTabs(sorted);
  };

  const sortTabsByDomainName = async () => {
    const tabs = await ct.queryTabs(targetTabConditions);
    const sorted = ct.sortTabsByDomainName(tabs);
    ct.moveTabs(sorted);
  };

  const sortTabsByDomainNameIgnoreSubDomain = async () => {
    const tabs = await ct.queryTabs(targetTabConditions);
    const sorted = ct.sortTabsByDomainNameIgnoreSubDomain(tabs);
    ct.moveTabs(sorted);
  };

  const runGroupTabs = async (
    domains: string[],
    domainMap: { [key: string]: number[] },
    pinnedTabs: chrome.tabs.Tab[],
    activeTab: chrome.tabs.Tab
  ) => {
    domains.sort((a, b) => {
      return a < b ? 1 : -1;
    });

    for (let i = 0; i < domains.length; i++) {
      const d: string = domains[i];

      // not group for domain has one tab
      if (domainMap[d].length == 1) {
        continue;
      }

      const groupID: number = await ct.groupTabs(domainMap[d]);
      const collapsed: boolean = !domainMap[d].includes(<number>activeTab.id);
      const colorIdx = (domains.length - i - 1) % ctg.groupColors.length;
      ctg.updateTabGroup(groupID, {
        collapsed: collapsed,
        title: d,
        color: ctg.groupColors[colorIdx],
      });
      ctg.moveGroup(groupID, pinnedTabs.length);
    }
  };

  const removeDuplicatedTabs = async () => {
    const tabs = await ct.queryTabs({
      currentWindow: true,
      pinned: false,
      url: ["http://*/*", "https://*/*"],
    });
    const exists: { [key: string]: boolean } = {};
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i] === undefined) {
        continue;
      }
      const t = tabs[i];
      if (t.url === undefined) {
        continue;
      }
      if (exists[t.url] !== undefined) {
        if (t.id === undefined) {
          continue;
        }
        ct.removeTab(t.id);
        continue;
      }
      exists[t.url] = true;
    }
  };
}

groupTabs();
