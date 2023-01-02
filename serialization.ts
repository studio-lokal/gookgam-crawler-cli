import { Member } from "./models.ts";
import { Member as DbMember } from "./database/models.ts";

export const member = (member: Member): DbMember => {
  return {
    name: member.hgNm,
    name_hanja: member.hjNm,
    name_english: member.engNm,
    current_unit_code: member.unitCd,
    units: member.units,
    staffs: member.staff,
    secretaries: member.secretary,
    secretaries_2: member.secretary2,
    homepage: member.homepage,
    watch_seq: member.seq,
    image: member.image,
    birth: member.bthDate,
    tel: member.telNo,
    email: member.eMail,
    sex: member.sexGbnNm,
    watch_mona_code: member.monaCd,
    watch_emp_number: member.empNo,
    committee_name: member.cmitNm,
    committees: member.cmits,
    party_code: member.polyCd,
    party_name: member.polyNm,
    watch_orig_name: member.origNm,
    watch_election_gbn_name: member.eleGbnNm,
    watch_open_na_id: member.openNaId,
    watch_reele_gbn_name: member.reeleGbnNm,
  };
};
