import "./utilities.css";
import "./popup.css";

export default function Informer({ onClose, primaryInfo, secondaryInfo, actionFunctions }) {
     return (
          <div className="info-wrapper center">
               <div className="info-container">
                    <p className="primary-info-text">{primaryInfo}</p>
                    <p className="secondary-info-text">{secondaryInfo}</p>
                    {(Object.keys(actionFunctions).length && actionFunctions !== undefined) ? (
                         <div className="alignC">
                              <button className="agree-button" onClick={actionFunctions.onAgree}>Agree</button>
                              <button className="disagree-button" onClick={actionFunctions.onDisagree}>Disagree</button>

                         </div>
                    ) : (
                         <button className="popup-cancel-button" onClick={onClose}>Dismiss</button>
                    )}

               </div>
          </div>
     )

}
