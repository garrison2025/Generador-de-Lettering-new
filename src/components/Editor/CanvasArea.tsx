import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text as KonvaText, Group, Image as KonvaImage, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import { useEditorStore } from '@/store/useEditorStore';
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
    backgroundImage, canvasRatio, overlayColor, overlayOpacity
  } = useEditorStore();

  const [fontLoaded, setFontLoaded] = useState(false);
  const [bgImageObj] = useImage(backgroundImage || '');

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
    setFontLoaded(false);
    loadFont(fontFamily).then(() => {
      // Pequeño retraso para asegurar que el motor de renderizado del navegador
      // haya aplicado la fuente al contexto del canvas
      setTimeout(() => {
        if (active) {
          setFontLoaded(true);
          // Forzar a Konva a redibujar todo
          stageRef.current?.batchDraw();
        }
      }, 100);
    });
    return () => { active = false; };
  }, [fontFamily]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    
    const handleExport = (e: CustomEvent<{format: 'png' | 'jpeg' | 'webp', pixelRatio?: number}>) => {
      const { format, pixelRatio = 3 } = e.detail;
      if (!stageRef.current) return;
      
      // Hide transformer before export
      if (trRef.current) trRef.current.nodes([]);
      
      // Small delay to allow the transformer to disappear before taking snapshot
      setTimeout(() => {
        if (!stageRef.current) return;
        const config: any = {
          mimeType: `image/${format}`,
          pixelRatio: pixelRatio,
        };

        let dataUrl = stageRef.current.toDataURL(config);
        
        if ((format === 'jpeg' || format === 'webp') && backgroundColor === 'transparent' && !backgroundImage) {
           const canvas = document.createElement("canvas");
           const img = new Image();
           img.onload = () => {
             canvas.width = img.width;
             canvas.height = img.height;
             const ctx = canvas.getContext("2d");
             if (ctx) {
               ctx.fillStyle = '#ffffff';
               ctx.fillRect(0, 0, canvas.width, canvas.height);
               ctx.drawImage(img, 0, 0);
               const finalUrl = canvas.toDataURL(`image/${format}`, format === 'webp' ? 0.9 : 1.0);
               triggerDownload(finalUrl, format);
             }
           };
           img.src = dataUrl;
        } else {
           triggerDownload(dataUrl, format);
        }
        
        // Restore selected node if it was previously selected
        if (groupRef.current && isSelected) {
          trRef.current?.nodes([groupRef.current]);
        }
      }, 50);
    };

    const triggerDownload = (url: string, format: string) => {
      const link = document.createElement('a');
      link.download = `lettering-export.${format}`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    window.addEventListener('export-canvas', handleExport as EventListener);
    
    return () => {
      observer.disconnect();
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
              {fontLoaded && dimensions.width > 0 && (
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
                   x={stageWidth / 2}
                   y={stageHeight / 2}
                 rotation={rotation}
                 draggable
                 onClick={() => {
                   setIsSelected(true);
                   if (groupRef.current && trRef.current) {
                     trRef.current.nodes([groupRef.current]);
                   }
                 }}
                 onTap={() => {
                   setIsSelected(true);
                   if (groupRef.current && trRef.current) {
                     trRef.current.nodes([groupRef.current]);
                   }
                 }}
                 onTransformEnd={(e) => {
                   const node = groupRef.current;
                   if (node) {
                     const scaleX = node.scaleX();
                     const newFontSize = Math.max(12, fontSize * scaleX);
                     node.scaleX(1);
                     node.scaleY(1);
                     useEditorStore.getState().updateState({
                       rotation: Math.round(node.rotation()),
                       fontSize: Math.round(newFontSize)
                     });
                   }
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
