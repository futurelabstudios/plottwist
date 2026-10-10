export interface Lesson {
  id: string;
  title: string;
  scene: string;
  consequences: string[];
  body: string[];
  exercise: string;
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
}
export interface Course {
  id: string;
  category: string;
  title: string;
  description: string;
  duration: string;
  audience: string;
  color: string;
  symbol: string;
  lessons: Lesson[];
}
export const courses: Course[] = [
  {
    id: "ai-at-work",
    category: "AI & PRODUCTIVITY",
    title: "Make AI your thinking partner",
    description:
      "Turn vague requests into useful drafts, better questions and a repeatable workflow.",
    duration: "12 min",
    audience: "Students & professionals",
    color: "mint",
    symbol: "spark",
    lessons: [
      {
        id: "brief",
        scene:
          "Your team needs a presentation outline by tomorrow. You have three milestones and an AI assistant, but no useful first draft yet. Your opening move will decide how much rework comes next.",
        consequences: [
          "The assistant cannot tell what \u201camazing\u201d means. You get a polished draft with the wrong emphasis.",
          "The assistant has a clear audience, source and format. You get a focused draft and a list of missing dates.",
          "You get a long collection of ideas rather than a usable update.",
        ],
        title: "Start with a clear brief",
        body: [
          "A useful AI request defines a task, the relevant context and what a good result looks like. Instead of “write my presentation”, ask for a six-slide outline for a specific audience, using the facts you provide.",
          "Give the model constraints: tone, length, source material and the format you need. Ask it to flag missing facts rather than fill the gaps with guesses.",
        ],
        exercise:
          "Write a brief for a real task: include the audience, source material, output format and one constraint.",
        question: "Which request is easiest to assess?",
        answers: [
          "Make this amazing.",
          "Draft a 150-word update for my manager using these three milestones. Flag missing dates.",
          "Write everything you know about my project.",
        ],
        correct: 1,
        explanation:
          "A defined audience, source and output make the result easier to check.",
      },
      {
        id: "verify",
        scene:
          "The draft arrives with a confident statistic and a citation you have never seen. A teammate wants to send it to the client immediately. You have one more decision before it leaves the team.",
        consequences: [
          "The statistic makes it into the update without evidence. Your team may have to correct it later.",
          "The update loses useful information along with the unsupported claim.",
          "You find the original source and discover the figure refers to a different audience. You correct the draft before sharing.",
        ],
        title: "Check before you trust",
        body: [
          "Fluent language is not evidence. For factual work, compare claims with your original documents or authoritative sources. A citation is useful only if it exists and supports the specific claim.",
          "Separate the draft from its factual claims. Make a short checklist of names, numbers, dates and assumptions; verify each item before sharing. Avoid uploading private material unless your organization permits it.",
        ],
        exercise:
          "Choose one AI-generated paragraph. List three claims you would verify and where you would check them.",
        question: "A draft includes a confident statistic. What should you do?",
        answers: [
          "Trust it because it sounds specific.",
          "Remove every number.",
          "Check the statistic against an original, relevant source.",
        ],
        correct: 2,
        explanation:
          "Confidence and precision do not prove accuracy; check the source.",
      },
      {
        id: "iterate",
        scene:
          "Your draft now has the right facts, but the introduction is too long and nobody can find the next action. You have time for one revision before the team meeting.",
        consequences: [
          "The revision keeps the milestones and makes the next action visible. You save this brief for next week.",
          "The assistant changes the tone but cannot tell what needs fixing.",
          "A full rewrite risks losing the verified facts and creates another review cycle.",
        ],
        title: "Build a repeatable loop",
        body: [
          "Treat the first answer as a draft. Give specific feedback: “keep the facts, reduce the introduction, and add one example for beginners”. Change one major thing at a time so you can see whether the revision improves it.",
          "Save a reusable brief, a verification checklist and an example of a good result. Run the same loop for similar tasks: brief → draft → check → revise → human review.",
        ],
        exercise:
          "Design a five-step AI workflow for a task you repeat each week.",
        question: "Which feedback gives the clearest next step?",
        answers: [
          "Keep the three milestones, shorten this to 120 words and make the next action explicit.",
          "Try harder.",
          "Start over and change everything.",
        ],
        correct: 0,
        explanation:
          "Specific feedback preserves what works while making the desired change clear.",
      },
    ],
  },
  {
    id: "story-craft",
    category: "CREATIVE THINKING",
    title: "Tell stories that move people",
    description:
      "Build a character, a meaningful choice and a twist that earns its place.",
    duration: "15 min",
    audience: "Students & creators",
    color: "violet",
    symbol: "orbit",
    lessons: [
      {
        id: "want",
        scene:
          "You are pitching a short interactive story for a student showcase. Your world is beautiful, but the first reader says, \u201cWhy should I care?\u201d Choose the premise that will give your story momentum.",
        consequences: [
          "The world has atmosphere, but the reader still has no reason to follow a character.",
          "A student, a missing teammate and a deadline create a goal with something personal at risk.",
          "Scale alone does not give the reader a character to care about.",
        ],
        title: "Give your character something to lose",
        body: [
          "A story begins to move when someone wants something and an obstacle makes it difficult. “A pilot wants to bring her brother home, but the rescue signal may be a trap” is more useful than a list of world details.",
          "Make the stakes concrete. What changes if the character fails? What belief or relationship makes this goal personal? A small, specific stake can be more powerful than an abstract threat to the universe.",
        ],
        exercise:
          "Write one sentence containing a character, a goal, an obstacle and a personal stake.",
        question: "Which premise has a clear dramatic engine?",
        answers: [
          "A city has many interesting buildings.",
          "A student must present a lost teammate’s work before the team is disqualified.",
          "Space is very large.",
        ],
        correct: 1,
        explanation:
          "The student has a goal, a deadline, an obstacle and a consequence.",
      },
      {
        id: "choice",
        scene:
          "Your character reaches the middle of the story. The reader must direct the next move. You want their choice to change a relationship and leave a consequence for the next chapter.",
        consequences: [
          "The reader follows an instruction without choosing between competing values.",
          "The corridors look different, but the decision has no meaningful cost.",
          "Either choice protects something valuable and risks something else. You can carry that consequence into the next scene.",
        ],
        title: "Make choices cost something",
        body: [
          "A meaningful choice offers competing values, not an obvious right answer. Save time or build trust. Protect a secret or ask for help. Give both options a benefit and a cost.",
          "After the choice, show a consequence. If the character takes a risk, change a relationship, resource or opportunity. In an interactive story, let that change appear in later scenes so the reader feels their decision mattered.",
        ],
        exercise:
          "Write two possible actions for your character. Give each a benefit and a cost.",
        question: "Which choice creates the strongest tension?",
        answers: [
          "Press the only working button.",
          "Choose between two identical corridors.",
          "Reveal a secret to save a friend, or keep the promise and risk losing their trust.",
        ],
        correct: 2,
        explanation:
          "Both options protect something valuable and put something else at risk.",
      },
      {
        id: "twist",
        scene:
          "The showcase reader is almost at the ending. You want the reveal to surprise them and make them rethink an earlier scene. Decide how to set up the twist.",
        consequences: [
          "An ordinary detail becomes meaningful after the reveal. The reader can look back and connect the clues.",
          "The ending depends on a rule the reader could not know. The surprise feels arbitrary.",
          "The reveal is unexpected, but it does not resolve the character\u2019s journey.",
        ],
        title: "Plant the twist before it arrives",
        body: [
          "A satisfying twist changes how the audience interprets something they already saw. Plant a clue that seems ordinary at first, then reveal its second meaning.",
          "Keep cause and effect intact. A twist should grow from the character’s actions and the world’s rules. Test it by rereading: can the reader spot a clue without feeling the outcome was obvious?",
        ],
        exercise:
          "Write a twist and one earlier clue that becomes meaningful after the reveal.",
        question: "What makes a twist feel earned?",
        answers: [
          "An earlier clue that gains a new meaning and fits the established rules.",
          "A new rule introduced only at the ending.",
          "A surprise unrelated to any character’s choices.",
        ],
        correct: 0,
        explanation:
          "An earned twist surprises the audience while respecting the story’s logic.",
      },
    ],
  },
  {
    id: "clear-communication",
    category: "CAREER SKILLS",
    title: "Communicate with confidence",
    description: "Make your ideas easier to understand, act on and remember.",
    duration: "10 min",
    audience: "Students & professionals",
    color: "amber",
    symbol: "signal",
    lessons: [
      {
        id: "point",
        scene:
          "You are coordinating a Monday launch. A reviewer has your draft, but their feedback is still missing. Your next message has to help them act without reading the whole project history.",
        consequences: [
          "The reviewer gets background but cannot find the action you need.",
          "The reviewer sees the request, deadline and reason immediately. You give them a clear next step.",
          "The polite opening delays the information the reviewer needs to act.",
        ],
        title: "Lead with the point",
        body: [
          "Before writing, decide what your reader needs to know or do. Put that point in the first sentence, then give the context that helps them act.",
          "“We need your feedback on the draft by Friday to meet Monday’s launch” is easier to act on than a long history of the project. Keep supporting details relevant to the decision.",
        ],
        exercise:
          "Rewrite a recent message with the main point in its first sentence.",
        question: "Which opening is clearest?",
        answers: [
          "There are a lot of things happening lately.",
          "Please approve the draft by Friday so we can publish on Monday.",
          "I hope this email finds you well; I wanted to reach out.",
        ],
        correct: 1,
        explanation:
          "The request, deadline and reason are visible immediately.",
      },
      {
        id: "evidence",
        scene:
          "Your project lead asks whether the prototype will be ready for a review. Two screens still need a decision. Pick the update that lets the team coordinate the remaining work.",
        consequences: [
          "The lead hears reassurance but cannot see what is left or who owns it.",
          "The lead knows you are trying, but still cannot plan the review.",
          "The team can see the finished work, the unresolved screens and the owner of the next action.",
        ],
        title: "Make progress concrete",
        body: [
          "Replace broad claims with observable facts. Instead of “we made good progress”, say what was finished, what remains and what is needed next.",
          "A useful status update has three parts: the outcome, the remaining issue, and the next action with an owner or date. Make uncertainty explicit rather than implying something is settled.",
        ],
        exercise:
          "Write a three-sentence project update: completed work, remaining issue, next action.",
        question: "Which update helps the reader plan?",
        answers: [
          "Everything is looking good.",
          "We are doing our best.",
          "The prototype is ready. Two screens need review. Maya will review them on Thursday.",
        ],
        correct: 2,
        explanation:
          "Concrete progress and an owned next action help people coordinate.",
      },
      {
        id: "feedback",
        scene:
          "A teammate shares a presentation with six small charts on its opening slide. The main result is hard to spot. You need to help them improve the slide while keeping the conversation constructive.",
        consequences: [
          "Your teammate knows what you observed, why it matters and what they can change next.",
          "The comment targets the person and gives them no useful way to improve the slide.",
          "The comment signals dissatisfaction but does not identify what to change.",
        ],
        title: "Give feedback someone can use",
        body: [
          "Describe the specific thing you observed, its effect and a possible next step. “The opening has three competing messages; choose one so readers know what to do next” is actionable feedback.",
          "Separate the person from the work. Invite clarification when you may be missing context, and make your suggestion proportionate to the problem.",
        ],
        exercise:
          "Give feedback on a piece of work using observation → effect → next step.",
        question: "Which feedback is most useful?",
        answers: [
          "This slide has six small charts; the main result is hard to find. Highlight one chart and move the others to the appendix.",
          "You are bad at presentations.",
          "This needs more polish.",
        ],
        correct: 0,
        explanation:
          "A specific observation, impact and next step make feedback usable.",
      },
    ],
  },
];
export const fantasyChoices = [
  {
    id: "listen",
    label: "Listen to the dragon",
    hint: "Find the truth beneath the legend.",
  },
  {
    id: "rescue",
    label: "Free the imprisoned flame",
    hint: "Risk the tower to save a life.",
  },
  {
    id: "search",
    label: "Decode the moon runes",
    hint: "Understand the magic before acting.",
  },
  {
    id: "guard",
    label: "Protect the sleeping city",
    hint: "Give everyone time to escape.",
  },
] as const;
export type FantasyChoice = (typeof fantasyChoices)[number]["id"];
export function fantasyPage(name: string, history: FantasyChoice[]) {
  const last = history.at(-1);
  const approach =
    last === "listen"
      ? "You hear the dragon’s forgotten name."
      : last === "rescue"
        ? "You break the chain around the flame."
        : last === "search"
          ? "The runes reveal the tower’s hidden purpose."
          : "You raise a shield over the sleeping city.";
  if (history.length === 0)
    return {
      title: "The flame that remembered",
      panels: [
        [
          "A city sleeps beneath two moons.",
          `${name}, the last ember is fading. If it goes out, morning will never arrive.`,
        ],
        [
          "A dragon coils around the bell tower.",
          `“They call me a monster,” it whispers. “They never asked what I guard.”`,
        ],
        [
          "Inside the tower, a flame beats like a heart.",
          `You recognize the lullaby it hums. Your family sang it when you were small.`,
        ],
        [
          "The city’s bells begin to ring backwards.",
          `${name}, will you trust the legend, or write a different one?`,
        ],
      ],
    };
  if (history.length === 1)
    return {
      title: "The guardian’s secret",
      panels: [
        [
          approach,
          `${name}, your decision changes the spell. The dragon lowers its head.`,
        ],
        [
          "A thousand names appear in the flame.",
          "The ember holds the memories of everyone the city has forgotten.",
        ],
        [
          "The tower is a lock. The dragon is its keeper.",
          last === "rescue"
            ? "The broken chain starts to fall. The city trembles."
            : last === "guard"
              ? "Your shield holds, but the ember grows weaker."
              : last === "search"
                ? "The runes say the lock opens only from both sides."
                : "“I stayed so they could remember,” the dragon tells you.",
        ],
        [
          "Your own name appears beside a missing name.",
          `${name}, your family helped build this spell. You can choose what it becomes.`,
        ],
      ],
    };
  const previous = history[0];
  const endings = {
    listen: [
      "A promise, freely chosen",
      "You ask the forgotten people what they want. Their names become stars; the dragon is finally free.",
    ],
    rescue: [
      "A dawn worth the risk",
      "You open the tower. The remembered people step into bodies of light, and the dragon carries them safely down.",
    ],
    search: [
      "The city that learned to remember",
      "You rewrite the runes. Every home becomes a lantern that keeps a memory without holding anyone captive.",
    ],
    guard: [
      "The keeper who opened the gate",
      "You hold the shield while the city wakes. Together, its people open the gate and share the ember’s light.",
    ],
  }[last!];
  return {
    title: endings[0],
    panels: [
      [approach, `${name}, the final spell answers your choice.`],
      [
        endings[1],
        previous === "rescue"
          ? "The chain you broke becomes the first bridge into the city."
          : previous === "search"
            ? "The runes you decoded guide every person home."
            : previous === "guard"
              ? "The shield you raised gives the forgotten time to return."
              : "The name you listened for is the first name the city speaks.",
      ],
      [
        "The sun rises over the tower for the first time in years.",
        `The dragon bows. “Thank you, ${name}. A guardian should never be a jailer.”`,
      ],
      [
        "Beyond the forest, another lantern flickers.",
        `${name}, some endings are invitations. Your next story is waiting.`,
      ],
    ],
  };
}
