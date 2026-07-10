"use client";

import Image from "next/image";
import { Lock } from "lucide-react";

const hexClipPath =
  "polygon(50% 3%, 93% 28%, 93% 72%, 50% 97%, 7% 72%, 7% 28%)";
const hexClipPathInner =
  "polygon(50% 8%, 88% 30%, 88% 70%, 50% 92%, 12% 70%, 12% 30%)";

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
  };
  color: string;
  rarityColor: string;
  glow: string;
  isEarned?: boolean;
  progress?: {
    current: number;
    required: number;
    percentage: number;
  };
  index?: number;
}

export default function BadgeCard({ badge, color, rarityColor, glow, isEarned = true, progress, index = 0 }: BadgeCardProps) {
  const rarityLabel = badge.category?.charAt(0).toUpperCase() + badge.category?.slice(1) || "Common";

  return (
    <div
      className={`group relative ${isEarned ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`relative transition-all duration-500 ${isEarned ? 'group-hover:-translate-y-3' : ''}`}>
        {/* Outer glow with chamfered clip */}
        {isEarned && (
          <div
            className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-md"
            style={{
              background: `linear-gradient(135deg, ${color}60, ${color}10, ${color}60, ${color}10)`,
              backgroundSize: "400% 400%",
              animation: "borderGlow 2s ease-in-out infinite",
              clipPath:
                "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)",
            }}
          />
        )}

        {/* Card body with chamfered corners */}
        <div
          className={`relative overflow-hidden transition-shadow duration-300 ${isEarned ? 'bg-white group-hover:shadow-2xl' : 'bg-gray-100'}`}
          style={{
            clipPath:
              "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)",
          }}
        >
          {/* Parchment texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #545863, #545863 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Top ornament bar */}
          <div className="relative h-1.5 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${isEarned ? color : '#d1d5db'}, ${isEarned ? color : '#d1d5db'}, transparent)`,
                opacity: isEarned ? 0.4 : 0.2,
              }}
            />
            {isEarned && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, ${color}, ${color}, transparent)`,
                }}
              />
            )}
          </div>

          <div className="p-2 md:p-3 text-center">
            {/* Hexagonal icon container */}
            <div className="relative mx-auto mb-2 w-48 h-48">
              <svg
                viewBox="0 0 120 120"
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isEarned ? 'opacity-0 group-hover:opacity-100' : 'opacity-30'}`}
                style={isEarned ? { animation: "spin 25s linear infinite" } : {}}
              >
                <polygon
                  points="60,2 108,30 108,90 60,118 12,90 12,30"
                  fill="none"
                  stroke={isEarned ? color : '#9ca3af'}
                  strokeWidth="0.5"
                  strokeDasharray="3 4"
                  opacity="0.4"
                />
              </svg>
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full"
              >
                <polygon
                  points="60,5 104,31 104,89 60,115 16,89 16,31"
                  fill="none"
                  stroke={isEarned ? color : '#9ca3af'}
                  strokeWidth="1"
                  className={`transition-all duration-500 ${isEarned ? 'opacity-25 group-hover:opacity-70' : 'opacity-30'}`}
                />
              </svg>
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full"
                style={isEarned ? { animation: "spin 15s linear infinite reverse" } : {}}
              >
                <polygon
                  points="60,10 98,32 98,88 60,110 22,88 22,32"
                  fill="none"
                  stroke={isEarned ? color : '#9ca3af'}
                  strokeWidth="0.75"
                  strokeDasharray="2 3"
                  className={`transition-all duration-500 ${isEarned ? 'opacity-15 group-hover:opacity-50' : 'opacity-25'}`}
                />
              </svg>
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full"
              >
                <polygon
                  points="60,14 93,33 93,87 60,106 27,87 27,33"
                  fill="none"
                  stroke={isEarned ? color : '#9ca3af'}
                  strokeWidth="2.5"
                  className={`transition-all duration-500 ${isEarned ? 'opacity-35 group-hover:opacity-100' : 'opacity-40'}`}
                />
              </svg>
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full"
              >
                <polygon
                  points="60,20 87,35 87,85 60,100 33,85 33,35"
                  fill="none"
                  stroke={isEarned ? color : '#9ca3af'}
                  strokeWidth="0.5"
                  className={`transition-all duration-500 ${isEarned ? 'opacity-10 group-hover:opacity-40' : 'opacity-20'}`}
                />
              </svg>
              {isEarned && (
                <svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 w-full h-full"
                >
                  <text
                    x="60"
                    y="8"
                    textAnchor="middle"
                    fontSize="7"
                    fill={color}
                    className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                  >
                    ◆
                  </text>
                  <text
                    x="103"
                    y="36"
                    textAnchor="middle"
                    fontSize="7"
                    fill={color}
                    className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                  >
                    ◆
                  </text>
                  <text
                    x="103"
                    y="90"
                    textAnchor="middle"
                    fontSize="7"
                    fill={color}
                    className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                  >
                    ◆
                  </text>
                  <text
                    x="60"
                    y="118"
                    textAnchor="middle"
                    fontSize="7"
                    fill={color}
                    className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                  >
                    ◆
                  </text>
                  <text
                    x="17"
                    y="90"
                    textAnchor="middle"
                    fontSize="7"
                    fill={color}
                    className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                  >
                    ◆
                  </text>
                  <text
                    x="17"
                    y="36"
                    textAnchor="middle"
                    fontSize="7"
                    fill={color}
                    className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                  >
                    ◆
                  </text>
                </svg>
              )}
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full"
              >
                <clipPath id={`hex-bg-${index}`}>
                  <polygon points="60,14 93,33 93,87 60,106 27,87 27,33" />
                </clipPath>
                <rect
                  x="0"
                  y="0"
                  width="120"
                  height="120"
                  fill={`${isEarned ? color : '#9ca3af'}15`}
                  clipPath={`url(#hex-bg-${index})`}
                  className="transition-all duration-500 group-hover:opacity-100"
                />
              </svg>
              {isEarned && (
                <div
                  className="absolute inset-0 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  style={{
                    background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 65%)`,
                    clipPath: hexClipPath,
                  }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`flex items-center justify-center z-10 transition-all duration-500 ${isEarned ? 'group-hover:scale-110' : ''}`}
                  style={{
                    width: "204px",
                    height: "204px",
                    backgroundColor: `${isEarned ? color : '#e5e7eb'}15`,
                    clipPath: hexClipPathInner,
                  }}
                >
                  <div
                    className={`absolute inset-0 z-10 transition-opacity duration-500 ${isEarned ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                    style={{
                      clipPath: hexClipPathInner,
                      boxShadow: isEarned ? `inset 0 0 35px ${glow}` : 'inset 0 0 35px rgba(0,0,0,0.1)',
                    }}
                  />
                  <div className="relative">
                    <Image
                      src={badge.icon}
                      alt={badge.name}
                      width={66}
                      height={66}
                      className={`relative z-40 object-contain transition-all duration-500 ${isEarned ? 'group-hover:scale-115 group-hover:brightness-110' : 'grayscale opacity-40'}`}
                    />
                    {!isEarned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock size={32} className="text-gray-400" strokeWidth={2} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Badge name */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                <div
                  className={`h-[1px] w-6 transition-all duration-500 ${isEarned ? 'group-hover:w-8' : ''}`}
                  style={{ backgroundColor: `${isEarned ? color : '#d1d5db'}30` }}
                />
                {isEarned && (
                  <span
                    className="text-[6px] opacity-0 group-hover:opacity-60 transition-all duration-300"
                    style={{ color }}
                  >
                    ◆
                  </span>
                )}
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${isEarned ? 'text-[#545863] group-hover:text-[#f96e46]' : 'text-gray-400'}`}>
                {badge.name}
              </h3>
              <div className="flex items-center gap-1">
                {isEarned && (
                  <span
                    className="text-[6px] opacity-0 group-hover:opacity-60 transition-all duration-300"
                    style={{ color }}
                  >
                    ◆
                  </span>
                )}
                <div
                  className={`h-[1px] w-6 transition-all duration-500 ${isEarned ? 'group-hover:w-8' : ''}`}
                  style={{ backgroundColor: `${isEarned ? color : '#d1d5db'}30` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="relative mb-2">
              {isEarned && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: `${color}03` }}
                />
              )}
              <p className={`relative text-[10px] leading-relaxed max-w-[180px] mx-auto ${isEarned ? 'text-[#7b7f89]' : 'text-gray-400'}`}>
                {badge.description}
              </p>
            </div>

            {/* Rarity gem */}
            <div className="relative inline-block">
              {isEarned && (
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{ backgroundColor: `${color}40` }}
                />
              )}
              <span
                className={`relative inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] overflow-hidden ${
                  isEarned ? rarityColor : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}
              >
                {isEarned && (
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
                    }}
                  />
                )}
                <span className="relative">{rarityLabel}</span>
              </span>
            </div>

            {/* Chamfered corner brackets */}
            {isEarned && (
              <>
                <div className="absolute top-2 left-2 flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div
                    className="w-5 h-5"
                    style={{
                      borderTop: `2px solid ${color}`,
                      borderLeft: `2px solid ${color}`,
                      clipPath: "polygon(0% 0%, 60% 0%, 0% 60%)",
                    }}
                  />
                  <span
                    className="text-[6px] mt-0.5 -ml-1"
                    style={{ color }}
                  >
                    ◆
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex items-start gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex-row-reverse">
                  <div
                    className="w-5 h-5"
                    style={{
                      borderTop: `2px solid ${color}`,
                      borderRight: `2px solid ${color}`,
                      clipPath: "polygon(100% 0%, 40% 0%, 100% 60%)",
                    }}
                  />
                  <span
                    className="text-[6px] mt-0.5 -mr-1"
                    style={{ color }}
                  >
                    ◆
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 flex items-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div
                    className="w-5 h-5"
                    style={{
                      borderBottom: `2px solid ${color}`,
                      borderLeft: `2px solid ${color}`,
                      clipPath: "polygon(0% 100%, 60% 100%, 0% 40%)",
                    }}
                  />
                  <span
                    className="text-[6px] mb-0.5 -ml-1"
                    style={{ color }}
                  >
                    ◆
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex-row-reverse">
                  <div
                    className="w-5 h-5"
                    style={{
                      borderBottom: `2px solid ${color}`,
                      borderRight: `2px solid ${color}`,
                      clipPath: "polygon(100% 100%, 40% 100%, 100% 40%)",
                    }}
                  />
                  <span
                    className="text-[6px] mb-0.5 -mr-1"
                    style={{ color }}
                  >
                    ◆
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Progress bar */}
          {progress && !isEarned && (
            <div className="px-3 pb-3">
              <div className="relative h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{
                    width: `${progress.percentage}%`,
                    background: `linear-gradient(90deg, ${color}80, ${color})`,
                  }}
                />
              </div>
              <p className="text-[9px] text-gray-500 mt-1 text-center">
                {progress.current} / {progress.required}
              </p>
            </div>
          )}

          {/* Bottom ornament bar */}
          <div className="relative h-1.5 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${isEarned ? color : '#d1d5db'}, ${isEarned ? color : '#d1d5db'}, transparent)`,
                opacity: isEarned ? 0.4 : 0.2,
              }}
            />
            {isEarned && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, ${color}, ${color}, transparent)`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderGlow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}