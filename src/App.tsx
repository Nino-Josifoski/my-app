import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Music2,
  Sparkles,
  Heart,
  ChevronDown,
  Download,
  Navigation,
  PartyPopper,
  CheckCircle2,
  Phone,
  MessageCircleHeart,
  Users,
} from "lucide-react";

const EVENT_DATE = new Date("2026-08-01T11:30:00+02:00");
const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Restaurant+Ostrovo+Sveti+Naum+Ohrid";
const MUSIC_URL = "/music.mp3";
const scenicImage = "/svnaum.jpg";
const RSVP_ENDPOINT = "https://formsubmit.co/josifoski1401@hotmail.com";

const galleryImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80",
];

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type RsvpData = {
  name: string;
  attendance: string;
  guests: string;
  phone: string;
  message: string;
};

function formatCountdown(diffMs: number): Countdown {
  if (diffMs <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function Reveal({
  children,
  delay = 0,
  y = 28,
  amount = 0.2,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CountdownCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group rounded-[1.8rem] border border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,240,232,0.72))] px-5 py-7 text-center shadow-[0_22px_70px_rgba(70,52,36,0.10)] backdrop-blur-xl"
    >
      <div className="text-4xl font-semibold tracking-wide text-stone-800 transition duration-300 group-hover:scale-105 md:text-5xl">
        {value}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.42em] text-stone-500">{label}</div>
    </motion.div>
  );
}

function FloatingOrnaments() {
  const items = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${4 + ((i * 9) % 92)}%`,
        size: 8 + (i % 5) * 6,
        duration: 8 + (i % 6),
        delay: (i % 7) * 0.7,
        opacity: 0.12 + (i % 4) * 0.06,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: -80, opacity: 0, x: 0 }}
          animate={{
            y: [0, 220, 440, 760],
            x: [0, 14, -10, 8],
            opacity: [0, item.opacity, item.opacity, 0],
            rotate: [0, 10, -12, 18],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear",
          }}
          className="absolute top-0"
          style={{ left: item.left }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-amber-100/60 to-rose-200/50 blur-[1px]"
            style={{ width: item.size, height: item.size * 1.2 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 text-[11px] uppercase tracking-[0.45em] text-stone-500">{eyebrow}</div>
      <h2 className="font-display text-4xl text-stone-900 md:text-6xl">{title}</h2>
      {subtitle ? <p className="mt-5 text-base leading-8 text-stone-600 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -5 }}
        className="rounded-[1.7rem] border border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(249,244,238,0.86))] p-5 shadow-[0_20px_60px_rgba(61,44,29,0.08)]"
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg shadow-stone-900/15">
          {icon}
        </div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-stone-500">{label}</div>
        <div className="mt-2 text-lg font-medium text-stone-900">{value}</div>
      </motion.div>
    </Reveal>
  );
}

export default function NinoSimonaInvitation() {
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>(
    formatCountdown(EVENT_DATE.getTime() - Date.now())
  );
  const [rsvpData, setRsvpData] = useState<RsvpData>({
    name: "",
    attendance: "Ќе присуствувам",
    guests: "1",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1.08, 1]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(formatCountdown(EVENT_DATE.getTime() - Date.now()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0.24;

    if (playing) {
      audioRef.current.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  const handleOpen = () => {
    setOpened(true);
    setPlaying(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.24;
      audioRef.current.play().catch(() => {
        setPlaying(false);
      });
    }
  };

  const toggleMusic = () => setPlaying((prev) => !prev);

  const downloadICS = () => {
    const start = "20260801T113000";
    const end = "20260801T150000";

    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NinoSimona//Invitation//EN\nBEGIN:VEVENT\nUID:nino-simona-veridba-20260801@example.com\nDTSTAMP:20260326T000000Z\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Веридба - Нино и Симона\nLOCATION:Св. Наум - Ресторан Острово, Охрид\nDESCRIPTION:Веридба на Нино и Симона\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nino-simona-veridba.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRsvpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRsvpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setRsvpError("");

    const formData = new FormData();
    formData.append("Име и презиме", rsvpData.name);
    formData.append("Присуство", rsvpData.attendance);
    formData.append("Број на гости", rsvpData.guests);
    formData.append("Телефон", rsvpData.phone);
    formData.append("Порака", rsvpData.message);
    formData.append("_subject", "Нова RSVP потврда - Нино и Симона");
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const response = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Неуспешно испраќање.");

      setSent(true);
      setRsvpData({
        name: "",
        attendance: "Ќе присуствувам",
        guests: "1",
        phone: "",
        message: "",
      });
    } catch {
      setRsvpError("Настана проблем при испраќањето. Обиди се повторно.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap');

        html { scroll-behavior: smooth; }
        body { background: #f6f0ea; }

        .invitation-shell {
          font-family: 'Manrope', sans-serif;
        }

        .invitation-shell .font-display {
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: 0.02em;
        }

        .glass-ring::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(212,175,122,0.28), rgba(255,255,255,0.2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      <div className="invitation-shell min-h-screen overflow-x-hidden bg-[#f6f0ea] text-stone-800">
        <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.97),rgba(246,240,234,1)_42%,rgba(231,221,210,1))]" />
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="fixed left-0 right-0 top-0 z-[80] h-[3px] origin-left bg-[linear-gradient(90deg,#c18b43,#f5deb6,#a56a33)]"
        />

        <AnimatePresence>
          {!opened && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#e8dccd_0%,#f7f1ea_36%,#e4d0b1_100%)] px-6"
            >
              <FloatingOrnaments />

              <motion.div
                initial={{ y: 28, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="glass-ring relative w-full max-w-xl overflow-hidden rounded-[2.4rem] border border-[#f0dfbf]/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.68),rgba(250,244,236,0.42))] p-5 shadow-[0_35px_120px_rgba(72,48,29,0.22)] backdrop-blur-xl md:p-8"
              >
                <div className="relative rounded-[2rem] border border-[#ead7b4]/80 bg-[linear-gradient(180deg,#fffaf4,#f4eadc_58%,#eadcc9)] p-4 md:p-6">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,239,205,0.68),rgba(255,255,255,0)_42%)]" />

                  <motion.div
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: [0, 2, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative mx-auto mb-6 flex h-56 items-center justify-center overflow-hidden rounded-[1.9rem] border border-[#e8cf9c] bg-[linear-gradient(180deg,#fff9ee,#f2e2c5_56%,#e9d2aa)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_20px_50px_rgba(124,90,46,0.12)] md:h-72"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),rgba(255,255,255,0)_46%)]" />
                    <div className="relative text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="mb-4 flex justify-center text-[#b48a57]"
                      >
                        <Heart className="h-9 w-9 fill-current" />
                      </motion.div>
                      <div className="text-[11px] uppercase tracking-[0.42em] text-[#9f7b47]">Дигитална покана</div>
                      <h1 className="mt-4 font-display text-5xl text-stone-900 md:text-6xl">
                        <span className="bg-[linear-gradient(180deg,#7d5a2c_0%,#b9925f_55%,#e5c58e_100%)] bg-clip-text text-transparent">
                          Нино &amp; Симона
                        </span>
                      </h1>
                      <p className="mt-4 text-sm uppercase tracking-[0.34em] text-[#8d7351]">
                          01.08.2026 · 11:30
                      </p>
                    </div>
                  </motion.div>

                  <div className="text-center">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.45em] text-[#9f7b47]">Со љубов и радост</div>
                    <p className="mx-auto max-w-md text-sm leading-7 text-stone-600 md:text-base">
                      Со особена чест ве покануваме да бидете дел од денот што засекогаш ќе остане во нашите срца.
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleOpen}
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#9b7343,#6f4f2a)] px-8 py-3.5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(111,79,42,0.28)]"
                    >
                      Отвори покана
                      <Sparkles className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {opened && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.05 }}>
              <section id="hero" className="relative min-h-screen overflow-hidden px-6 pb-20 pt-24 md:px-10 lg:px-16">
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${scenicImage})`, scale: heroScale, y: heroY }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,11,0.22),rgba(28,19,11,0.44),rgba(22,14,8,0.78))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,231,186,0.30),rgba(255,255,255,0.01)_34%,rgba(0,0,0,0)_62%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,122,0.12),rgba(255,255,255,0.02),rgba(139,94,60,0.15))]" />
                <FloatingOrnaments />

                <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center">
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-4xl text-white"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18, duration: 0.7 }}
                      className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f1ddba]/40 bg-[linear-gradient(135deg,rgba(255,245,224,0.18),rgba(255,255,255,0.06))] px-4 py-2 text-[11px] uppercase tracking-[0.38em] text-[#fff5e3] backdrop-blur-md"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                      Веридба 2026
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22, duration: 0.85 }}
                      className="font-display text-6xl font-bold leading-[0.92] tracking-[0.03em] drop-shadow-[0_8px_30px_rgba(0,0,0,0.44)] md:text-8xl lg:text-[7.5rem]"
                    >
                      <span className="bg-[linear-gradient(180deg,#fffdf8_0%,#fff5e4_38%,#f3d29e_76%,#cf9950_100%)] bg-clip-text text-transparent">
                        Нино &amp; Симона
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.33, duration: 0.8 }}
                      className="mt-7 max-w-2xl text-xl font-medium leading-9 text-[#fffaf2] drop-shadow-[0_4px_14px_rgba(0,0,0,0.30)] md:text-2xl"
                    >
                      Со искрена радост ве покануваме да бидете дел од еден исклучително важен и незаборавен момент — почетокот на нашето заедничко поглавје.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.42, duration: 0.8 }}
                      className="mt-9 flex flex-wrap gap-3 text-[#fff7ea]"
                    >
                      {[
                        "01.08.2026",
                        "11:30 часот",
                        "Св. Наум · Охрид",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-full border border-[#f1ddba]/30 bg-[linear-gradient(135deg,rgba(255,248,236,0.16),rgba(255,255,255,0.07))] px-5 py-3 backdrop-blur-md"
                        >
                          {item}
                        </div>
                      ))}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.52, duration: 0.8 }}
                      className="mt-10 flex flex-wrap gap-4"
                    >
                      <motion.a
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="#details"
                        className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#fff9ee,#f2ddb9)] px-6 py-3.5 text-sm font-semibold text-stone-900 shadow-[0_12px_30px_rgba(212,175,122,0.18)]"
                      >
                        Погледни детали
                        <ChevronDown className="h-4 w-4" />
                      </motion.a>

                      <motion.button
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={downloadICS}
                        className="inline-flex items-center gap-2 rounded-full border border-[#f1ddba]/35 bg-[linear-gradient(135deg,rgba(255,248,236,0.15),rgba(255,255,255,0.05))] px-6 py-3.5 text-sm font-medium text-[#fff8ef] backdrop-blur-md"
                      >
                        Додај во календар
                        <Download className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-white/80 md:block"
                >
                  <ChevronDown className="h-7 w-7" />
                </motion.div>
              </section>

              <section className="relative z-10 -mt-20 px-6 md:px-10 lg:px-16">
                <div className="mx-auto grid max-w-6xl gap-4 rounded-[2.1rem] border border-white/50 bg-white/72 p-5 shadow-[0_24px_80px_rgba(61,44,29,0.12)] backdrop-blur-xl md:grid-cols-4 md:p-8">
                  <InfoCard icon={<CalendarDays className="h-5 w-5" />} label="Датум" value="01.08.2026" />
                  <InfoCard icon={<Clock3 className="h-5 w-5" />} label="Време" value="11:30 часот" delay={0.06} />
                  <InfoCard icon={<MapPin className="h-5 w-5" />} label="Локација" value="Св. Наум, Охрид" delay={0.12} />
                  <InfoCard icon={<PartyPopper className="h-5 w-5" />} label="Ресторан" value="Острово" delay={0.18} />
                </div>
              </section>

              <section id="details" className="px-6 py-28 md:px-10 lg:px-16">
                <div className="mx-auto max-w-6xl">
                  <Reveal>
                    <SectionTitle
                      eyebrow="Одбројување"
                      title="Сè поблиску до нашиот ден"
                      subtitle="Ден што го очекуваме со возбуда – исполнет со топлина, блискост и природна убавина."
                    />
                  </Reveal>

                  <div className="mt-14 grid gap-4 md:grid-cols-4">
                    <Reveal delay={0.04}><CountdownCard value={countdown.days} label="денови" /></Reveal>
                    <Reveal delay={0.08}><CountdownCard value={countdown.hours} label="часа" /></Reveal>
                    <Reveal delay={0.12}><CountdownCard value={countdown.minutes} label="минути" /></Reveal>
                    <Reveal delay={0.16}><CountdownCard value={countdown.seconds} label="секунди" /></Reveal>
                  </div>
                </div>
              </section>

              <section className="px-6 pb-24 md:px-10 lg:px-16">
                <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                  <Reveal>
                    <div className="glass-ring relative overflow-hidden rounded-[2.2rem] border border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,240,232,0.82))] p-8 shadow-[0_24px_80px_rgba(61,44,29,0.10)] backdrop-blur-md md:p-10">
                      <div className="mb-4 text-[11px] uppercase tracking-[0.36em] text-stone-500">Нашиот ден</div>
                      <h3 className="font-display text-4xl text-stone-900 md:text-5xl">Свеченост покрај езеро, природа и мир</h3>
                      <p className="mt-6 text-base leading-8 text-stone-600 md:text-lg">
                        На <strong>01 август 2026</strong>, со почеток во <strong>11:30 часот</strong>, ќе го прославиме нашиот посебен момент во прекрасниот амбиент на <strong>Ресторан Острово</strong>, Св. Наум, Охрид.
                      </p>
                      <p className="mt-4 text-base leading-8 text-stone-600 md:text-lg">
                        Сакавме покана што не само што информира, туку создава чувство — нежно, свечено и современо искуство што ќе го почувствувате уште од првиот клик.
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.4rem] border border-stone-200/80 bg-white/70 p-5">
                          <div className="mb-2 flex items-center gap-2 text-stone-900">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Локација со посебен шарм</span>
                          </div>
                          <p className="text-sm leading-7 text-stone-600">Амбиент што носи мир, убавина и свечена атмосфера за овој значаен ден.</p>
                        </div>
                        <div className="rounded-[1.4rem] border border-stone-200/80 bg-white/70 p-5">
                          <div className="mb-2 flex items-center gap-2 text-stone-900">
                            <Sparkles className="h-5 w-5" />
                            <span className="font-medium">Премиум дигитална покана</span>
                          </div>
                          <p className="text-sm leading-7 text-stone-600">Дизајнирана да изгледа елегантно, современо и доволно посебно за повод како овој.</p>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-4">
                        <motion.a
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={MAP_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-medium text-white"
                        >
                          Отвори локација
                          <Navigation className="h-4 w-4" />
                        </motion.a>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="glass-ring relative overflow-hidden rounded-[2.2rem] border border-stone-200/70 bg-white/70 shadow-[0_24px_80px_rgba(61,44,29,0.10)] backdrop-blur-md"
                    >
                      <div className="relative h-full min-h-[500px] overflow-hidden">
                        <motion.img
                          src={galleryImages[0]}
                          alt="Elegant engagement mood"
                          className="h-full w-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.8 }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,18,13,0.04),rgba(25,18,13,0.62))]" />
                        <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10">
                          <div className="text-[11px] uppercase tracking-[0.36em] text-white/75">Атмосфера</div>
                          <div className="mt-3 font-display text-4xl">Елеганција што се чувствува</div>
                          <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 md:text-base">
                            Секој детал е замислен да изгледа современо, луксузно и беспрекорно — како покана за ден што навистина значи многу.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                </div>
              </section>

              <section className="px-6 pb-24 md:px-10 lg:px-16">
                <div className="mx-auto max-w-6xl">
                  <Reveal>
                    <SectionTitle
                      eyebrow="RSVP"
                      title="Потврдете го вашето присуство"
                      subtitle="Ќе ни биде чест да знаеме дека ќе бидете дел од нашиот посебен ден."
                    />
                  </Reveal>

                  <div className="mt-12 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
                    <Reveal>
                      <div className="glass-ring relative rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,240,232,0.82))] p-8 shadow-[0_24px_80px_rgba(61,44,29,0.10)] backdrop-blur-md md:p-9">
                        <div className="space-y-6">
                          <div>
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white">
                              <Users className="h-5 w-5" />
                            </div>
                            <h3 className="font-display text-3xl text-stone-900">Вашиот одговор ни значи многу</h3>
                            <p className="mt-4 text-base leading-8 text-stone-600">
                              Ве молиме одвојте неколку секунди и потврдете го вашето присуство за да можеме сè да подготвиме со љубов и внимание.
                            </p>
                          </div>

                          <div className="space-y-4 rounded-[1.4rem] border border-stone-200/80 bg-white/70 p-5">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 text-stone-900" />
                              <p className="text-sm leading-7 text-stone-600">Пополнете го името и изберете дали ќе присуствувате.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <Phone className="mt-0.5 h-5 w-5 text-stone-900" />
                              <p className="text-sm leading-7 text-stone-600">Можете да оставите и телефон за полесна координација.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <MessageCircleHeart className="mt-0.5 h-5 w-5 text-stone-900" />
                              <p className="text-sm leading-7 text-stone-600">Додадете кратка порака доколку сакате.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reveal>

                    <Reveal delay={0.08}>
                      <div className="glass-ring relative rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,240,232,0.84))] p-8 shadow-[0_24px_80px_rgba(61,44,29,0.10)] backdrop-blur-md md:p-9">
                        {sent ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-[1.5rem] border border-green-200 bg-green-50 px-6 py-7 text-center text-green-700"
                          >
                            <CheckCircle2 className="mx-auto mb-3 h-8 w-8" />
                            <div className="text-lg font-semibold">Ви благодариме!</div>
                            <p className="mt-2 text-sm leading-7">Вашата потврда е успешно испратена. Со нетрпение ве очекуваме.</p>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleRsvpSubmit} className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                name="name"
                                placeholder="Име и презиме"
                                value={rsvpData.name}
                                onChange={handleRsvpChange}
                                required
                                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-800 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                              />
                            </div>

                            <div>
                              <select
                                name="attendance"
                                value={rsvpData.attendance}
                                onChange={handleRsvpChange}
                                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-800 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                              >
                                <option value="Ќе присуствувам">Ќе присуствувам</option>
                                <option value="Нема да присуствувам">Нема да присуствувам</option>
                              </select>
                            </div>

                            <div>
                              <select
                                name="guests"
                                value={rsvpData.guests}
                                onChange={handleRsvpChange}
                                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-800 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                              >
                                <option value="1">1 гостин</option>
                                <option value="2">2 гости</option>
                                <option value="3">3 гости</option>
                                <option value="4">4 гости</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <input
                                type="text"
                                name="phone"
                                placeholder="Телефон"
                                value={rsvpData.phone}
                                onChange={handleRsvpChange}
                                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-800 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <textarea
                                name="message"
                                placeholder="Порака"
                                value={rsvpData.message}
                                onChange={handleRsvpChange}
                                rows={5}
                                className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-800 outline-none transition focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                              />
                            </div>

                            {rsvpError ? <div className="md:col-span-2 text-sm text-red-600">{rsvpError}</div> : null}

                            <div className="md:col-span-2 pt-1">
                              <motion.button
                                whileHover={{ y: -2, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={sending}
                                className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#111111,#2c2c2c)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,17,17,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {sending ? "Се испраќа..." : "Испрати потврда"}
                              </motion.button>
                            </div>
                          </form>
                        )}
                      </div>
                    </Reveal>
                  </div>
                </div>
              </section>

              <section className="px-6 pb-24 md:px-10 lg:px-16">
                <div className="mx-auto max-w-6xl">
                  <Reveal>
                    <SectionTitle
                      eyebrow="Визуелна атмосфера"
                      title="Дизајн со карактер"
                      subtitle="Дел од атмосферата која ќе ја споделиме – исполнета со природна убавина, нежни детали и искрени моменти."
                    />
                  </Reveal>

                  <div className="mt-14 grid gap-5 md:grid-cols-2">
                    {galleryImages.map((image, index) => (
                      <Reveal key={image} delay={index * 0.06}>
                        <motion.div
                          whileHover={{ y: -8 }}
                          className="glass-ring group relative overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white/70 shadow-[0_24px_60px_rgba(61,44,29,0.08)]"
                        >
                          <div className="relative h-[300px] overflow-hidden md:h-[360px]">
                            <motion.img
                              src={image}
                              alt={`Invitation gallery ${index + 1}`}
                              className="h-full w-full object-cover"
                              whileHover={{ scale: 1.06 }}
                              transition={{ duration: 0.85 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                          </div>
                        </motion.div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>

              <section className="px-6 pb-28 md:px-10 lg:px-16">
                <Reveal>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-ring relative mx-auto max-w-5xl rounded-[2.8rem] border border-stone-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(247,240,232,0.96))] px-8 py-16 text-center shadow-[0_34px_100px_rgba(61,44,29,0.10)] backdrop-blur-md md:px-14"
                  >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-stone-500">
                      <Heart className="h-4 w-4 fill-current text-stone-700" />
                      Со нетрпение ве очекуваме
                    </div>
                    <h3 className="font-display text-4xl text-stone-900 md:text-6xl">Нека љубовта го осветли денот</h3>
                    <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
                      Ви благодариме што ќе бидете дел од овој незаменлив момент. Вашето присуство ќе му даде уште поголема топлина, радост и убавина на денот што ќе го паметиме засекогаш.
                    </p>

                    <div className="mt-9 flex flex-wrap justify-center gap-4">
                      <motion.a
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={MAP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-medium text-white"
                      >
                        Локација
                        <MapPin className="h-4 w-4" />
                      </motion.a>

                      <motion.button
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={downloadICS}
                        className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-medium text-stone-800"
                      >
                        Преземи календар покана
                        <Download className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </Reveal>
              </section>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={toggleMusic}
                className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/85 px-4 py-3 text-sm font-medium text-stone-800 shadow-xl backdrop-blur-xl"
              >
                <Music2 className="h-4 w-4" />
                {playing ? "Музика ON" : "Музика OFF"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
