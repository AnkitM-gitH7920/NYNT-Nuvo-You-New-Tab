import "./error.css";
import "./utilities.css";

export default function Error({ err, onClose }) {
     return (
          <div className="error-wrapper center">
               <div className="error-container">
                    <p className="error-message">{err}</p>
               </div>
               <button onClick={onClose}>Close</button>
          </div>
     )
}
