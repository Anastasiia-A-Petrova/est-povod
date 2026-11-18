import { useState } from 'react'

export default function GoodDayCards({
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (title) => {
    setIsOpen(false)
    onSelect(title)
  }

  return (
    <div className="good-day-cards">
      <button
        type="button"
        className="good-day-cards-button"
        onClick={() =>
          setIsOpen((value) => !value)
        }
        aria-expanded={isOpen}
      >
        💌 Хорошего дня: открытки
      </button>

      {isOpen && (
        <div className="good-day-cards-menu">
          <button
            type="button"
            onClick={() =>
              handleSelect('Доброе утро')
            }
          >
            🌅 Доброе утро
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelect('Добрый день')
            }
          >
            ☀️ Добрый день
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelect('Добрый вечер')
            }
          >
            🌆 Добрый вечер
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelect('Спокойной ночи')
            }
          >
            🌙 Спокойной ночи
          </button>
        </div>
      )}
    </div>
  )
}