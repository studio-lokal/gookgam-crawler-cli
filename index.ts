import { cac } from "https://unpkg.com/cac/mod.ts";

const cli = cac("gookgam");

cli.option("--type <type>", "Choose a project type", {
  default: "node",
});

const parsed = cli.parse();
