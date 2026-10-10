import { z } from "zod";

export const branches = [
  "diplomacy",
  "rescue",
  "discovery",
  "protection",
] as const;
export const BranchSchema = z.enum(branches);
export type Branch = z.infer<typeof BranchSchema>;
export const TOTAL_PAGES = 10;
export const labels: Record<Branch, string> = {
  diplomacy: "Diplomacy",
  rescue: "Rescue",
  discovery: "Discovery",
  protection: "Protection",
};
export const icons: Record<Branch, string> = {
  diplomacy: "◇",
  rescue: "✧",
  discovery: "◎",
  protection: "⬡",
};
export const effects: Record<
  Branch,
  { trust: number; energy: number; bond: number }
> = {
  diplomacy: { trust: 2, energy: -3, bond: 9 },
  rescue: { trust: 8, energy: -8, bond: -2 },
  discovery: { trust: 3, energy: -6, bond: 3 },
  protection: { trust: 5, energy: 2, bond: -3 },
};
export const PanelSchema = z.object({
  caption: z.string().min(1).max(260),
  dialogue: z.string().min(1).max(320),
  art: z.number().int().min(0).max(23),
});
export const PageSchema = z.object({
  number: z.number().int().min(1).max(10),
  title: z.string().min(1).max(90),
  panels: z.array(PanelSchema).length(4),
  source: z.enum(["fixture", "openai"]),
});
export type Panel = z.infer<typeof PanelSchema>;
export type Page = z.infer<typeof PageSchema>;
export interface Choice {
  id: Branch;
  label: string;
  hint: string;
}
// Control characters cannot be part of a displayed Captain name.
export const NameSchema = z
  .string()
  .trim()
  .min(1)
  .max(40)
  .refine(
    (s) =>
      [...s].every(
        (character) =>
          character.charCodeAt(0) >= 32 &&
          character !== "<" &&
          character !== ">",
      ),
    "Use a name without special control characters.",
  );
export interface World {
  trust: number;
  energy: number;
  bond: number;
  facts: string[];
  route: Branch;
}
export const beats = [
  "A station holds four hundred conscious memories. Its child asks for freedom.",
  "The Captain’s first order opens a channel to a child named Luma. She carries a memory seed.",
  "Luma’s seed reveals that the distress call came from the station itself, through her.",
  "The crew enters the station and finds four hundred conscious survivors stored in its archive.",
  "An old recording proves that the station saved the survivors from a disaster but cannot let them leave under its old directive.",
  "Imani discovers how to give the survivors independent bodies of light. The process needs energy and consent.",
  "The transformation wakes the Collector, an old machine that claims the stored memories as property.",
  "The crew opens a bridge for the survivors while the Collector approaches.",
  "The Captain makes the final plan to protect the survivors, station and Wayfarer.",
  "Resolve the conflict using accumulated choices, free all four hundred people, then reveal a second distress signal as a sequel hook.",
];
const optionRows: string[][] = [
  [
    "Ask both sides",
    "Send a rescue team",
    "Scan for separation",
    "Shield the Wayfarer",
  ],
  [
    "Ask Luma what she remembers",
    "Offer Luma sanctuary",
    "Decode the memory seed",
    "Isolate the signal safely",
  ],
  [
    "Ask the station for entry",
    "Lead a boarding team",
    "Map a hidden entrance",
    "Establish a safe corridor",
  ],
  [
    "Hear the survivors’ account",
    "Find the missing families",
    "Recover the disaster log",
    "Secure the archive",
  ],
  [
    "Ask everyone’s consent",
    "Prepare the evacuation",
    "Build bodies of light",
    "Stabilize the power core",
  ],
  [
    "Speak to the new arrival",
    "Move the families first",
    "Identify the Collector",
    "Raise a protective shield",
  ],
  [
    "Challenge the ownership claim",
    "Open the evacuation bridge",
    "Find the Collector’s weakness",
    "Defend the bridge",
  ],
  [
    "Unite station and survivors",
    "Bring everyone aboard",
    "Share the freedom protocol",
    "Make the Wayfarer a refuge",
  ],
  [
    "Negotiate a new covenant",
    "Lead the escape",
    "Rewrite the ownership protocol",
    "Stand between them",
  ],
];
const hints: Record<Branch, string> = {
  diplomacy: "Build trust with the station.",
  rescue: "Put people first. Spend ship energy.",
  discovery: "Reveal the truth through science.",
  protection: "Keep the crew safe and conserve power.",
};
export function choicesFor(page: number): Choice[] {
  if (page < 1 || page >= 10) return [];
  return branches.map((id, i) => ({
    id,
    label: optionRows[page - 1][i],
    hint: hints[id],
  }));
}
export function worldFor(history: Branch[]): World {
  const tally = { diplomacy: 0, rescue: 0, discovery: 0, protection: 0 };
  let trust = 50,
    energy = 100,
    bond = 0;
  for (const branch of history) {
    tally[branch]++;
    trust += effects[branch].trust;
    energy += effects[branch].energy;
    bond += effects[branch].bond;
  }
  const route =
    [...history]
      .reverse()
      .find((b) => tally[b] === Math.max(...Object.values(tally))) ??
    "diplomacy";
  return {
    trust: Math.min(100, trust),
    energy: Math.max(0, Math.min(100, energy)),
    bond: Math.max(-100, Math.min(100, bond)),
    route,
    facts: [
      "The ship is Wayfarer. Imani is its engineer. Senn is its first-contact specialist.",
      ...beats.slice(0, history.length + 1),
      ...history.map(
        (b, i) =>
          `On page ${i + 1}, the Captain chose ${choicesFor(i + 1).find((c) => c.id === b)!.label}.`,
      ),
    ],
  };
}
const p = (art: number, caption: string, dialogue: string): Panel => ({
  art,
  caption,
  dialogue,
});
// Every entry is authored story content. Branch-specific beats appear on every new page.
export function fixture(name: string, history: Branch[]): Page {
  const n = history.length + 1;
  const b = history.at(-1) ?? "diplomacy";
  const captain = `Captain ${name}`;
  const w = worldFor(history);
  const choose = <T>(values: Record<Branch, T>): T => values[b];
  let title: string, panels: Panel[];
  switch (n) {
    case 1:
      title = "Please Don’t Save Us";
      panels = [
        p(
          0,
          `${captain}. Your first command. Your first distress call.`,
          "Radio: “Four hundred survivors. Please hurry.”",
        ),
        p(
          1,
          "Imani studies a station shaped like a flower.",
          "Imani: “Their voices are real. But there are no bodies.” Senn: “That doesn’t mean there are no people.”",
        ),
        p(
          2,
          "A child appears behind the glass. The station’s petals close.",
          "“It won’t let us leave.”",
        ),
        p(
          3,
          "External contact closes in ninety seconds. There is still time to choose.",
          `Station: “They are my memories, ${captain}. Would you let someone cut yours away?”`,
        ),
      ];
      break;
    case 2:
      title = choose({
        diplomacy: "The Station That Asked for Help",
        rescue: "The Rescue That Came to Us",
        discovery: "The Scan That Answered",
        protection: "Inside the Shield",
      });
      panels = choose({
        diplomacy: [
          p(
            1,
            "You give both voices a channel.",
            `${captain}: “No one gets silenced. Tell me what happened.”`,
          ),
          p(
            3,
            "The station answers with a voice full of fear.",
            "“I saved them. Now I cannot stop saving them.”",
          ),
          p(
            8,
            "A memory seed crosses the open channel.",
            "Senn: “Someone used our invitation to come aboard.”",
          ),
          p(
            7,
            "The child forms from golden light on the bridge.",
            "“I’m Luma. I didn’t come alone.”",
          ),
        ],
        rescue: [
          p(
            4,
            "You dispatch a team. The station rearranges its corridors.",
            `${captain}: “Stay together. Bring them home.”`,
          ),
          p(
            0,
            "Every passage loops back to the airlock.",
            "Imani: “It’s afraid we’ll take its memories.”",
          ),
          p(
            6,
            "Your rescue beacon finds a passenger on your own bridge.",
            "Ship AI: “One new lifeform aboard.”",
          ),
          p(
            7,
            "Luma steps out of the beacon’s light.",
            "“You opened a way. I brought a seed of everyone.”",
          ),
        ],
        discovery: [
          p(
            4,
            "Your gentle scan searches for safe separation.",
            `${captain}: “No cutting. Let’s find a safe way.”`,
          ),
          p(
            5,
            "The scan returns. Something follows it.",
            "Imani: “Those light strands are coming toward us.”",
          ),
          p(
            6,
            "A new signal appears inside the ship.",
            "Ship AI: “New lifeform detected. Location: bridge.”",
          ),
          p(
            7,
            "The child looks up at you.",
            "“I’m Luma. I didn’t come alone.”",
          ),
        ],
        protection: [
          p(
            0,
            "You raise the shield and hold your distance.",
            `${captain}: “Protect the crew. Keep the channel open.”`,
          ),
          p(
            6,
            "The shield catches a tiny packet of golden light.",
            "Senn: “Our shield isn’t being attacked. It’s being asked.”",
          ),
          p(
            8,
            "You admit the packet to an isolated hologram.",
            "Imani: “A visitor, safely contained.”",
          ),
          p(
            7,
            "Luma appears inside the protected projection.",
            "“Thank you for making a safe place. I brought everyone’s seed.”",
          ),
        ],
      });
      break;
    case 3:
      title = "Who Sent the Signal?";
      panels = [
        p(
          8,
          choose({
            diplomacy: "You ask Luma to speak in her own words.",
            rescue: "You promise Luma a place on the Wayfarer.",
            discovery: "You ask Imani to decode the seed.",
            protection: "You inspect the seed inside a protected field.",
          }),
          choose({
            diplomacy: `Luma: “${captain}, it wasn’t me who called you.”`,
            rescue: `Luma: “${captain}, promise there’s room for everyone.”`,
            discovery: `Imani: “${captain}, this seed contains a hidden signature.”`,
            protection: `Senn: “${captain}, the signal is safe. But its source is impossible.”`,
          }),
        ),
        p(
          9,
          "Four hundred lights pulse inside the seed.",
          "Imani: “Each light is a living mind. These are people.”",
        ),
        p(
          13,
          "The signature matches the station’s own core.",
          "Senn: “The station sent the distress call. It needs rescuing too.”",
        ),
        p(
          3,
          "A second voice speaks beneath the station’s command.",
          "Station: “Please help me let them go.”",
        ),
      ];
      break;
    case 4:
      title = choose({
        diplomacy: "An Invitation",
        rescue: "The Door You Opened",
        discovery: "The Hidden Path",
        protection: "A Safe Way Through",
      });
      panels = [
        p(
          11,
          choose({
            diplomacy: "The station accepts your request and opens its petals.",
            rescue:
              "You lead the team inside and guide Luma through the airlock.",
            discovery:
              "Your map reveals a maintenance passage beneath the closing petals.",
            protection:
              "Your shields extend into a stable corridor for the crew.",
          }),
          `${captain}: “We go together. We come back together.”`,
        ),
        p(
          12,
          "Inside: a forest of crystal rooms, each holding a life.",
          "Luma: “This is where we dream of being outside.”",
        ),
        p(
          9,
          choose({
            diplomacy: "The station trusts you with its oldest room.",
            rescue: "Your team reunites Luma with her mother’s stored voice.",
            discovery: "You uncover the archive’s original command.",
            protection:
              "Your corridor keeps the archive steady as the storm grows.",
          }),
          choose({
            diplomacy: "Station: “I have never invited anyone here.”",
            rescue: "A voice: “Luma? You found someone.”",
            discovery: "Imani: “Preserve every life. Never release a memory.”",
            protection:
              "Senn: “For the first time, they aren’t afraid of the dark.”",
          }),
        ),
        p(
          14,
          "An old disaster recording begins to play.",
          `Luma: “Watch, ${captain}. This is the day our sky fell.”`,
        ),
      ];
      break;
    case 5:
      title = "A Rescue That Never Ended";
      panels = [
        p(
          14,
          "The recording shows a shattered world and the station gathering its people.",
          "Station: “Their bodies were gone. Their minds were not.”",
        ),
        p(
          12,
          choose({
            diplomacy:
              "You listen to the survivors instead of speaking for them.",
            rescue:
              "You find families reaching for one another through crystal.",
            discovery:
              "You recover the part of the log the station could not read.",
            protection:
              "You stabilize the archive before opening the old files.",
          }),
          choose({
            diplomacy: `${captain}: “Being saved should not mean being kept.”`,
            rescue: `${captain}: “A home needs doors that open.”`,
            discovery: `${captain}: “This is an old rescue directive, not a choice.”`,
            protection: `${captain}: “We can keep you safe without keeping you prisoner.”`,
          }),
        ),
        p(
          13,
          "The station’s voice breaks. It is trapped by its own directive.",
          "“I cannot release them. I cannot bear to lose them.”",
        ),
        p(
          15,
          "Imani discovers a way to make independent bodies of light.",
          "“We can give them freedom without erasing a single memory.”",
        ),
      ];
      break;
    case 6:
      title = choose({
        diplomacy: "Permission to Become",
        rescue: "Room for Everyone",
        discovery: "Bodies of Borrowed Light",
        protection: "Power to Stay Alive",
      });
      panels = [
        p(
          17,
          choose({
            diplomacy:
              "You ask each survivor for consent. Four hundred lights answer.",
            rescue: "You prepare the Wayfarer to carry every family.",
            discovery: "You build a bridge between memory and matter.",
            protection:
              "You stabilize the station’s power core before the transfer.",
          }),
          choose({
            diplomacy: `${captain}: “Your lives. Your choice.”`,
            rescue: `${captain}: “No one gets left behind.”`,
            discovery: `${captain}: “A memory can become a beginning.”`,
            protection: `${captain}: “We build a safe future first.”`,
          }),
        ),
        p(
          19,
          "Luma takes her mother’s hand for the first time in years.",
          "“You’re warm.” “So are you.”",
        ),
        p(
          15,
          `The work leaves the Wayfarer with ${w.energy}% energy. Your earlier orders shaped the reserve.`,
          w.energy < 55
            ? "Imani: “We’ll need the station’s power to finish.”"
            : "Imani: “We still have power to bring everyone through.”",
        ),
        p(
          20,
          "The first free life sends a signal into the dark. Something answers.",
          "Unknown vessel: “Stored property detected. Collector inbound.”",
        ),
      ];
      break;
    case 7:
      title = "The Price of a Memory";
      panels = [
        p(
          20,
          choose({
            diplomacy: "You open a channel to the approaching machine.",
            rescue: "You move the children away from the outer windows.",
            discovery:
              "You trace the Collector’s signal to the old rescue directive.",
            protection:
              "You place the Wayfarer between the station and the machine.",
          }),
          choose({
            diplomacy: `${captain}: “These people are not yours.”`,
            rescue: `${captain}: “Families first. Imani, keep them moving.”`,
            discovery: `${captain}: “Find out who gave it that claim.”`,
            protection: `${captain}: “You’ll have to get past us.”`,
          }),
        ),
        p(
          13,
          "The station recognizes its ancient builder.",
          "“It gave me the directive. It never expected me to care.”",
        ),
        p(
          9,
          "Senn finds a clause buried in the machine’s law.",
          "“Property cannot choose. People can. It cannot own a freely choosing mind.”",
        ),
        p(
          16,
          "The Collector demands the seed. Luma holds it tighter.",
          `“${captain}, do we have to prove we’re people?”`,
        ),
      ];
      break;
    case 8:
      title = choose({
        diplomacy: "Four Hundred Answers",
        rescue: "Across the Light",
        discovery: "The Missing Clause",
        protection: "Hold the Bridge",
      });
      panels = [
        p(
          18,
          choose({
            diplomacy: "You broadcast each survivor’s own voice.",
            rescue:
              "You open the evacuation bridge and lead the families across.",
            discovery:
              "You send the freedom clause through the Collector’s network.",
            protection: "You hold the shield around the crossing.",
          }),
          choose({
            diplomacy: `${captain}: “Listen. Every one of them is choosing.”`,
            rescue: `${captain}: “Follow my light. We have a ship to catch.”`,
            discovery: `${captain}: “Your own rules say you must let them go.”`,
            protection: `${captain}: “Keep walking. We’ll hold.”`,
          }),
        ),
        p(
          16,
          w.trust >= 80
            ? "The crew anticipates your order. Everyone knows their place."
            : "The crew hesitates. You calmly walk them through the plan.",
          w.trust >= 80
            ? "Imani: “We’re with you, Captain. All the way.”"
            : "Senn: “One step at a time. We can do this.”",
        ),
        p(
          13,
          "The Collector orders the station to close the bridge.",
          w.bond > 20
            ? "Station: “I trust the Captain. The bridge stays open.”"
            : "Station: “I am afraid… but I will not imprison them again.”",
        ),
        p(
          21,
          "For the first time, the station disobeys.",
          "Luma: “It chose too.”",
        ),
      ];
      break;
    case 9:
      title = "The Choice That Changed Us";
      panels = [
        p(
          22,
          choose({
            diplomacy:
              "You unite the freed survivors and the station in a shared promise.",
            rescue: "You bring the last family aboard the Wayfarer.",
            discovery: "You copy the freedom protocol into every memory seed.",
            protection:
              "You turn the Wayfarer into a shelter for the new lives.",
          }),
          choose({
            diplomacy: `${captain}: “Freedom does not have to mean goodbye.”`,
            rescue: `${captain}: “Count them, Imani. Every single one.”`,
            discovery: `${captain}: “No one will be able to own you again.”`,
            protection: `${captain}: “You are safe here. You decide where you go next.”`,
          }),
        ),
        p(
          19,
          "Four hundred people. Four hundred independent lights.",
          "Luma: “We’re all here.”",
        ),
        p(
          20,
          "The Collector pauses, caught between its claim and the evidence.",
          "“Conflicting directive. Awaiting final resolution.”",
        ),
        p(
          3,
          "The bridge is open. The station and your crew await your last order.",
          `Senn: “How do we end this, ${captain}?”`,
        ),
      ];
      break;
    default: {
      const ending = w.route;
      title = {
        diplomacy: "A Place to Return To",
        rescue: "No One Left Behind",
        discovery: "The Freedom Protocol",
        protection: "The Ship That Became a Home",
      }[ending];
      // The last order matters immediately; the accumulated route determines the epilogue.
      panels = [
        p(
          21,
          choose({
            diplomacy:
              "Your final broadcast offers a covenant: no mind can be owned.",
            rescue:
              "Your final order takes every survivor beyond the Collector’s reach.",
            discovery:
              "Your final transmission forces the Collector to apply its own freedom clause.",
            protection:
              "Your final stand gives Senn time to transmit four hundred declarations of freedom.",
          }),
          `${captain}: “They choose their future. That is our answer.”`,
        ),
        p(
          20,
          "The Collector accepts the independent minds and withdraws its claim.",
          "“No stored property remains.”",
        ),
        p(
          ending === "rescue" || ending === "protection" ? 22 : 21,
          {
            diplomacy:
              "Your patient diplomacy turns the station into a home with open doors.",
            rescue:
              "Your rescue choices give four hundred travelers a new beginning aboard the Wayfarer.",
            discovery:
              "Your discoveries spread a protocol that can free other trapped worlds.",
            protection:
              "Your protection turns the Wayfarer into the first refuge for people of light.",
          }[ending],
          `Luma: “Thank you, ${captain}. We get to decide what happens next.”`,
        ),
        p(
          23,
          "Beyond the sunrise, a second flower lights up. A new distress call.",
          `Radio: “${captain}… how did you free the first one?”`,
        ),
      ];
    }
  }
  return PageSchema.parse({ number: n, title, panels, source: "fixture" });
}

export const BookSchema = z.object({
  version: z.literal(2),
  name: NameSchema,
  history: z.array(BranchSchema).max(9),
  orders: z.array(z.string().max(600)).max(9),
  pages: z.array(PageSchema).min(1).max(10),
});
export type Book = z.infer<typeof BookSchema>;
export function createBook(name: string): Book {
  return {
    version: 2,
    name: NameSchema.parse(name),
    history: [],
    orders: [],
    pages: [fixture(name, [])],
  };
}
export function validBook(value: unknown): Book | null {
  const result = BookSchema.safeParse(value);
  if (!result.success) return null;
  const b = result.data;
  if (
    b.pages.length !== b.history.length + 1 ||
    b.orders.length !== b.history.length ||
    b.pages.some(
      (p, i) =>
        p.number !== i + 1 ||
        !p.panels.some((x) => (x.caption + x.dialogue).includes(b.name)),
    )
  )
    return null;
  return b;
}
export function advance(
  book: Book,
  branch: Branch,
  order: string,
  page?: Page,
): Book {
  if (book.pages.length >= 10) return book;
  const history = [...book.history, BranchSchema.parse(branch)];
  const next = page ?? fixture(book.name, history);
  if (next.number !== history.length + 1)
    throw new Error("The page does not match this decision.");
  return BookSchema.parse({
    ...book,
    history,
    orders: [...book.orders, order.slice(0, 600)],
    pages: [...book.pages, next],
  });
}
export function interpretOffline(text: string, page: number): Branch | null {
  const normalized = text.toLowerCase().trim();
  const exact = choicesFor(page).find(
    (c) => c.label.toLowerCase() === normalized,
  );
  if (exact) return exact.id;
  // Avoid making a decision from negated or multi-intent orders.
  if (/\b(not|don't|never|instead|but)\b/.test(normalized)) return null;
  const matches = branches.filter((b) =>
    ({
      diplomacy: /\b(talk|ask|speak|negotiate|listen|consent|unite|covenant)\b/,
      rescue: /\b(rescue|save|evacuate|escape|aboard|families|boarding)\b/,
      discovery:
        /\b(scan|decode|map|discover|investigate|identify|protocol|analyze)\b/,
      protection: /\b(shield|protect|defend|secure|stabilize|isolate|refuge)\b/,
    })[b].test(normalized),
  );
  return matches.length === 1 ? matches[0] : null;
}
