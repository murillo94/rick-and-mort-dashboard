"use client";

import { useState } from "react";
import { PieChart as MinimalPieChart } from "react-minimal-pie-chart";

import { cn } from "@/utils/cn";

interface ChartDataItem {
  title: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: ChartDataItem[];
  className?: string;
  lineWidth?: number;
  animate?: boolean;
  selected?: number | undefined;
  onSelect?: (index: number | undefined) => void;
}

const PieChart = ({
  data,
  className,
  lineWidth = 100,
  animate,
  selected,
  onSelect,
}: PieChartProps) => {
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  const dataWithHighlight = data.map((item, index) => {
    const isSelected = selected !== undefined && selected === index;
    const isHovered = hovered !== undefined && hovered === index;
    const shouldHighlight = isSelected || isHovered;
    const shouldApplyOpacity =
      (selected !== undefined || hovered !== undefined) && !shouldHighlight;

    return {
      ...item,
      style: {
        opacity: shouldApplyOpacity ? 0.4 : 1,
        transition: "opacity 0.2s ease",
        cursor: "pointer",
      },
    };
  });

  const handleClick = (_: unknown, segmentIndex: number) => {
    if (selected === segmentIndex) {
      onSelect?.(undefined);
    } else {
      onSelect?.(segmentIndex);
    }
  };

  return (
    <div className={cn("w-full aspect-square", className)}>
      <MinimalPieChart
        data={dataWithHighlight}
        label={({ x, y, dx, dy, dataEntry }) => (
          <text
            x={x}
            y={y}
            dx={dx}
            dy={dy}
            dominantBaseline="central"
            textAnchor="middle"
            style={{
              fontSize: "6px",
              fontFamily: "sans-serif",
              filter: "drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))",
            }}
            fill="white"
          >
            {Math.round(dataEntry.percentage) + "%"}
          </text>
        )}
        lineWidth={lineWidth}
        animate={animate}
        animationDuration={500}
        animationEasing="ease-out"
        onMouseOver={(_, index) => setHovered(index)}
        onMouseOut={() => setHovered(undefined)}
        onClick={handleClick}
      />
    </div>
  );
};

interface LegendProps {
  data: ChartDataItem[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  selected?: number | undefined;
  onSelect?: (index: number | undefined) => void;
}

const Legend = ({
  data,
  orientation = "vertical",
  className,
  selected,
  onSelect,
}: LegendProps) => {
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  const handleClick = (index: number) => {
    if (selected === index) {
      onSelect?.(undefined);
    } else {
      onSelect?.(index);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className
      )}
    >
      {data.map((item, index) => {
        const isSelected = selected !== undefined && selected === index;
        const isHovered = hovered !== undefined && hovered === index;
        const shouldHighlight = isSelected || isHovered;
        const shouldDim =
          (selected !== undefined || hovered !== undefined) && !shouldHighlight;

        return (
          <LegendItem
            key={`${item.title}-${index}`}
            item={item}
            isActive={!shouldDim}
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(undefined)}
            className="cursor-pointer"
          />
        );
      })}
    </div>
  );
};

interface LegendItemProps {
  item: ChartDataItem;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const LegendItem = ({
  item,
  isActive = true,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: LegendItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 transition-opacity",
        !isActive && "opacity-40",
        className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="w-4 h-4 rounded-sm flex-shrink-0"
        style={{ backgroundColor: item.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {item.title}
        </p>
        <p className="text-xs text-slate-600">{item.value.toLocaleString()}</p>
      </div>
    </div>
  );
};

PieChart.Legend = Legend;
PieChart.LegendItem = LegendItem;

export { PieChart };
