const sortTabs = document.getElementById('sortTabs');
const groupTabs = document.getElementById('groupTabs');
const ungroupTabs = document.getElementById('ungroupTabs');
const targetTabConditions = {
  currentWindow: true,
  pinned: false,
  url: ['http://*/*', 'https://*/*'],
  groupId: chrome.tabGroups.TAB_GROUP_ID_NONE
};
const groupColors = [
  "grey",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "red",
];

sortTabs.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query(targetTabConditions);
  const sorted = sort(tabs);
  moveTabs(sorted);
});

groupTabs.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query(targetTabConditions);
  const sorted = sort(tabs);
  const [activeTab] = await chrome.tabs.query({ currentWindow:true,  active: true });

  const domainMap = {};
  const domains = Array();
  for (let i = 0; i < sorted.length; i++) {
    const domain = getDomain(sorted[i].url);
    if (domain === '') {
      continue;
    }

    if (domainMap[domain] === undefined) {
      domainMap[domain] = Array();
      domains.push(domain);
    }

    domainMap[domain].push(sorted[i].id);
  }
  domains.sort();

  for (let i in domains) {
    const d = domains[i];
    const groupId = await chrome.tabs.group({tabIds: domainMap[d]});
    const collapsed = !domainMap[d].includes(activeTab.id)
    const colorIdx = i % groupColors.length;
    const tg = await chrome.tabGroups.update(groupId, {collapsed: collapsed,title: d, color: groupColors[colorIdx]})
  }
});

ungroupTabs.addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    pinned: false,
    url: ['http://*/*', 'https://*/*']
  });

  const tabIds = Array();
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].groupId === "") {
      continue;
    }
    tabIds.push(tabs[i].id);
  }
  chrome.tabs.ungroup(tabIds);
});

function sort(tabs) {
  return sortByDomain(sortByURL(tabs));
}

function sortByURL(tabs) {
  tabs.sort((a, b) => {
    const urlA = a.url.toLowerCase();
    const urlB = b.url.toLowerCase();
    if (urlA < urlB) {
      return -1;
    }
    if (urlA > urlB) {
      return 1;
    }
    return 0;
  });
  return tabs;
}

function sortByDomain(tabs) {
  tabs.sort((a, b) => {
    const  grpupTitleA = getDomain(a.url.toLowerCase());
    const grpupTitleB = getDomain(b.url.toLowerCase());
    if ( grpupTitleA < grpupTitleB) {
      return -1;
    }
    if ( grpupTitleA > grpupTitleB) {
      return 1;
    }
    return 0;
  });
  return tabs;
}

function moveTabs(tabs) {
  for (let i = 0; i < tabs.length; i++) {
    chrome.tabs.move(tabs[i].id, {index: i});
  }
}

/** Get domain from url.
  without
  - without TLD part
  - `www` , `www2` or ``www3` ...etc
*/
function getDomain(url) {
  let domain = '';
  if (url === '') {
    return domain;
  }

  const m = url.match(/https?:\/\/(.*)$/)
  if (m === null || m[1] === undefined || m[1] === '') {
    return domain;
  }
  domain = m[1];

  const idx = domain.indexOf('/');
  if (idx > 0) {
    domain = domain.substr(0, idx);
  }

  const lastDotIdx = domain.lastIndexOf('.')
  if (lastDotIdx > 0) {
    domain = domain.substr(0, lastDotIdx);
  }

  domain = domain.replace(/^www\d?\./i, '');

  return domain
}
