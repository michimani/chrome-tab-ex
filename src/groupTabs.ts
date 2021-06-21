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
  const targetTabConditions: chrome.tabs.QueryInfo = {
    currentWindow: true,
    pinned: false,
    url: ["http://*/*", "https://*/*"],
    groupId: chrome.tabGroups.TAB_GROUP_ID_NONE,
  };

  sortTabs.addEventListener("click", async () => {
    sortTabsByURL();
  });

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
    domains.sort((a,b) => {
      return (a < b ? 1 : -1)
    });

    for (let i = 0; i < domains.length; i++) {
      const d: string = domains[i];
      const groupID: number = await ct.groupTabs(domainMap[d]);
      const collapsed: boolean = !domainMap[d].includes(<number>activeTab.id);
      const colorIdx = (domains.length - i - 1) % ctg.groupColors.length;
      console.log(`domain: ${d}, color: ${colorIdx}`)
      ctg.updateTabGroup(groupID, {
        collapsed: collapsed,
        title: d,
        color: ctg.groupColors[colorIdx],
      });
      ctg.moveGroup(groupID, pinnedTabs.length)
    }
  });

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
    domains.sort((a,b) => {
      return (a < b ? 1 : -1)
    });

    for (let i = 0; i < domains.length; i++) {
      const d: string = domains[i];
      const groupID: number = await ct.groupTabs(domainMap[d]);
      const collapsed: boolean = !domainMap[d].includes(<number>activeTab.id);
      const colorIdx = (domains.length - i - 1) % ctg.groupColors.length;
      console.log(`domain: ${d}, color: ${colorIdx}`)
      ctg.updateTabGroup(groupID, {
        collapsed: collapsed,
        title: d,
        color: ctg.groupColors[colorIdx],
      });
      ctg.moveGroup(groupID, pinnedTabs.length)
    }
  });

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
}

groupTabs();
