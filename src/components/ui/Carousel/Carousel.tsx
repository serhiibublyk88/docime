import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./Carousel.module.css";

interface CarouselProps {
  items: { id: string; name: string }[];
  selectedItemId: string;
  onSelect: (id: string) => void;
  onBack?: () => void; // Кнопка "Назад" (если нужно)
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  selectedItemId,
  onSelect,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    items.findIndex((item) => item.id === selectedItemId) || 0
  );

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length); // Loop прокрутка
    onSelect(items[(currentIndex + 1) % items.length].id);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    ); // Loop прокрутка
    onSelect(items[(currentIndex - 1 + items.length) % items.length].id);
  };

  return (
    <div className={styles.carousel}>
      {onBack && (
        <button className={styles.backButton} onClick={onBack}>
          ⬅ Все
        </button>
      )}

      <button className={styles.navButton} onClick={handlePrev}>
        <FaChevronLeft />
      </button>

      <div className={styles.carouselItems}>
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.item} ${
              index === currentIndex ? styles.selected : ""
            }`}
            onClick={() => {
              setCurrentIndex(index);
              onSelect(item.id);
            }}
          >
            {item.name}
          </div>
        ))}
      </div>

      <button className={styles.navButton} onClick={handleNext}>
        <FaChevronRight />
      </button>
    </div>
  );
};
