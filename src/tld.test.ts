import * as tld from "./tld";

function TestRemoveAttributeTypeDomain() {
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
      domain: "example.lg.jp",
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
}

TestRemoveAttributeTypeDomain();

function TestRemoveSecondLevelDomain() {
  type Case = {
    name: string;
    domain: string;
    expect: tld.RemoveResult;
  };

  const cases: Case[] = [
    {
      name: "not removed (has no second level domain)",
      domain: "example.com",
      expect: { removed: false, result: "example.com" },
    },
    {
      name: "removed 1",
      domain: "example.co.jp",
      expect: { removed: true, result: "example" },
    },
    {
      name: "removed 2",
      domain: "example.com.uk",
      expect: { removed: true, result: "example" },
    },
    {
      name: "removed 3",
      domain: "example.co.ru",
      expect: { removed: true, result: "example" },
    },
  ];

  cases.forEach((c) => {
    test(c.name, () => {
      const res = tld.removeSecondLevelDomain(c.domain);
      expect(res.removed).toBe(c.expect.removed);
      expect(res.result).toBe(c.expect.result);
    });
  });
}

TestRemoveSecondLevelDomain();
