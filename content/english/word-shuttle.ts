import type { GameModule } from "../types";

/**
 * אנגלית: זיהוי מילים בסיסיות עם אימוג'י — תוכן בלבד.
 */
export const englishWordShuttle: GameModule = {
  id: "en-word-shuttle",
  slug: "english-word-shuttle",
  worldId: "english",
  title: "מעבורת המילים",
  tagline: "בוחרים את המילה הנכונה",
  learningGoal: "אוצר מילים באנגלית — הקשר בין תמונה (אימוג'י) למילה.",
  banks: {
    gentle: [
      {
        id: "g1",
        prompt: "Which word is 🐱 ?",
        direction: "ltr",
        correctChoiceId: "cat",
        choices: [
          { id: "cat", label: "cat", emoji: "🐱" },
          { id: "dog", label: "dog", emoji: "🐶" },
        ],
      },
      {
        id: "g2",
        prompt: "Which word is ☀️ ?",
        direction: "ltr",
        correctChoiceId: "sun",
        choices: [
          { id: "sun", label: "sun" },
          { id: "moon", label: "moon" },
          { id: "star", label: "star" },
        ],
      },
      {
        id: "g3",
        prompt: "Which word is 🍎 ?",
        direction: "ltr",
        correctChoiceId: "apple",
        choices: [
          { id: "apple", label: "apple" },
          { id: "book", label: "book" },
        ],
      },
      {
        id: "g4",
        prompt: "Which word is 🐠 ?",
        direction: "ltr",
        correctChoiceId: "fish",
        choices: [
          { id: "fish", label: "fish" },
          { id: "bird", label: "bird" },
          { id: "tree", label: "tree" },
        ],
      },
      {
        id: "g5",
        prompt: "Touch BLUE",
        direction: "ltr",
        correctChoiceId: "blue",
        choices: [
          { id: "blue", label: "blue" },
          { id: "red", label: "red" },
        ],
      },
    ],
    steady: [
      {
        id: "s1",
        prompt: "Which word is 🚌 ?",
        direction: "ltr",
        correctChoiceId: "bus",
        choices: [
          { id: "bus", label: "bus" },
          { id: "train", label: "train" },
          { id: "bike", label: "bike" },
          { id: "boat", label: "boat" },
        ],
      },
      {
        id: "s2",
        prompt: "Which word is 🏠 ?",
        direction: "ltr",
        correctChoiceId: "house",
        choices: [
          { id: "house", label: "house" },
          { id: "school", label: "school" },
          { id: "park", label: "park" },
          { id: "shop", label: "shop" },
        ],
      },
      {
        id: "s3",
        prompt: "Which word is happy 😊 ?",
        direction: "ltr",
        correctChoiceId: "happy",
        choices: [
          { id: "happy", label: "happy" },
          { id: "sad", label: "sad" },
          { id: "angry", label: "angry" },
          { id: "sleepy", label: "sleepy" },
        ],
      },
    ],
    spark: [
      {
        id: "p1",
        prompt: "Which word is 🦁 ? (animal)",
        direction: "ltr",
        correctChoiceId: "lion",
        choices: [
          { id: "lion", label: "lion" },
          { id: "tiger", label: "tiger" },
          { id: "rabbit", label: "rabbit" },
          { id: "mouse", label: "mouse" },
        ],
      },
      {
        id: "p2",
        prompt: "Which word is opposite of hot?",
        direction: "ltr",
        correctChoiceId: "cold",
        choices: [
          { id: "cold", label: "cold" },
          { id: "warm", label: "warm" },
          { id: "fast", label: "fast" },
          { id: "loud", label: "loud" },
        ],
      },
    ],
  },
};
