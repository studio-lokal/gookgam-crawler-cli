import axiod from "https://deno.land/x/axiod/mod.ts";

import { AssemblyMember, WatchMember } from "./models.ts";
import Parser from "./parser.ts";

const CURRENT_ELECTION_UNIT = 21;
const ELECTION_UNIT_CODE = (electionNumber: number) => `1000${electionNumber}`;

export class Client {
  private electionUnitCode: string;

  constructor({ electionNumber }: { electionNumber: number }) {
    this.electionUnitCode = ELECTION_UNIT_CODE(
      electionNumber || CURRENT_ELECTION_UNIT
    );
  }

  async fetchBonAttendanceByMember({
    memberSeq,
    page,
  }: {
    memberSeq: number;
    page: number;
  }) {
    const html = await fetch(
      `https://watch.peoplepower21.org/opages/_member_bon.php?member_seq=${memberSeq}&page=${page}&rec_num=100`
    ).then((res) => res.text());
    const parsedData = Parser.bonAttendances(html);
  }

  async fetchSangimAttendanceByMember({
    memberSeq,
    page,
  }: {
    memberSeq: number;
    page: number;
  }) {
    const html = await fetch(
      `https://watch.peoplepower21.org/opages/_member_sangim.php?member_seq=${memberSeq}&page=${page}&rec_num=100`
    ).then((res) => res.text());
    const parsedData = Parser.sangimAttendances(html);
  }

  async fetchEuian({ billNo }: { billNo: string }) {
    console.log(billNo);
    const html = await fetch(
      `https://watch.peoplepower21.org/?mid=LawInfo&bill_no=${billNo}`
    ).then((res) => res.text());
    return Parser.euian(html);
  }

  async fetchEuiansByMember({
    page,
    memberSeq,
  }: {
    page: number;
    memberSeq: number;
  }) {
    const html = await fetch(
      `https://watch.peoplepower21.org/index.php?mid=Euian&page=${page}&member_seq=${memberSeq}&show=0&rec_num=50&from=m`
    ).then((res) => res.text());
    return Parser.euiansByMember(html);
  }

  async fetchMembers({
    page,
  }: {
    page: number;
  }): Promise<(AssemblyMember & WatchMember)[]> {
    console.log("국회의원 목록 가져오는 중...", "page:", page);

    const jsonResponse: {
      data: {
        data: AssemblyMember[];
      };
    } = await axiod({
      method: "POST",
      url: "https://open.assembly.go.kr/portal/assm/search/searchAssmMemberSch.do",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `page=${page}&unitCd=${this.electionUnitCode}`,
    });

    const result = jsonResponse.data;

    const watchPage = Math.floor(page / 3);
    const html = await fetch(
      `https://watch.peoplepower21.org/?mid=AssemblyMembers&mode=search&page=${Math.floor(
        watchPage
      )}`
    ).then((res) => res.text());
    const parsedData: WatchMember[] = Parser.members(html);

    return result.data.map((d, index) => {
      return {
        ...d,
        ...parsedData[index + 10 * ((page - 1) % 3)],
      };
    });
  }
}
