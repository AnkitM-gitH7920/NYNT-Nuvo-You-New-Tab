import "./settings-window.css";
import ToggleButton from "./ToggleButton";
import { X, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function SettingsWindow() {
     // useRef
     const chevronRef = useRef(null);

     // useState
     const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);


     let settings = [
          {
               category: "Customizations",
               items: [
                    {
                         "settingName": "Quotes",
                         "settingsDescription": "Daily motivational quotes",
                         "settingFunction": () => {
                              localStorage.setItem("dailyQuotes", false);
                         }
                    },
                    {
                         "settingName": "24-Hour Format",
                         "settingsDescription": "Toggle 24 hours clock format",
                         "settingFunction": () => {
                              localStorage.setItem("clock-format", "12hour")
                         }
                    }
               ]

          }
     ]

     useEffect(() => {
          console.log(settings)

     }, [])



     return (
          <div className="settings-window">
               <div className="sw-accordion">
                    <div className="sw-accordion-head alignC">
                         <span className="sw-accordion-head-title">
                              Customization
                         </span>
                         <button ref={chevronRef} onClick={() => {
                              chevronRef.current.classList.contains("chevron-rotate")
                                   ? (() => {
                                        chevronRef.current.classList.remove("chevron-rotate");
                                        setIsAccordionExpanded(false);
                                   })()
                                   : (() => {
                                        chevronRef.current.classList.add("chevron-rotate");
                                        setIsAccordionExpanded(true);
                                   })()
                         }
                         } className="sw-accordion-chevron center">
                              <ChevronDown size={25} />
                         </button>
                    </div>
                    <div className={`sw-accordion-body alignC ${isAccordionExpanded ? "accordion-expanded" : ""}`}>
                         <div className="single-setting alignC">
                              <div style={{ flexDirection: "column" }} className="setting-desc">
                                   <p>AI Tools</p>
                                   <p>Show shortcuts for AI tools</p>
                              </div>
                              <ToggleButton />
                         </div>
                         <div className="single-setting alignC">
                              <div style={{ flexDirection: "column" }} className="setting-desc">
                                   <p>AI Tools</p>
                                   <p>Show shortcuts for AI tools</p>
                              </div>
                              <ToggleButton />
                         </div>
                         <div className="single-setting alignC">
                              <div style={{ flexDirection: "column" }} className="setting-desc">
                                   <p>AI Tools</p>
                                   <p>Show shortcuts for AI tools</p>
                              </div>
                              <ToggleButton />
                         </div>
                         <div className="single-setting alignC">
                              <div style={{ flexDirection: "column" }} className="setting-desc">
                                   <p>AI Tools</p>
                                   <p>Show shortcuts for AI tools</p>
                              </div>
                              <ToggleButton />
                         </div>
                         <div className="single-setting alignC">
                              <div style={{ flexDirection: "column" }} className="setting-desc">
                                   <p>AI Tools</p>
                                   <p>Show shortcuts for AI tools</p>
                              </div>
                              <ToggleButton />
                         </div>
                    </div>
               </div>
          </div>
     )
}
// Start by adding settings into the list 
