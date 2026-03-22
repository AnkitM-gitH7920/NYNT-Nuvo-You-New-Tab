import { useState } from "react";

export default function TodoList() {
     const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("nynt-todos") || "[]"));
     const [val, setVal] = useState("");

     function save(t) {
          setTodos(t);
          localStorage.setItem("nynt-todos", JSON.stringify(t));
     }
     function add(e) {
          e.preventDefault();
          if (val.trim()) {
               save([{ text: val.trim(), done: false }, ...todos]);
               setVal("");
          }
     }
     function toggle(i) {
          const t = [...todos];
          t[i].done = !t[i].done;
          save(t);
     }
     function del(i) {
          save(todos.filter((_, j) => j !== i))
     }

     return (
          <div className="todo-inner">
               <form className="todo-form" onSubmit={add}>
                    <input className="todo-input" placeholder="Add task..." value={val} onChange={e => setVal(e.target.value)} />
                    <button type="submit" className="todo-add-btn">+</button>
               </form>
               <div className="todo-list">
                    {todos.map((t, i) => (
                         <div key={i} className={`todo-item ${t.done ? "done" : ""}`}>
                              <span className="todo-check" onClick={() => toggle(i)}>{t.done ? "✓" : "○"}</span>
                              <span className="todo-text">{t.text}</span>
                              <span className="todo-del" onClick={() => del(i)}>✕</span>
                         </div>
                    ))}
                    {todos.length === 0 && <div className="todo-empty">No tasks yet</div>}
               </div>
          </div>
     );
}
