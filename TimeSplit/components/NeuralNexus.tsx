import React, { useMemo, useState } from 'react';
import { BrainCircuit } from 'lucide-react';

interface NeuralNexusProps {
  mastery: Record<string, number>;
}

export const NeuralNexus: React.FC<NeuralNexusProps> = ({ mastery }) => {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Configuration
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const radius = 38; // SVG coordinate radius (viewBox 0 0 100 100, center 50 50)
  const center = { x: 50, y: 50 };

  // Calculate Node Positions
  const nodes = useMemo(() => {
    return numbers.map((num, index) => {
      // Start from top (-90 degrees) and go clockwise
      const angle = (index * (360 / numbers.length) - 90) * (Math.PI / 180);
      return {
        id: num,
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      };
    });
  }, []);

  // Calculate Edges (Connections)
  const edges = useMemo(() => {
    const edgeList: { u: number; v: number; score: number; key: string }[] = [];
    
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i; j < numbers.length; j++) {
        const u = numbers[i];
        const v = numbers[j];
        
        // Key format check: min x max
        const key = `${u}x${v}`;
        // Also check reverse just in case mastery map has inconsistencies, though app logic enforces min x max
        const score = mastery[key] || 0;

        edgeList.push({ u, v, score, key });
      }
    }
    return edgeList;
  }, [mastery]);

  // Calculate "Neural Density" (Total Mastery %)
  const density = useMemo(() => {
    const totalFacts = edges.length;
    const totalScore = edges.reduce((acc, edge) => acc + edge.score, 0);
    return Math.round((totalScore / totalFacts) * 100);
  }, [edges]);

  // Determine Pulse Speed based on Density (Higher density = Faster/More alive heart beat)
  const pulseDuration = Math.max(0.5, 2 - (density / 100) * 1.5); 

  return (
    <div className="w-full aspect-square max-w-[500px] mx-auto relative bg-[#0f172a] rounded-[2rem] shadow-2xl border-4 border-slate-800 overflow-hidden group">
      
      {/* Background Grid FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0%,rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] pointer-events-none"></div>

      {/* Header Overlay */}
      <div className="absolute top-6 left-0 w-full text-center z-10 pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700">
              <BrainCircuit size={14} className="text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100 shadow-cyan-500/50">Neural Nexus</span>
          </div>
      </div>

      <svg className="w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        
        <defs>
          {/* Glow Filters */}
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* EDGES LAYER */}
        <g className="transition-all duration-500">
          {edges.map((edge) => {
            const nodeU = nodes.find(n => n.id === edge.u)!;
            const nodeV = nodes.find(n => n.id === edge.v)!;
            
            // Interaction Logic
            const isConnectedToHover = hoveredNode === edge.u || hoveredNode === edge.v;
            const isFaded = hoveredNode !== null && !isConnectedToHover;
            
            // Style Logic
            let stroke = "transparent";
            let strokeWidth = 0.5;
            let opacity = 0.1;
            let filter = "";
            let className = "";

            if (edge.score >= 0.8) {
                // Mastered
                stroke = "#22d3ee"; // Cyan-400
                strokeWidth = isConnectedToHover ? 1.5 : 0.8;
                opacity = isFaded ? 0.1 : 0.8;
                filter = "url(#glow-cyan)";
            } else if (edge.score > 0) {
                // Learning
                stroke = "#f59e0b"; // Amber-500
                strokeWidth = isConnectedToHover ? 1.2 : 0.6;
                opacity = isFaded ? 0.1 : 0.6;
                filter = "url(#glow-amber)";
                className = "animate-pulse-slow";
            } else {
                // Not Started
                stroke = "#334155"; // Slate-700
                opacity = isFaded ? 0.02 : 0.1;
            }

            return (
              <line
                key={edge.key}
                x1={nodeU.x}
                y1={nodeU.y}
                x2={nodeV.x}
                y2={nodeV.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                strokeLinecap="round"
                filter={filter}
                className={`transition-all duration-300 ${className}`}
              />
            );
          })}
        </g>

        {/* CORE ORB (Center) */}
        <g className="cursor-default">
            {/* Outer Rings */}
            <circle cx="50" cy="50" r="12" fill="none" stroke="#0f172a" strokeWidth="8" /> {/* Mask */}
            <circle cx="50" cy="50" r="10" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />
            
            {/* Pulsing Core */}
            <circle cx="50" cy="50" r="8">
                <animate 
                    attributeName="r" 
                    values="7;8;7" 
                    dur={`${pulseDuration}s`} 
                    repeatCount="indefinite" 
                />
                <animate 
                    attributeName="fill" 
                    values="#0891b2;#22d3ee;#0891b2" 
                    dur={`${pulseDuration}s`} 
                    repeatCount="indefinite" 
                />
                <animate 
                    attributeName="opacity" 
                    values="0.8;1;0.8" 
                    dur={`${pulseDuration}s`} 
                    repeatCount="indefinite" 
                />
            </circle>

            {/* Density Text */}
            <text 
                x="50" 
                y="51.5" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fill="#ffffff" 
                fontSize="5" 
                fontWeight="900"
                className="pointer-events-none font-mono tracking-tighter"
            >
                {density}%
            </text>
            <text 
                x="50" 
                y="56" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fill="#22d3ee" 
                fontSize="2" 
                fontWeight="bold"
                className="pointer-events-none uppercase tracking-widest"
                opacity="0.8"
            >
                Density
            </text>
        </g>

        {/* NODES LAYER */}
        <g>
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            
            // Check if node has any active connections (mastered or learning)
            const hasActivity = edges.some(e => (e.u === node.id || e.v === node.id) && e.score > 0);
            
            return (
              <g 
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-all duration-300"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                {/* Glow behind node */}
                <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={isHovered ? 8 : hasActivity ? 6 : 4} 
                    fill={hasActivity ? (isHovered ? '#22d3ee' : '#0ea5e9') : '#334155'}
                    opacity={isHovered ? 0.3 : 0.1}
                    filter="url(#glow-cyan)"
                    className="transition-all duration-300"
                />

                {/* The Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={4}
                  fill="#0f172a"
                  stroke={isHovered ? '#22d3ee' : hasActivity ? '#38bdf8' : '#475569'}
                  strokeWidth={isHovered ? 1 : 0.5}
                  className="transition-all duration-300"
                />

                {/* The Number */}
                <text
                  x={node.x}
                  y={node.y + 1.2} // Slight optical adjustment
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHovered ? '#ffffff' : hasActivity ? '#e0f2fe' : '#94a3b8'}
                  fontSize="3.5"
                  fontWeight="900"
                  className="pointer-events-none select-none font-nunito"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Footer Status */}
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
          <div className="flex justify-center gap-4 text-[8px] font-bold uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> Dormant</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Active</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></span> Synced</span>
          </div>
      </div>

      <style>{`
        .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};
