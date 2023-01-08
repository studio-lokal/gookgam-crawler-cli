import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { cac } from "https://unpkg.com/cac/mod.ts";
// import { AssemblyMember } from "./models.ts";
import database from "./database/client.ts";
import * as serialization from "./serialization.ts";

import * as crawl from "./commands/crawl.ts";

const pause = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

const cli = cac("gookgam");

export enum Target {
  MEMBERS = "members",
  EUIAN = "euian",
  EUIANS = "euians",
}

cli
  .command("members", "crawl members")
  .option("--page [page]", "page number")
  .option("--member-seq [memberSeq]", "member sequence number")
  // .option("--euian-id [euianId]", "euian id")
  .option("--save ", "save")
  .action(async (options) => {
    for (let i = 1; i <= 30; i++) {
      const items = await crawl.members({ page: i, electionNumber: 21 });

      if (options?.save) {
        const result = await database.post(
          "GookgamMember",
          items.map(serialization.member)
        );

        if (result.status >= 400) {
          console.error(result);
        }
      }
    }
  });

cli
  .command("bills", "crawl bills")
  .option("--all", "all pages")
  .option("--page [page]", "page number")
  .option("--bill-no [billNo]", "bill no")
  .option(
    "--member-seq [memberSeq]",
    "member sequence number from watch.peoplepower"
  )
  .option("--save ", "save")
  .action(async (options) => {
    const items = await crawl.euians({
      page: options?.page || 1,
      memberSeq: options.memberSeq as number,
      electionNumber: 21,
    });

    for (const item of items) {
      const _item = await crawl.euian({
        electionNumber: 21,
        billNo: item.billNo,
      });

      console.log(_item);

      pause();
    }
  });
cli.parse();
