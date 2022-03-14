import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import Parser from "./parser.ts";

Deno.test("Parser.members", async () => {
  const html = await fetch(
    "https://watch.peoplepower21.org/?mid=AssemblyMembers&mode=search",
  ).then((res) => res.text());

  const result = Parser.members(html);
  assertEquals(typeof result[0].seq, "number");
});

Deno.test("Parser.euian", async () => {
  const html = await fetch(
    "https://watch.peoplepower21.org/?mid=LawInfo&bill_no=2114344",
  ).then((res) => res.text());

  const result = Parser.euian(html);
  console.log(result);
  assertEquals(typeof result.state, "string");
});

Deno.test("Parser.euiansByMember", async () => {
  const html = await fetch(
    "https://watch.peoplepower21.org/index.php?mid=Euian&member_seq=775&lname=%EA%B0%95%EA%B8%B0%EC%9C%A4&show=0&rec_num=50&from=m",
  ).then((res) => res.text());

  const result = Parser.euiansByMember(html);
  assertEquals(typeof result[0].date, "string");
});

Deno.test("Parser.bonAttendance", async () => {
  const html = await fetch(
    "https://watch.peoplepower21.org/opages/_member_bon.php?member_seq=775&page=1&rec_num=100&_=1647167949350",
  ).then((res) => res.text());

  const result = Parser.bonAttendances(html);
  assertEquals(typeof result[0].date, "string");
});

Deno.test("Parser.sangimAttendance", async () => {
  const html = await fetch(
    "https://watch.peoplepower21.org/opages/_member_sangim.php?member_seq=775&page=1&rec_num=100",
  ).then((res) => res.text());

  const result = Parser.sangimAttendances(html);
  assertEquals(typeof result[0].date, "string");
});
