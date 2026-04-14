import "./error.css";
import "./utilities.css";

export default function Error({ onClose, errTitle, errMessage }) {
     return (
          <div className="error-wrapper center">
               <div className="error-container">
                    <div className="error-container-header alignC">
                         <span className="error-container-title">{errTitle}</span>
                    </div>
                    <div className="error-container-content">
                         <p className="error-container-message">{errMessage} </p>
                    </div>
                    <button
                         onClick={onClose}
                         className="error-cancel-button"
                         type="button">Dismiss</button>
               </div>
          </div>
     )
}

// function WarnSymbol() {
//      return (
//           <div className="error-container-image center">
//                <svg
//                     aria-hidden="true"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                >
//                     <path
//                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
//                          strokeLinejoin="round"
//                          strokeLinecap="round"
//                     ></path>
//                </svg>
//           </div>
//      )
// }
