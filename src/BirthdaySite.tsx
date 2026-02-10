
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

type Heart = { id: number; left: number };

const BirthdaySite: React.FC = () => {
  const [showTeddyMessage, setShowTeddyMessage] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [popMessage, setPopMessage] = useState('');
  const [hearts, setHearts] = useState<Heart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const birthDate = new Date(2007, 10, 20);
  const [daysAlive, setDaysAlive] = useState<number>(0);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const gallery = [
    '/assets/ourfirstpic.jpg',
    '/assets/2nd_pic.jpg',
    '/assets/3rdpic.jpg',
    '/assets/4thpic.jpg',
    '/assets/7thpic.jpg',
    '/assets/6thpic.jpg',
  ];

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      setDaysAlive(diffDays >= 0 ? diffDays : 0);

      const year = (now.getMonth() > birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() > birthDate.getDate()))
        ? now.getFullYear() + 1
        : now.getFullYear();
      const next = new Date(year, birthDate.getMonth(), birthDate.getDate(), 0, 0, 0);
      const diff = Math.max(0, next.getTime() - now.getTime());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown({ d, h, m, s });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [birthDate]);

  useEffect(() => {
    const id = setInterval(() => {
      setHearts(h => [...h, { id: Date.now(), left: Math.random() * 92 }].slice(-6));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn && started) {
      audioRef.current.play().catch(() => { });
    } else {
      audioRef.current.pause();
    }
  }, [musicOn, started]);

  const balloonMessages = [
    "I love you so much Bujuku😘",
    "You make my world brighter 💗",
    "You’re the best thing that ever happened to me 😚💞",
    "Happy 18th, My love 💗🎀",
    "You + me = ❤️",
    "Thank you for being the reason my life feels beautifully meant 🌸",
  ];

  const [popIndex, setPopIndex] = useState(0);

  function popBalloon() {
    // pick messages in order and loop through them
    const msg = balloonMessages[popIndex];
    setPopIndex(i => (i + 1) % balloonMessages.length);
    setPopMessage(msg);
    setShowMessagePopup(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3300);
  }

  function blowCandles() {
    if (!candlesLit) return;
    setCandlesLit(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  }

  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    gallery.forEach(s => { const i = new Image(); i.src = s; });
    const p = new Image(); p.src = '/assets/Her_portrait.jpg';
  }, []);

  // Lightbox keyboard navigation and escape/backspace handling
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!popupImage) return;
      if (e.key === 'Escape' || e.key === 'Backspace') {
        setPopupImage(null);
        setLightboxIndex(-1);
        return;
      }
      if (e.key === 'ArrowRight') {
        const nxt = (lightboxIndex + 1) % gallery.length;
        setLightboxIndex(nxt);
        setPopupImage(gallery[nxt]);
      }
      if (e.key === 'ArrowLeft') {
        const prev = (lightboxIndex - 1 + gallery.length) % gallery.length;
        setLightboxIndex(prev);
        setPopupImage(gallery[prev]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [popupImage, lightboxIndex, gallery]);

  const handleStart = () => {
    setStarted(true);
    setMusicOn(true);
    setTimeout(() => setIntroVisible(false), 1200);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFF1F8] to-[#FFC6E5] text-gray-900 antialiased">
      <audio ref={audioRef} src="/assets/flute_bg.mp3" loop />

      {/* Floating hearts background (uses `hearts` state generated in useEffect) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {hearts.map(h => (
          <motion.div
            key={h.id}
            initial={{ y: 20, opacity: 0.95, scale: 0.95 }}
            animate={{ y: -260, opacity: 0 }}
            transition={{ duration: 4.2, ease: 'easeOut' }}
            style={{ left: `${h.left}%` }}
            className="absolute bottom-0 text-2xl md:text-3xl"
          >
            <span className="text-pink-800 drop-shadow-lg">💗</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {introVisible && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFEAF2] to-[#FFD1E6] opacity-95" />
            <div className="relative z-10 px-6 py-8 max-w-2xl w-[92%] text-center rounded-2xl bg-white/60 backdrop-blur-sm shadow-2xl">
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-4xl md:text-5xl font-bold text-[#FF5CA2] tracking-tight">
                Happy Birthday, <span className="text-pink-600">Divya</span> 💖
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.95 }} transition={{ delay: 0.25 }} className="mt-4 text-gray-700">
                A tiny website for a big heart💫. Tap around — there are little surprises hidden all over. 😚💖
              </motion.p>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button onClick={handleStart} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF8DBE] to-[#FF5CA2] text-white font-semibold shadow-lg hover:scale-[1.03] transition btn-glow">
                  Start & Play Music
                </button>
                <button onClick={() => setIntroVisible(false)} className="px-4 py-2 rounded-full bg-white border border-pink-200 text-pink-600 shadow btn-glow">
                  Skip
                </button>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                <div>Born: <strong className="text-gray-800">20 November 2007</strong></div>
                <div className="mt-1">Days alive: <strong>{daysAlive}</strong></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${introVisible ? 'pointer-events-none opacity-40' : 'opacity-100'} transition-all relative z-10`}>
        <header className="max-w-5xl mx-auto py-6 px-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#FF6AA5]">Happy Birthday — Divi</h2>
            <p className="text-sm text-gray-700 mt-1">Made with ❤️ — A small surprise for you</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setMusicOn(m => !m); setStarted(true); }} className="px-3 py-2 rounded-full bg-white/80 text-sm shadow-sm btn-glow">
              {musicOn ? 'Music On' : 'Music Off'}
            </button>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="px-3 py-2 rounded-full bg-pink-100 text-sm shadow-sm btn-glow">
              Surprise ❤️
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 pb-20">
          <section className="bg-white/60 backdrop-blur rounded-2xl p-6 md:p-8 shadow-md grid md:grid-cols-2 gap-6 items-center">
            <div>
              <motion.h3 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-2xl md:text-3xl font-bold">
                Happy , <span className="text-[#FF5CA2]">Divya</span>
              </motion.h3>
              <p className="mt-3 text-gray-700">A tiny website for a big heart — tap around to find little surprises.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => setShowEnvelope(true)} className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8DBE] to-[#FF5CA2] text-white shadow btn-glow">Open My Letter</button>
                <button onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })} className="px-4 py-2 rounded-full bg-white border btn-glow">See Gallery</button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 max-w-xs">
                <div className="bg-white p-3 rounded-lg shadow text-center">
                  <div className="text-lg font-bold text-[#FF5CA2]">{daysAlive}</div>
                  <div className="text-xs text-gray-500">Days alive</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow text-center">
                  <div className="text-lg font-bold text-[#FF5CA2]">18</div>
                  <div className="text-xs text-gray-500">Years</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow text-center">
                  <div className="text-lg font-bold text-[#FF5CA2]">∞</div>
                  <div className="text-xs text-gray-500">Love</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <motion.div drag dragConstraints={{ top: -8, bottom: 8, left: -8, right: 8 }} className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-50 to-pink-100 p-2 relative z-20">
                <img src="/assets/5thpic.jpg" alt="Divya portrait" className="w-full h-full object-cover rounded-xl object-[center_48%]" />
              </motion.div>
            </div>
          </section>

          <section id="gallery" className="mt-8">
            <h4 className="text-xl font-semibold text-gray-800">✨Our Moments✨</h4>
            <p className="text-sm text-gray-600 mt-1">Tap images to enlarge ✨</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {gallery.map((g, i) => (
                <motion.div key={g} whileHover={{ scale: 1.02 }} onClick={() => { setPopupImage(g); setLightboxIndex(i); }} className="rounded-lg overflow-hidden shadow cursor-pointer card-glow">
                  <img src={g} alt={`photo-${i}`} className="w-full h-40 object-cover" />
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-8 bg-white/60 p-4 rounded-xl shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h5 className="text-lg font-semibold text-[#FF5CA2]">Cake & Surprise</h5>
                <p className="text-sm text-gray-600">Make a wish and blow the candles 🎂</p>
              </div>
              <div className="flex gap-2">
                <button onClick={blowCandles} className="px-3 py-2 rounded-full bg-pink-100 btn-glow">Blow Candles</button>
                <button onClick={popBalloon} className="px-3 py-2 rounded-full bg-[#FF5CA2] text-white btn-glow">Pop Balloon</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex items-center justify-center">
                <div className="w-56 h-40 flex items-end justify-center relative">
                  {/* Plate */}
                  <div className="absolute bottom-1 w-52 h-3 bg-gray-100 rounded-full shadow-md" />

                  <div className="relative z-10 w-full flex flex-col items-center">
                    {/* Top tier */}
                    <div className="relative w-36 h-10 bg-pink-300 rounded-t-lg shadow-inner overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-2xl font-bold text-white">18</div>
                      </div>
                      {/* Top frosting drip */}
                      <div className="absolute -bottom-3 left-4 right-4 h-5 bg-white rounded-b-full" />
                    </div>

                    {/* Bottom tier */}
                    <div className="relative w-44 h-14 bg-pink-500 rounded-b-lg mt-1 shadow-lg overflow-hidden">
                      {/* Frosting seam */}
                      <div className="absolute -top-4 left-6 right-6 h-6 bg-pink-200 rounded-b-full" />
                      {/* Sprinkles */}
                      <div className="absolute inset-0 pointer-events-none">
                        <span className="block absolute left-6 top-6 w-1 h-1 bg-yellow-300 rounded-full" />
                        <span className="block absolute left-14 top-4 w-1 h-1 bg-white rounded-full" />
                        <span className="block absolute left-24 top-7 w-1 h-1 bg-yellow-200 rounded-full" />
                        <span className="block absolute left-32 top-5 w-1 h-1 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Candles row (positioned above the top tier) */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-3">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="relative flex flex-col items-center">
                          <div className="w-1.5 h-7 bg-white rounded-sm border border-yellow-200" />
                          {candlesLit && (
                            <span className="absolute -top-3 text-xs animate-pulse" aria-hidden>🔥</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <button key={i} onClick={popBalloon} className="p-3 bg-pink-50 rounded-lg btn-glow">🎈</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-[#FF5CA2]">{countdown.d}</div>
              <div className="text-sm text-gray-500">Days until next birthday</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-[#FF5CA2]">{countdown.h}</div>
              <div className="text-sm text-gray-500">Hours</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-[#FF5CA2]">{countdown.m}:{String(countdown.s).padStart(2, "0")}</div>
              <div className="text-sm text-gray-500">Min : Sec</div>
            </div>
          </section>

          <section className="mt-12 text-center py-12 bg-gradient-to-b from-white/60 to-pink-50 rounded-2xl shadow-lg">
            <motion.h4 className="text-3xl font-extrabold" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>Forever Yours Bae❤️</motion.h4>
            <p className="mt-3 text-gray-700">Leave a short message.</p>
            <motion.div whileTap={{ scale: 0.98 }} className="mt-6 inline-block">
              <button onClick={() => setShowMessageBox(true)} className="px-6 py-3 rounded-full bg-[#FF8DBE] text-white shadow btn-glow">Send Love</button>
            </motion.div>
          </section>
          {/* Super Cute Doodle (GIF version) */}
          <div className="mt-10 flex flex-col items-center justify-center">
            <div
              className="relative cursor-pointer"
              onClick={() => setShowConfetti(true)}
            >
              <img
                src="/assets/kiss_bears.gif"
                alt="cute bears"
                className="w-56 h-auto drop-shadow-lg"
              />

              {/* Floating hearts */}
              <motion.div
                animate={{ y: [-6, -14, -6], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="absolute left-1/2 top-0 text-3xl"
              >
                ❤️
              </motion.div>

              {/* Speech bubble */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 
      bg-white px-3 py-1 rounded-full shadow text-sm border">
                mwah!
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              This is us… always sweet, always close 💕
            </p>
          </div>

        </main>
        {/* Promise Wall */}
        <section className="mt-12 bg-white/70 backdrop-blur rounded-2xl p-6 shadow-md">
          <h3 className="text-2xl font-bold text-center text-[#FF5CA2] mb-4">My Promises to You ❤️</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-xl shadow promise-glow">
              <p className="text-gray-700">I promise to choose you, in small ways, every day.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow promise-glow">
              <p className="text-gray-700">I promise to protect your smile like it’s my treasure.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow promise-glow">
              <p className="text-gray-700">I promise to stay gentle, patient, and yours always.</p>
            </div>
          </div>
        </section>
        {/* Drag-to-Reveal Teddy Surprise */}
        <section className="mt-12 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#FF5CA2] mb-3">Drag the bear - 🧸</h3>

          <motion.div
            drag
            dragConstraints={{ top: -30, bottom: 30, left: -30, right: 30 }}
            onDragEnd={() => setShowTeddyMessage(true)}
            className="w-32 h-32 rounded-full shadow-lg bg-pink-100 flex items-center justify-center cursor-grab"
          >
            <span className="text-5xl">🧸</span>
          </motion.div>

          {showTeddyMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-md text-gray-700 text-center"
            >
              I loves you more than you think sweetie❤️
            </motion.p>
          )}
        </section>

        <footer className="py-6 text-center text-sm text-gray-600">Made with ❤️ — for Divi wifeyy✨</footer>
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={document.documentElement.scrollHeight}
            numberOfPieces={350}
            recycle={false}
            gravity={0.25}
            wind={0.01}
          />
        )}


        <AnimatePresence>
          {showMessagePopup && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
                <div className="text-xl font-semibold">{popMessage || 'You are my favourite person 💗'}</div>
                <p className="text-sm text-gray-600 mt-3">A little note just for you.</p>
                <div className="mt-4">
                  <button onClick={() => setShowMessagePopup(false)} className="px-4 py-2 rounded-full bg-[#FF8DBE] text-white btn-glow">Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEnvelope && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-xl w-[92%]">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold">A Letter For You 💌</h4>
                  <button onClick={() => setShowEnvelope(false)} className="text-gray-500 btn-glow">✕</button>
                </div>
                <div className="mt-4">
                  <p className="text-gray-800">My dearest Divya,</p>
                  <p className="mt-3 text-gray-700">I still remember the first time I saw you — your smile lit up everything. On your 18th, I wish you endless happiness, silly giggles, and dreams that never stop growing. Thank you for everything that you have changed alot for me!✨. My love for you isn’t loud—it’s steady, deep, and written into every tomorrow I dream of🙃.</p>
                  <div className="mt-4 text-right">
                    <button onClick={() => setShowEnvelope(false)} className="px-4 py-2 rounded-full bg-[#FF8DBE] text-white btn-glow">Close</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {popupImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lightbox-backdrop flex items-center justify-center p-4" onClick={() => { setPopupImage(null); setLightboxIndex(-1); }}>
              <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="max-w-3xl w-full relative" onClick={(e) => e.stopPropagation()}>
                {/* Close / Back button (top-right) */}
                <button aria-label="Close" onClick={() => { setPopupImage(null); setLightboxIndex(-1); }} className="lightbox-close">✕</button>

                {/* Prev / Next side buttons */}
                <button aria-label="Previous" onClick={() => {
                  const prev = (lightboxIndex - 1 + gallery.length) % gallery.length;
                  setLightboxIndex(prev);
                  setPopupImage(gallery[prev]);
                }} className="lightbox-nav left">‹</button>

                <button aria-label="Next" onClick={() => {
                  const nxt = (lightboxIndex + 1) % gallery.length;
                  setLightboxIndex(nxt);
                  setPopupImage(gallery[nxt]);
                }} className="lightbox-nav right">›</button>

                <img src={popupImage} alt="enlarged" className="w-full rounded-xl lightbox-image" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMessageBox && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMessageBox(false)}>
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="bg-white rounded-xl p-6 max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold">Send a Message</h4>
                  <button aria-label="Close message box" onClick={() => setShowMessageBox(false)} className="text-gray-600">✕</button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Write to me whatever your heart whispers — your sweetest words willcome straight to my inbox.</p>
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value.slice(0, 400))} maxLength={400} placeholder="Write your message..." className="message-textarea mt-3 w-full rounded border p-3 text-sm" rows={6} />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">{messageText.length}/400</div>
                  <div className="flex gap-2">
                    <button onClick={() => { setMessageText(''); }} className="px-3 py-1 rounded bg-gray-100 text-sm">Clear</button>
                    <button onClick={() => {
                      // Use mailto: to open user's mail client. Direct server-side sending requires SMTP credentials.
                      const to = 'naveenr2k05@gmail.com';
                      const subject = encodeURIComponent('A message from the birthday site');
                      const body = encodeURIComponent(messageText || '');
                      // Open default mail client with prefilled recipient, subject and body
                      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
                      setShowMessageBox(false);
                      setMessageText('');
                    }} className="px-4 py-2 rounded bg-[#FF8DBE] text-white btn-glow">Send</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BirthdaySite;
