import React from 'react';
import { motion } from 'framer-motion';

export default function SplitText({
  text = "",
  className = '',
  delay = 20, // delay between character stagger (ms)
  duration = 0.5,
  ease = 'easeOut',
  threshold = 0.1,
  textAlign = 'left',
  tag = 'span',
  animationFrom = { opacity: 0, y: 12 },
  animationTo = { opacity: 1, y: 0 },
}) {
  const words = text.split(" ");
  const Tag = tag;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay / 1000,
      }
    }
  };

  const childVariants = {
    hidden: animationFrom,
    visible: {
      ...animationTo,
      transition: {
        duration: duration,
        ease: ease
      }
    }
  };

  return (
    <Tag className={`inline-block ${className}`} style={{ textAlign }}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: threshold }}
        className="inline-flex flex-wrap justify-start gap-x-1"
      >
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIdx) => (
              <motion.span
                key={charIdx}
                variants={childVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {/* Add space between words */}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
