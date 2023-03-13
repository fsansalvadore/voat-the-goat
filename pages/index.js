'use client';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JSConfetti from 'js-confetti';
import { supabase } from '../utils/supabaseClient';

const getRandomImageNumber = () => {
  const number = Math.floor(Math.random() * 7) + 1;
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
  const [isLoading, setIsLoading] = useState(true);
  const [messiVotes, setMessiVotes] = useState(0);
  const [ronaldoMisses, setRonaldoMisses] = useState(0);
  const [ronaldoVotes, setRonaldoVotes] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [randomImage, setRandomImage] = useState(getRandomImageNumber());
  const [hasVoted, setHasVoted] = useState(false);

  const getData = async () => {
    try {
      let { data: goatVotes, error } = await supabase
        .from('goatVotes')
        .select('goat');
      setMessiVotes(
        goatVotes.filter((vote) => vote.goat === 'messi')?.length ?? 0
      );
      setRonaldoVotes(
        goatVotes.filter((vote) => vote.goat === 'ronaldo')?.length ?? 0
      );

      if (error) {
        console.log('error');
      }
      setIsLoading(false);
    } catch (err) {
      console.log('err', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const insertVote = async (name) => {
    try {
      const { data, error } = await supabase
        .from('goatVotes')
        .insert([{ goat: name }]);

      if (error) return console.log('error', error);
      console.log('inserted data', data);
    } catch (err) {
      console.log('err', err);
    }
  };

  const getRandomIntInRange = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

  const handleRonaldoClick = () => {
    if (ronaldoMisses > 8) {
      if (hasVoted) return alert('You can only vote once');
      setRonaldoVotes((prev) => prev + 1);
      insertVote('ronaldo');
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
    insertVote('messi');
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
        <title>Vote the goat 🐐</title>
        <meta name="description" content="Who is the goat?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col md:flex-row bg-gradient-to-b to-teal-50">
        <h1 className="relative md:absolute inset-0 bottom-auto p-10 text-[40px] gap-2 text-white w-full text-center font-black uppercase">
          <div className="text-7xl">🐐</div>
          Vote the G.O.A.T.
          <div className="text-sm">- unbiased -</div>
        </h1>
        <div className="relative py-10 z-10 w-screen md:w-1/2 h-1/2 md:h-screen flex flex-col gap-3 text-center justify-center items-center">
          <div className="bg-white flex flex-col gap-3 text-center justify-center items-center p-8 border border-[#ddd] rounded-xl hover:shadow-lg transition-all">
            <img
              src={images.messi[7]}
              alt="Messi"
              className="w-[300px] h-auto H relative flex items-end rounded"
            />
            <div className="text-[28px]">Messi</div>
            <div className="text-[32px]">{isLoading ? '...' : messiVotes}</div>
            <button
              className="bg-teal-800 font-bold w-full text-white border-none rounded-md px-4 py-3"
              onClick={handleMessiClick}
            >
              Upvote
            </button>
          </div>
        </div>
        <div className="relative mt-[30vh] md:mt-auto w-screen md:w-1/2 h-1/2 md:h-screen flex flex-col gap-3 text-center justify-center items-center">
          <motion.div
            className="absolute inset-0 flex flex-col gap-3 text-center justify-center items-center"
            animate={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            <div className="bg-white flex flex-col gap-3 text-center justify-center items-center p-8 border border-[#ddd] rounded-xl hover:shadow-lg transition-all">
              <img
                src={images.ronaldo[randomImage]}
                alt="Ronaldo"
                className="w-[300px] h-auto relative flex items-end rounded"
              />
              <div className="text-[28px]">Ronaldo</div>
              <div className="text-[32px]">
                {isLoading ? '...' : ronaldoVotes}
              </div>
              <button
                className="bg-teal-800 font-bold w-full text-white border-none rounded-md px-4 py-3"
                onClick={handleRonaldoClick}
                onMouseEnter={() => {
                  if (ronaldoMisses < 4) {
                    updateOffset();
                    setRonaldoMisses((prev) => prev + 1);
                  }
                }}
              >
                Upvote
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <div
        className="fixed -z-10 inset-0 w-screen h-screen bg-center bg-cover"
        style={{ backgroundImage: `url('/messironaldochess.jpg')` }}
      />
    </div>
  );
}
