import { useEffect, useRef, useReducer } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/utils/socket";
import { useAuth } from "@/store/auth-context";

// Store socket outside React so it is never accessed as a ref during render
// and never causes cascading setState calls inside effects.
let _socketInstance: Socket | null = null;

export function useSocket(): Socket | null {
  const { accessToken } = useAuth();
  // useReducer tick forces re-render without storing socket in state
  const [tick, rerender] = useReducer((x: number) => x + 1, 0);
  // suppress unused warning — tick is intentionally used to trigger re-render
  void tick;

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      _socketInstance = null;
      rerender();
      return;
    }

    const s = getSocket(accessToken);
    _socketInstance = s;
    rerender();

    const onConnect    = () => { _socketInstance = s;    rerender(); };
    const onDisconnect = () => { _socketInstance = null; rerender(); };
    const onError      = (err: Error) => console.error("[socket] error:", err.message);

    s.on("connect",       onConnect);
    s.on("disconnect",    onDisconnect);
    s.on("connect_error", onError);

    return () => {
      s.off("connect",       onConnect);
      s.off("disconnect",    onDisconnect);
      s.off("connect_error", onError);
    };
  }, [accessToken]);

  return _socketInstance;
}