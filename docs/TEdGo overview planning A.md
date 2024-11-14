Phase 1 - Core Setup and Basic Viewer:
typescriptCopy// 1. Project Setup
// Using Next.js for easy routing and SSR capabilities
```bash
npx create-next-app@latest cable-viewer --typescript --tailwind
cd cable-viewer

Essential Dependencies:

jsonCopy{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@react-pdf-viewer/core": "^3.x",
    "react-zoom-pan-pinch": "^3.x",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.x",
    "@tanstack/react-query": "^5.x",
    "pdfjs-dist": "^3.x",
    "idb": "^7.x",           // IndexedDB wrapper for caching
    "lodash": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x"
  }
}

Initial Drawing Viewer Component:

typescriptCopy// components/DrawingViewer/index.tsx
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useState, useEffect, useRef } from 'react';

interface DrawingViewerProps {
  drawingUrl: string;
  initialScale?: number;
  onViewChange?: (scale: number, position: { x: number; y: number }) => void;
}

export const DrawingViewer: React.FC<DrawingViewerProps> = ({
  drawingUrl,
  initialScale = 1,
  onViewChange
}) => {
  const viewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="h-full w-full relative">
      <TransformWrapper
        initialScale={initialScale}
        minScale={0.1}
        maxScale={8}
        ref={viewerRef}
        onTransformed={(e) => {
          onViewChange?.(e.state.scale, {
            x: e.state.positionX,
            y: e.state.positionY
          });
        }}
      >
        <TransformComponent>
          {/* Drawing content will go here */}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

Layer Management:

typescriptCopy// components/DrawingViewer/LayerManager.tsx
interface Layer {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'sync' | 'control';
  visible: boolean;
  color: string;
}

const LayerManager: React.FC<{
  layers: Layer[];
  onLayerToggle: (layerId: string) => void;
}> = ({ layers, onLayerToggle }) => {
  return (
    <div className="bg-white border-l w-64">
      <div className="p-3 border-b">
        <h3 className="font-medium">Layers</h3>
      </div>
      <div className="p-2 space-y-2">
        {layers.map((layer) => (
          <LayerControl
            key={layer.id}
            layer={layer}
            onToggle={() => onLayerToggle(layer.id)}
          />
        ))}
      </div>
    </div>
  );
};

Drawing State Management:

typescriptCopy// lib/stores/drawingStore.ts
import create from 'zustand';

interface DrawingState {
  currentDrawing: string | null;
  scale: number;
  position: { x: number; y: number };
  layers: Layer[];
  setDrawing: (drawing: string) => void;
  updateView: (scale: number, position: { x: number; y: number }) => void;
  toggleLayer: (layerId: string) => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  currentDrawing: null,
  scale: 1,
  position: { x: 0, y: 0 },
  layers: [],
  setDrawing: (drawing) => set({ currentDrawing: drawing }),
  updateView: (scale, position) => set({ scale, position }),
  toggleLayer: (layerId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      ),
    })),
}));
Phase 2 - Drawing Loading and Caching:
typescriptCopy// lib/services/drawingService.ts
import { openDB } from 'idb';

const CACHE_NAME = 'drawings-cache';

export class DrawingService {
  private db: IDBDatabase;

  async init() {
    this.db = await openDB('drawings-db', 1, {
      upgrade(db) {
        db.createObjectStore('drawings');
        db.createObjectStore('metadata');
      },
    });
  }

  async loadDrawing(drawingId: string): Promise<ArrayBuffer> {
    // Check cache first
    const cached = await this.db.get('drawings', drawingId);
    if (cached) return cached;

    // Fetch if not cached
    const response = await fetch(`/api/drawings/${drawingId}`);
    const data = await response.arrayBuffer();
    
    // Cache for future use
    await this.db.put('drawings', data, drawingId);
    
    return data;
  }
}
Phase 3 - UI Components:
typescriptCopy// components/DrawingViewer/Toolbar.tsx
export const Toolbar: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToolChange: (tool: string) => void;
}> = ({ onZoomIn, onZoomOut, onFitView, onToolChange }) => {
  return (
    <div className="bg-white border-b p-2 flex justify-between">
      {/* Toolbar content */}
    </div>
  );
};

// components/DrawingViewer/Minimap.tsx
export const Minimap: React.FC<{
  drawing: string;
  viewportBounds: { x: number; y: number; width: number; height: number };
}> = ({ drawing, viewportBounds }) => {
  return (
    <div className="absolute bottom-4 right-4 w-48 h-48 bg-white border rounded-lg shadow-lg">
      {/* Minimap content */}
    </div>
  );
};
Phase 4 - Integration:
typescriptCopy// pages/drawings/[id].tsx
import { DrawingViewer } from '@/components/DrawingViewer';
import { useDrawingStore } from '@/lib/stores/drawingStore';
import { DrawingService } from '@/lib/services/drawingService';

export default function DrawingPage({ id }: { id: string }) {
  const { currentDrawing, setDrawing } = useDrawingStore();
  const drawingService = new DrawingService();

  useEffect(() => {
    drawingService.init().then(() => {
      drawingService.loadDrawing(id).then((drawing) => {
        setDrawing(drawing);
      });
    });
  }, [id]);

  return (
    <div className="h-screen flex flex-col">
      <DrawingViewer drawingUrl={currentDrawing} />
    </div>
  );
}


Next steps would be:

Implement the drawing renderer for AutoCAD files
Add measurement tools
Implement signal path tracing
Add search functionality
Build the caching system