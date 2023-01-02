import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

type TextWithAnchor = { href: string; text: string };
type BonMeetingResponse = {
  members: {
    attended: { seq: number | null }[];
    absenseApplied: { seq: number | null }[];
    absenseNotApplied: { seq: number | null }[];
  };
  euians: {
    euian: { id: number | null; text: string };
    proposer: string;
    result: string;
  }[];
};

type BonAttendancesResponse = {
  date: string;
  meeting: TextWithAnchor;
  state: string;
}[];

type SangimAttendancesResponse = {
  date: string;
  sangim: TextWithAnchor;
  meeting: TextWithAnchor;
  state: string;
}[];

type EuianResponse = {
  state: string;
  summary: string;
  assemblyLink: string;
  proposers: string[];
};

type EuiansResponse = {
  date: string;
  euian: TextWithAnchor;
  sangim: TextWithAnchor;
  state: string;
}[];

type MembersResponse = {
  seq: number | null;
  image: string;
}[];

class Parser {
  bonAttendances(html: string): BonAttendancesResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const wrappers = doc.querySelectorAll("tbody > tr");

    const bonAttendances: BonAttendancesResponse = [];

    wrappers.forEach((wrapper: any) => {
      const columns = wrapper.querySelectorAll("td");
      const date = columns[0].textContent.trim();
      const _meeting = columns[1].childNodes[0];
      const meeting: TextWithAnchor = {
        href: _meeting.getAttribute("href"),
        text: _meeting.textContent.trim(),
      };
      const state = columns[2].textContent.trim();

      bonAttendances.push({ date, meeting, state });
    });

    return bonAttendances;
  }

  bonMeeting(html: string): BonMeetingResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const _attended = doc.querySelectorAll(
      "tbody > tr:first-child > td:last-child > span.session_attend_name"
    );

    const attended: { seq: number | null }[] = [];
    _attended.forEach((m: any, index: number) => {
      if (index !== 0) {
        try {
          const href = m.querySelector("a").getAttribute("href");
          const regex = /member_seq=([0-9]+)/;
          const hrefResult = regex.exec(href.trim());
          const seq = hrefResult && +hrefResult[1];
          attended.push({ seq });
        } catch (e) {
          console.error(e);
          console.log(index);
        }
      }
    });

    const _absenseApplied = doc.querySelectorAll(
      "tbody > tr:nth-child(2) > td:last-child > span.session_attend_name"
    );

    const absenseApplied: { seq: number | null }[] = [];
    _absenseApplied.forEach((m: any, index: number) => {
      if (index !== 0) {
        try {
          const href = m.querySelector("a").getAttribute("href");
          const regex = /member_seq=([0-9]+)/;
          const hrefResult = regex.exec(href.trim());
          const seq = hrefResult && +hrefResult[1];
          absenseApplied.push({ seq });
        } catch (e) {
          console.error(e);
          console.log(index);
        }
      }
    });

    const _absenseNotApplied = doc.querySelectorAll(
      "tbody > tr:nth-child(3) > td:last-child > span.session_attend_name"
    );

    const absenseNotApplied: { seq: number | null }[] = [];
    _absenseNotApplied.forEach((m: any, index: number) => {
      if (index !== 0) {
        try {
          const href = m.querySelector("a").getAttribute("href");
          const regex = /member_seq=([0-9]+)/;
          const hrefResult = regex.exec(href.trim());
          const seq = hrefResult && +hrefResult[1];
          absenseNotApplied.push({ seq });
        } catch (e) {
          console.error(e);
          console.log(index);
        }
      }
    });

    const _euians = doc.querySelectorAll("div#collapseTwo tbody > tr");

    const euians: {
      euian: { id: number | null; text: string };
      proposer: string;
      result: string;
    }[] = [];

    _euians.forEach((_e: any) => {
      const _euian = _e.querySelector("td:first-child").querySelector("a");
      const href = _euian.getAttribute("href");
      const regex = /bill_no=([0-9]+)/;
      const hrefResult = regex.exec(href.trim());
      const euianId: number | null = hrefResult && +hrefResult[1];
      euians.push({
        euian: {
          text: _euian.textContent.trim(),
          id: euianId,
        },
        proposer: _e.querySelector("td:nth-child(2)").textContent.trim(),
        result: _e.querySelector("td:nth-child(3)").textContent.trim(),
      });
    });

    const bonMeeting: BonMeetingResponse = {
      members: {
        attended,
        absenseApplied,
        absenseNotApplied,
      },
      euians,
    };

    return bonMeeting;
  }

  sangimAttendances(html: string): SangimAttendancesResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const wrappers = doc.querySelectorAll("tbody > tr");

    const sangimAttendances: SangimAttendancesResponse = [];

    wrappers.forEach((wrapper: any) => {
      const columns = wrapper.querySelectorAll("td");
      const date = columns[0].textContent.trim();
      const _sangim = columns[1].childNodes[0];
      const sangim: TextWithAnchor = {
        href: _sangim.getAttribute("href"),
        text: _sangim.textContent.trim(),
      };
      const _meeting = columns[2].childNodes[0];
      const meeting: TextWithAnchor = {
        href: _meeting.getAttribute("href"),
        text: _meeting.textContent.trim(),
      };
      const state = columns[3].textContent.trim();

      sangimAttendances.push({ date, sangim, meeting, state });
    });

    return sangimAttendances;
  }

  euian(html: string): EuianResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const state = doc.querySelector(".stepType01 span.on").textContent.trim();

    let summary = "";

    doc.querySelector("div#summaryContentDiv").childNodes.forEach((n: any) => {
      if (n.nodeName === "BR") {
        summary += "\n";
      } else {
        summary += n.textContent.trim();
      }
    });

    const assemblyLink =
      doc
        .querySelector("#collapseOne div.panel-body a")
        ?.getAttribute("href") || "";

    const proposers: string[] = [];

    doc
      .querySelector("div#collapseTwo .panel-body > .row > .col-sm-8")
      .childNodes.forEach((n: any) => {
        const proposer = n.textContent.trim();
        if (n.nodeName !== "BR" && proposer) {
          proposers.push(proposer);
        }
      });

    return { state, summary, assemblyLink, proposers };
  }

  euiansByMember(html: string): EuiansResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const euianWrappers = doc.querySelectorAll("tbody > tr");

    const euians: EuiansResponse = [];

    euianWrappers.forEach((wrapper: any) => {
      const columns = wrapper.querySelectorAll("td");
      const date = columns[0].textContent.trim();
      const _euian = columns[1].childNodes[0];
      const euian: TextWithAnchor = {
        href: _euian.getAttribute("href"),
        text: _euian.textContent.trim(),
      };
      const _sangim = columns[3].childNodes[0];
      const sangim: TextWithAnchor = {
        href: _sangim.getAttribute("href"),
        text: _sangim.textContent.trim(),
      };
      const state = columns[4].textContent.trim();

      euians.push({ date, euian, sangim, state });
    });

    return euians;
  }

  members(html: string): MembersResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const membersWrapper = doc.querySelectorAll(
      "div.col-md-8 div.col-xs-6.col-sm-3 > div"
    );

    const result: { seq: number | null; image: string }[] = [];
    membersWrapper.forEach((wrapper: any) => {
      const href = wrapper.querySelector("a").getAttribute("href");
      const image = wrapper.querySelector("img").getAttribute("src");
      const regex = /member_seq=([0-9]+)/;
      const hrefResult = regex.exec(href.trim());
      result.push({
        seq: hrefResult && +hrefResult[1],
        image,
      });
    });

    return result;
  }
}

export default new Parser();
