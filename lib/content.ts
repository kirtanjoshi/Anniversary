// Everything personal lives here — edit the words, the magazine follows.

// Anniversary date (YYYY-MM-DD). Calendar page + numbers page use it.
export const ANNIVERSARY = "2021-11-13";
export const SIGNATURE = "Yours, always";

const start = new Date(ANNIVERSARY + "T00:00:00");
const fifth = new Date(start);
fifth.setFullYear(start.getFullYear() + 5);
export const DAYS = Math.round((+fifth - +start) / 86_400_000);
export const START_YEAR = start.getFullYear();
export const ISSUE_YEAR = fifth.getFullYear();
export const MONTH_NAME = start.toLocaleString("en-US", { month: "long" });
export const MONTH = start.getMonth();
export const DAY = start.getDate();

export const editorsLetter = [
  "Five years ago I had no idea that one ordinary day would quietly rearrange my whole life. I only knew I wanted to keep talking to you.",
  "So I made this — a small magazine with a print run of exactly one, for exactly one reader. Inside are the pages of us: the school-uniform days, the bad-signal video calls, the birthdays, the long rides, the slow walks, and all the little nothings that somehow became everything.",
  "Turn the pages slowly. Every one of them is yours.",
];

export const chapterOne = [
  "It started the way the best things do — without asking permission. A conversation that didn’t want to end, then another, then a habit I never wanted to break.",
  "Those were the masked-up, stay-at-home days. Our whole world fit on a phone screen: a slow connection, a hundred silly filters, and your voice on the other end. Somehow that was enough. More than enough.",
  "I didn’t know it yet, but I was already saving you a seat in every plan I would ever make.",
];

export const chapterTwo =
  "Ties a little crooked, shoes a little dusty, pigeons everywhere. Two kids in school uniform standing in front of temples that had seen centuries — and all I remember thinking is that the view next to me was the better one.";

export const toYou = [
  "I don’t say it enough, so let me put it in print where it can’t be taken back: thank you.",
  "For the patience on my worst days and the loud laughter on my best ones. For voice notes that were longer than they needed to be. For listening when I didn’t make sense, and for staying even when staying wasn’t the easy thing to do.",
  "You make the ordinary feel worth remembering — a walk, a ride, a plate we split down the middle. You make me want to be kinder, braver, better.",
  "I’m proud of us. We grew up side by side without ever growing apart. We haven’t figured everything out, and that’s okay — I’d rather work it out with you than have every answer alone.",
];

export const chapterThree = [
  "Somewhere along the way the school bags disappeared. Exams came and went, plans got bigger, and the city slowly turned into our map — narrow lanes, prayer flags, the back seat of a bus, little cafés we pretended were ours.",
  "We changed a lot in these years. The one thing that never changed was where I wanted to be: right next to you.",
];

export const chapterFour =
  "Golden balloons, a cake, and you in the middle of it all, trying not to smile too wide for the camera — and failing beautifully. Nineteen looked good on you. Then came the long rides, a forest walk in June, and a November night at Boudha with flowers in your arms.";

// Tap a record to play public/songs/<song>.mp3.
export const playlist = [
  { title: "Perfect", artist: "Ed Sheeran", song: "perfect", photo: "holding-hands", note: "Cliché? Maybe. True? Completely. This one will always sound like slow-dancing in a kitchen we don’t own yet." },
  { title: "Sarangi", artist: "Sushant KC", song: "sarangi", photo: "street-selfie", note: "The one that plays in my head every time you laugh at something that wasn’t even that funny." },
  { title: "Until I Found You", artist: "Stephen Sanchez", song: "until-i-found-you", photo: "lake", note: "Because before you, I didn’t even know what I was looking for." },
  { title: "Hataarindai, Bataasindai", artist: "Sajjan Raj Vaidya", song: "hataarindai", photo: "call-long", note: "For all the nights on a bad connection, waiting. Patience became the title of our story — and you were always worth the wait." },
];

export const photobooth =
  "We’ve collected more blurry selfies than either of us would admit. Too close, too bright, someone always mid-blink. They’re my favourite kind of photo — the ones that weren’t trying to be perfect, just trying to keep a moment.";

export const chapterFive = [
  "Five years in, and it still feels new in all the ways that matter. A lake in the hills in January. Late cafés that smell like coffee and rain. Neon signs, good friends, and your hand finding mine without either of us looking.",
  "This is the chapter we’re writing right now — and I don’t want to skip a single page.",
];

export const favourites = [
  "Favourite laugh",
  "Favourite voice at 2 a.m.",
  "Favourite hand to hold",
  "Favourite hello",
  "Favourite person to do nothing with",
  "Favourite place — next to you",
];

// One line per year for the timeline on the numbers page.
export const timeline: [number, string][] = [
  [START_YEAR, "the first hello"],
  [START_YEAR + 1, "school uniforms"],
  [START_YEAR + 2, "prayer flags"],
  [START_YEAR + 3, "growing up"],
  [START_YEAR + 4, "nineteen"],
  [START_YEAR + 5, "still us"],
];

export const closing = [
  "This magazine has a print run of one, and it will never sell out — there is only one reader it was ever made for.",
  "If you’ve reached this page, thank you for flipping through five years with me, and for being the best part of every single one of them.",
  "Happy anniversary, my love. Here’s to the next issue — and every one after that.",
];
