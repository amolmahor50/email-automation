"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/** Animated Counter */
function AnimatedCounter({ startCount, endCount, className }) {
  const countValue = useMotionValue(startCount);
  const rounded = useTransform(countValue, (value) => Math.round(value));

  useEffect(() => {
    const controls = animate(countValue, endCount, {
      duration: 2.5,
      ease: "linear",
    });
    return () => controls.stop();
  }, [countValue, endCount]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

/** Metrics Component */
export default function Metrics({ heading, caption, blockDetail }) {
  return (
    <section className="py-16">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {blockDetail.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className="bg-[#f2f5fa] rounded-4xl shadow p-6 flex flex-col items-center space-y-2"
          >
            <div className="flex items-end space-x-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                <AnimatedCounter startCount={0} endCount={item.counter} />
              </h3>
              {item.defaultUnit && (
                <span className="text-lg md:text-xl text-gray-500">
                  {item.defaultUnit}
                </span>
              )}
            </div>
            <p className="text-center text-gray-500">{item.caption}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
