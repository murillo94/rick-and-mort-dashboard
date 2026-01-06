"use client";

import { createContext, useContext, useState } from "react";
import { PieChart as MinimalPieChart } from "react-minimal-pie-chart";

import { cn } from "@/utils/cn";
import { formatLabelPercentage } from "./pie.helpers";

interface ChartDataItem {
  title: string;
  value: number;
  color: string;
}

interface PieChartContextValue {
  selected: number | undefined;
  setSelected: (index: number | undefined) => void;
  hovered: number | undefined;
  setHovered: (index: number | undefined) => void;
}

const PieChartContext = createContext<PieChartContextValue | null>(null);

const usePieChartContext = () => {
  const context = useContext(PieChartContext);
  return context;
};

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
  selected: externalSelected,
  onSelect: externalOnSelect,
}: PieChartProps) => {
  const [internalSelected, setInternalSelected] = useState<number | undefined>(
    undefined
  );
  const [internalHovered, setInternalHovered] = useState<number | undefined>(
    undefined
  );

  const context = usePieChartContext();
  const selected = context?.selected ?? externalSelected ?? internalSelected;
  const setSelected =
    context?.setSelected ?? externalOnSelect ?? setInternalSelected;
  const hovered = context?.hovered ?? internalHovered;
  const setHovered = context?.setHovered ?? setInternalHovered;

  const dataWithHighlight = data.map((item, index) => {
    const isSelected = selected !== undefined && selected === index;
    const isHovered = hovered !== undefined && hovered === index;
    const shouldHighlight = isSelected || isHovered;
    const shouldApplyOpacity =
      (selected !== undefined || hovered !== undefined) && !shouldHighlight;

    return {
      ...item,
      ...(isSelected && {
        style: {
          filter: "drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))",
          transition: "all 0.2s ease",
          cursor: "pointer",
        },
      }),
      ...(!isSelected && {
        style: {
          opacity: shouldApplyOpacity ? 0.4 : 1,
          transition: "opacity 0.2s ease",
          cursor: "pointer",
        },
      }),
    };
  });

  const segmentShift = data.map((_, index) => {
    const isSelected = selected !== undefined && selected === index;
    return isSelected ? 3 : 0;
  });

  const handleClick = (_: unknown, segmentIndex: number) => {
    if (selected === segmentIndex) {
      setSelected?.(undefined);
    } else {
      setSelected?.(segmentIndex);
    }
  };

  return (
    <div className={cn("w-full aspect-square max-h-[300px]", className)}>
      <MinimalPieChart
        data={dataWithHighlight}
        segmentsShift={(index) => segmentShift[index]}
        label={({ x, y, dx, dy, dataEntry }) => {
          const formatted = formatLabelPercentage(dataEntry.percentage);

          if (!formatted) {
            return null;
          }

          return (
            <text
              x={x}
              y={y}
              dx={dx}
              dy={dy}
              dominantBaseline="central"
              textAnchor="middle"
              style={{
                fontSize: formatted.fontSize,
                fontFamily: "sans-serif",
                fontWeight: "600",
                filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))",
                pointerEvents: "none",
              }}
              fill="white"
            >
              {formatted.percentage + "%"}
            </text>
          );
        }}
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

interface PieChartLegendProps {
  data: ChartDataItem[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  selected?: number | undefined;
  onSelect?: (index: number | undefined) => void;
  columns?: number;
}

const PieChartLegend = ({
  data,
  orientation = "vertical",
  className,
  selected: externalSelected,
  onSelect: externalOnSelect,
  columns = 1,
}: PieChartLegendProps) => {
  const [internalSelected, setInternalSelected] = useState<number | undefined>(
    undefined
  );
  const [internalHovered, setInternalHovered] = useState<number | undefined>(
    undefined
  );

  const context = usePieChartContext();
  const selected = context?.selected ?? externalSelected ?? internalSelected;
  const setSelected =
    context?.setSelected ?? externalOnSelect ?? setInternalSelected;
  const hovered = context?.hovered ?? internalHovered;
  const setHovered = context?.setHovered ?? setInternalHovered;

  const handleClick = (index: number) => {
    if (selected === index) {
      setSelected?.(undefined);
    } else {
      setSelected?.(index);
    }
  };

  return (
    <div
      className={cn(
        "grid gap-1",
        orientation === "vertical" && columns === 1 && "grid-cols-1",
        orientation === "vertical" &&
          columns === 2 &&
          "grid-cols-1 sm:grid-cols-2",
        orientation === "vertical" &&
          columns > 2 &&
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        orientation === "horizontal" &&
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
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
            isSelected={isSelected}
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
  isSelected?: boolean;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const LegendItem = ({
  item,
  isActive = true,
  isSelected = false,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: LegendItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 transition-all duration-200 p-2 rounded-lg",
        !isActive && "opacity-40",
        isSelected && "bg-slate-100 ring-2 ring-slate-300",
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
        <p className="text-sm font-medium text-slate-800 truncate capitalize">
          {item.title}
        </p>
        <p className="text-xs text-slate-600">{item.value.toLocaleString()}</p>
      </div>
    </div>
  );
};

interface PieChartProviderProps {
  children: React.ReactNode;
}

const PieChartProvider = ({ children }: PieChartProviderProps) => {
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  return (
    <PieChartContext.Provider
      value={{ selected, setSelected, hovered, setHovered }}
    >
      {children}
    </PieChartContext.Provider>
  );
};

export { PieChart, PieChartProvider, PieChartLegend };
