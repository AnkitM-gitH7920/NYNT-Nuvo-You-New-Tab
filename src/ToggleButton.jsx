import "./toggle-btn.css";
import { useRef } from "react";

export default function ToggleButton({ defaultChecked, onChange }) {
     const inputRef = useRef(null);

     return (
          <>
               <div className="toggle-btn-body" onClick={() => inputRef.current.click()}>
                    <input
                         style={{ display: "none" }}
                         checked={defaultChecked}
                         ref={inputRef}
                         onChange={(e) => onChange?.(e.target.checked)}
                         type="checkbox"
                    />
               </div>
          </>
     );
}
