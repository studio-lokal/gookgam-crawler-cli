import {
  DOMParser,
} from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

type TextWithAnchor = { href: string; text: string };
type BonAttandencesResponse = {
  date: string;
  meeting: TextWithAnchor;
  state: string;
}[];

type SangimAttandencesResponse = {
  date: string;
  sangim: TextWithAnchor;
  meeting: TextWithAnchor;
  state: string;
}[];

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
  bonAttandences(html: string): BonAttandencesResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const wrappers = doc.querySelectorAll(
      "tbody > tr",
    );

    const bonAttandences: BonAttandencesResponse = [];

    wrappers.forEach((wrapper: any) => {
      const columns = wrapper.querySelectorAll("td");
      const date = columns[0].textContent.trim();
      const _meeting = columns[1].childNodes[0];
      const meeting: TextWithAnchor = {
        href: _meeting.getAttribute("href"),
        text: _meeting.textContent.trim(),
      };
      const state = columns[2].textContent.trim();

      bonAttandences.push({ date, meeting, state });
    });

    return bonAttandences;
  }

  sangimAttandences(html: string): SangimAttandencesResponse {
    const doc: any = new DOMParser().parseFromString(html, "text/html");
    const wrappers = doc.querySelectorAll(
      "tbody > tr",
    );

    const sangimAttandences: SangimAttandencesResponse = [];

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

      sangimAttandences.push({ date, sangim, meeting, state });
    });

    return sangimAttandences;
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
