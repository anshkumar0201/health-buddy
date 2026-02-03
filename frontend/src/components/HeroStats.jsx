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
    if (!isInView) return;

    // Extract number + suffix (e.g. "500+", "24/7", "10k")
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2] || "";

    const controls = animate(0, target, {
      duration: 1.6,
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

  return (
    <section className="relative z-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="grid grid-cols-2 lg:grid-cols-4
 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = ICON_MAP[stat.id];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true }}
                className="
    rounded-2xl shadow-lg 
    px-4 py-5 sm:px-6 sm:py-8   /* smaller on mobile */
    text-center 
    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
    bg-white 
    dark:bg-[#242930] dark:border dark:border-slate-700
    dark:shadow-gray-700 dark:hover:shadow-gray-500 dark:text-gray-300
  "
              >
                {Icon && (
                  <Icon
                    className="
    w-6 h-6 sm:w-8 sm:h-8 
    mx-auto mb-3 sm:mb-4
    text-blue-600 
    dark:text-blue-400
  "
                  />
                )}

                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter value={stat.value} />
                </div>

                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
