"use client";

import { useState } from "react";
import Game from "./game/game";
import { getWord } from "./dictionary";

export default function Home() {
  const [gameKey, setGameKey] = useState(crypto.randomUUID());
  const [answer, setAnswer] = useState(getWord());

  function handleReload() {
    setGameKey(crypto.randomUUID());
    setAnswer(getWord());
  }

  return (
    <div className="h-full flex items-center justify-center">
      <Game key={gameKey} answer={answer} onReload={handleReload} />
    </div>
  );
}
