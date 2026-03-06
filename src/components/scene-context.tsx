"use client";

import * as React from "react";

interface SceneContextValue {
  activeSceneIndex: number;
  lastSceneIndex: number;
  setActiveSceneIndex: (index: number) => void;
}

const SceneContext = React.createContext<SceneContextValue | null>(null);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [activeSceneIndex, setActiveSceneIndexState] = React.useState(0);
  const [lastSceneIndex, setLastSceneIndex] = React.useState(0);
  const activeRef = React.useRef(0);

  const setActiveSceneIndex = React.useCallback((nextIndex: number) => {
    if (nextIndex === activeRef.current) return;
    setLastSceneIndex(activeRef.current);
    activeRef.current = nextIndex;
    setActiveSceneIndexState(nextIndex);
  }, []);

  return (
    <SceneContext.Provider value={{ activeSceneIndex, lastSceneIndex, setActiveSceneIndex }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useSceneContext() {
  const context = React.useContext(SceneContext);
  if (!context) {
    throw new Error("useSceneContext must be used within SceneProvider");
  }
  return context;
}
