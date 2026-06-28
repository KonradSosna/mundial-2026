export type MatchStatus = "upcoming" | "live" | "finished";
export type Group = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
export type Stage = "group" | "round32" | "round16" | "quarter" | "semi" | "third" | "final";

export interface Match {
  id: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  date: string; // ISO
  group?: Group;
  stage: Stage;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
}

// Static match data — status/scores are computed at runtime from time + Firestore results
export type StaticMatch = Omit<Match, "status" | "homeScore" | "awayScore">;

export const MATCHES: StaticMatch[] = [
  // Group A: Mexico, South Africa, South Korea, Czechia
  { id: "A1", home: "Mexico", away: "South Africa", homeFlag: "🇲🇽", awayFlag: "🇿🇦", date: "2026-06-11T22:00:00", group: "A", stage: "group" },
  { id: "A2", home: "South Korea", away: "Czechia", homeFlag: "🇰🇷", awayFlag: "🇨🇿", date: "2026-06-12T15:00:00", group: "A", stage: "group" },
  { id: "A3", home: "Czechia", away: "South Africa", homeFlag: "🇨🇿", awayFlag: "🇿🇦", date: "2026-06-18T18:00:00", group: "A", stage: "group" },
  { id: "A4", home: "Mexico", away: "South Korea", homeFlag: "🇲🇽", awayFlag: "🇰🇷", date: "2026-06-19T03:00:00", group: "A", stage: "group" },
  { id: "A5", home: "South Africa", away: "South Korea", homeFlag: "🇿🇦", awayFlag: "🇰🇷", date: "2026-06-25T03:00:00", group: "A", stage: "group" },
  { id: "A6", home: "Czechia", away: "Mexico", homeFlag: "🇨🇿", awayFlag: "🇲🇽", date: "2026-06-25T03:00:00", group: "A", stage: "group" },

  // Group B: Canada, Bosnia and Herzegovina, Qatar, Switzerland
  { id: "B1", home: "Canada", away: "Bosnia and Herzegovina", homeFlag: "🇨🇦", awayFlag: "🇧🇦", date: "2026-06-12T21:00:00", group: "B", stage: "group" },
  { id: "B2", home: "Qatar", away: "Switzerland", homeFlag: "🇶🇦", awayFlag: "🇨🇭", date: "2026-06-13T21:00:00", group: "B", stage: "group" },
  { id: "B3", home: "Switzerland", away: "Bosnia and Herzegovina", homeFlag: "🇨🇭", awayFlag: "🇧🇦", date: "2026-06-18T21:00:00", group: "B", stage: "group" },
  { id: "B4", home: "Canada", away: "Qatar", homeFlag: "🇨🇦", awayFlag: "🇶🇦", date: "2026-06-19T00:00:00", group: "B", stage: "group" },
  { id: "B5", home: "Switzerland", away: "Canada", homeFlag: "🇨🇭", awayFlag: "🇨🇦", date: "2026-06-24T21:00:00", group: "B", stage: "group" },
  { id: "B6", home: "Bosnia and Herzegovina", away: "Qatar", homeFlag: "🇧🇦", awayFlag: "🇶🇦", date: "2026-06-24T21:00:00", group: "B", stage: "group" },

  // Group C: Brazil, Morocco, Haiti, Scotland
  { id: "C1", home: "Brazil", away: "Morocco", homeFlag: "🇧🇷", awayFlag: "🇲🇦", date: "2026-06-14T00:00:00", group: "C", stage: "group" },
  { id: "C2", home: "Haiti", away: "Scotland", homeFlag: "🇭🇹", awayFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", date: "2026-06-14T03:00:00", group: "C", stage: "group" },
  { id: "C3", home: "Scotland", away: "Morocco", homeFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", awayFlag: "🇲🇦", date: "2026-06-20T00:00:00", group: "C", stage: "group" },
  { id: "C4", home: "Brazil", away: "Haiti", homeFlag: "🇧🇷", awayFlag: "🇭🇹", date: "2026-06-20T02:30:00", group: "C", stage: "group" },
  { id: "C5", home: "Morocco", away: "Haiti", homeFlag: "🇲🇦", awayFlag: "🇭🇹", date: "2026-06-25T00:00:00", group: "C", stage: "group" },
  { id: "C6", home: "Scotland", away: "Brazil", homeFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", awayFlag: "🇧🇷", date: "2026-06-25T00:00:00", group: "C", stage: "group" },

  // Group D: USA, Paraguay, Australia, Türkiye
  { id: "D1", home: "USA", away: "Paraguay", homeFlag: "🇺🇸", awayFlag: "🇵🇾", date: "2026-06-13T03:00:00", group: "D", stage: "group" },
  { id: "D2", home: "Australia", away: "Türkiye", homeFlag: "🇦🇺", awayFlag: "🇹🇷", date: "2026-06-14T06:00:00", group: "D", stage: "group" },
  { id: "D3", home: "USA", away: "Australia", homeFlag: "🇺🇸", awayFlag: "🇦🇺", date: "2026-06-19T21:00:00", group: "D", stage: "group" },
  { id: "D4", home: "Türkiye", away: "Paraguay", homeFlag: "🇹🇷", awayFlag: "🇵🇾", date: "2026-06-20T05:00:00", group: "D", stage: "group" },
  { id: "D5", home: "Türkiye", away: "USA", homeFlag: "🇹🇷", awayFlag: "🇺🇸", date: "2026-06-26T04:00:00", group: "D", stage: "group" },
  { id: "D6", home: "Paraguay", away: "Australia", homeFlag: "🇵🇾", awayFlag: "🇦🇺", date: "2026-06-26T04:00:00", group: "D", stage: "group" },

  // Group E: Germany, Curaçao, Ivory Coast, Ecuador
  { id: "E1", home: "Germany", away: "Curaçao", homeFlag: "🇩🇪", awayFlag: "🇨🇼", date: "2026-06-14T19:00:00", group: "E", stage: "group" },
  { id: "E2", home: "Ivory Coast", away: "Ecuador", homeFlag: "🇨🇮", awayFlag: "🇪🇨", date: "2026-06-15T01:00:00", group: "E", stage: "group" },
  { id: "E3", home: "Germany", away: "Ivory Coast", homeFlag: "🇩🇪", awayFlag: "🇨🇮", date: "2026-06-20T22:00:00", group: "E", stage: "group" },
  { id: "E4", home: "Ecuador", away: "Curaçao", homeFlag: "🇪🇨", awayFlag: "🇨🇼", date: "2026-06-21T02:00:00", group: "E", stage: "group" },
  { id: "E5", home: "Curaçao", away: "Ivory Coast", homeFlag: "🇨🇼", awayFlag: "🇨🇮", date: "2026-06-25T22:00:00", group: "E", stage: "group" },
  { id: "E6", home: "Ecuador", away: "Germany", homeFlag: "🇪🇨", awayFlag: "🇩🇪", date: "2026-06-25T22:00:00", group: "E", stage: "group" },

  // Group F: Netherlands, Japan, Sweden, Tunisia
  { id: "F1", home: "Netherlands", away: "Japan", homeFlag: "🇳🇱", awayFlag: "🇯🇵", date: "2026-06-14T22:00:00", group: "F", stage: "group" },
  { id: "F2", home: "Sweden", away: "Tunisia", homeFlag: "🇸🇪", awayFlag: "🇹🇳", date: "2026-06-15T04:00:00", group: "F", stage: "group" },
  { id: "F3", home: "Netherlands", away: "Sweden", homeFlag: "🇳🇱", awayFlag: "🇸🇪", date: "2026-06-20T19:00:00", group: "F", stage: "group" },
  { id: "F4", home: "Tunisia", away: "Japan", homeFlag: "🇹🇳", awayFlag: "🇯🇵", date: "2026-06-21T06:00:00", group: "F", stage: "group" },
  { id: "F5", home: "Tunisia", away: "Netherlands", homeFlag: "🇹🇳", awayFlag: "🇳🇱", date: "2026-06-26T01:00:00", group: "F", stage: "group" },
  { id: "F6", home: "Japan", away: "Sweden", homeFlag: "🇯🇵", awayFlag: "🇸🇪", date: "2026-06-26T01:00:00", group: "F", stage: "group" },

  // Group G: Belgium, Egypt, Iran, New Zealand
  { id: "G1", home: "Belgium", away: "Egypt", homeFlag: "🇧🇪", awayFlag: "🇪🇬", date: "2026-06-15T21:00:00", group: "G", stage: "group" },
  { id: "G2", home: "Iran", away: "New Zealand", homeFlag: "🇮🇷", awayFlag: "🇳🇿", date: "2026-06-16T03:00:00", group: "G", stage: "group" },
  { id: "G3", home: "Belgium", away: "Iran", homeFlag: "🇧🇪", awayFlag: "🇮🇷", date: "2026-06-21T21:00:00", group: "G", stage: "group" },
  { id: "G4", home: "New Zealand", away: "Egypt", homeFlag: "🇳🇿", awayFlag: "🇪🇬", date: "2026-06-22T03:00:00", group: "G", stage: "group" },
  { id: "G5", home: "New Zealand", away: "Belgium", homeFlag: "🇳🇿", awayFlag: "🇧🇪", date: "2026-06-27T05:00:00", group: "G", stage: "group" },
  { id: "G6", home: "Egypt", away: "Iran", homeFlag: "🇪🇬", awayFlag: "🇮🇷", date: "2026-06-27T05:00:00", group: "G", stage: "group" },

  // Group H: Spain, Cabo Verde, Saudi Arabia, Uruguay
  { id: "H1", home: "Spain", away: "Cabo Verde", homeFlag: "🇪🇸", awayFlag: "🇨🇻", date: "2026-06-15T18:00:00", group: "H", stage: "group" },
  { id: "H2", home: "Saudi Arabia", away: "Uruguay", homeFlag: "🇸🇦", awayFlag: "🇺🇾", date: "2026-06-16T00:00:00", group: "H", stage: "group" },
  { id: "H3", home: "Spain", away: "Saudi Arabia", homeFlag: "🇪🇸", awayFlag: "🇸🇦", date: "2026-06-21T18:00:00", group: "H", stage: "group" },
  { id: "H4", home: "Uruguay", away: "Cabo Verde", homeFlag: "🇺🇾", awayFlag: "🇨🇻", date: "2026-06-22T00:00:00", group: "H", stage: "group" },
  { id: "H5", home: "Cabo Verde", away: "Saudi Arabia", homeFlag: "🇨🇻", awayFlag: "🇸🇦", date: "2026-06-27T02:00:00", group: "H", stage: "group" },
  { id: "H6", home: "Uruguay", away: "Spain", homeFlag: "🇺🇾", awayFlag: "🇪🇸", date: "2026-06-27T02:00:00", group: "H", stage: "group" },

  // Group I: France, Senegal, Iraq, Norway
  { id: "I1", home: "France", away: "Senegal", homeFlag: "🇫🇷", awayFlag: "🇸🇳", date: "2026-06-16T21:00:00", group: "I", stage: "group" },
  { id: "I2", home: "Iraq", away: "Norway", homeFlag: "🇮🇶", awayFlag: "🇳🇴", date: "2026-06-17T00:00:00", group: "I", stage: "group" },
  { id: "I3", home: "France", away: "Iraq", homeFlag: "🇫🇷", awayFlag: "🇮🇶", date: "2026-06-22T23:00:00", group: "I", stage: "group" },
  { id: "I4", home: "Norway", away: "Senegal", homeFlag: "🇳🇴", awayFlag: "🇸🇳", date: "2026-06-23T02:00:00", group: "I", stage: "group" },
  { id: "I5", home: "Norway", away: "France", homeFlag: "🇳🇴", awayFlag: "🇫🇷", date: "2026-06-26T21:00:00", group: "I", stage: "group" },
  { id: "I6", home: "Senegal", away: "Iraq", homeFlag: "🇸🇳", awayFlag: "🇮🇶", date: "2026-06-26T21:00:00", group: "I", stage: "group" },

  // Group J: Argentina, Algeria, Austria, Jordan
  { id: "J1", home: "Argentina", away: "Algeria", homeFlag: "🇦🇷", awayFlag: "🇩🇿", date: "2026-06-17T03:00:00", group: "J", stage: "group" },
  { id: "J2", home: "Austria", away: "Jordan", homeFlag: "🇦🇹", awayFlag: "🇯🇴", date: "2026-06-17T06:00:00", group: "J", stage: "group" },
  { id: "J3", home: "Argentina", away: "Austria", homeFlag: "🇦🇷", awayFlag: "🇦🇹", date: "2026-06-22T19:00:00", group: "J", stage: "group" },
  { id: "J4", home: "Jordan", away: "Algeria", homeFlag: "🇯🇴", awayFlag: "🇩🇿", date: "2026-06-23T05:00:00", group: "J", stage: "group" },
  { id: "J5", home: "Algeria", away: "Austria", homeFlag: "🇩🇿", awayFlag: "🇦🇹", date: "2026-06-28T04:00:00", group: "J", stage: "group" },
  { id: "J6", home: "Jordan", away: "Argentina", homeFlag: "🇯🇴", awayFlag: "🇦🇷", date: "2026-06-28T04:00:00", group: "J", stage: "group" },

  // Group K: Portugal, DR Congo, Uzbekistan, Colombia
  { id: "K1", home: "Portugal", away: "DR Congo", homeFlag: "🇵🇹", awayFlag: "🇨🇩", date: "2026-06-17T19:00:00", group: "K", stage: "group" },
  { id: "K2", home: "Uzbekistan", away: "Colombia", homeFlag: "🇺🇿", awayFlag: "🇨🇴", date: "2026-06-18T04:00:00", group: "K", stage: "group" },
  { id: "K3", home: "Portugal", away: "Uzbekistan", homeFlag: "🇵🇹", awayFlag: "🇺🇿", date: "2026-06-23T19:00:00", group: "K", stage: "group" },
  { id: "K4", home: "Colombia", away: "DR Congo", homeFlag: "🇨🇴", awayFlag: "🇨🇩", date: "2026-06-24T04:00:00", group: "K", stage: "group" },
  { id: "K5", home: "Colombia", away: "Portugal", homeFlag: "🇨🇴", awayFlag: "🇵🇹", date: "2026-06-28T01:30:00", group: "K", stage: "group" },
  { id: "K6", home: "DR Congo", away: "Uzbekistan", homeFlag: "🇨🇩", awayFlag: "🇺🇿", date: "2026-06-28T01:30:00", group: "K", stage: "group" },

  // Group L: England, Croatia, Ghana, Panama
  { id: "L1", home: "England", away: "Croatia", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇭🇷", date: "2026-06-17T22:00:00", group: "L", stage: "group" },
  { id: "L2", home: "Ghana", away: "Panama", homeFlag: "🇬🇭", awayFlag: "🇵🇦", date: "2026-06-18T01:00:00", group: "L", stage: "group" },
  { id: "L3", home: "England", away: "Ghana", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇬🇭", date: "2026-06-23T22:00:00", group: "L", stage: "group" },
  { id: "L4", home: "Panama", away: "Croatia", homeFlag: "🇵🇦", awayFlag: "🇭🇷", date: "2026-06-24T01:00:00", group: "L", stage: "group" },
  { id: "L5", home: "Panama", away: "England", homeFlag: "🇵🇦", awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", date: "2026-06-27T23:00:00", group: "L", stage: "group" },
  { id: "L6", home: "Croatia", away: "Ghana", homeFlag: "🇭🇷", awayFlag: "🇬🇭", date: "2026-06-27T23:00:00", group: "L", stage: "group" },

  // Round of 32
  { id: "R32_1", home: "South Africa", away: "Canada", homeFlag: "🇿🇦", awayFlag: "🇨🇦", date: "2026-06-28T21:00:00", stage: "round32" },
  { id: "R32_2", home: "Brazil", away: "Japan", homeFlag: "🇧🇷", awayFlag: "🇯🇵", date: "2026-06-29T19:00:00", stage: "round32" },
  { id: "R32_3", home: "Germany", away: "Paraguay", homeFlag: "🇩🇪", awayFlag: "🇵🇾", date: "2026-06-29T22:30:00", stage: "round32" },
  { id: "R32_4", home: "Netherlands", away: "Morocco", homeFlag: "🇳🇱", awayFlag: "🇲🇦", date: "2026-06-30T03:00:00", stage: "round32" },
  { id: "R32_5", home: "Ivory Coast", away: "Norway", homeFlag: "🇨🇮", awayFlag: "🇳🇴", date: "2026-06-30T19:00:00", stage: "round32" },
  { id: "R32_6", home: "France", away: "Sweden", homeFlag: "🇫🇷", awayFlag: "🇸🇪", date: "2026-06-30T23:00:00", stage: "round32" },
  { id: "R32_7", home: "Mexico", away: "Ecuador", homeFlag: "🇲🇽", awayFlag: "🇪🇨", date: "2026-07-01T03:00:00", stage: "round32" },
  { id: "R32_8", home: "England", away: "DR Congo", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇨🇩", date: "2026-07-01T18:00:00", stage: "round32" },
  { id: "R32_9", home: "Belgium", away: "Senegal", homeFlag: "🇧🇪", awayFlag: "🇸🇳", date: "2026-07-01T22:00:00", stage: "round32" },
  { id: "R32_10", home: "USA", away: "Bosnia and Herzegovina", homeFlag: "🇺🇸", awayFlag: "🇧🇦", date: "2026-07-02T02:00:00", stage: "round32" },
  { id: "R32_11", home: "Spain", away: "Austria", homeFlag: "🇪🇸", awayFlag: "🇦🇹", date: "2026-07-02T21:00:00", stage: "round32" },
  { id: "R32_12", home: "Portugal", away: "Croatia", homeFlag: "🇵🇹", awayFlag: "🇭🇷", date: "2026-07-03T01:00:00", stage: "round32" },
  { id: "R32_13", home: "Switzerland", away: "Algeria", homeFlag: "🇨🇭", awayFlag: "🇩🇿", date: "2026-07-03T05:00:00", stage: "round32" },
  { id: "R32_14", home: "Australia", away: "Egypt", homeFlag: "🇦🇺", awayFlag: "🇪🇬", date: "2026-07-03T20:00:00", stage: "round32" },
  { id: "R32_15", home: "Argentina", away: "Cabo Verde", homeFlag: "🇦🇷", awayFlag: "🇨🇻", date: "2026-07-04T00:00:00", stage: "round32" },
  { id: "R32_16", home: "Colombia", away: "Ghana", homeFlag: "🇨🇴", awayFlag: "🇬🇭", date: "2026-07-04T03:30:00", stage: "round32" },

  // Round of 16
  { id: "R16_1", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-04T19:00:00", stage: "round16" },
  { id: "R16_2", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-04T23:00:00", stage: "round16" },
  { id: "R16_3", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-05T22:00:00", stage: "round16" },
  { id: "R16_4", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-06T02:00:00", stage: "round16" },
  { id: "R16_5", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-06T21:00:00", stage: "round16" },
  { id: "R16_6", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-07T02:00:00", stage: "round16" },
  { id: "R16_7", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-07T18:00:00", stage: "round16" },
  { id: "R16_8", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-07T22:00:00", stage: "round16" },

  // Quarter-finals
  { id: "QF1", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-09T22:00:00", stage: "quarter" },
  { id: "QF2", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-10T21:00:00", stage: "quarter" },
  { id: "QF3", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-11T23:00:00", stage: "quarter" },
  { id: "QF4", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-12T03:00:00", stage: "quarter" },

  // Semi-finals
  { id: "SF1", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-14T21:00:00", stage: "semi" },
  { id: "SF2", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-15T21:00:00", stage: "semi" },

  // Third place play-off
  { id: "TP", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-18T23:00:00", stage: "third" },

  // Final
  { id: "FIN", home: "TBD", away: "TBD", homeFlag: "", awayFlag: "", date: "2026-07-19T21:00:00", stage: "final" },
];

export function getMatchesByGroup() {
  const groups: Partial<Record<Group, StaticMatch[]>> = {};
  for (const m of MATCHES) {
    if (m.group) {
      if (!groups[m.group]) groups[m.group] = [];
      groups[m.group]!.push(m);
    }
  }
  return groups;
}
