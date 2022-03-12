import {
  DOMParser,
} from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

type FetchMembersResponse = {
  seq: number | null;
  image: string;
}[];

class Parser {
  fetchMembers(html: string): FetchMembersResponse {
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
