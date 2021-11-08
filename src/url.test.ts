import * as url from "./url";

type Case = {
  name: string;
  url: string;
  expect: string;
};

function TestGetDomainName() {
  const cases: Case[] = [
    {
      name: "not url",
      url: "xxxxx",
      expect: "",
    },
    {
      name: "not http or https",
      url: "chrome://extensions/",
      expect: "",
    },
    {
      name: "http",
      url: "http://example.com/hoge",
      expect: "example",
    },
    {
      name: "https",
      url: "https://example.com/hoge",
      expect: "example",
    },
    {
      name: "www",
      url: "https://www.example.com/hoge",
      expect: "example",
    },
    {
      name: "sub domain",
      url: "https://test.example.com/hoge",
      expect: "test.example",
    },
    {
      name: "www with sub domain",
      url: "https://www.test.example.com/hoge",
      expect: "test.example",
    },
    {
      name: "attribute type domain",
      url: "https://example.lg.jp/hoge",
      expect: "example",
    },
    {
      name: "attribute type domain with www",
      url: "https://www.example.lg.jp/hoge",
      expect: "example",
    },
    {
      name: "attribute type domain with sub domain",
      url: "https://test.example.lg.jp/hoge",
      expect: "test.example",
    },
    {
      name: "attribute type domain with www and sub domain",
      url: "https://www.test.example.lg.jp/hoge",
      expect: "test.example",
    },
    {
      name: "second level domain",
      url: "https://example.co.jp/hoge",
      expect: "example",
    },
    {
      name: "second level domain with www",
      url: "https://www.example.co.jp/hoge",
      expect: "example",
    },
    {
      name: "second level domain with sub domain",
      url: "https://test.example.co.jp/hoge",
      expect: "test.example",
    },
    {
      name: "second level domain with www and sub domain",
      url: "https://www.test.example.co.jp/hoge",
      expect: "test.example",
    },
  ];

  cases.forEach((c) => {
    test(c.name, () => {
      const domain = url.getDomainName(c.url);
      expect(domain).toBe(c.expect);
    });
  });
}

TestGetDomainName();

function TestGetDomainNameIgnoreSubDomain() {
  const cases: Case[] = [
    {
      name: "not url",
      url: "xxxxx",
      expect: "",
    },
    {
      name: "not http or https",
      url: "chrome://extensions/",
      expect: "",
    },
    {
      name: "http",
      url: "http://example.com/hoge",
      expect: "example",
    },
    {
      name: "https",
      url: "https://example.com/hoge",
      expect: "example",
    },
    {
      name: "www",
      url: "https://www.example.com/hoge",
      expect: "example",
    },
    {
      name: "sub domain",
      url: "https://test.example.com/hoge",
      expect: "example",
    },
    {
      name: "www with sub domain",
      url: "https://www.test.example.com/hoge",
      expect: "example",
    },
    {
      name: "attribute type domain",
      url: "https://example.lg.jp/hoge",
      expect: "example",
    },
    {
      name: "attribute type domain with www",
      url: "https://www.example.lg.jp/hoge",
      expect: "example",
    },
    {
      name: "attribute type domain with sub domain",
      url: "https://test.example.lg.jp/hoge",
      expect: "example",
    },
    {
      name: "attribute type domain with www and sub domain",
      url: "https://www.test.example.lg.jp/hoge",
      expect: "example",
    },
    {
      name: "second level domain",
      url: "https://example.co.jp/hoge",
      expect: "example",
    },
    {
      name: "second level domain with www",
      url: "https://www.example.co.jp/hoge",
      expect: "example",
    },
    {
      name: "second level domain with sub domain",
      url: "https://test.example.co.jp/hoge",
      expect: "example",
    },
    {
      name: "second level domain with www and sub domain",
      url: "https://www.test.example.co.jp/hoge",
      expect: "example",
    },
  ];

  cases.forEach((c) => {
    test(c.name, () => {
      const domain = url.getDomainNameIgnoreSubDomain(c.url);
      expect(domain).toBe(c.expect);
    });
  });
}

TestGetDomainNameIgnoreSubDomain();
