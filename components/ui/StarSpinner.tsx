'use client';
import { motion } from 'framer-motion';

const StarSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.svg
        width="50"
        height="50"
        viewBox="0 0 14 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <path
          d="M13.5245 4.96603L9.74717 8.16225L10.9887 12.9962L6.76226 10.3283L2.53585 12.9962L3.77736 8.16225L0 4.96603L4.91321 4.64905L6.76226 -1.04904e-05L8.61132 4.64905L13.5245 4.96603Z"
          fill="#FFBE00"
        />
      </motion.svg>
    </div>
  );
};

export default StarSpinner;
