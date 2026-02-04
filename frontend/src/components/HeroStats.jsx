import { BookOpen, Shield, Users, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ICON_MAP = {
  diseases: BookOpen,
  healthTips: Shield,
  languages: Users,
  emergency: AlertCircle,
};

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView || !value) return;

    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2] || "";

    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(Math.floor(v) + suffix);
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function HeroStats() {
  const { t } = useTranslation();
  const stats = t("HeroStats.items", { returnObjects: true });

  if (!Array.isArray(stats)) return null;

  return (
    <section
      className="
        relative z-20 
        px-4 pb-20 
        
        /* SPACING FIX: 
           - mt-0: On mobile, it sits naturally below the hero.
           - lg:mt-10: On laptops+, adds the requested gap below the 'Start Assessment' button.
        */
        mt-10 lg:mt-50

      "
    >
      <div className="max-w-7xl mx-auto">
        {/* GRID FIX:
           - grid-cols-2: Ensures 2 columns (2x2) on Mobile/Tablets instantly.
           - lg:grid-cols-4: Switches to 1 row of 4 on Laptops.
           - gap-3: Tighter gap on mobile to fit screen.
           - sm:gap-6: Larger gap on bigger screens.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = ICON_MAP[stat.id];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="
                  flex flex-col items-center justify-center
                  /* Mobile: smaller padding (p-4). Desktop: larger padding (p-8) */
                  p-4 sm:p-8 
                  rounded-2xl
                  bg-white dark:bg-[#1e2329]
                  border border-gray-200 dark:border-gray-800
                  shadow-xl shadow-gray-200/50 dark:shadow-black/40
                  hover:-translate-y-1 hover:shadow-2xl hover:border-blue-300 dark:hover:border-gray-600
                  transition-all duration-300
                "
              >
                {/* Icon Circle */}
                <div
                  className="
                  w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 
                  rounded-xl bg-blue-50 dark:bg-blue-900/20 
                  flex items-center justify-center 
                  text-blue-600 dark:text-blue-400
                "
                >
                  {Icon && (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                  )}
                </div>

                {/* Number Text */}
                <div className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  <AnimatedCounter value={stat.value} />
                </div>

                {/* Label Text */}
                <div className="text-xs sm:text-sm font-medium text-center text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
