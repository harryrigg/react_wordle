export type ToastState = {
  show: boolean;
  message: string;
};

export default function Toast({ state }: { state: ToastState }) {
  return (
    <div
      className={`
        absolute top-2 p-2 bg-zinc-200 rounded z-10 text-black transition-[transform,opacity]
        ${state.show ? "opacity-100 scale-100" : "opacity-0 scale-0"}
      `}
    >
      {state.message}
    </div>
  );
}
