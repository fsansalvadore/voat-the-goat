'use client';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JSConfetti from 'js-confetti';
import { supabase } from '../utils/supabaseClient';

const getRandomImageNumber = () => {
  const number = Math.floor(Math.random() * 7) + 1;
  console.log('number', number);
  return number;
};

const images = {
  messi: {
    1: '/messi/messi-01.jpeg',
    2: '/messi/messi-02.jpeg',
    3: '/messi/messi-03.jpeg',
    4: '/messi/messi-04.jpeg',
    5: '/messi/messi-05.jpeg',
    6: '/messi/messi-06.jpeg',
    7: '/messi/messi-07.jpeg',
  },
  ronaldo: {
    1: '/ronaldo/ronaldo-01.jpeg',
    2: '/ronaldo/ronaldo-02.jpeg',
    3: '/ronaldo/ronaldo-03.jpeg',
    4: '/ronaldo/ronaldo-04.jpeg',
    5: '/ronaldo/ronaldo-05.jpeg',
    6: '/ronaldo/ronaldo-crying-cristiano-ronaldo.gif',
    7: '/ronaldo/ronaldo-07.jpeg',
  },
};

export default function Home() {
  const [messiVotes, setMessiVotes] = useState(0);
  const [ronaldoMisses, setRonaldoMisses] = useState(0);
  const [ronaldoVotes, setRonaldoVotes] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [randomImage, setRandomImage] = useState(getRandomImageNumber());
  const [hasVoted, setHasVoted] = useState(false);

  const getData = async () => {
    let { data: goatVoats, error } = await supabase
      .from('goatVoats')
      .select('messiVotes, ronaldoVotes');
    console.log('supabase', supabase);
    console.log('goatVoats', goatVoats);
    setMessiVotes();
  };

  useEffect(() => {
    getData();
  }, []);

  const getRandomIntInRange = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

  const handleRonaldoClick = () => {
    if (ronaldoMisses > 3) {
      if (hasVoted) return alert('You can only vote once');
      setRonaldoVotes((prev) => prev + 1);
      setHasVoted(true);
      setRonaldoMisses(0);
    } else {
      updateOffset();
    }
    setRonaldoMisses((prev) => prev + 1);
  };
  const handleMessiClick = () => {
    if (hasVoted) return alert('You can only vote once');
    setMessiVotes((prev) => prev + 1);
    setHasVoted(true);
    if (document) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ['🐐'],
      });
    }
  };

  const updateOffset = () => {
    setRandomImage(getRandomImageNumber());
    setPosition({
      x: getRandomIntInRange(0, 100),
      y: getRandomIntInRange(0, 100),
    });
  };

  return (
    <div>
      <Head>
        <title>Guess who's the goat</title>
        <meta name="description" content="Who is the goat?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col md:flex-row">
        <div className="relative w-screen md:w-1/2 h-1/2 md:h-screen flex flex-col gap-3 text-center justify-center items-center">
          <img
            src={images.messi[1]}
            alt="Messi"
            className="w-[300px] h-auto H relative flex items-end"
          />
          <div className="text-[28px]">Messi</div>
          <div className="text-[32px]">{messiVotes}</div>
          <button
            className="bg-[#52a5ee] border-none rounded-md px-4 py-2"
            onClick={handleMessiClick}
          >
            Upvote
          </button>
        </div>
        <div className="relative w-screen md:w-1/2 h-1/2 md:h-screen flex flex-col gap-3 text-center justify-center items-center">
          <motion.div
            className="absolute inset-0 flex flex-col gap-3 text-center justify-center items-center"
            animate={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            <img
              src={images.ronaldo[randomImage]}
              alt="Ronaldo"
              className="w-[300px] h-auto relative flex items-end"
            />
            <div className="text-[28px]">Ronaldo</div>
            <div className="text-[32px]">{ronaldoVotes}</div>
            <button
              className="bg-[#52a5ee] border-none rounded-md px-4 py-2"
              onClick={handleRonaldoClick}
            >
              Upvote
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// export async function getServerSideProps() {
//   let { data } = await supabase.from('goatVotes').select();

//   console.log('static props', data);
//   return {
//     props: {
//       votes: data,
//     },
//   };
// }
