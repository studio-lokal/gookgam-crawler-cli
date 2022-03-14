import {
  DOMParser,
} from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

type TextWithAnchor = { href: string; text: string };
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
    const wrappers = doc.querySelectorAll(
      "tbody > tr",
    );

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

  sangimAttendances(html: string): SangimAttendancesResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const wrappers = doc.querySelectorAll(
      "tbody > tr",
    );

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
    const state = doc.querySelector(
      ".stepType01 span.on",
    ).textContent.trim();

    let summary = "";

    doc.querySelector("div#summaryContentDiv").childNodes.forEach((n: any) => {
      if (n.nodeName === "BR") {
        summary += "\n";
      } else {
        summary += n.textContent.trim();
      }
    });

    const assemblyLink = doc.querySelector("#collapseOne div.panel-body a")
      ?.getAttribute(
        "href",
      ) || "";

    const proposers: string[] = [];

    doc.querySelector("div#collapseTwo .panel-body > .row > .col-sm-8")
      .childNodes
      .forEach((n: any) => {
        const proposer = n.textContent.trim();
        if (n.nodeName !== "BR" && proposer) {
          proposers.push(proposer);
        }
      });

    return { state, summary, assemblyLink, proposers };
  }

  euiansByMember(html: string): EuiansResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const euianWrappers = doc.querySelectorAll(
      "tbody > tr",
    );

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
      "div.col-md-8 div.col-xs-6.col-sm-3 > div",
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
