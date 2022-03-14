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

  async fetchBonAttendanceByMember(
    { memberSeq, page }: { memberSeq: number; page: number },
  ) {
    const html = await fetch(
      `https://watch.peoplepower21.org/opages/_member_bon.php?member_seq=${memberSeq}&page=${page}&rec_num=100`,
    ).then((res) => res.text());
    const parsedData = Parser.bonAttendances(html);
  }

  async fetchSangimAttendanceByMember(
    { memberSeq, page }: { memberSeq: number; page: number },
  ) {
    const html = await fetch(
      `https://watch.peoplepower21.org/opages/_member_sangim.php?member_seq=${memberSeq}&page=${page}&rec_num=100`,
    ).then((res) => res.text());
    const parsedData = Parser.sangimAttendances(html);
  }

  async fetchEuian({ euianId }: { euianId: string }) {
    const html = await fetch(
      `https://watch.peoplepower21.org/?mid=LawInfo&bill_no=${euianId}`,
    ).then((res) => res.text());
    const parsedData = Parser.euian(html);
  }

  async fetchEuiansByMember(
    { memberName, memberSeq }: { memberName: string; memberSeq: number },
  ) {
    const html = await fetch(
      `https://watch.peoplepower21.org/index.php?mid=Euian&member_seq=775&lname=${
        encodeURIComponent(memberName)
      }&show=0&rec_num=50&from=m`,
    ).then((res) => res.text());
    const parsedData = Parser.euiansByMember(html);
  }

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
    const parsedData = Parser.members(html);

    return jsonResponse.data.map((d, index) => ({
      ...d,
      ...parsedData[index],
    }));
  }
}
