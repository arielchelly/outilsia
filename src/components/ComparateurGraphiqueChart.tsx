'use client';

import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ChartTool {
  id: string;
  name: string;
  color: string;
  /** key is the dimension label, value is the score (0..5) */
  scores: Record<string, number>;
}

interface ChartProps {
  tools: ChartTool[];
  /** Ordered list of dimension labels to plot on the X axis */
  dimensions: string[];
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ value: number; color: string; dataKey: string }>;
}

function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].sort((a, b) => b.value - a.value);
  return (
    <div
      style={{
        background: '#211119',
        border: '1px solid rgba(216, 139, 106, 0.3)',
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        fontFamily: 'var(--font-body)',
        minWidth: 200,
      }}
    >
      <div
        style={{
          color: 'rgba(242, 234, 217, 0.6)',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((entry) => (
          <div
            key={entry.dataKey}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: entry.color,
                  boxShadow: `0 0 8px ${entry.color}`,
                }}
              />
              <span style={{ color: '#F2EAD9', fontSize: 13, fontWeight: 500 }}>
                {entry.dataKey}
              </span>
            </span>
            <span
              style={{
                color: '#D88B6A',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {entry.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparateurGraphiqueChart({ tools, dimensions }: ChartProps) {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  // Build the data array: one row per dimension, each tool as a key
  const data = dimensions.map((dim) => {
    const row: Record<string, string | number> = { dimension: dim };
    tools.forEach((t) => {
      row[t.name] = t.scores[dim] ?? 0;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 30, right: 40, bottom: 50, left: 30 }}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="0" />
        <XAxis
          dataKey="dimension"
          stroke="#B8A89B"
          tick={{ fill: '#B8A89B', fontSize: 11, fontFamily: 'var(--font-body)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
          tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          stroke="#B8A89B"
          tick={{ fill: '#B8A89B', fontSize: 11, fontFamily: 'var(--font-mono)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
          tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
          label={{
            value: 'NOTE / 5',
            angle: -90,
            position: 'insideLeft',
            offset: 10,
            fill: '#B8A89B',
            fontSize: 11,
            fontFamily: 'var(--font-body)',
            style: { letterSpacing: '0.18em', textAnchor: 'middle' },
          }}
        />
        <Tooltip
          cursor={{ stroke: 'rgba(216, 139, 106,0.25)', strokeWidth: 1, strokeDasharray: '4 4' }}
          content={(props) => (
            <CustomTooltip
              active={props.active}
              label={typeof props.label === 'string' ? props.label : undefined}
              payload={props.payload as unknown as CustomTooltipProps['payload']}
            />
          )}
        />
        {tools.map((tool) => {
          const isDimmed = hoveredTool !== null && hoveredTool !== tool.id;
          const isFocused = hoveredTool === tool.id;
          return (
            <Line
              key={tool.id}
              type="monotone"
              dataKey={tool.name}
              stroke={tool.color}
              strokeWidth={isFocused ? 3 : 2}
              strokeOpacity={isDimmed ? 0.18 : 1}
              dot={{
                r: isFocused ? 5 : 4,
                fill: tool.color,
                strokeWidth: 2,
                stroke: '#15090E',
                opacity: isDimmed ? 0.25 : 1,
              }}
              activeDot={{
                r: 7,
                fill: tool.color,
                stroke: '#15090E',
                strokeWidth: 2,
                onMouseEnter: () => setHoveredTool(tool.id),
                onMouseLeave: () => setHoveredTool(null),
              }}
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
