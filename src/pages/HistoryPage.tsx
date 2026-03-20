import { useState } from "react";
import { useStore } from "../store/useStore";
import { PROVIDERS } from "../lib/providers";

export function HistoryPage() {
  const { history, clearHistory, setQuestion, setResponses } = useStore();
  const [open, setOpen] = useState<string|null>(null);
  if (!history.length) return <div className="empty"><div className="empty-icon">📋</div><p className="empty-title">No history</p><p className="empty-sub">မေးခွန်းတွေ ဒီမှာ သိမ်းမယ်</p></div>;
  return (
    <div className="history">
      <div className="h-bar">
        <span className="h-count">{history.length} conversations</span>
        <button className="btn-clr" onClick={clearHistory}>🗑 Clear all</button>
      </div>
      {history.map(e=>(
        <div key={e.id} className={`h-item${open===e.id?" open":""}`}>
          <div className="h-head" onClick={()=>setOpen(open===e.id?null:e.id)}>
            <span className="h-chev">{open===e.id?"▼":"▶"}</span>
            <div className="h-info">
              <p className="h-q">{e.question}</p>
              <p className="h-meta">{new Date(e.ts).toLocaleString()} · {e.responses.length} models</p>
            </div>
            <button className="btn-load" onClick={ev=>{ev.stopPropagation();setQuestion(e.question);setResponses(e.responses);}}>Load</button>
          </div>
          {open===e.id&&<div className="h-responses">
            {e.responses.map(r=>{
              const p=PROVIDERS.find(x=>x.id===r.providerId);
              const m=p?.models.find(x=>x.id===r.modelId);
              return <div key={r.providerId+r.modelId} className="h-card" style={{"--c":p?.color} as React.CSSProperties}>
                <div className="h-card-head"><span>{p?.icon}</span><span style={{color:p?.color}}>{m?.name}</span>{r.status==="done"&&<span className="h-t">{r.elapsed.toFixed(1)}s</span>}</div>
                <pre className="h-text">{r.status==="done"?r.text:r.error||"…"}</pre>
              </div>;
            })}
          </div>}
        </div>
      ))}
    </div>
  );
}
