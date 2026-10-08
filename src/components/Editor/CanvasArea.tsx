import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text as KonvaText, Group, Image as KonvaImage, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import { useEditorStore } from '@/store/useEditorStore';
import { useShallow } from 'zustand/react/shallow';
import { loadFont } from '@/lib/fonts';

export function CanvasArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isSelected, setIsSelected] = useState(false);
  
  const {
    text, fontFamily, fontSize, letterSpacing, lineHeight, textAlign, textColor, backgroundColor,
    textOpacity, isGradient, gradientStartColor, gradientEndColor,
    shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, strokeWidth, strokeColor, rotation,
    textOffsetX, textOffsetY, backgroundImage, canvasRatio, overlayColor, overlayOpacity
  } = useEditorStore(useShallow((state) => ({
    text: state.text,
    fontFamily: state.fontFamily,
    fontSize: state.fontSize,
    letterSpacing: state.letterSpacing,
    lineHeight: state.lineHeight,
    textAlign: state.textAlign,
    textColor: state.textColor,
    backgroundColor: state.backgroundColor,
    textOpacity: state.textOpacity,
    isGradient: state.isGradient,
    gradientStartColor: state.gradientStartColor,
    gradientEndColor: state.gradientEndColor,
    shadowOffsetX: state.shadowOffsetX,
    shadowOffsetY: state.shadowOffsetY,
    shadowBlur: state.shadowBlur,
    shadowColor: state.shadowColor,
    strokeWidth: state.strokeWidth,
    strokeColor: state.strokeColor,
    rotation: state.rotation,
    textOffsetX: state.textOffsetX,
    textOffsetY: state.textOffsetY,
    backgroundImage: state.backgroundImage,
    canvasRatio: state.canvasRatio,
    overlayColor: state.overlayColor,
    overlayOpacity: state.overlayOpacity,
  })));

  const [bgImageObj] = useImage(backgroundImage || '');

  useEffect(() => {
    // The transformer mounts after selection, so bind it after React commits.
    if (isSelected && groupRef.current && trRef.current) {
      trRef.current.nodes([groupRef.current]);
    }
  }, [isSelected]);

  let stageWidth = dimensions.width;
  let stageHeight = dimensions.height;

  if (canvasRatio && canvasRatio !== 'free' && dimensions.width && dimensions.height) {
    const ratioMap = {
      '1:1': 1,
      '16:9': 16/9,
      '9:16': 9/16
    };
    const targetRatio = ratioMap[canvasRatio];
    const containerRatio = dimensions.width / dimensions.height;

    if (containerRatio > targetRatio) {
      stageHeight = dimensions.height;
      stageWidth = stageHeight * targetRatio;
    } else {
      stageWidth = dimensions.width;
      stageHeight = stageWidth / targetRatio;
    }
  }

  // Calculate background scale to cover the canvas
  let bgScale = 1;
  let bgX = 0;
  let bgY = 0;
  if (bgImageObj) {
    const scaleX = stageWidth / bgImageObj.width;
    const scaleY = stageHeight / bgImageObj.height;
    bgScale = Math.max(scaleX, scaleY);
    bgX = (stageWidth - bgImageObj.width * bgScale) / 2;
    bgY = (stageHeight - bgImageObj.height * bgScale) / 2;
  }

  useEffect(() => {
    let active = true;
    let redrawFrame: number | null = null;

    // Keep Konva mounted and interactive while the requested font downloads.
    // It can render with a fallback immediately, then redraw once that specific
    // font is ready instead of blanking/remounting the entire canvas.
    void loadFont(fontFamily).then(() => {
      if (!active) return;

      redrawFrame = window.requestAnimationFrame(() => {
        if (!active) return;
        trRef.current?.forceUpdate();
        stageRef.current?.batchDraw();
      });
    });

    return () => {
      active = false;
      if (redrawFrame !== null) {
        window.cancelAnimationFrame(redrawFrame);
      }
    };
  }, [fontFamily]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = Math.max(0, Math.round(entry.contentRect.width));
      const height = Math.max(0, Math.round(entry.contentRect.height));

      setDimensions((current) => (
        current.width === width && current.height === height
          ? current
          : { width, height }
      ));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const triggerDownload = (url: string, requestedFormat: 'png' | 'jpeg' | 'webp') => {
      const mimeMatch = url.match(/^data:image\/([^;,]+)/i);
      const actualFormat = (mimeMatch?.[1] || requestedFormat).toLowerCase();
      const extension = actualFormat === 'jpeg' ? 'jpg' : actualFormat;

      if (requestedFormat === 'webp' && actualFormat !== 'webp') {
        window.alert('Tu navegador no admite exportación WEBP. La imagen se descargará como PNG.');
      }

      const link = document.createElement('a');
      link.download = `lettering-export.${extension}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handleExport = (e: CustomEvent<{format: 'png' | 'jpeg' | 'webp', pixelRatio?: number}>) => {
      const { format, pixelRatio = 3 } = e.detail;
      if (!stageRef.current) return;

      if (trRef.current) trRef.current.nodes([]);

      setTimeout(() => {
        try {
          if (!stageRef.current) return;

          const needsOpaqueComposite =
            (format === 'jpeg' || format === 'webp') &&
            backgroundColor === 'transparent' &&
            !backgroundImage;

          const dataUrl = stageRef.current.toDataURL({
            // Preserve alpha until we explicitly composite onto white.
            mimeType: needsOpaqueComposite ? 'image/png' : `image/${format}`,
            pixelRatio,
          });

          if (needsOpaqueComposite) {
            const canvas = document.createElement('canvas');
            const img = new Image();

            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');

              if (!ctx) {
                window.alert('No se pudo preparar la imagen para exportar. Inténtalo de nuevo.');
                return;
              }

              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);

              const finalUrl = canvas.toDataURL(
                `image/${format}`,
                format === 'webp' ? 0.9 : 1.0
              );
              triggerDownload(finalUrl, format);
            };

            img.onerror = () => {
              window.alert('No se pudo preparar la imagen para exportar. Inténtalo de nuevo.');
            };
            img.src = dataUrl;
          } else {
            triggerDownload(dataUrl, format);
          }
        } catch {
          window.alert('No se pudo exportar el diseño. Prueba una resolución menor o vuelve a intentarlo.');
        } finally {
          if (groupRef.current && isSelected) {
            trRef.current?.nodes([groupRef.current]);
          }
        }
      }, 50);
    };

    window.addEventListener('export-canvas', handleExport as EventListener);

    return () => {
      window.removeEventListener('export-canvas', handleExport as EventListener);
    };
  }, [backgroundColor, backgroundImage, isSelected]);

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden">
      <div 
        className="relative shadow-sm"
        style={{ 
          width: stageWidth, 
          height: stageHeight,
          backgroundColor: backgroundColor === 'transparent' ? '#f3f4f6' : backgroundColor
        }}
      >
        {backgroundColor === 'transparent' && (
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAXUlEQVQ4T2NkYGBg+P///38whrHAioEBmI2MgzQyMTAwMDIwMDTj10o0DEZGMmxgYGBgYWBgYGHwYhAhXhiMMqKwwzADyTKMWAWjRjEaDCjBSjBqFKMwwyh0I1YIAABKaxv1B+z2mQAAAABJRU5ErkJggg==")', backgroundRepeat: 'repeat' }} />
        )}
              {dimensions.width > 0 && (
           <Stage 
             width={stageWidth} 
             height={stageHeight} 
             id="lettering-stage" 
             ref={stageRef}
             onMouseDown={(e) => {
               // deselect when clicked on empty area
               const clickedOnEmpty = e.target === e.target.getStage() || e.target.className === 'Rect' || e.target.className === 'Image';
               if (clickedOnEmpty) {
                 setIsSelected(false);
                 trRef.current?.nodes([]);
               }
             }}
             onTouchStart={(e) => {
               const clickedOnEmpty = e.target === e.target.getStage() || e.target.className === 'Rect' || e.target.className === 'Image';
               if (clickedOnEmpty) {
                 setIsSelected(false);
                 trRef.current?.nodes([]);
               }
             }}
           >
               <Layer>
                 {backgroundColor !== 'transparent' && !bgImageObj && (
                   <Rect width={stageWidth} height={stageHeight} fill={backgroundColor} listening={false} />
                 )}
                 {bgImageObj && (
                   <KonvaImage 
                     image={bgImageObj} 
                     x={bgX} 
                     y={bgY} 
                     scaleX={bgScale} 
                     scaleY={bgScale} 
                     listening={false}
                   />
                 )}
                 {((bgImageObj || backgroundColor !== 'transparent') && overlayOpacity > 0) && (
                   <Rect width={stageWidth} height={stageHeight} fill={overlayColor} opacity={overlayOpacity} listening={false} />
                 )}
                 <Group
                   ref={groupRef}
                   x={stageWidth / 2 + textOffsetX * stageWidth}
                   y={stageHeight / 2 + textOffsetY * stageHeight}
                 rotation={rotation}
                 draggable
                 dragBoundFunc={(position) => ({
                   x: Math.min(stageWidth, Math.max(0, position.x)),
                   y: Math.min(stageHeight, Math.max(0, position.y)),
                 })}
                 onClick={() => {
                   setIsSelected(true);
                 }}
                 onTap={() => {
                   setIsSelected(true);
                 }}
                 onDragEnd={(event) => {
                   useEditorStore.getState().updateState({
                     textOffsetX: stageWidth > 0 ? (event.target.x() - stageWidth / 2) / stageWidth : 0,
                     textOffsetY: stageHeight > 0 ? (event.target.y() - stageHeight / 2) / stageHeight : 0,
                   });
                 }}
                 onTransformEnd={() => {
                   const node = groupRef.current;
                   if (!node) return;

                   const scaleX = Math.abs(node.scaleX());
                   const newFontSize = Math.max(12, fontSize * scaleX);
                   const nextOffsetX = stageWidth > 0 ? (node.x() - stageWidth / 2) / stageWidth : 0;
                   const nextOffsetY = stageHeight > 0 ? (node.y() - stageHeight / 2) / stageHeight : 0;

                   node.scaleX(1);
                   node.scaleY(1);

                   useEditorStore.getState().updateState({
                     rotation: Math.round(node.rotation()),
                     fontSize: Math.round(newFontSize),
                     textOffsetX: nextOffsetX,
                     textOffsetY: nextOffsetY,
                   });
                 }}
               >
                 <KonvaText
                   text={text}
                   fontFamily={fontFamily}
                   fontSize={fontSize}
                   letterSpacing={letterSpacing}
                   lineHeight={lineHeight}
                   fill={isGradient ? undefined : textColor}
                   fillLinearGradientStartPoint={isGradient ? { x: -stageWidth/4, y: 0 } : undefined}
                   fillLinearGradientEndPoint={isGradient ? { x: stageWidth/4, y: 0 } : undefined}
                   fillLinearGradientColorStops={isGradient ? [0, gradientStartColor, 1, gradientEndColor] : undefined}
                   opacity={textOpacity}
                   align={textAlign}
                   width={stageWidth}
                   x={-stageWidth / 2}
                   y={-(text.split('\n').length * fontSize * lineHeight) / 2 - 40}
                   padding={40}
                   shadowColor={shadowColor}
                   shadowBlur={shadowBlur}
                   shadowOffset={{ x: shadowOffsetX, y: shadowOffsetY }}
                   shadowOpacity={shadowBlur > 0 || shadowOffsetX !== 0 || shadowOffsetY !== 0 ? 1 : 0}
                   stroke={strokeColor}
                   strokeWidth={strokeWidth}
                 />
               </Group>
               {isSelected && (
                 <Transformer
                   ref={trRef}
                   flipEnabled={false}
                   boundBoxFunc={(oldBox, newBox) => {
                     // Limit minimum size
                     if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50) {
                       return oldBox;
                     }
                     return newBox;
                   }}
                 />
               )}
             </Layer>
         </Stage>
      )}
      </div>
    </div>
  );
}
