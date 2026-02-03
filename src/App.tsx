import { GalleryProvider } from './features/gallery/context/GalleryContext';
import { XRProvider } from './features/xr/context/XRContext';
import { GalleryApp } from './features/gallery/ui/GalleryApp';
import { SceneErrorBoundary } from './components/SceneErrorBoundary';

import './App.css';

function App() {
  return (
    <XRProvider>
      <GalleryProvider>
        <SceneErrorBoundary>
          <GalleryApp />
        </SceneErrorBoundary>
      </GalleryProvider>
    </XRProvider>
  );
}

export default App;
