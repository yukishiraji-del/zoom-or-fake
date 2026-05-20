export type ParticipantType = "real" | "fake";

export interface Question {
  id: string;
  imageUrl: string;
  type: ParticipantType;
  displayName: string;
  jobTitle: string;
  signal: string;
  explanation: string;
}

const names = [
  "Aiko", "Kenji", "Mina", "Ren", "Yui", "Sora", "Rina", "Kaito", "Noa", "Leo",
  "Mao", "Hana", "Daichi", "Mei", "Toma", "Sara", "Ryo", "Nana", "Aki", "Yuto",
  "Emi", "Kai", "Riku", "Mika", "Rio", "Yuna", "Sho", "Aya", "Haruto", "Niko",
];

const roles = [
  "Weekly sync", "Client call", "Interview", "Product review", "Design critique",
  "Hiring panel", "Standup", "Partner call", "Planning", "Demo",
  "Strategy call", "Research review", "Finance check", "Ops update", "Sales call",
];

const realSignals = [
  {
    signal: "Texture is consistent across skin, hair, and background",
    explanation: "Compression noise appears evenly across the person and the room, so the face does not feel pasted on.",
  },
  {
    signal: "The edge between the person and background looks natural",
    explanation: "Hair and shoulder edges blend normally with the room, without the double outline you often see from masking.",
  },
  {
    signal: "The eyes have natural asymmetry",
    explanation: "Reflections and eyelid shapes are not perfectly mirrored, which gives the image a real-camera feel.",
  },
  {
    signal: "Face and clothing shadows point the same way",
    explanation: "The light direction is consistent across the face, neck, and clothes, reducing the feeling of a composite.",
  },
  {
    signal: "The mouth and cheeks connect cleanly",
    explanation: "Expression details transition smoothly instead of showing the melted texture common in generated faces.",
  },
];

const fakeSignals = [
  {
    signal: "There is a subtle double edge around the face",
    explanation: "Thin smearing near the hair or cheeks can make the face look like a separate layer from the room.",
  },
  {
    signal: "The eye reflections look too matched",
    explanation: "When both eyes have unusually similar reflections or shapes, it can be a sign of over-smoothed generation.",
  },
  {
    signal: "The face texture is sharper than the background",
    explanation: "A mismatch in detail between the face and the rest of the frame can point to a deepfake or generated headshot.",
  },
  {
    signal: "Ear or hair details look slightly melted",
    explanation: "Ears, hairlines, and accessories are common places for generated images to lose structure.",
  },
  {
    signal: "Face brightness does not quite match the neck or background",
    explanation: "If only the face has different lighting, the whole video frame can feel less physically consistent.",
  },
];

function pad(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function buildQuestion(type: ParticipantType, index: number): Question {
  const evidence = type === "real" ? realSignals[index % realSignals.length] : fakeSignals[index % fakeSignals.length];
  const prefix = type === "real" ? "real" : "fake";
  const idPrefix = type === "real" ? "r" : "f";

  return {
    id: `${idPrefix}${pad(index)}`,
    imageUrl: `/images/photos/${prefix}/${prefix}-${pad(index)}.jpg`,
    type,
    displayName: names[index],
    jobTitle: roles[index % roles.length],
    signal: evidence.signal,
    explanation: evidence.explanation,
  };
}

const realQuestions: Question[] = names.map((_, index) => buildQuestion("real", index));
const fakeQuestions: Question[] = names.map((_, index) => buildQuestion("fake", index));

export const questions: Question[] = [...realQuestions, ...fakeQuestions];

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getShuffledQuestions(count = 10): Question[] {
  const half = Math.floor(count / 2);
  const selected = [
    ...shuffle(realQuestions).slice(0, count - half),
    ...shuffle(fakeQuestions).slice(0, half),
  ];

  return shuffle(selected);
}
