import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { Client } from "./client.ts";

Deno.test("Client.fetchMembers", async () => {
  const client = new Client({ electionNumber: 21 });
  const result = await client.fetchMembers({ page: 1 });
  assertEquals(result[0].ROW_NUM, 1);
});
