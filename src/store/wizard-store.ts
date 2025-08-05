import { create } from 'zustand';

interface AgentProfileState {
  experience: number;
  specialization: string;
  licenseNumber: string;
  bio: string;
  phone: string;
  city: string;
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
  specialization: '',
  licenseNumber: '',
  bio: '',
  phone: '',
  city: '',
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