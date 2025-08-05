import { create } from 'zustand';

interface AgentProfileState {
  experience: number;
  bio: string;
  phone: string;
  city: string;
  area: string;
  theme: string;
  profilePhotoUrl: string;
  slug: string;
}

interface AgentProfileActions {
  setData: (data: Partial<AgentProfileState>) => void;
  reset: () => void;
}

const initialState: AgentProfileState = {
  experience: 0,
  bio: '',
  phone: '',
  city: '',
  area: '',
  theme: 'professional-blue',
  profilePhotoUrl: '',
  slug: '',
};

export const useWizardStore = create<AgentProfileState & AgentProfileActions>((set) => ({
  ...initialState,
  
  setData: (data: Partial<AgentProfileState>) =>
    set((state) => ({ ...state, ...data })),
  
  reset: () => set(initialState),
}));