import { FaGlobe } from "react-icons/fa";
import "./styles/language.css";
import type React from "react";
type langProps = {
  lang: "en" | "am";
  setLang: (lang: "en" | "am") => void;
};
export default function Language({ lang, setLang }: langProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as "en" | "am");
  };
  return (
    <div className="language-selector">
      <FaGlobe className="language-icon" />
      <select value={lang} onChange={handleChange}>
        <option value="en">English</option>
        <option value="am">አማርኛ</option>
      </select>
    </div>
  );
}
