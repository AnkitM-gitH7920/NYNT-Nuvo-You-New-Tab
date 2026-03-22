import "./add-shortcutpane.css";
import { useState } from "react";

export default function AddShortcutPane({ onClose, onAdd }) {
     const [name, setName] = useState("");
     const [url, setUrl] = useState("");

     return (
          <div className="add-shortcutpane-wrapper" onClick={onClose}>
               <div className="add-shortcutpane-container" onClick={e => e.stopPropagation()}>
                    <div className="add-shortcutpane-head">
                         <span className="add-shortcutpane-title">Add Shortcut</span>
                         <button className="add-shortcutpane-close" onClick={onClose}><X size={16} /></button>
                    </div>
                    <div className="add-shortcutpane-body">
                         <input className="add-shortcutpane-input" placeholder="Shortcut name..." type="text" value={name} onChange={e => setName(e.target.value)} />
                         <input className="add-shortcutpane-input" placeholder="Shortcut URL..." type="text" value={url} onChange={e => setUrl(e.target.value)} />
                         <button className="add-shortcutpane-submit" onClick={() => onAdd({ name, url })}>Add Shortcut</button>
                    </div>
               </div>
          </div>
     );
}
