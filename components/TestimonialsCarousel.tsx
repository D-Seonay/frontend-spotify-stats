"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Card } from "@/components/ui/card";

// Reprend votre TestimonialCard tel quel (ou importez-le si défini ailleurs)
function TestimonialCard({
  name,
  date,
  avatar,
  text,
  stats,
  hover,
}: {
  name: string;
  date: string;
  avatar: string;
  text: string;
  stats: { comments: string; shares: string; likes: string };
  hover?: boolean;
}) {
  return (
    <Card
      className={`group relative border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm ${
        hover
          ? "transition-all duration-500 hover:scale-105 hover:border-[#1DB954]/50 hover:shadow-2xl hover:shadow-[#1DB954]/20"
          : ""
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#1DB954]">
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-300">{text}</p>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">💬 {stats.comments}</span>
        <span className="flex items-center gap-1">🔄 {stats.shares}</span>
        <span className="flex items-center gap-1">❤️ {stats.likes}</span>
      </div>
    </Card>
  );
}

type Testimonial = {
  name: string;
  date: string;
  avatar: string;
  text: string;
  stats: { comments: string; shares: string; likes: string };
  hover?: boolean;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marie L.",
    date: "15 nov",
    avatar: "/user-profile-illustration.png",
    text: "Je viens de tester SLS, c'est dingue de voir mes moods d'écoute et mes tops évoluer chaque semaine. #MusicLovers",
    stats: { comments: "12.5k", shares: "8.2k", likes: "34.1k" },
    hover: true,
  },
  {
    name: "Thomas B.",
    date: "22 nov",
    avatar: "/diverse-person-smiling.png",
    text: "Enfin une app qui comprend vraiment mes habitudes musicales ! Les insights sont ultra précis. 🎵",
    stats: { comments: "8.7k", shares: "5.3k", likes: "28.9k" },
    hover: true,
  },
  {
    name: "Sofia R.",
    date: "1 déc",
    avatar: "/happy-user.jpg",
    text: "Les visualisations sont magnifiques et les comparaisons avec mes amis sont trop fun ! 🔥",
    stats: { comments: "15.2k", shares: "11.8k", likes: "42.3k" },
    hover: true,
  },
  // Ajoutez autant d’items que voulu
];

/**
 * Carrousel automatique infini:
 * - Duplique les items pour une boucle continue.
 * - Animation linéaire translateX avec repeat Infinity.
 * - Pause au hover/focus.
 * - Responsive: cartes flexibles, gap configuré.
 * - Edge fade via mask gradients pour une finition visuelle.
 */
export default function TestimonialsCarousel({
  items = TESTIMONIALS,
  speed = 60, // pixels/seconde
  gap = 24, // espace entre cartes en px
}: {
  items?: Testimonial[];
  speed?: number;
  gap?: number;
}) {
  const controls = useAnimationControls();

  // Double la liste pour l'effet infini
  const loopItems = React.useMemo(() => [...items, ...items], [items]);

  // Référence pour mesurer la largeur totale d'une "piste"
  const trackRef = React.useRef<HTMLUListElement | null>(null);
  const [trackWidth, setTrackWidth] = React.useState(0);

  // Mesure au mount et sur resize
  React.useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      // La moitié de la largeur du track (une liste)
      const children = Array.from(trackRef.current.children);
      const halfCount = children.length / 2;
      let width = 0;
      for (let i = 0; i < halfCount; i++) {
        const el = children[i] as HTMLElement;
        width += el.offsetWidth;
        if (i < halfCount - 1) width += gap;
      }
      setTrackWidth(width);
    };
    measure();
    const obs = new ResizeObserver(measure);
    if (trackRef.current) obs.observe(trackRef.current);
    return () => obs.disconnect();
  }, [loopItems, gap]);

  // Lance l’animation continue
  React.useEffect(() => {
    if (trackWidth === 0) return;
    const duration = trackWidth / speed; // en secondes
    controls.start({
      x: [-trackWidth, 0],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        duration,
      },
    });
  }, [trackWidth, speed, controls]);

  const handleMouseEnter = () => controls.stop();
  const handleMouseLeave = () => {
    // Redémarre l’animation, en reprenant depuis la position actuelle
    if (trackWidth === 0) return;
    const duration = trackWidth / speed;
    controls.start({
      x: [undefined as unknown as number, 0], // permet de continuer le loop
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        duration,
      },
    });
  };

  return (
    <section
      aria-label="Témoignages utilisateurs"
      className="relative py-16 md:py-24 bg-gradient-to-b from-[#0a0a0a] to-black"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-5xl">
          Ce que disent nos utilisateurs
        </h2>

        {/* Zone masquée sur les bords pour un fade élégant */}
        <div
          className="relative mx-auto max-w-6xl overflow-hidden p-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent" />

          <motion.ul
            ref={trackRef}
            className="flex items-stretch"
            animate={controls}
            role="list"
            drag="x"
            dragConstraints={{ left: -trackWidth, right: 0 }}
            dragElastic={0.1}
            style={{ gap }}
            aria-roledescription="carrousel de témoignages utilisateurs"
          >
            {loopItems.map((t, idx) => (
              <li
                key={`${t.name}-${idx}`}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px]"
                aria-label={`Témoignage de ${t.name}`}
              >
                <TestimonialCard
                  name={t.name}
                  date={t.date}
                  avatar={t.avatar}
                  text={t.text}
                  stats={t.stats}
                  hover
                />
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
