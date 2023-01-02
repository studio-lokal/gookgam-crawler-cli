import "https://deno.land/x/dotenv/load.ts";
import { cac } from "https://unpkg.com/cac/mod.ts";
import { Member } from "./models.ts";
import database from "./database/client.ts";
import * as serialization from "./serialization.ts";

import crawl from "./commands/crawl.ts";

const cli = cac("gookgam");

export enum Target {
  MEMBERS = "members",
}

cli
  .command("crawl <target>", "crawl <target> from ...")
  .option("--all", "all pages")
  .option("--page", "page number")
  .option("--save ", "save")
  .action(async (target, options) => {
    if (options.all) {
      for (let i = 1; i <= 30; i++) {
        const items = await crawl(target, { page: i });

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
    } else {
      const page = options?.page || 1;
      const items = await crawl(target, { page });
      console.log(items);
    }
  });

cli.parse();
