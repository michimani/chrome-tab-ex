import * as tld from "./tld";

test("not removed (not localized domain)", () => {
  const res = tld.removeAttributeTypeDomain("example.com");
  expect(res.removed).toBe(false);
  expect(res.result).toBe("example.com");
});

test("not removed (not attribute type domain)", () => {
  const res = tld.removeAttributeTypeDomain("example.jp");
  expect(res.removed).toBe(false);
  expect(res.result).toBe("example.jp");
});

test("removed", () => {
  const res = tld.removeAttributeTypeDomain("example.co.jp");
  expect(res.removed).toBe(true);
  expect(res.result).toBe("example.co.jp");
});
