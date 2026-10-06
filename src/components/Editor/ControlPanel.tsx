import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore, type EditorState } from '@/store/useEditorStore';
import { useShallow } from 'zustand/react/shallow';
import { FONTS, PRESET_COLORS, loadFontPreviews } from '@/lib/fonts';
import { AlignLeft, AlignCenter, AlignRight, Check, ChevronDown } from 'lucide-react';

type ColorField =
  | 'textColor'
  | 'gradientStartColor'
  | 'gradientEndColor'
  | 'overlayColor'
  | 'shadowColor'
  | 'strokeColor';

type LocalSliderProps = {
  value: number[];
  onValueChange: (value: number[]) => void;
  onValueCommit?: (initialValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

function Slider({
  value,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  className = ''
}: LocalSliderProps) {
  const initialValueRef = useRef<number | null>(null);

  const captureInitialValue = (currentValue: number) => {
    if (initialValueRef.current === null) {
      initialValueRef.current = currentValue;
    }
  };

  const commitValue = () => {
    if (initialValueRef.current === null) return;
    const initialValue = initialValueRef.current;
    initialValueRef.current = null;
    onValueCommit?.(initialValue);
  };

  return (
    <input
      type="range"
      value={value[0] ?? min}
      min={min}
      max={max}
      step={step}
      onPointerDown={(event) => captureInitialValue(Number(event.currentTarget.value))}
      onFocus={(event) => captureInitialValue(Number(event.currentTarget.value))}
      onChange={(event) => onValueChange([Number(event.target.value)])}
      onPointerUp={commitValue}
      onBlur={commitValue}
      className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#5A4AD2] ${className}`}
    />
  );
}

export function ControlPanel() {
  const store = useEditorStore(useShallow((state) => ({
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
    updateState: state.updateState,
    previewState: state.previewState,
    commitPreview: state.commitPreview,
  })));
  const [activeTab, setActiveTab] = useState<'texto' | 'estilo' | 'efectos'>('texto');
  const [isFontSelectOpen, setIsFontSelectOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textEditStartRef = useRef<string | null>(null);
  const colorEditStartRef = useRef<Partial<Record<ColorField, string>>>({});
  const backgroundEditStartRef = useRef<Pick<EditorState, 'backgroundColor' | 'backgroundImage'> | null>(null);

  const beginColorEdit = (field: ColorField, value: string) => {
    if (colorEditStartRef.current[field] === undefined) {
      colorEditStartRef.current[field] = value;
    }
  };

  const previewColor = (field: ColorField, value: string) => {
    store.previewState({ [field]: value } as Partial<EditorState>);
  };

  const commitColorEdit = (field: ColorField) => {
    const initialValue = colorEditStartRef.current[field];
    if (initialValue === undefined) return;
    delete colorEditStartRef.current[field];
    store.commitPreview({ [field]: initialValue } as Partial<EditorState>);
  };

  const beginBackgroundColorEdit = () => {
    if (backgroundEditStartRef.current) return;
    backgroundEditStartRef.current = {
      backgroundColor: store.backgroundColor,
      backgroundImage: store.backgroundImage,
    };
  };

  const previewBackgroundColor = (value: string) => {
    store.previewState({
      backgroundColor: value,
      backgroundImage: null,
    });
  };

  const commitBackgroundColorEdit = () => {
    const initialState = backgroundEditStartRef.current;
    if (!initialState) return;
    backgroundEditStartRef.current = null;
    store.commitPreview(initialState);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFontSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedFont = FONTS.find(f => f.family === store.fontFamily) || FONTS[0];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden z-10 w-full">
      <div className="overflow-y-auto w-full overscroll-contain">
        <div className="w-full">
          <div className="w-full grid grid-cols-3 bg-gray-100 border-b border-gray-200" role="tablist" aria-label="Controles del editor">
            {[
              { id: 'texto', label: 'Texto' },
              { id: 'estilo', label: 'Estilo' },
              { id: 'efectos', label: 'Efectos' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as 'texto' | 'estilo' | 'efectos')}
                className={`py-2.5 text-sm font-medium transition border-b-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 border-[#5A4AD2]'
                    : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === 'texto' && (
              <div className="space-y-6 mt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700">Texto para Lettering</label>
                  <span className="text-[10px] text-gray-400">Pulsación o Escribe</span>
                </div>
                <textarea 
                  value={store.text}
                  onFocus={() => {
                    if (textEditStartRef.current === null) {
                      textEditStartRef.current = store.text;
                    }
                  }}
                  onChange={(e) => store.previewState({ text: e.target.value })}
                  onBlur={() => {
                    if (textEditStartRef.current === null) return;
                    const initialText = textEditStartRef.current;
                    textEditStartRef.current = null;
                    store.commitPreview({ text: initialText });
                  }}
                  className="w-full border border-gray-200 rounded-lg p-3 min-h-[90px] text-sm resize-none focus:ring-1 focus:ring-[#5A4AD2] focus:border-[#5A4AD2] outline-none"
                  placeholder="Tu texto aquí..."
                />
                
                {/* Quick Emoji / Symbol inserter */}
                <div className="pt-1">
                  <span className="text-[10px] font-semibold text-gray-500 block mb-1.5">Símbolos Decorativos Rápidos:</span>
                  <div className="flex flex-wrap gap-1">
                    {['✨', '🌸', '🌿', '⚡', '💖', '👑', '✦', '🖤', '🦋', '🌟', '🌺', '🎈', '🎨', '🔥', '☕', '🚀'].map((symbol) => (
                      <button
                        key={symbol}
                        type="button"
                        onClick={() => store.updateState({ text: store.text + ' ' + symbol })}
                        className="w-7 h-7 bg-gray-50 hover:bg-purple-100 hover:text-[#5A4AD2] border border-gray-200 rounded-md text-xs flex items-center justify-center transition"
                        title={`Añadir ${symbol}`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Phrases */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-500 block mb-1.5">Frases de Ejemplo:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Buenos Días ✨',
                      'Love Yourself 💖',
                      'Dream Big 🚀',
                      'Good Vibes 🌿',
                      '¡Feliz Cumpleaños! 🎉',
                      'Hazlo con Pasión 🔥'
                    ].map((phrase) => (
                      <button
                        key={phrase}
                        type="button"
                        onClick={() => store.updateState({ text: phrase })}
                        className="text-[11px] px-2.5 py-1 bg-purple-50 hover:bg-[#5A4AD2] text-[#5A4AD2] hover:text-white rounded-md font-medium transition"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-xs font-semibold text-gray-700">Estilo de Letra</label>
                <button 
                  type="button"
                  onClick={() => {
                    if (!isFontSelectOpen) void loadFontPreviews();
                    setIsFontSelectOpen(!isFontSelectOpen);
                  }}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 focus:ring-1 focus:ring-[#5A4AD2] outline-none text-left"
                >
                  <span className="text-xl" style={{ fontFamily: selectedFont.family }}>{selectedFont.group}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isFontSelectOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-50 max-h-64 overflow-y-auto">
                    {FONTS.map(font => {
                      const isSelected = store.fontFamily === font.family;
                      return (
                        <button
                          key={font.family}
                          type="button"
                          className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-[#FCD34D] transition-colors ${isSelected ? 'bg-gray-50' : ''}`}
                          onClick={() => {
                            store.updateState({ fontFamily: font.family });
                            setIsFontSelectOpen(false);
                          }}
                        >
                          <div className="w-4 flex justify-center text-[#5A4AD2]">
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                          <span className="text-xl px-1 py-1" style={{ fontFamily: font.family }}>{font.group}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-700">Tamaño</label>
                  <span className="text-xs text-gray-500">{store.fontSize}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <Slider 
                    value={[store.fontSize]} 
                    onValueChange={(val: any) => store.previewState({ fontSize: Array.isArray(val) ? val[0] : val })}
                     onValueCommit={(initial) => store.commitPreview({ fontSize: initial })}
                    min={10} max={200} step={1}
                    className="flex-1"
                  />
                  <input 
                    type="number"
                    value={store.fontSize}
                    onChange={(e) => store.updateState({ fontSize: Number(e.target.value) })}
                    className="w-14 border border-gray-200 rounded p-1 text-center text-sm outline-none focus:border-[#5A4AD2]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-700">Alineación</label>
                </div>
                <div className="flex gap-2 w-32">
                  <button aria-label="Alinear a la izquierda" onClick={() => store.updateState({ textAlign: 'left' })} className={`flex-1 flex justify-center items-center py-2 rounded border ${store.textAlign === 'left' ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}><AlignLeft className="w-4 h-4" /></button>
                  <button aria-label="Alinear al centro" onClick={() => store.updateState({ textAlign: 'center' })} className={`flex-1 flex justify-center items-center py-2 rounded border ${store.textAlign === 'center' ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}><AlignCenter className="w-4 h-4" /></button>
                  <button aria-label="Alinear a la derecha" onClick={() => store.updateState({ textAlign: 'right' })} className={`flex-1 flex justify-center items-center py-2 rounded border ${store.textAlign === 'right' ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}><AlignRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-700">Interletraje</label>
                  <span className="text-xs text-gray-500">{store.letterSpacing}px</span>
                </div>
                <Slider 
                  value={[store.letterSpacing]} 
                  onValueChange={(val) => store.previewState({ letterSpacing: Array.isArray(val) ? val[0] : val as unknown as number })}
                   onValueCommit={(initial) => store.commitPreview({ letterSpacing: initial })}
                  min={-20} max={50} step={1}
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-700">Interlineado</label>
                  <span className="text-xs text-gray-500">{store.lineHeight}</span>
                </div>
                <Slider 
                  value={[store.lineHeight]} 
                  onValueChange={(val) => store.previewState({ lineHeight: Array.isArray(val) ? val[0] : val as unknown as number })}
                   onValueCommit={(initial) => store.commitPreview({ lineHeight: initial })}
                  min={0.5} max={3} step={0.1}
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-gray-700">Rotación</label>
                  <span className="text-xs text-gray-500">{store.rotation}°</span>
                </div>
                <Slider 
                  value={[store.rotation]} 
                  onValueChange={(val) => store.previewState({ rotation: Array.isArray(val) ? val[0] : val as unknown as number })}
                   onValueCommit={(initial) => store.commitPreview({ rotation: initial })}
                  min={-180} max={180} step={1}
                />
              </div>

              </div>
            )}

            {activeTab === 'estilo' && (
              <div className="space-y-6 mt-0">
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <label className="text-xs font-semibold text-gray-700">Color de Texto</label>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => store.updateState({ isGradient: false })} 
                       className={`text-[10px] px-2 py-0.5 rounded border ${!store.isGradient ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                     >Sólido</button>
                     <button 
                       onClick={() => store.updateState({ isGradient: true })} 
                       className={`text-[10px] px-2 py-0.5 rounded border ${store.isGradient ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                     >Gradiente</button>
                   </div>
                 </div>
                 
                 {!store.isGradient ? (
                   <div className="flex flex-wrap gap-2">
                     {PRESET_COLORS.map(color => (
                       <button 
                         key={color}
                         onClick={() => store.updateState({ textColor: color })}
                         className={`w-8 h-8 rounded-full border-2 ${store.textColor === color ? 'border-[#5A4AD2] scale-110 shadow-sm' : 'border-gray-200'} transition-all`}
                         style={{ backgroundColor: color }}
                       />
                     ))}
                     <input
                       type="color"
                       value={store.textColor}
                       onFocus={() => beginColorEdit('textColor', store.textColor)}
                       onPointerDown={() => beginColorEdit('textColor', store.textColor)}
                       onChange={(e) => previewColor('textColor', e.target.value)}
                       onBlur={() => commitColorEdit('textColor')}
                       className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden"
                     />
                   </div>
                 ) : (
                   <div className="flex gap-4 items-center">
                     <div className="flex flex-col gap-1 items-center">
                       <span className="text-[10px] text-gray-500">Inicio</span>
                       <input
                         type="color"
                         value={store.gradientStartColor}
                         onFocus={() => beginColorEdit('gradientStartColor', store.gradientStartColor)}
                         onPointerDown={() => beginColorEdit('gradientStartColor', store.gradientStartColor)}
                         onChange={(e) => previewColor('gradientStartColor', e.target.value)}
                         onBlur={() => commitColorEdit('gradientStartColor')}
                         className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm"
                       />
                     </div>
                     <div className="h-4 w-12 rounded bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${store.gradientStartColor}, ${store.gradientEndColor})` }} />
                     <div className="flex flex-col gap-1 items-center">
                       <span className="text-[10px] text-gray-500">Fin</span>
                       <input
                         type="color"
                         value={store.gradientEndColor}
                         onFocus={() => beginColorEdit('gradientEndColor', store.gradientEndColor)}
                         onPointerDown={() => beginColorEdit('gradientEndColor', store.gradientEndColor)}
                         onChange={(e) => previewColor('gradientEndColor', e.target.value)}
                         onBlur={() => commitColorEdit('gradientEndColor')}
                         className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm"
                       />
                     </div>
                   </div>
                 )}
               </div>

               <div className="space-y-4 pt-2 border-t border-gray-100">
                 <div className="flex justify-between">
                   <label className="text-xs font-semibold text-gray-700">Opacidad del Texto</label>
                   <span className="text-xs text-gray-500">{Math.round(store.textOpacity * 100)}%</span>
                 </div>
                 <Slider 
                   value={[store.textOpacity * 100]} 
                   onValueChange={(val: any) => store.previewState({ textOpacity: (Array.isArray(val) ? val[0] : val) / 100 })}
                    onValueCommit={(initial) => store.commitPreview({ textOpacity: initial / 100 })}
                   min={0} max={100} step={1}
                 />
               </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-700">Fondo</label>
                <div className="flex flex-wrap gap-2 items-center">
                  <button 
                    onClick={() => store.updateState({ backgroundColor: 'transparent', backgroundImage: null })}
                    className={`h-8 px-3 rounded-full border-2 text-xs ${store.backgroundColor === 'transparent' && !store.backgroundImage ? 'border-[#5A4AD2] bg-[#5A4AD2]/5 text-[#5A4AD2] font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} transition-all flex items-center justify-center`}
                  >
                    Ninguno
                  </button>
                  <label className="h-8 px-3 rounded-full border-2 border-gray-200 text-xs text-gray-600 hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-all">
                    <span>Subir Imagen</span>
                    <input 
                      type="file" 
                      accept="image/png,image/jpeg,image/webp" 
                      className="hidden" 
                      onChange={async (e) => {
                        const input = e.currentTarget;
                        const file = input.files?.[0];
                        if (!file) return;

                        const maxBytes = 10 * 1024 * 1024;
                        const maxPixels = 25_000_000;

                        const allowedTypes = new Set([
                          'image/png',
                          'image/jpeg',
                          'image/webp',
                        ]);

                        if (!allowedTypes.has(file.type)) {
                          window.alert('Formato no compatible. Usa una imagen PNG, JPG o WEBP.');
                          input.value = '';
                          return;
                        }

                        if (file.size > maxBytes) {
                          window.alert('La imagen supera 10 MB. Elige una imagen más ligera para mantener el editor fluido.');
                          input.value = '';
                          return;
                        }

                        const readDimensions = async () => {
                          if ('createImageBitmap' in window) {
                            const bitmap = await createImageBitmap(file);
                            const dimensions = { width: bitmap.width, height: bitmap.height };
                            bitmap.close();
                            return dimensions;
                          }

                          return await new Promise<{ width: number; height: number }>((resolve, reject) => {
                            const objectUrl = URL.createObjectURL(file);
                            const image = new Image();

                            image.onload = () => {
                              const dimensions = {
                                width: image.naturalWidth,
                                height: image.naturalHeight,
                              };
                              URL.revokeObjectURL(objectUrl);
                              resolve(dimensions);
                            };

                            image.onerror = () => {
                              URL.revokeObjectURL(objectUrl);
                              reject(new Error('image-decode-failed'));
                            };

                            image.src = objectUrl;
                          });
                        };

                        try {
                          const { width, height } = await readDimensions();

                          if (!width || !height || width * height > maxPixels) {
                            window.alert('La imagen es demasiado grande para editarla con fluidez. Usa una imagen de hasta 25 megapíxeles.');
                            input.value = '';
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const result = ev.target?.result;
                            if (typeof result === 'string') {
                              store.updateState({ backgroundImage: result });
                            }
                          };
                          reader.onerror = () => {
                            window.alert('No se pudo leer la imagen. Prueba con otro archivo.');
                          };
                          reader.readAsDataURL(file);
                        } catch {
                          window.alert('No se pudo abrir la imagen seleccionada. Prueba con un archivo PNG, JPG o WEBP válido.');
                        } finally {
                          input.value = '';
                        }
                      }} 
                    />
                  </label>
                  <input
                    type="color"
                    aria-label="Color de fondo"
                    value={store.backgroundColor === 'transparent' ? '#ffffff' : store.backgroundColor}
                    onFocus={beginBackgroundColorEdit}
                    onPointerDown={beginBackgroundColorEdit}
                    onChange={(event) => previewBackgroundColor(event.target.value)}
                    onBlur={commitBackgroundColorEdit}
                    className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden"
                  />
                  {PRESET_COLORS.filter(c => c !== 'transparent').map(color => (
                    <button 
                      key={color}
                      onClick={() => store.updateState({ backgroundColor: color, backgroundImage: null })}
                      className={`w-8 h-8 rounded-full border-2 ${store.backgroundColor === color && !store.backgroundImage ? 'border-[#5A4AD2] scale-110 shadow-sm' : 'border-gray-200'} transition-all`}
                      style={{ backgroundColor: color }}
                      aria-label={`Fondo ${color}`}
                    />
                  ))}
                  {store.backgroundImage && (
                     <div 
                       className="w-8 h-8 rounded-full border-2 border-[#5A4AD2] scale-110 shadow-sm bg-cover bg-center"
                       style={{ backgroundImage: `url(${store.backgroundImage})` }}
                     />
                  )}
                </div>
              </div>

              {(store.backgroundImage || store.backgroundColor !== 'transparent') && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-700">Filtro de Fondo (Oscurecer)</label>
                    <input 
                      type="color" 
                      value={store.overlayColor}
                      onFocus={() => beginColorEdit('overlayColor', store.overlayColor)}
                      onPointerDown={() => beginColorEdit('overlayColor', store.overlayColor)}
                      onChange={(e) => previewColor('overlayColor', e.target.value)}
                      onBlur={() => commitColorEdit('overlayColor')}
                      className="w-6 h-6 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm" 
                    />
                  </div>
                  <Slider 
                    value={[store.overlayOpacity * 100]} 
                    onValueChange={(val: any) => store.previewState({ overlayOpacity: (Array.isArray(val) ? val[0] : val) / 100 })}
                     onValueCommit={(initial) => store.commitPreview({ overlayOpacity: initial / 100 })}
                    min={0} max={100} step={1}
                  />
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-700">Proporción del Lienzo (Aspect Ratio)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: 'free', label: 'Estandar' },
                    { val: '1:1', label: '1:1' },
                    { val: '16:9', label: '16:9' },
                    { val: '9:16', label: '9:16' }
                  ].map(ratio => (
                    <button
                      key={ratio.val}
                      onClick={() => store.updateState({ canvasRatio: ratio.val as any })}
                      className={`py-1.5 text-xs font-medium rounded border ${store.canvasRatio === ratio.val ? 'bg-[#5A4AD2] text-white border-[#5A4AD2]' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>
              </div>
            )}

            {activeTab === 'efectos' && (
              <div className="space-y-8 mt-0">
               <div className="space-y-6">
                <h3 className="font-bold border-b pb-2 text-sm text-gray-800">Sombra</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-gray-700">Desenfoque</label>
                    <span className="text-xs text-gray-500">{store.shadowBlur}px</span>
                  </div>
                  <Slider value={[store.shadowBlur]} onValueChange={(val: any) => store.previewState({ shadowBlur: Array.isArray(val) ? val[0] : val })} onValueCommit={(initial) => store.commitPreview({ shadowBlur: initial })} min={0} max={50} step={1} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-gray-700">Desplazamiento</label>
                    <span className="text-xs text-gray-500">{store.shadowOffsetX}, {store.shadowOffsetY}</span>
                  </div>
                  <div className="flex gap-4">
                    <Slider value={[store.shadowOffsetX]} onValueChange={(val: any) => store.previewState({ shadowOffsetX: Array.isArray(val) ? val[0] : val })} onValueCommit={(initial) => store.commitPreview({ shadowOffsetX: initial })} min={-50} max={50} step={1} className="flex-1" />
                    <Slider value={[store.shadowOffsetY]} onValueChange={(val: any) => store.previewState({ shadowOffsetY: Array.isArray(val) ? val[0] : val })} onValueCommit={(initial) => store.commitPreview({ shadowOffsetY: initial })} min={-50} max={50} step={1} className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2 items-center flex justify-between">
                  <label className="text-xs font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={store.shadowColor}
                    onFocus={() => beginColorEdit('shadowColor', store.shadowColor)}
                    onPointerDown={() => beginColorEdit('shadowColor', store.shadowColor)}
                    onChange={(e) => previewColor('shadowColor', e.target.value)}
                    onBlur={() => commitColorEdit('shadowColor')}
                    className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold border-b pb-2 text-sm text-gray-800">Contorno</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-gray-700">Grosor</label>
                    <span className="text-xs text-gray-500">{store.strokeWidth}px</span>
                  </div>
                  <Slider value={[store.strokeWidth]} onValueChange={(val: any) => store.previewState({ strokeWidth: Array.isArray(val) ? val[0] : val })} onValueCommit={(initial) => store.commitPreview({ strokeWidth: initial })} min={0} max={20} step={1} />
                </div>
                <div className="space-y-2 items-center flex justify-between">
                  <label className="text-xs font-medium text-gray-700">Color</label>
                  <input
                    type="color"
                    value={store.strokeColor}
                    onFocus={() => beginColorEdit('strokeColor', store.strokeColor)}
                    onPointerDown={() => beginColorEdit('strokeColor', store.strokeColor)}
                    onChange={(e) => previewColor('strokeColor', e.target.value)}
                    onBlur={() => commitColorEdit('strokeColor')}
                    className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm"
                  />
                </div>
              </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
