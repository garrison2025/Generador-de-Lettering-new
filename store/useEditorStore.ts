import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EditorState {
  text: string;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  textOpacity: number;
  isGradient: boolean;
  gradientStartColor: string;
  gradientEndColor: string;
  backgroundColor: string; // 'transparent' or hex
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
  past: EditorState[];
  future: EditorState[];
  updateState: (updates: Partial<EditorState>) => void;
  resetState: () => void;
  randomizeState: () => void;
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
  textOpacity: 1,
  isGradient: false,
  gradientStartColor: '#FF6B6B',
  gradientEndColor: '#5A4AD2',
  backgroundColor: 'transparent',
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

const extractState = (state: EditorStore): EditorState => ({
  text: state.text,
  fontFamily: state.fontFamily,
  fontSize: state.fontSize,
  letterSpacing: state.letterSpacing,
  lineHeight: state.lineHeight,
  textAlign: state.textAlign,
  textColor: state.textColor,
  textOpacity: state.textOpacity,
  isGradient: state.isGradient,
  gradientStartColor: state.gradientStartColor,
  gradientEndColor: state.gradientEndColor,
  backgroundColor: state.backgroundColor,
  shadowOffsetX: state.shadowOffsetX,
  shadowOffsetY: state.shadowOffsetY,
  shadowBlur: state.shadowBlur,
  shadowColor: state.shadowColor,
  strokeWidth: state.strokeWidth,
  strokeColor: state.strokeColor,
  rotation: state.rotation,
  backgroundImage: state.backgroundImage,
  canvasRatio: state.canvasRatio,
  overlayColor: state.overlayColor,
  overlayOpacity: state.overlayOpacity,
});

const RANDOM_TEXTS = ["Hola Mundo", "Vivir es Increíble", "Amor y Paz", "Arte Digital", "Sueña en Grande", "Buenas Vibras"];
const RANDOM_COLORS = ["#FF6B6B", "#FBBF24", "#34D399", "#3B82F6", "#5A4AD2", "#9333EA", "#000000", "#FFFFFF"];
const RANDOM_FONTS = ["Dancing Script", "Pacifico", "Parisienne", "Caveat", "Lobster", "Permanent Marker"];

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      past: [],
      future: [],
      updateState: (updates) => set((state) => {
        const currentState = extractState(state);
        return {
          ...state,
          ...updates,
          past: [...state.past, currentState].slice(-20), // keep last 20 actions
          future: [],
        };
      }),
      resetState: () => set((state) => ({ 
        ...DEFAULT_STATE, 
        past: [...state.past, extractState(state)].slice(-20), 
        future: [] 
      })),
      randomizeState: () => set((state) => ({
        text: RANDOM_TEXTS[Math.floor(Math.random() * RANDOM_TEXTS.length)],
        fontFamily: RANDOM_FONTS[Math.floor(Math.random() * RANDOM_FONTS.length)],
        textColor: RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)],
        past: [...state.past, extractState(state)].slice(-20),
        future: []
      })),
      undo: () => set((state) => {
        if (state.past.length === 0) return state;
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, state.past.length - 1);
        
        return {
          ...state,
          ...previous,
          past: newPast,
          future: [extractState(state), ...state.future]
        };
      }),
      redo: () => set((state) => {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        
        return {
          ...state,
          ...next,
          past: [...state.past, extractState(state)],
          future: newFuture
        };
      })
    }),
    {
      name: 'lettering-editor-storage',
      version: 1,
      // Keep lightweight editor preferences, but never serialize uploaded image data URLs.
      partialize: (state) => ({
        ...extractState(state),
        backgroundImage: null,
      }),
      // Older versions may already contain a large base64 background image in localStorage.
      migrate: (persistedState) => ({
        ...(persistedState as EditorState),
        backgroundImage: null,
      }),
    }
  )
);
