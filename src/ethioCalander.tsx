import { useState, useEffect, useRef } from "react";
import styles from "./styles/ethioCalander.module.css";
import {
  ethiopianToGregorian,
  gregorianToEthiopian,
  ETHIOPIAN_MONTHS,
} from "./actions/dataConverter";
import { AiOutlineCalendar } from "react-icons/ai";
interface EthiopianCalendarProps {
  value?: Date;
  onChange?: (date: string) => void; // changed to string
  className?: string;
}

export default function EthiopianCalendar({
  value,
  onChange,
}: EthiopianCalendarProps) {
  // --- Conversion functions ---
  const digitPattern = /^\d*$/;
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [currentEthiopian, setCurrentEthiopian] = useState(
    gregorianToEthiopian(selectedDate)
  );
  const [viewMonth, setViewMonth] = useState(currentEthiopian.month);
  const [viewYear, setViewYear] = useState(currentEthiopian.year);
  const [calendarAbove, setCalendarAbove] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      const ethDate = gregorianToEthiopian(value);
      setCurrentEthiopian(ethDate);
      setViewMonth(ethDate.month);
      setViewYear(ethDate.year);
    }
  }, [value]);
  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // Prevent overflow: detect space below vs above
  useEffect(() => {
    if (showCalendar && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setCalendarAbove(spaceBelow < 300); // 300px = calendar height
    }
  }, [showCalendar]);
  useEffect(() => {
    if (value) {
      const formattedDate = `${String(value.getFullYear()).padStart(
        4,
        "0"
      )}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(
        value.getDate()
      ).padStart(2, "0")}`;

      onChange?.(formattedDate);
    }
  }, []);
  const generateCalendarDays = () => {
    const days = [];
    const gregDateOfFirst = ethiopianToGregorian(viewYear, viewMonth, 1);
    const startDay = gregDateOfFirst.getDay();
    const daysInMonth = viewMonth === 13 ? (viewYear % 4 === 3 ? 6 : 5) : 30;

    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        day === currentEthiopian.day &&
        viewMonth === currentEthiopian.month &&
        viewYear === currentEthiopian.year;
      days.push({ day, isCurrentMonth: true, isSelected });
    }
    return days;
  };

  const handleDayClick = (day: number) => {
    const newGregDate = ethiopianToGregorian(viewYear, viewMonth, day);
    const newEthDate = { year: viewYear, month: viewMonth, day };
    setSelectedDate(newGregDate);
    setCurrentEthiopian(newEthDate);
    setShowCalendar(false);

    // Send yyyy-mm-dd string for consistency
    const formattedDate = `${String(newGregDate.getFullYear()).padStart(
      4,
      "0"
    )}-${String(newGregDate.getMonth() + 1).padStart(2, "0")}-${String(
      newGregDate.getDate()
    ).padStart(2, "0")}`;
    onChange?.(formattedDate);
  };

  const navigateMonth = (direction: number) => {
    let newMonth = viewMonth + direction;
    let newYear = viewYear;
    if (newMonth > 13) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 13;
      newYear--;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  const goToToday = () => {
    const today = new Date();
    const ethToday = gregorianToEthiopian(today);
    setSelectedDate(today);
    setCurrentEthiopian(ethToday);
    setViewMonth(ethToday.month);
    setViewYear(ethToday.year);

    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    onChange?.(formattedDate);
  };

  const calendarDays = generateCalendarDays();
  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        {/* Day Input */}
        <input
          type="text"
          value={String(currentEthiopian.day).padStart(2, "0")}
          onChange={(e) => {
            if (digitPattern.test(e.target.value)) {
              setCurrentEthiopian((prev) => ({
                ...prev,
                day: Number(e.target.value) % 31,
              }));
            }
          }}
          onClick={(e) => {
            const target = e.target as HTMLInputElement;
            const length = target.value.length;
            target.setSelectionRange(length, length);
          }}
          onFocus={(e) => {
            const target = e.target as HTMLInputElement;
            const length = target.value.length;
            target.setSelectionRange(length, length);
            setCurrentEthiopian((prev) => ({ ...prev, day: 0 }));
          }}
          onBlur={() => {
            if (currentEthiopian.day === 0) {
              handleDayClick(1);
            } else {
              handleDayClick(currentEthiopian.day);
            }
          }}
          className={`${styles.noCaret} ${styles.input}`}
        />
        /{/* Month Input */}
        <input
          type="text"
          value={String(currentEthiopian.month).padStart(2, "0")}
          onChange={(e) => {
            if (digitPattern.test(e.target.value)) {
              setViewMonth(Number(e.target.value) % 14 || 1);
              setCurrentEthiopian((prev) => ({
                ...prev,
                month: Number(e.target.value) % 14,
              }));
            }
          }}
          onClick={(e) => {
            const target = e.target as HTMLInputElement;
            const length = target.value.length;
            target.setSelectionRange(length, length);
          }}
          onFocus={(e) => {
            const target = e.target as HTMLInputElement;
            const length = target.value.length;
            target.setSelectionRange(length, length);
            setCurrentEthiopian((prev) => ({ ...prev, month: 0 }));
            setViewMonth(1);
          }}
          onBlur={() => {
            handleDayClick(currentEthiopian.day);
          }}
          className={`${styles.noCaret} ${styles.input}`}
        />
        /{/* Year Input */}
        <input
          type="text"
          value={String(currentEthiopian.year).padStart(4, "0")}
          onChange={(e) => {
            if (digitPattern.test(e.target.value)) {
              let strYear = e.target.value;
              if (e.target.value.length > 4) {
                strYear = strYear.slice(-4);
              }
              setViewYear(Number(strYear) || 1);
              setCurrentEthiopian((prev) => ({
                ...prev,
                year: Number(strYear),
              }));
            }
          }}
          onClick={(e) => {
            const target = e.target as HTMLInputElement;
            const length = target.value.length;
            target.setSelectionRange(length, length);
          }}
          onFocus={(e) => {
            const target = e.target as HTMLInputElement;
            const length = target.value.length;
            target.setSelectionRange(length, length);
            setViewYear(1);
            setCurrentEthiopian((prev) => ({
              ...prev,
              year: 0,
            }));
          }}
          onBlur={() => {
            handleDayClick(currentEthiopian.day);
          }}
          className={`${styles.noCaret} ${styles.input}`}
        />
        <span
          className={styles.icon}
          onClick={() => setShowCalendar(true)}
          ref={iconRef}
        >
          <AiOutlineCalendar size={18} />
        </span>
      </div>
      {showCalendar && (
        <div
          ref={calendarRef}
          className={`${styles.ethiopianCalendar}`}
          style={{
            top: calendarAbove ? "auto" : "110%",
            bottom: calendarAbove ? "110%" : "auto",
          }}
        >
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={styles.navButton}
              onClick={() => navigateMonth(-1)}
            >
              ‹
            </button>

            <div className={styles.calendarTitle}>
              {ETHIOPIAN_MONTHS[viewMonth - 1]} {viewYear}
            </div>

            <button
              type="button"
              className={styles.navButton}
              onClick={() => navigateMonth(1)}
            >
              ›
            </button>
          </div>

          <div className={styles.weekDays}>
            {["እ", "ሰ", "ማ", "ረ", "ሐ", "ዓ", "ቅ"].map((day, i) => (
              <div key={i}>{day}</div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {calendarDays.map(({ day, isCurrentMonth, isSelected }, index) => (
              <div
                key={index}
                className={`${styles.calendarDay} ${
                  !isCurrentMonth ? styles.empty : ""
                } ${isSelected ? styles.selected : ""}`}
                onClick={() => isCurrentMonth && day && handleDayClick(day)}
              >
                {day}
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <button className={styles.todayBtn} onClick={goToToday}>
              ዛሬ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
