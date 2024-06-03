import React, { useState } from "react";

import { isWord } from "../dictionary";

import Toast from "./toast";
import Modal from "./modal";
import Keyboard from "./keyboard";
import { useToast, useShake } from "./hooks";

import "./style.css";

export const rowFlipDuration = 1500;

export type TileState = "none" | "correct" | "present" | "not_present";

type TileProps = {
  char: string;
  state: TileState;
  index: number;
  shake: boolean;
};

function Tile(props: TileProps) {
  const style = {
    transitionDelay: props.index * (rowFlipDuration / 5.0) + "ms",
  } as React.CSSProperties;

  return (
    <div
      className={`tile ${props.state} ${props.shake && "shake"}`}
      data-content={props.char}
      style={style}
    ></div>
  );
}

export default function Game({
  onReload,
  answer,
}: {
  onReload: () => void;
  answer: string;
}) {
  const [charRows, setCharRows] = useState(
    Array(6)
      .fill(undefined)
      .map(() =>
        Array(5)
          .fill(undefined)
          .map(() => ""),
      ),
  );
  const [stateRows, setStateRows] = useState<Array<Array<TileState>>>(
    Array(6)
      .fill(undefined)
      .map(() =>
        Array(5)
          .fill(undefined)
          .map(() => "none"),
      ),
  );

  const [keymap, setKeymap] = useState<Map<string, TileState>>(new Map());

  const [gameState, setGameState] = useState<"play" | "win" | "lose">("play");
  const [colIndex, setColIndex] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [allowInput, setAllowInput] = useState(true);

  const [modal, setModal] = useState<null | "win" | "lose">(null);
  const [toastState, showToast] = useToast(2000);
  const [shake, startShake] = useShake(800);

  function enterLetter(letter: string) {
    if (colIndex < 5) {
      setCharRows((rows) =>
        rows.map((r, i) => {
          if (i == rowIndex) {
            r[colIndex] = letter;
          }
          return r;
        }),
      );
      setColIndex((v) => v + 1);
    }
  }

  function backspace() {
    if (colIndex > 0) {
      setCharRows((rows) =>
        rows.map((r, i) => {
          if (i == rowIndex) {
            r[colIndex - 1] = "";
          }
          return r;
        }),
      );
      setColIndex((v) => v - 1);
    }
  }

  function confirmWord() {
    if (colIndex != 5) {
      startShake();
      showToast("Not a complete word");
      return;
    }

    if (!isWord(charRows[rowIndex].join(""))) {
      startShake();
      showToast("Not in the word list");
      return;
    }

    setAllowInput(false);
    const answerRemaining = answer.split("");
    const nextKeymap = new Map(keymap);

    // Find all correct matches
    const correctPass = charRows[rowIndex].map((c, i) => {
      if (answer[i] == c) {
        answerRemaining[i] = "";
        nextKeymap.set(c, "correct");
        return "correct";
      } else {
        return "none";
      }
    });

    // Find all present matches
    const presentPass = correctPass.map((state, i) => {
      if (state == "none") {
        const c = charRows[rowIndex][i];
        const index = answerRemaining.indexOf(c);
        if (index !== -1) {
          if (nextKeymap.get(c) != "correct") {
            nextKeymap.set(c, "present");
          }
          return "present";
        }
      }
      return state;
    });

    // Mark all remaining characters as not present
    const finalPass = presentPass.map((state, i) => {
      if (state == "none") {
        const c = charRows[rowIndex][i];
        if (!nextKeymap.has(c)) {
          nextKeymap.set(c, "not_present");
        }
        return "not_present";
      } else {
        return state;
      }
    });

    // Update state
    setStateRows((rows) =>
      rows.map((r, i) => {
        if (i == rowIndex) {
          return finalPass;
        } else {
          return r;
        }
      }),
    );
    setKeymap(nextKeymap);

    let onRevealed;
    if (finalPass.every((s) => s == "correct")) {
      // Win
      onRevealed = () => {
        setModal("win");
        setGameState("win");
      };
    } else if (rowIndex == 5) {
      // Lose
      onRevealed = () => {
        setModal("lose");
        setGameState("lose");
      };
    } else {
      // Continue
      onRevealed = () => {
        setRowIndex((v) => v + 1);
        setColIndex(0);
        setAllowInput(true);
      };
    }

    setTimeout(onRevealed, rowFlipDuration);
  }

  function handleKey(key: string) {
    if (!allowInput) return;

    if (key == "Enter") {
      confirmWord();
    } else if (key == "Backspace") {
      backspace();
    } else {
      enterLetter(key);
    }
  }

  function modalTitle() {
    switch (modal) {
      case "win":
        return "You Win!";
      case "lose":
        return "Game Over! Better luck next time";
      case null:
        return "";
    }
  }

  return (
    <>
      <Modal
        show={modal != null}
        title={modalTitle()}
        onClose={() => setModal(null)}
        onReload={() => onReload()}
      >
        {modal == "lose" ? (
          <span className="text-lg">
            The answer was: <b>{answer}</b>
          </span>
        ) : (
          ""
        )}
      </Modal>

      <div className="relative flex flex-col w-[min(100%-2rem,600px)] items-center gap-2">
        <Toast state={toastState} />
        <div className="grid grid-cols-5 grid-rows-6 w-[90%] sm:w-1/2 aspect-[5/6] gap-1">
          {charRows.map((row, i) =>
            row.map((char, j) => (
              <Tile
                char={char}
                state={stateRows[i][j]}
                shake={i == rowIndex && shake}
                index={j}
                key={j}
              />
            )),
          )}
        </div>

        <div className="h-10 grid grid-cols-2 gap-2">
          {gameState != "play" && (
            <>
              <button
                className="rounded-xl border px-2"
                onClick={() => onReload()}
              >
                Play Again
              </button>
              <button
                className="rounded-xl border px-2"
                onClick={() => setModal(gameState)}
              >
                Show Results
              </button>
            </>
          )}
        </div>

        <Keyboard keymap={keymap} onKey={handleKey} />
      </div>
    </>
  );
}
