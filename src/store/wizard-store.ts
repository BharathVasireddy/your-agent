import { create } from 'zustand';

interface AgentProfileState {
  name: string;
  email: string;
  experience: number;
  bio: string;
  phone: string;
  city: string;
  area: string;
  template: string;
  profilePhotoUrl: string;
  slug: string;
  dateOfBirth: string;
}

interface AgentProfileActions {
  setData: (data: Partial<AgentProfileState>) => void;
  reset: () => void;
}

const initialState: AgentProfileState = {
  name: '',
  email: '',
  experience: 0,
  bio: '',
  phone: '',
  city: '',
  area: '',
  template: 'classic-professional',
  profilePhotoUrl: '',
  slug: '',
  dateOfBirth: '',
};

export const useWizardStore = create<AgentProfileState & AgentProfileActions>((set) => ({
  ...initialState,
  
  setData: (data: Partial<AgentProfileState>) =>
    set((state) => ({ ...state, ...data })),
  
  reset: () => set(initialState),
}));