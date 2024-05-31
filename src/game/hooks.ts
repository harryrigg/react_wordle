import { useEffect, useState } from "react";
import { ToastState } from "./toast";

export function useToast(
  timeout: number,
): [ToastState, (value: string) => void] {
  const [toastState, setToastState] = useState<ToastState>({
    show: false,
    message: "",
  });

  useEffect(() => {
    let timeoutId = null;

    if (toastState.show) {
      timeoutId = setTimeout(() => {
        setToastState({ show: false, message: toastState.message });
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [toastState, timeout]);

  function showToast(message: string) {
    setToastState({ show: true, message });
  }

  return [toastState, showToast];
}

export function useShake(duration: number): [boolean, () => void] {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    let timeoutId = null;

    if (shake) {
      timeoutId = setTimeout(() => {
        setShake(false);
      }, duration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shake, duration]);

  function startShake() {
    setShake(true);
  }

  return [shake, startShake];
}
