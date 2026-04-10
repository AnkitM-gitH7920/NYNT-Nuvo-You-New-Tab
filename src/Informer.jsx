import "./utilities.css";
import "./informer.css";

export default function Informer({ onClose, primaryInfo, secondaryInfo, actionFunctions }) {
     return (
          // Start by building Info container UI
          <div className="info-container">
               <p>{primaryInfo}</p>
               <p>{secondaryInfo}</p>
               {Object.keys(actionFunctions).length ? (
                    <div className="alignC">
                         <button onClick={actionFunctions.onAgree}>Agree</button>
                         <button onClick={actionFunctions.onDisagree}>Disagree</button>

                    </div>
               ) : (
                    <button onClick={onClose}>Close</button>
               )}

          </div>
     )

}
