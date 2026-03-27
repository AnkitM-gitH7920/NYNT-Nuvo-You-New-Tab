import "./toggle-btn.css";

export default function ToggleButton({ defaultChecked, onChange }) {

     return (
          <>
               <label className="switch">
                    <input
                         style={{ display: "none" }}
                         checked={defaultChecked}
                         onChange={(e) => onChange?.(e.target.checked)}
                         type="checkbox" />
                    <span className="toggle"></span>
               </label >
          </>
     );
}
