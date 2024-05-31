import React, { MouseEvent, useRef } from "react";

type ModalProps = {
  show: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  onReload: () => void;
};

export default function Modal({
  title,
  show,
  children,
  onClose,
  onReload,
}: ModalProps) {
  const background = useRef(null);

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target == background.current) onClose();
  }

  return (
    <div
      className={`
        fixed left-0 top-0 w-full h-full bg-zinc-950/90 grid place-items-center z-10
        ${show ? "block" : "hidden"}
      `}
      onClick={handleClick}
      ref={background}
    >
      <div className="min-w-[300px] bg-zinc-800 rounded p-4 flex flex-col gap-6 items-center">
        <span className="text-xl">{title}</span>
        {children}
        <div className="flex gap-2">
          <button className="rounded bg-sky-700 p-2" onClick={() => onReload()}>
            Play Again
          </button>
          <button className="rounded bg-sky-700 p-2" onClick={() => onClose()}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
