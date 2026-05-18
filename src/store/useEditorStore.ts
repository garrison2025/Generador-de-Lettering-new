import { create } from 'zustand';

export interface EditorState {
  text: string;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  backgroundColor: string; // 'transparent' or hex
  textOpacity: number;
  isGradient: boolean;
  gradientStartColor: string;
  gradientEndColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowColor: string;
  strokeWidth: number;
  strokeColor: string;
  rotation: number;
  backgroundImage: string | null;
  canvasRatio: 'free' | '1:1' | '16:9' | '9:16';
  overlayColor: string;
  overlayOpacity: number;
}

interface EditorStore extends EditorState {
  updateState: (updates: Partial<EditorState>) => void;
  resetState: () => void;
  randomizeState: () => void;
  history: EditorState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
}

const DEFAULT_STATE: EditorState = {
  text: 'Generador\nde Lettering',
  fontFamily: 'Dancing Script',
  fontSize: 80,
  letterSpacing: 0,
  lineHeight: 1.2,
  textAlign: 'center',
  textColor: '#000000',
  backgroundColor: 'transparent',
  textOpacity: 1,
  isGradient: false,
  gradientStartColor: '#FF6B6B',
  gradientEndColor: '#3B82F6',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: '#000000',
  strokeWidth: 0,
  strokeColor: '#000000',
  rotation: 0,
  backgroundImage: null,
  canvasRatio: 'free',
  overlayColor: '#000000',
  overlayOpacity: 0,
};

const RANDOM_TEXTS = ["Hola Mundo", "Vivir es Increíble", "Amor y Paz", "Arte Digital", "Sueña en Grande", "Buenas Vibras"];
const RANDOM_COLORS = ["#FF6B6B", "#FBBF24", "#34D399", "#3B82F6", "#5A4AD2", "#9333EA", "#000000", "#FFFFFF"];
const RANDOM_FONTS = ["Dancing Script", "Pacifico", "Parisienne", "Caveat", "Lobster", "Permanent Marker"];

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...DEFAULT_STATE,
  history: [DEFAULT_STATE],
  historyIndex: 0,
  
  updateState: (updates) => set((state) => {
    const newState = { ...state, ...updates };
    // Remove functions and history from the state we save
    const stateToSave = {
      text: newState.text,
      fontFamily: newState.fontFamily,
      fontSize: newState.fontSize,
      letterSpacing: newState.letterSpacing,
      lineHeight: newState.lineHeight,
      textAlign: newState.textAlign,
      textColor: newState.textColor,
      backgroundColor: newState.backgroundColor,
      textOpacity: newState.textOpacity,
      isGradient: newState.isGradient,
      gradientStartColor: newState.gradientStartColor,
      gradientEndColor: newState.gradientEndColor,
      shadowOffsetX: newState.shadowOffsetX,
      shadowOffsetY: newState.shadowOffsetY,
      shadowBlur: newState.shadowBlur,
      shadowColor: newState.shadowColor,
      strokeWidth: newState.strokeWidth,
      strokeColor: newState.strokeColor,
      rotation: newState.rotation,
      backgroundImage: newState.backgroundImage,
      canvasRatio: newState.canvasRatio,
      overlayColor: newState.overlayColor,
      overlayOpacity: newState.overlayOpacity,
    };
    
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(stateToSave);
    
    // Keep max 50 history steps to avoid memory bloat
    if (newHistory.length > 50) newHistory.shift();
    
    return {
      ...newState,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),
  
  resetState: () => set((state) => ({
    ...state,
    ...DEFAULT_STATE,
    history: [...state.history, DEFAULT_STATE],
    historyIndex: state.historyIndex + 1
  })),
  
  randomizeState: () => set((state) => {
    const randomUpdates = {
      text: RANDOM_TEXTS[Math.floor(Math.random() * RANDOM_TEXTS.length)],
      fontFamily: RANDOM_FONTS[Math.floor(Math.random() * RANDOM_FONTS.length)],
      textColor: RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)],
    };
    return get().updateState(randomUpdates) as any;
  }),
  
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        ...state.history[newIndex],
        historyIndex: newIndex
      };
    }
    return state;
  }),
  
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        ...state.history[newIndex],
        historyIndex: newIndex
      };
    }
    return state;
  }),
}));
