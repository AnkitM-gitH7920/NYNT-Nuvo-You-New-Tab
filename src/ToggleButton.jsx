import "./toggle-btn.css";
import { useRef } from "react";

export default function ToggleButton({ defaultChecked, onChange }) {
     const inputRef = useRef(null);

     return (
          <div className="toggle-btn-body" onClick={() => inputRef.current.click()}>
               <input
                    checked={defaultChecked}
                    ref={inputRef}
                    onChange={(e) => onChange?.(e.target.checked)}
                    style={{ display: "none" }}
                    type="checkbox"
               />
          </div>
     );
}
