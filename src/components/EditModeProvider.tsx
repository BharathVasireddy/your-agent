'use client';

import React, { createContext, useContext, useState } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isOwner: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

interface EditModeProviderProps {
  children: React.ReactNode;
  isOwner: boolean;
}

export function EditModeProvider({ children, isOwner }: EditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode, isOwner }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  // Gracefully handle absence of provider (public pages)
  return (
    context || {
      isEditMode: false,
      isOwner: false,
      toggleEditMode: () => {},
    }
  );
}