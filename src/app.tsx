import { useState } from "react";
import Game from "./game/game";
import { getWord } from "./dictionary";

export default function Home() {
  const [gameKey, setGameKey] = useState(Date.now());
  const [answer, setAnswer] = useState(getWord());

  function handleReload() {
    setGameKey(Date.now());
    setAnswer(getWord());
  }

  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="w-max absolute bottom-0 right-1/2 flex translate-x-1/2 items-center gap-2 p-4 text-zinc-400 md:right-0 md:translate-x-0">
        <a href="https://github.com/harryrigg/react_wordle" target="_blank">
          <img className="h-[1.2em]" src="/github.svg" alt="github" />
        </a>
        •
        <span className="w-max">
          Built by{" "}
          <a className="text-zinc-500" href="https://github.com/harryrigg">
            Harry Rigg
          </a>
        </span>
      </div>
      <Game key={gameKey} answer={answer} onReload={handleReload} />
    </div>
  );
}
