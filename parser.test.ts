import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import Parser from "./parser.ts";

Deno.test("Parser.fetchMembers", async () => {
  const html = await fetch(
    "https://watch.peoplepower21.org/?mid=AssemblyMembers&mode=search",
  ).then((res) => res.text());

  const result = Parser.fetchMembers(html);
  assertEquals(typeof result[0].seq, "number");
});
