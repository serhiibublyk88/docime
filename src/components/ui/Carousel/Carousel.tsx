import { useState, useEffect, useMemo, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./Carousel.module.css";

interface CarouselProps {
  items: { id: string; name: string }[];
  selectedItemId: string;
  onSelect: (id: string) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  selectedItemId,
  onSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Индекс выбранного элемента
  const selectedIndex = useMemo(() => {
    return items.findIndex((item) => item.id === selectedItemId);
  }, [items, selectedItemId]);

  // 🔹 Синхронизация индекса при смене selectedItemId
  useEffect(() => {
    if (selectedIndex !== -1) {
      setCurrentIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    onSelect(items[nextIndex].id);
  }, [items, currentIndex, onSelect]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIndex);
    onSelect(items[prevIndex].id);
  }, [items, currentIndex, onSelect]);

  if (items.length === 0) {
    return <p className="text-center text-muted">Keine Gruppen verfügbar</p>;
  }

  return (
    <div className={styles.carouselWrapper}>
      <button
        className={styles.navButton}
        onClick={handlePrev}
        disabled={items.length <= 1}
      >
        <FaChevronLeft />
      </button>

      <div className={styles.carouselContainer}>
        <button
          className={styles.item}
          onClick={() => onSelect(items[currentIndex].id)}
        >
          {items[currentIndex]?.name ?? "Unbekannt"}
        </button>
      </div>

      <button
        className={styles.navButton}
        onClick={handleNext}
        disabled={items.length <= 1}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};
