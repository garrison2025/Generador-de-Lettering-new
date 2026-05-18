import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { FONTS, PRESET_COLORS } from '@/lib/fonts';
import { AlignLeft, AlignCenter, AlignRight, Check, ChevronDown } from 'lucide-react';

export function ControlPanel() {
  const store = useEditorStore();
  const [isFontSelectOpen, setIsFontSelectOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        <Tabs defaultValue="texto" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100 rounded-none border-b border-gray-200">
            <TabsTrigger value="texto" className="text-sm rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#5A4AD2]">Texto</TabsTrigger>
            <TabsTrigger value="estilo" className="text-sm rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#5A4AD2]">Estilo</TabsTrigger>
            <TabsTrigger value="efectos" className="text-sm rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#5A4AD2]">Efectos</TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="texto" className="space-y-6 mt-0">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Texto para Lettering</label>
                <textarea 
                  value={store.text}
                  onChange={e => store.updateState({ text: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-3 min-h-[100px] text-sm resize-none focus:ring-1 focus:ring-[#5A4AD2] focus:border-[#5A4AD2] outline-none"
                  placeholder="Tu texto aquí"
                />
              </div>

              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-xs font-semibold text-gray-700">Estilo de Letra</label>
                <button 
                  type="button"
                  onClick={() => setIsFontSelectOpen(!isFontSelectOpen)}
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
                    onValueChange={(val: any) => store.updateState({ fontSize: Array.isArray(val) ? val[0] : val })}
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
                  onValueChange={(val) => store.updateState({ letterSpacing: Array.isArray(val) ? val[0] : val as unknown as number })}
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
                  onValueChange={(val) => store.updateState({ lineHeight: Array.isArray(val) ? val[0] : val as unknown as number })}
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
                  onValueChange={(val) => store.updateState({ rotation: Array.isArray(val) ? val[0] : val as unknown as number })}
                  min={-180} max={180} step={1}
                />
              </div>

            </TabsContent>

            <TabsContent value="estilo" className="space-y-6 mt-0">
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
                     <input type="color" value={store.textColor} onChange={e => store.updateState({ textColor: e.target.value })} className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden" />
                   </div>
                 ) : (
                   <div className="flex gap-4 items-center">
                     <div className="flex flex-col gap-1 items-center">
                       <span className="text-[10px] text-gray-500">Inicio</span>
                       <input type="color" value={store.gradientStartColor} onChange={e => store.updateState({ gradientStartColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm" />
                     </div>
                     <div className="h-4 w-12 rounded bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${store.gradientStartColor}, ${store.gradientEndColor})` }} />
                     <div className="flex flex-col gap-1 items-center">
                       <span className="text-[10px] text-gray-500">Fin</span>
                       <input type="color" value={store.gradientEndColor} onChange={e => store.updateState({ gradientEndColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm" />
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
                   onValueChange={(val: any) => store.updateState({ textOpacity: (Array.isArray(val) ? val[0] : val) / 100 })}
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
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => store.updateState({ backgroundImage: ev.target?.result as string });
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                  <input type="color" value={store.backgroundColor} onChange={e => store.updateState({ backgroundColor: e.target.value, backgroundImage: null })} className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden" />
                  {PRESET_COLORS.filter(c => c !== 'transparent').map(color => (
                    <button 
                      key={color}
                      onClick={() => store.updateState({ backgroundColor: color, backgroundImage: null })}
                      className={`w-8 h-8 rounded-full border-2 ${store.backgroundColor === color && !store.backgroundImage ? 'border-[#5A4AD2] scale-110 shadow-sm' : 'border-gray-200'} transition-all`}
                      style={{ backgroundColor: color }}
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
                      onChange={e => store.updateState({ overlayColor: e.target.value })} 
                      className="w-6 h-6 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm" 
                    />
                  </div>
                  <Slider 
                    value={[store.overlayOpacity * 100]} 
                    onValueChange={(val: any) => store.updateState({ overlayOpacity: (Array.isArray(val) ? val[0] : val) / 100 })}
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
            </TabsContent>

            <TabsContent value="efectos" className="space-y-8 mt-0">
               <div className="space-y-6">
                <h3 className="font-bold border-b pb-2 text-sm text-gray-800">Sombra</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-gray-700">Desenfoque</label>
                    <span className="text-xs text-gray-500">{store.shadowBlur}px</span>
                  </div>
                  <Slider value={[store.shadowBlur]} onValueChange={(val: any) => store.updateState({ shadowBlur: Array.isArray(val) ? val[0] : val })} min={0} max={50} step={1} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-gray-700">Desplazamiento</label>
                    <span className="text-xs text-gray-500">{store.shadowOffsetX}, {store.shadowOffsetY}</span>
                  </div>
                  <div className="flex gap-4">
                    <Slider value={[store.shadowOffsetX]} onValueChange={(val: any) => store.updateState({ shadowOffsetX: Array.isArray(val) ? val[0] : val })} min={-50} max={50} step={1} className="flex-1" />
                    <Slider value={[store.shadowOffsetY]} onValueChange={(val: any) => store.updateState({ shadowOffsetY: Array.isArray(val) ? val[0] : val })} min={-50} max={50} step={1} className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2 items-center flex justify-between">
                  <label className="text-xs font-medium text-gray-700">Color</label>
                  <input type="color" value={store.shadowColor} onChange={e => store.updateState({ shadowColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold border-b pb-2 text-sm text-gray-800">Contorno</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-xs font-medium text-gray-700">Grosor</label>
                    <span className="text-xs text-gray-500">{store.strokeWidth}px</span>
                  </div>
                  <Slider value={[store.strokeWidth]} onValueChange={(val: any) => store.updateState({ strokeWidth: Array.isArray(val) ? val[0] : val })} min={0} max={20} step={1} />
                </div>
                <div className="space-y-2 items-center flex justify-between">
                  <label className="text-xs font-medium text-gray-700">Color</label>
                  <input type="color" value={store.strokeColor} onChange={e => store.updateState({ strokeColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer p-0 border border-gray-200 overflow-hidden shadow-sm" />
                </div>
              </div>

            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
