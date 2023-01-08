import { Client } from "../client.ts";

export const euian = ({
  electionNumber,
  billNo,
}: {
  electionNumber: number;
  billNo: string;
}) => {
  const client = new Client({ electionNumber });
  return client.fetchEuian({ billNo });
};

export const euians = ({
  electionNumber,
  page,
  memberSeq,
}: {
  electionNumber: number;
  page: number;
  memberSeq: number;
}) => {
  const client = new Client({ electionNumber });
  return client.fetchEuiansByMember({ page, memberSeq });
};

export const members = ({
  electionNumber,
  page,
}: {
  electionNumber: number;
  page: number;
}) => {
  const client = new Client({ electionNumber });
  return client.fetchMembers({ page });
};
