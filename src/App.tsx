import "./styles/App.css";
import EthiopianCalendar from "./ethioCalander";
import Language from "./languages";
import { useState } from "react";

function App() {
  const [lang, setLang] = useState<"en" | "am">("en");
  const today = new Date().toISOString().split("T")[0];
  const [curDate, setCurDate] = useState(today);
  return (
    <div className="app">
      <div className="lang-selector">
        <Language lang={lang} setLang={setLang} />
      </div>

      <div className="date-picker">
        {lang === "am" ? (
          <EthiopianCalendar
            value={(curDate && new Date(curDate)) || new Date()}
            onChange={(selectedDate: string) => {
              setCurDate(selectedDate);
            }}
          />
        ) : (
          <input
            type="date"
            id="date"
            name="date"
            value={curDate}
            onChange={(e) => setCurDate(e.target.value)}
            className={"input"}
          />
        )}
      </div>
    </div>
  );
}

export default App;
