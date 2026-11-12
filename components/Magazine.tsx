/* eslint-disable @next/next/no-img-element -- photos are pre-optimised WebP and must load eagerly inside hidden flipbook pages */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import * as C from "@/lib/content";

type Tone = "paper" | "wine" | "slate" | "ink" | "dusk";
type Spec = { id?: string; tone: Tone; toc?: string; hard?: boolean; body: ReactNode };

const pad = (n: number) => String(n).padStart(2, "0");
const at = (id: string) => pad(PAGES.findIndex((p) => p.id === id));

function Img({ s, alt = "", className, style }: { s: string; alt?: string; className?: string; style?: CSSProperties }) {
  return <img src={`/photos/${s}.webp`} alt={alt} className={className} style={style} draggable={false} decoding="async" />;
}

function Clip({ s }: { s: string }) {
  return <video src={`/clips/${s}.mp4`} autoPlay muted loop playsInline preload="auto" />;
}

const Paras = ({ list }: { list: string[] }) => list.map((t, i) => <p key={i}>{t}</p>);

const Barcode = () => (
  <div className="barcode">
    <i />
    <span>05 · {C.ISSUE_YEAR} · priceless</span>
  </div>
);

function Cover() {
  return (
    <div className="cover">
      <Img s="elevator-selfie" className="cover__photo bw" alt="The two of us" />
      <div className="cover__top">
        <span>A personal edition</span>
        <span>Print run · one</span>
      </div>
      <h1 className="cover__mast">
        The Two <em>of</em> Us
      </h1>
      <div className="cover__badge pop" style={{ "--d": ".5s" } as CSSProperties}>
        <b>5</b>
        <span>years</span>
      </div>
      <ul className="cover__lines">
        <li className="lead">The five-year issue</li>
        <li>
          <b>{C.DAYS.toLocaleString("en-US")} days</b> of us — and counting
        </li>
       
      </ul>
      <div className="cover__foot">
        <span>
          Vol. 05 · {C.MONTH_NAME} {C.ISSUE_YEAR}
        </span>
        <Barcode />
      </div>
    </div>
  );
}

// One player for the whole issue: the opening song (started by the intro's "open" tap) and the playlist records share it,
// so tapping a record swaps the song instead of playing two at once.
let player: HTMLAudioElement | null = null;
export const music = () => (player ??= new Audio());

function Playlist() {
  const [playing, setPlaying] = useState<string | null>(null);
  useEffect(() => () => player?.pause(), []);

  const toggle = (song: string) => {
    const a = music();
    if (playing === song) {
      a.pause();
      return setPlaying(null);
    }
    a.src = `/songs/${song}.mp3`;
    a.loop = false;
    a.onended = () => setPlaying(null);
    a.play().catch(() => setPlaying(null));
    setPlaying(song);
  };

  return (
    <ul>
      {C.playlist.map((t) => (
        <li key={t.title}>
          <button
            type="button"
            className={`sleeve${playing === t.song ? " is-playing" : ""}`}
            onClick={() => toggle(t.song)}
            aria-label={`${playing === t.song ? "Pause" : "Play"} ${t.title}`}
          >
            <i className="vinyl" />
            <Img s={t.photo} />
            <svg className="sleeve__play" viewBox="0 0 24 24" aria-hidden>
              <path d={playing === t.song ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5v14l11-7z"} />
            </svg>
          </button>
          <div>
            <b>
              {t.title} — {t.artist}
            </b>
            <p>{t.note}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Calendar() {
  const first = new Date(C.START_YEAR, C.MONTH, 1).getDay();
  const days = new Date(C.START_YEAR, C.MONTH + 1, 0).getDate();
  const cells = [...Array<null>(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <div className="cal-page">
      <div className="cal">
        <div className="cal__rings">
          {Array.from({ length: 13 }, (_, i) => <i key={i} />)}
        </div>
        <span className="cal__year">{C.START_YEAR}</span>
        <h3 className="cal__month">{C.MONTH_NAME}</h3>
        <div className="cal__grid">
          {"SMTWTFS".split("").map((d, i) => <b key={i}>{d}</b>)}
          {cells.map((d, i) => (
            <span key={i} className={d === C.DAY ? "is-day" : undefined}>
              {d === C.DAY && <i className="pop" />}
              {d}
            </span>
          ))}
        </div>
        <p className="cal__note">the day it all began</p>
      </div>
    </div>
  );
}

const STATS: [number, string][] = [
  [5, "years"],
  [60, "months"],
  [C.DAYS, "days"],
  [C.DAYS * 24, "hours"],
  [50, "photos in this issue"],
  [1, "person I’d choose, every time"],
];

const EVERYDAY = ["peace", "pout", "towel", "glasses", "mirror", "dark-selfie", "panda-call", "helmet-shop", "red-jacket"];
const MOSAIC = ["basantapur-walk", "hearts", "nineteen", "lake", "neon", "peace", "bday-table", "school-snap", "boudha-bouquet", "elevator-mirror", "crew-night", "friday-12-aug"];
const PILE: [string, CSSProperties][] = [
  ["elevator-mirror", { left: "6%", top: "6%", width: "38%", rotate: "-7deg" }],
  ["street-selfie-2", { left: "11%", top: "33%", width: "40%", rotate: "5deg", "--ar": "4/3" } as CSSProperties],
  ["cafe-mirror-2", { left: "4%", top: "56%", width: "36%", rotate: "-3deg" }],
  ["peace", { left: "22%", bottom: "5%", width: "34%", rotate: "8deg" }],
];

// Back cover hearts drifting up: [left, size, duration, delay (negative = already mid-air), sideways drift]
const FLOAT: [string, string, string, string, string][] = [
  ["6%", "3cqw", "9s", "-3s", "5cqw"],
  ["15%", "2cqw", "11s", "-8s", "-4cqw"],
  ["27%", "4cqw", "10s", "-1s", "6cqw"],
  ["39%", "2.4cqw", "12s", "-6s", "-5cqw"],
  ["50%", "3.4cqw", "9.5s", "-4.5s", "4cqw"],
  ["61%", "2cqw", "11.5s", "-10s", "-3cqw"],
  ["72%", "4.6cqw", "10.5s", "-2s", "-6cqw"],
  ["83%", "2.6cqw", "9s", "-7s", "4cqw"],
  ["91%", "3.2cqw", "12.5s", "-5s", "-5cqw"],
  ["21%", "1.8cqw", "13s", "-11s", "3cqw"],
  ["66%", "1.6cqw", "12s", "0s", "-2cqw"],
  ["45%", "1.4cqw", "14s", "-12.5s", "2cqw"],
];

export const PAGES: Spec[] = [
  /* 00 — cover */
  {
    tone: "ink",
    hard: true,
    body: <Cover />,
  },
  /* 01 */
  {
    tone: "ink",
    body: (
      <div className="feature">
        <div className="feature__img">
          <Clip s="now-showing" />
        </div>
        <div className="feature__text">
          <p className="kicker">Now showing</p>
          <h2 className="feature__title">
            The Two <em>of</em> Us
          </h2>
          <p className="feature__meta">One screen, two seats, five years and still playing.</p>
        </div>
      </div>
    ),
  },
  /* 02 */
  {
    tone: "wine",
    toc: "Editor’s letter",
    body: (
      <div className="editor">
        <span className="editor__numeral">V</span>
        <div className="editor__col">
          <p className="kicker kicker--rule">Editor’s Letter</p>
          <p className="script editor__dear">Dear you,</p>
          <Paras list={C.editorsLetter} />
          <p className="script sign">— {C.SIGNATURE}</p>
        </div>
      </div>
    ),
  },
  /* 03 */
  { tone: "slate", toc: "Save the date", body: <Calendar /> },
  /* 04 */
  {
    tone: "paper",
    body: (
      <div className="stack">
        <div className="polaroid stack__ghost" style={{ rotate: "-9deg" }} />
        <div className="polaroid stack__ghost" style={{ rotate: "6deg" }} />
        <figure className="polaroid stack__front">
          <Img s="holding-hands" alt="Holding hands" />
          <figcaption>the first of many</figcaption>
        </figure>
        <p className="stack__note">One hand, held a little longer than necessary. That was the whole plan.</p>
      </div>
    ),
  },
  /* 05 */
  {
    tone: "paper",
    toc: "The moment we began",
    body: (
      <div className="chap">
        <span className="datestamp">
          {pad(C.DAY)}.{pad(C.MONTH + 1)}.{String(C.START_YEAR).slice(2)}
        </span>
        <p className="kicker">Chapter One · {C.START_YEAR}</p>
        <h2 className="script-title">The moment</h2>
        <p className="sub-title">we began</p>
        <div className="body dropcap chap__body">
          <Paras list={C.chapterOne} />
        </div>
        <div className="strip chap__strip">
          {["night-walk", "red-jacket", "masked"].map((s) => (
            <Img key={s} s={s} />
          ))}
        </div>
      </div>
    ),
  },
  /* 06 */
  {
    tone: "paper",
    body: (
      <div className="collage">
        <div className="phone" style={{ left: "7%", top: "6%", width: "36%", rotate: "-6deg" }}>
          <Img s="video-call" alt="A video call with a silly filter" />
        </div>
        <p className="hand" style={{ left: "6%", top: "71%", width: "40%", rotate: "-4deg" }}>
          lockdown calls &amp; one very fake beard
        </p>
        <figure className="taped" style={{ right: "8%", top: "7%", width: "36%", rotate: "5deg" }}>
          <Img s="butterflies" alt="" />
        </figure>
        <figure className="polaroid" style={{ right: "7%", bottom: "8%", width: "42%", rotate: "-3deg" }}>
          <Clip s="masked-hearts" />
          <figcaption>you, me &amp; a mask</figcaption>
        </figure>
        <span className="sticker pop" style={{ left: "40%", top: "44%", "--d": ".6s" } as CSSProperties}>
          bad wifi,
          <br />
          best calls
        </span>
      </div>
    ),
  },
  /* 07 */
  {
    id: "ch2",
    tone: "ink",
    toc: "Two kids in uniform",
    body: (
      <div className="feature">
        <Img s="basantapur" className="feature__img" alt="Us in school uniform at Basantapur" />
        <div className="feature__text">
          <p className="kicker">Chapter Two · 2022</p>
          <h2 className="feature__title">
            Two kids
            <br />
            <em>in uniform</em>
          </h2>
          <p className="feature__meta">Basantapur Durbar Square — 29.09.2022</p>
        </div>
      </div>
    ),
  },
  /* 08 */
  {
    tone: "paper",
    body: (
      <div className="g8">
        <figure className="g8__a">
          <Img s="school-snap" />
          <figcaption>School days were our days.</figcaption>
        </figure>
        <p className="g8__t dropcap">{C.chapterTwo}</p>
        <figure className="g8__b">
          <Img s="friday-12-aug" />
          <figcaption>Friday, 12 August 2022</figcaption>
        </figure>
        <figure className="g8__c">
          <Img s="basantapur-walk" />
          <figcaption>The walk back.</figcaption>
        </figure>
      </div>
    ),
  },
  /* 09 */
  {
    tone: "paper",
    toc: "To you",
    body: (
      <div className="toyou">
        <h2 className="script toyou__title">To you,</h2>
        <div className="body">
          <Paras list={C.toYou} />
        </div>
        <p className="toyou__end">Happy anniversary, my favourite person. I’m so glad it’s you.</p>
        <p className="script sign">— {C.SIGNATURE}</p>
        <figure className="toyou__fig">
          <Img s="street-selfie" className="bw" />
          <figcaption>06.06.2025 — squinting into the sun, together</figcaption>
        </figure>
      </div>
    ),
  },
  /* 10 */
  {
    tone: "paper",
    body: (
      <div className="quad">
        {["cheek-to-cheek", "hearts", "silhouette", "toy-shop"].map((s, i) => (
          <figure key={s}>
            <span>({i + 1})</span>
            <Img s={s} />
          </figure>
        ))}
      </div>
    ),
  },
  /* 11 */
  {
    tone: "paper",
    toc: "Growing up, together",
    body: (
      <div className="split">
        <Img s="thamel-lane" className="split__img" alt="A lane hung with prayer flags" />
        <div className="split__text">
          <p className="kicker">Chapter Three · 2023 — 2025</p>
          <h2 className="script-title">Growing up,</h2>
          <p className="sub-title">together</p>
          <div className="body">
            <Paras list={C.chapterThree} />
          </div>
          <figure className="split__fig">
            <Img s="bus-selfie" />
            <figcaption>15.01.2023</figcaption>
          </figure>
        </div>
      </div>
    ),
  },
  /* 12 */
  {
    tone: "ink",
    body: (
      <div className="reel">
        <p className="kicker">Moving pictures</p>
        <h2 className="reel__title">
          Some memories
          <br />
          <em>refuse to sit still.</em>
        </h2>
        <figure className="film film--wide">
          <Clip s="valentines-eve" />
          <figcaption>13.02.2025 — the night before Valentine’s</figcaption>
        </figure>
        <figure className="film film--tall">
          <Clip s="flower-crown" />
          <figcaption>07.03.2025 — flower crowns, zero shame</figcaption>
        </figure>
      </div>
    ),
  },
  /* 13 */
  {
    id: "calls",
    tone: "paper",
    toc: "Hours on the line",
    body: (
      <div className="collage">
        <div className="phone" style={{ left: "5%", top: "6%", width: "29%", rotate: "-6deg" }}>
          <Img s="call-hour" alt="A video call, one hour in" />
        </div>
        <div className="phone" style={{ left: "36%", top: "10%", width: "29%", rotate: "2deg" }}>
          <Img s="call-laugh" alt="You laughing on a video call" />
        </div>
        <div className="phone" style={{ right: "5%", top: "5%", width: "29%", rotate: "6deg" }}>
          <Img s="call-long" alt="A video call, two and a half hours in" />
        </div>
        <p className="hand" style={{ left: "7%", top: "74%", width: "58%", rotate: "-3deg" }}>
          one hour, then two and a half — and still nobody wanted to hang up first
        </p>
        <span className="sticker pop" style={{ right: "9%", bottom: "9%", "--d": ".6s" } as CSSProperties}>
          2:32:24
          <br />
          &amp; counting
        </span>
      </div>
    ),
  },
  /* 14 */
  {
    tone: "ink",
    body: (
      <div className="reel">
        <p className="kicker">31.05.2024</p>
        <h2 className="reel__title">
          And some days
          <br />
          <em>just deserve cake.</em>
        </h2>
        <figure className="film film--wide">
          <Clip s="cake-day" />
          <figcaption>31.05.2024 — cake, candles &amp; a rose</figcaption>
        </figure>
        <figure className="film film--tall">
          <Clip s="ring" />
          <figcaption>and this little ring</figcaption>
        </figure>
      </div>
    ),
  },
  /* 15 */
  {
    tone: "ink",
    toc: "Nineteen",
    body: (
      <div className="feature feature--top">
        <Img s="nineteen" className="feature__img" alt="A nineteenth birthday with golden balloons" />
        <div className="feature__text">
          <p className="kicker">Chapter Four · 22.05.2025</p>
          <h2 className="feature__script">Nineteen</h2>
        </div>
      </div>
    ),
  },
  /* 16 */
  {
    tone: "paper",
    body: (
      <div className="bday">
        <figure className="bday__main">
          <Img s="bday-couple-2" />
        </figure>
        <figure className="bday__hug">
          <Img s="bday-hug" />
        </figure>
        <figure className="polaroid bday__clip">
          <Clip s="birthday" />
          <figcaption>make a wish</figcaption>
        </figure>
        <p className="bday__text dropcap">{C.chapterFour}</p>
      </div>
    ),
  },
  /* 17 */
  {
    tone: "wine",
    toc: "Playlist of us",
    body: (
      <div className="playlist">
        <h2 className="playlist__title">
          Playlist <span>of us</span>
        </h2>
        <Playlist />
        <p className="playlist__foot">Press play on any of these and I’m right back there — with you.</p>
      </div>
    ),
  },
  /* 18 */
  {
    tone: "ink",
    body: (
      <div className="booth">
        <p className="booth__text">{C.photobooth}</p>
        <figure className="booth__bw">
          <Img s="bike-ride" className="bw" />
          <figcaption>the view from the back seat</figcaption>
        </figure>
        <div className="strip strip--wine booth__strip">
          {["street-selfie", "night-selfie", "street-selfie-2", "night-selfie-2"].map((s) => (
            <Img key={s} s={s} />
          ))}
        </div>
      </div>
    ),
  },
  /* 19 */
  {
    tone: "wine",
    toc: "Some moments stay",
    body: (
      <div className="heart-page">
        <div className="heart">
          <Img s="elevator-selfie" className="bw" alt="Us, the night of Boudha" />
        </div>
        <p className="heart-page__cap">Boudha · 15.11.2025</p>
      </div>
    ),
  },
  /* 20 */
  {
    tone: "paper",
    body: (
      <p className="bigquote">
        Time keeps{" "}
        <span className="chip">
          <Img s="boudha-bouquet" />
        </span>{" "}
        moving, but every moment with{" "}
        <span className="chip">
          <Img s="night-selfie-2" />
        </span>{" "}
        you stays <mark>right here.</mark>
      </p>
    ),
  },
  /* video wall, left */
  {
    tone: "ink",
    toc: "On repeat",
    body: (
      <div className="wall">
        <p className="kicker">Moving pictures · the outtakes</p>
        <h2 className="reel__title">
          Little moments,
          <br />
          <em>on repeat.</em>
        </h2>
        <div className="wall__grid">
          {["wall-forest", "wall-scooter", "wall-flowers", "wall-hands", "wall-tea", "wall-walk"].map((s) => (
            <Clip key={s} s={s} />
          ))}
        </div>
      </div>
    ),
  },
  /* video wall, right */
  {
    tone: "ink",
    body: (
      <div className="wall wall--b">
        <div className="wall__grid">
          {["wall-street", "wall-stars", "wall-masked", "wall-glasses", "wall-anniversary"].map((s) => (
            <Clip key={s} s={s} />
          ))}
        </div>
        <p className="script wall__foot">…and a thousand more I never filmed.</p>
      </div>
    ),
  },
  /* 21 */
  {
    tone: "ink",
    toc: "Now",
    body: (
      <div className="feature">
        <Img s="lake" className="feature__img" alt="Us at the lake" style={{ objectPosition: "62% 50%" }} />
        <div className="feature__text">
          <p className="kicker">Chapter Five · {C.ISSUE_YEAR}</p>
          <h2 className="feature__title feature__title--huge">Now</h2>
          <div className="feature__body">
            <Paras list={C.chapterFive} />
          </div>
        </div>
      </div>
    ),
  },
  /* 22 */
  {
    tone: "ink",
    body: (
      <div className="mosaic6">
        {["cafe-look", "neon", "cafe-mirror", "shoes", "neon-2", "crew-night"].map((s) => (
          <figure key={s}>
            <Img s={s} />
          </figure>
        ))}
        <p className="mosaic6__cap">None of these were taken to prove anything. I just never want to forget how it felt to be there, with you.</p>
      </div>
    ),
  },
  /* 23 */
  {
    id: "fav",
    tone: "paper",
    toc: "My favourite person",
    body: (
      <div className="fav">
        <h2 className="fav__title">
          My favourite
          <br />
          person
        </h2>
        <p className="fav__sub">
          Not for one reason.
          <br />
          For every reason. For being you.
        </p>
      </div>
    ),
  },
  /* 24 */
  {
    tone: "dusk",
    body: (
      <div className="oval-page">
        <div className="oval">
          <Img s="forest-hug" className="bw" alt="Us in the forest" />
        </div>
        {C.favourites.map((f, i) => (
          <span key={f} className={`note note--${i}`}>
            {f}
          </span>
        ))}
      </div>
    ),
  },
  /* 25 */
  {
    tone: "paper",
    toc: "By the numbers",
    body: (
      <div className="numbers">
        <p className="kicker">By the numbers</p>
        <h2 className="numbers__title">
          Five years, <em>counted</em>
        </h2>
        <dl>
          {STATS.map(([n, l]) => (
            <div key={l}>
              <dt>{n.toLocaleString("en-US")}</dt>
              <dd>{l}</dd>
            </div>
          ))}
        </dl>
        <p className="kicker numbers__kicker">The short version</p>
        <ol className="timeline">
          {C.timeline.map(([y, t]) => (
            <li key={y}>
              <b>{y}</b>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <p className="numbers__foot">* Figures unverified. Feelings fully audited.</p>
      </div>
    ),
  },
  /* 26 */
  {
    tone: "ink",
    body: (
      <div className="contact">
        <p className="kicker">Contact sheet</p>
        <h2 className="contact__title">The everyday edition</h2>
        <div className="contact__grid">
          {EVERYDAY.map((s, i) => (
            <figure key={s}>
              <Img s={s} />
              <span>{12 + i}A</span>
              {i === 1 && (
                <svg className="grease" viewBox="0 0 100 100" aria-hidden>
                  <path className="draw" pathLength={1} d="M52 4 C 18 3, 2 30, 6 56 C 10 86, 46 98, 74 90 C 98 80, 99 40, 86 20 C 76 6, 58 2, 40 8" />
                </svg>
              )}
            </figure>
          ))}
        </div>
        <p className="contact__cap">Unposed, unfiltered (mostly), entirely you. Circle your favourite — I already did.</p>
      </div>
    ),
  },
  /* 27 */
  {
    tone: "wine",
    toc: "Always you",
    body: (
      <div className="mount-page">
        <figure className="mount">
          <Img s="dashain" alt="You, in 2020" />
        </figure>
        <p className="mount__cap">
          Of all the people in all the world —<br />
          <em>it was always going to be you.</em>
        </p>
      </div>
    ),
  },
  /* 28 */
  {
    tone: "paper",
    body: (
      <div className="mosaic12">
        {MOSAIC.map((s) => (
          <Img key={s} s={s} />
        ))}
      </div>
    ),
  },
  /* 29 */
  {
    tone: "slate",
    toc: "Still choosing you",
    body: (
      <div className="choose">
        <figure className="choose__photo">
          <Img s="forest-back" className="bw" alt="Walking together in the forest" />
        </figure>
        <p className="choose__text">
          Five years later,
          <br />
          I’d still choose you.
          <br />
          <em>Every single time.</em>
        </p>
      </div>
    ),
  },
  /* 30 */
  {
    tone: "paper",
    body: (
      <div className="closing">
        {PILE.map(([s, style]) => (
          <figure key={s} className="polaroid" style={style}>
            <Img s={s} />
          </figure>
        ))}
        <div className="closing__text">
          <p className="script closing__hi">Happy anniversary,</p>
          <Paras list={C.closing} />
          <p className="script sign">— {C.SIGNATURE}</p>
        </div>
      </div>
    ),
  },
  /* 31 — back cover */
  {
    tone: "wine",
    hard: true,
    toc: "The last page",
    body: (
      <div className="back">
        <div className="back__float" aria-hidden>
          {FLOAT.map(([l, s, t, d, x], i) => (
            <i key={i} style={{ "--l": l, "--s": s, "--t": t, "--delay": d, "--x": x } as CSSProperties} />
          ))}
        </div>
        <span className="ink" style={{ "--d": ".3s" } as CSSProperties}>
          i
        </span>
        <span className="ink" style={{ "--d": "1.1s" } as CSSProperties}>
          love
        </span>
        <span className="ink" style={{ "--d": "1.9s" } as CSSProperties}>
          you
        </span>
        <svg className="back__heart" viewBox="0 0 100 100" aria-hidden>
          <path className="draw" pathLength={1} d="M50 86 C 20 64, 5 46, 13 26 C 20 10, 42 9, 50 29 C 57 9, 80 9, 87 26 C 95 46, 80 64, 50 86" />
        </svg>
        <p className="back__sign">— {C.SIGNATURE}</p>
        <span className="seal back__seal pop" style={{ "--d": "4.1s" } as CSSProperties}>
          <span>
            {pad(C.DAY)}·{pad(C.MONTH + 1)}
          </span>
        </span>
        <p className="back__dates">
          {pad(C.DAY)}.{pad(C.MONTH + 1)}.{C.START_YEAR} — {pad(C.DAY)}.{pad(C.MONTH + 1)}.{C.ISSUE_YEAR}
        </p>
        <p className="back__foot">The Two of Us · Vol. 05 · to be continued</p>
      </div>
    ),
  },
];
