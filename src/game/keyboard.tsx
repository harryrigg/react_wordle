import { useEffect } from "react";
import { TileState, rowFlipDuration } from "./game";

const keys = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((s) => s.split(""));

type KeyProps = {
  k: string;
  className: string;
  onClick: () => void;
};

function Key(props: KeyProps) {
  const style = {
    transitionDelay: rowFlipDuration + "ms",
  } as React.CSSProperties;
  return (
    <button
      className={`rounded h-16 transition-colors duration-200 font-extrabold ${props.className}`}
      style={style}
      onClick={props.onClick}
    >
      {props.k}
    </button>
  );
}

type KeyboardProps = {
  onKey: (key: string) => void;
  keymap: Map<string, TileState>;
};

export default function Keyboard(props: KeyboardProps) {
  const onKey = props.onKey;
  useEffect(() => {
    function onKeypress(e: KeyboardEvent) {
      if (/^[a-z]$/.test(e.key) || e.key === "Enter" || e.key === "Backspace")
        onKey(e.key);
    }

    window.addEventListener("keydown", onKeypress);
    return () => {
      window.removeEventListener("keydown", onKeypress);
    };
  }, [onKey]);

  function keyColor(key: string) {
    switch (props.keymap.get(key)) {
      case "correct":
        return "bg-green-600";
      case "present":
        return "bg-yellow-500";
      case "not_present":
        return "bg-zinc-600";
      default:
        return "bg-gray-400";
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <div className="flex mx-auto gap-1 w-full">
        {keys[0].map((k) => (
          <Key
            key={k}
            k={k}
            className={`flex-1 ${keyColor(k)}`}
            onClick={() => onKey(k)}
          />
        ))}
      </div>
      <div className="flex mx-auto gap-1 w-full">
        <div className="flex-[0.5]"></div>
        {keys[1].map((k) => (
          <Key
            key={k}
            k={k}
            className={`flex-1 ${keyColor(k)}`}
            onClick={() => onKey(k)}
          />
        ))}
        <div className="flex-[0.5]"></div>
      </div>
      <div className="flex mx-auto gap-1 w-full">
        <Key
          k="ENTER"
          className="flex-[1.5] bg-gray-400 text-xs"
          onClick={() => onKey("Enter")}
        />
        {keys[2].map((k) => (
          <Key
            key={k}
            k={k}
            className={`flex-1 ${keyColor(k)}`}
            onClick={() => onKey(k)}
          />
        ))}
        <Key
          k="BACK"
          className="flex-[1.5] bg-gray-400 text-xs"
          onClick={() => onKey("Backspace")}
        />
      </div>
    </div>
  );
}
