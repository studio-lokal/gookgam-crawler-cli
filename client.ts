import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import Parser from "./parser.ts";

config();

export type CLIENT_SEARCH_MEMBER_DATA = {
  ROW_NUM: number;
  empNo: string;
  monaCd: string;
  hgNm: string;
  hjNm: string;
  engNm: string;
  age: number;
  sexGbnNm: string;
  deptImgUrl: string;
  polyCd: string;
  polyNm: string;
  origNm: string;
  eleGbnNm: string;
  reeleGbnNm: string;
  unitCd: string;
  units: string;
  cmitNm: string;
  cmits: string;
  telNo: string;
  eMail: string;
  homepage: string;
  staff: string;
  secretary: string;
  secretary2: string;
  bthDate: string;
  unitNm: string;
  openNaId: string;
};

const ELECTION_UNIT_CODE = (electionNumber: number) => `1000${electionNumber}`;
const HOST_SEARCH_MEMBERS =
  "https://open.assembly.go.kr/portal/assm/search/searchAssmMemberSch.do";

export class Client {
  private electionUnitCode: string;

  constructor({ electionNumber }: { electionNumber: number }) {
    this.electionUnitCode = ELECTION_UNIT_CODE(electionNumber);
  }

  fetchMember({ memberSeq }: { memberSeq: number }) {}

  async fetchMembers({ page }: { page: number }): Promise<
    ({ seq: number | null; image: string } & CLIENT_SEARCH_MEMBER_DATA)[]
  > {
    const jsonResponse: {
      data: CLIENT_SEARCH_MEMBER_DATA[];
    } = await fetch(
      HOST_SEARCH_MEMBERS,
      {
        method: "POST",
        body: JSON.stringify({
          unitCd: this.electionUnitCode,
          rows: 10,
          page,
        }),
      },
    ).then((res) => res.json());

    const html = await fetch(
      `https://watch.peoplepower21.org/?mid=AssemblyMembers&mode=search&page=${page}`,
    ).then((res) => res.text());
    const parsedData = Parser.fetchMembers(html);

    return jsonResponse.data.map((d, index) => ({
      ...d,
      ...parsedData[index],
    }));
  }
}
