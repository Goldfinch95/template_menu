import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';

interface ColorSettingsCardProps {
  formData: {
    color: {
      primary: string;
      secondary: string;
    };
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorEditor: React.FC<ColorSettingsCardProps> = ({
  formData,
  handleInputChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary');
  const [tempColors, setTempColors] = useState({
    primary: formData.color.primary || '#FF1744',
    secondary: formData.color.secondary || '#2196F3'
  });
  const [hue, setHue] = useState(0);
  const [lightness, setLightness] = useState(50);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setTempColors({
        primary: formData.color.primary || '#FF9000',
        secondary: formData.color.secondary || '#FFFFFF'
      });
    }
  }, [isOpen, formData.color.primary, formData.color.secondary]);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
      if (!ctx) return;
      
      // Habilitar anti-aliasing y suavizado
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const outerRadius = canvas.width / 2 - 10;
      const middleOuterRadius = outerRadius * 0.75;
      const middleInnerRadius = outerRadius * 0.45;
      const innerRadius = middleInnerRadius * 0.7;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. CÍRCULO EXTERIOR: Banda de luminosidad ultra suave
      const outerAngles = 720;
      const outerRadiusSteps = 100;
      
      for (let r = 0; r < outerRadiusSteps; r++) {
        const currentRadius = middleOuterRadius + (r / outerRadiusSteps) * (outerRadius - middleOuterRadius);
        const nextRadius = middleOuterRadius + ((r + 1) / outerRadiusSteps) * (outerRadius - middleOuterRadius);
        
        for (let a = 0; a < outerAngles; a++) {
          const startAngle = (a / outerAngles) * Math.PI * 2 - Math.PI / 2;
          const endAngle = ((a + 1) / outerAngles) * Math.PI * 2 - Math.PI / 2;
          
          // Calcular luminosidad basada en el ángulo
          let angleDeg = (a / outerAngles) * 360;
          const lightness = angleDeg < 180 
            ? (angleDeg / 180) * 50
            : 50 + ((angleDeg - 180) / 180) * 50;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, nextRadius, startAngle, endAngle);
          ctx.arc(centerX, centerY, currentRadius, endAngle, startAngle, true);
          ctx.closePath();
          
          ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, middleOuterRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 2. CÍRCULO MEDIO: Rueda de tonos con más segmentos
      const hueSteps = 720;
      for (let i = 0; i < hueSteps; i++) {
        const angle = (i / hueSteps) * 360;
        const startAngle = (angle - 0.5) * Math.PI / 180;
        const endAngle = (angle + 0.5) * Math.PI / 180;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, middleOuterRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, middleInnerRadius, endAngle, startAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
        ctx.fill();
      }

      // 3. CÍRCULO INTERIOR: Gradiente de fusión entre primario y secundario
      const gradient = ctx.createLinearGradient(
        centerX - innerRadius, 
        centerY, 
        centerX + innerRadius, 
        centerY
      );
      gradient.addColorStop(0, tempColors.primary);
      gradient.addColorStop(1, tempColors.secondary);

      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Indicador en anillo de luminosidad
      const lightnessAngle = ((lightness / 100) * Math.PI * 2) - Math.PI / 2;
      const lightnessIndicatorRadius = (outerRadius + middleOuterRadius) / 2;
      const lightnessIndicatorX = centerX + Math.cos(lightnessAngle) * lightnessIndicatorRadius;
      const lightnessIndicatorY = centerY + Math.sin(lightnessAngle) * lightnessIndicatorRadius;

      ctx.beginPath();
      ctx.arc(lightnessIndicatorX, lightnessIndicatorY, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = `hsl(${hue}, 100%, ${lightness}%)`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Indicador del tono en círculo medio
      const hueAngle = hue * Math.PI / 180;
      const hueIndicatorRadius = (middleOuterRadius + middleInnerRadius) / 2;
      const hueIndicatorX = centerX + Math.cos(hueAngle) * hueIndicatorRadius;
      const hueIndicatorY = centerY + Math.sin(hueAngle) * hueIndicatorRadius;

      ctx.beginPath();
      ctx.arc(hueIndicatorX, hueIndicatorY, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.lineWidth = 3;
      ctx.stroke();

    }, 50);

    return () => clearTimeout(timer);
  }, [hue, lightness, tempColors, isOpen]);

  const handleCanvasInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] : null;
    const x = (touch ? touch.clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = (touch ? touch.clientY : (e as React.MouseEvent).clientY) - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const outerRadius = canvas.width / 2 - 10;
    const middleOuterRadius = outerRadius * 0.75;
    const middleInnerRadius = outerRadius * 0.45;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    requestAnimationFrame(() => {
      if (distance > middleOuterRadius && distance <= outerRadius) {
        let adjustedAngle = angle + 90;
        if (adjustedAngle >= 360) adjustedAngle -= 360;
        
        const newLightness = (adjustedAngle / 360) * 100;
        setLightness(newLightness);
        
        const newColor = hslToHex(hue, 100, newLightness);
        setTempColors(prev => ({
          ...prev,
          [activeColor]: newColor
        }));
      }
      else if (distance > middleInnerRadius && distance <= middleOuterRadius) {
        setHue(angle);
        const newColor = hslToHex(angle, 100, lightness);
        setTempColors(prev => ({
          ...prev,
          [activeColor]: newColor
        }));
      }
      else if (distance <= middleInnerRadius) {
        const innerRadius = middleInnerRadius * 0.7;
        const saturation = Math.max(0, Math.min(100, 100 - (distance / innerRadius) * 100));
        
        const newColor = hslToHex(hue, saturation, lightness);
        setTempColors(prev => ({
          ...prev,
          [activeColor]: newColor
        }));
      }
    });
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    handleCanvasInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging.current) {
      handleCanvasInteraction(e);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleApplyColors = () => {
    const primaryEvent = {
      target: { name: 'colorPrimary', value: tempColors.primary }
    } as React.ChangeEvent<HTMLInputElement>;
    
    const secondaryEvent = {
      target: { name: 'colorSecondary', value: tempColors.secondary }
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(primaryEvent);
    handleInputChange(secondaryEvent);
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
        <div className="space-y-6">
          <h3 className="font-semibold text-slate-800 text-lg">
            Personalización de Colores
          </h3>

          {/* Mostrar colores seleccionados 
          {(formData.color.primary || formData.color.secondary) && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-3">Colores Actuales:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div 
                    className="h-16 rounded-lg shadow-md border-2 border-white"
                    style={{ backgroundColor: formData.color.primary || '#cccccc' }}
                  />
                  <p className="text-xs text-slate-600">Principal</p>
                  <p className="text-xs font-mono text-slate-800">{formData.color.primary || 'No definido'}</p>
                </div>
                <div className="space-y-2">
                  <div 
                    className="h-16 rounded-lg shadow-md border-2 border-white"
                    style={{ backgroundColor: formData.color.secondary || '#cccccc' }}
                  />
                  <p className="text-xs text-slate-600">Secundario</p>
                  <p className="text-xs font-mono text-slate-800">{formData.color.secondary || 'No definido'}</p>
                </div>
              </div>
            </div>
          )}*/}

          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-3 px-4 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600
        text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Abrir Selector de Color
          </button>
        </div>
      </div>

      {/* Dialog de shadcn/ui */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gradient-to-b from-white via-[#FFF6EF] to-[#FFE8D8] border border-white/40 rounded-2xl shadow-2xl sm:max-w-md p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-white/40 backdrop-blur-xl">
            <DialogTitle className="text-xl font-bold text-slate-800 text-center">
              Selector de Color
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Rueda de colores */}
            {isOpen && (
              <div className="flex justify-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={280}
                    className="touch-none cursor-pointer rounded-full shadow-inner"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                  />
                </div>
              </div>
            )}

            {/* Selector de color activo */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setActiveColor('primary')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  activeColor === 'primary'
                    ? 'bg-white text-slate-800 shadow-lg'
                    : 'bg-white/70 text-slate-500'
                }`}
                style={{
                  borderBottom: activeColor === 'primary' ? `3px solid ${tempColors.primary}` : 'none'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full border border-slate-300"
                    style={{ backgroundColor: tempColors.primary }}
                  />
                  Principal
                </div>
              </button>
              <button
                onClick={() => setActiveColor('secondary')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  activeColor === 'secondary'
                    ? 'bg-white text-slate-800 shadow-lg'
                    : 'bg-white/70 text-slate-500'
                }`}
                style={{
                  borderBottom: activeColor === 'secondary' ? `3px solid ${tempColors.secondary}` : 'none'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full border border-slate-300"
                    style={{ backgroundColor: tempColors.secondary }}
                  />
                  Secundario
                </div>
              </button>
            </div>

            {/* Vista de colores */}
            <div className="space-y-3">
              <div className="bg-white/80 rounded-xl p-4 shadow-inner border border-white/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Color Principal</span>
                  <span className="text-sm font-mono text-slate-700">{tempColors.primary}</span>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-4 shadow-inner border border-white/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Color Secundario</span>
                  <span className="text-sm font-mono text-slate-700">{tempColors.secondary}</span>
                </div>
              </div>
            </div>

            {/* Botón aplicar */}
            <button
              onClick={handleApplyColors}
              className="w-full py-4 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]
                   bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
              
            >
              Aplicar Colores
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ColorEditor;