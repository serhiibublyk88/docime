import { useState, useEffect } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex((item) => item.id === selectedItemId) || 0
  );

  useEffect(() => {
    const selectedIndex = items.findIndex((item) => item.id === selectedItemId);
    if (selectedIndex !== -1) {
      setCurrentIndex(selectedIndex);
    }
  }, [selectedItemId, items]);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(newIndex);
    onSelect(items[newIndex].id);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(newIndex);
    onSelect(items[newIndex].id);
  };

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.navButton} onClick={handlePrev}>
        <FaChevronLeft />
      </button>

      <div className={styles.carouselContainer}>
        <button className={styles.item} onClick={() => {}}>
          {items[currentIndex].name}
        </button>
      </div>

      <button className={styles.navButton} onClick={handleNext}>
        <FaChevronRight />
      </button>
    </div>
  );
};
