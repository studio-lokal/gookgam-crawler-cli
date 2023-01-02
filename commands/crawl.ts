import { Client } from "../client.ts";
import { Target } from "../index.ts";

const main = async (
  target: Target,
  options?: {
    page?: number;
  }
) => {
  switch (target) {
    case Target.MEMBERS:
      return crawlMembers({ electionNumber: 21, page: options?.page });
  }
};

const crawlMembers = async ({
  electionNumber,
  page,
}: {
  electionNumber: number;
  page;
}) => {
  const client = new Client({ electionNumber });
  return client.fetchMembers({ page });
};

export default main;
