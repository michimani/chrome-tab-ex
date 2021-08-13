import * as tld from "./tld";

type Case = {
  name: string;
  domain: string;
  expect: tld.RemoveResult;
};

const cases: Case[] = [
  {
    name: "not removed (not localized domain)",
    domain: "example.com",
    expect: { removed: false, result: "example.com" },
  },
  {
    name: "not removed (not attribute type domain)",
    domain: "example.jp",
    expect: { removed: false, result: "example.jp" },
  },
  {
    name: "removed",
    domain: "example.co.jp",
    expect: { removed: true, result: "example" },
  },
];

cases.forEach((c) => {
  test(c.name, () => {
    const res = tld.removeAttributeTypeDomain(c.domain);
    expect(res.removed).toBe(c.expect.removed);
    expect(res.result).toBe(c.expect.result);
  });
});
