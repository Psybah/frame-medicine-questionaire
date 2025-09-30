"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

let interval: any;

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
  manual = false,
  current = 0,
  maxVisible = 4,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  manual?: boolean;
  current?: number; // index of the front card when manual is true
  maxVisible?: number; // limit number of visible stacked cards
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    if (manual) return; // do not autoplay in manual mode
    startFlipping();
    return () => clearInterval(interval);
  }, [manual]);

  // In manual mode, rotate the array so the desired "current" card is on top
  const rotated = useMemo(() => {
    if (!manual) return cards;
    const len = items.length;
    if (len === 0) return [] as Card[];
    const idx = ((current % len) + len) % len; // safe modulo
    const head = items.slice(idx);
    const tail = items.slice(0, idx);
    return [...head, ...tail];
  }, [manual, current, items, cards]);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 5000);
  };

  const stack = (manual ? rotated : cards).slice(0, Math.max(1, Math.min(maxVisible, items.length)));

  return (
    <div className="relative min-h-72 w-[20rem] md:min-h-72 md:w-[30rem]">
      {stack.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute dark:bg-black bg-white min-h-72 w-[20rem] md:min-h-72 md:w-[30rem] rounded-[28px] p-5 shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: stack.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">
              {card.content}
            </div>
            <div>
              <p className="text-neutral-500 font-medium dark:text-white">
                {card.name}
              </p>
              <p className="text-neutral-400 font-normal dark:text-neutral-200">
                {card.designation}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};


