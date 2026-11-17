import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, PanInfo, useMotionValue } from "framer-motion";
import { Direction } from "../types/calendar";

const SNAP_DURATION = 0.28;
const PEEK = 0;
const GAP = 0;
const DISTANCE_RATIO_THRESHOLD = 0.22;
const VELOCITY_THRESHOLD = 500;

const startOfMonth = (year: number, month: number) => new Date(year, month, 1);
const addMonths = (date: Date, diff: number) =>
  new Date(date.getFullYear(), date.getMonth() + diff, 1);

export const useMonthCarousel = () => {
  const [centerDate, setCenterDate] = useState(() => {
    const now = new Date();
    return startOfMonth(now.getFullYear(), now.getMonth());
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [panelWidth, setPanelWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const step = panelWidth + GAP;
  const baseX = -step + PEEK;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setPanelWidth(el.offsetWidth - PEEK * 2);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAnimating) x.set(baseX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseX]);

  const commit = useCallback(
    (direction: 1 | -1 | 0) => {
      setIsAnimating(true);
      animate(x, baseX - direction * step, {
        duration: SNAP_DURATION,
        ease: "easeOut",
        onComplete: () => {
          x.set(baseX);
          if (direction !== 0) {
            setCenterDate((prev) => addMonths(prev, direction));
          }
          setIsAnimating(false);
        },
      });
    },
    [baseX, step, x],
  );

  const handleDragEnd = useCallback(
    (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      if (!panelWidth) return;

      const offset = x.get() - baseX;
      const passedDistance =
        Math.abs(offset) / panelWidth > DISTANCE_RATIO_THRESHOLD;
      const passedVelocity = Math.abs(info.velocity.x) > VELOCITY_THRESHOLD;
      const passed = passedDistance || passedVelocity;

      if (offset < 0 && passed) commit(1);
      else if (offset > 0 && passed) commit(-1);
      else commit(0);
    },
    [baseX, commit, panelWidth, x],
  );

  const navigateMonth = useCallback(
    (direction: Direction) => {
      if (isAnimating) return;
      commit(direction === "right" ? 1 : -1);
    },
    [commit, isAnimating],
  );

  const goToMonth = useCallback(
    (year: number, month: number) => {
      if (isAnimating) return;
      setCenterDate(startOfMonth(year, month - 1));
    },
    [isAnimating],
  );

  const goToToday = useCallback(() => {
    const now = new Date();
    goToMonth(now.getFullYear(), now.getMonth() + 1);
  }, [goToMonth]);

  const prevDate = useMemo(() => addMonths(centerDate, -1), [centerDate]);
  const nextDate = useMemo(() => addMonths(centerDate, 1), [centerDate]);

  return {
    centerDate,
    prevDate,
    nextDate,
    containerRef,
    x,
    panelWidth,
    gap: GAP,
    dragConstraints: { left: baseX - step, right: baseX + step },
    isDragEnabled: !isAnimating && panelWidth > 0,
    handleDragEnd,
    navigateMonth,
    goToMonth,
    goToToday,
  };
};
