import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "./AppContext";
import { listenForIncomingCall } from "./service/videoCall.service";

export const CallContext = createContext();

export function CallProvider({ children }) {
  const { user } = useContext(AppContext);
  const [incomingCall, setIncomingCall] = useState(null);
  const listenerRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) return;

    // Only attach listener once
    if (!listenerRef.current) {
      listenerRef.current = listenForIncomingCall(user.uid, (callData, key) => {
        setIncomingCall({ ...callData, key });
      });
    }

    return () => {
      // Cleanup listener if user logs out
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
    };
  }, [user?.uid]);

  return (
    <CallContext.Provider value={{ incomingCall, setIncomingCall }}>
      {children}
    </CallContext.Provider>
  );
}

// Hook to use call context easily
export const useCall = () => useContext(CallContext);
