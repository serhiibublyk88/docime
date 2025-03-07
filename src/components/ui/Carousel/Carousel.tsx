import { useState, useEffect, useMemo, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Loader } from "../../../components";
import styles from "./Carousel.module.css";

interface CarouselProps {
  items: { id: string; name: string }[];
  selectedItemId: string;
  onSelect: (id: string) => void;
  isLoading?: boolean; 
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  selectedItemId,
  onSelect,
  isLoading = false, 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectedIndex = useMemo(() => {
    return items.findIndex((item) => item.id === selectedItemId);
  }, [items, selectedItemId]);

  useEffect(() => {
    if (selectedIndex !== -1) {
      setCurrentIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    onSelect(items[(currentIndex + 1) % items.length].id);
  }, [items, currentIndex, onSelect]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
    onSelect(items[(currentIndex - 1 + items.length) % items.length].id);
  }, [items, currentIndex, onSelect]);

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader size="md" /> 
      </div>
    );
  }

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
