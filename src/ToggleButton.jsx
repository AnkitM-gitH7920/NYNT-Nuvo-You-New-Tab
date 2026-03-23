import "./toggle-btn.css";
import { useRef } from "react";

export default function ToggleButton({ onChange }) {
     const inputRef = useRef(null);

     return (
          <div className="toggle-btn-body" onClick={() => inputRef.current.click()}>
               <input
                    ref={inputRef}
                    onChange={(e) => onChange?.(e.target.checked)}
                    style={{ display: "none" }}
                    type="checkbox"
               />
          </div>
          // start by
          /*
          Reading the code and understand logic
          reload the window to access the location
          just complete the weather functionality overall
          */
     );
}
