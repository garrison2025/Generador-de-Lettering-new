import {StrictMode, useEffect} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

let editorPersistenceHydrationStarted = false;

function EditorPersistenceHydrator() {
  useEffect(() => {
    if (editorPersistenceHydrationStarted) return;
    editorPersistenceHydrationStarted = true;

    void import('@/store/useEditorStore').then(({ useEditorStore }) => {
      void useEditorStore.persist.rehydrate();
    });
  }, []);

  return null;
}

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <EditorPersistenceHydrator />
    <App />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
