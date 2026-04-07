import "./add-shortcutpanel.css";
import "./utilities.css";

import { useState } from "react";
import { X } from "lucide-react";

export default function AddShortcutPanel({ onClose, onAdd }) {
     const [name, setName] = useState("");
     const [url, setUrl] = useState("");

     return (
          <div className="add-shortcutpanel-wrapper center" onClick={onClose}>
               <div className="add-shortcutpanel-container" onClick={e => e.stopPropagation()}>
                    <div className="add-shortcutpanel-head">
                         <span className="add-shortcutpanel-title">Add Shortcut</span>
                         <button className="add-shortcutpanel-close" onClick={onClose}><X size={23} /></button>
                    </div>
                    <div className="add-shortcutpanel-body">
                         <input className="add-shortcutpanel-input" placeholder="Shortcut name..." type="text" value={name} onChange={e => setName(e.target.value)} />
                         <input className="add-shortcutpanel-input" placeholder="Shortcut URL..." type="text" value={url} onChange={e => setUrl(e.target.value)} />
                         <button className="add-shortcutpanel-submit" onClick={
                              () => onAdd({ name, url })
                         }>Add Shortcut</button>
                    </div>
               </div>
          </div>
     );
}
