export const groupColors: chrome.tabGroups.ColorEnum[] = [
  "grey",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "red",
];

export function updateTabGroup(
  groupID: number,
  options: chrome.tabGroups.UpdateProperties
): Promise<chrome.tabGroups.TabGroup> {
  return chrome.tabGroups.update(groupID, options);
}

export function moveGroup(
  groupID: number,
  index: number
): Promise<chrome.tabGroups.TabGroup> {
  return chrome.tabGroups.move(groupID, { index: index });
}
