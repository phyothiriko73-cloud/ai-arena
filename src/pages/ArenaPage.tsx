import { useRef } from "react";
import { useStore } from "../store/useStore";
import { callProvider } from "../lib/api";
import { PROVIDERS } from "../lib/providers";

export function ArenaPage() {
  const { apiKeys, activeModels, question, setQuestion, responses, setResponses, updateResponse, addHistory } = useStore();
  const [loading, setLoading] = [responses.some(r=>r.status==="loading"), null];
  const ref = useRef<HTMLTextAreaElement>(null);
  const isLoading = responses.some(r=>r.status==="loading");
  const modelsWithKeys = activeModels.filter(m=>apiKeys[m.providerId]);

  async function askAll() {
    if (isLoading || !question.trim() || !modelsWithKeys.length) return;
    setResponses(modelsWithKeys.map(m=>({providerId:m.providerId,modelId:m.modelId,text:"",elapsed:0,status:"loading"})));
    await Promise.allSettled(modelsWithKeys.map(async m=>{
      try {
        const r = await callProvider(m.providerId, apiKeys[m.providerId], m.modelId, question);
        updateResponse(m.providerId, m.modelId, {text:r.text,elapsed:r.elapsed,tokens:r.tokens,status:"done"});
      } catch(e) {
        updateResponse(m.providerId, m.modelId, {status:"error",error:e instanceof Error?e.message:"Error"});
      }
    }));
    const final = useStore.getState().responses;
    addHistory({id:Date.now().toString(),question,responses:final,ts:Date.now()});
  }

  return (
    <div className="arena">
      <div className="chips">
        {activeModels.map(m=>{
          const p=PROVIDERS.find(x=>x.id===m.providerId);
          const hasKey=!!apiKeys[m.providerId];
          return <span key={m.providerId+m.modelId} className={`chip${hasKey?"":" no-key"}`} style={{borderColor:p?.color+"44",background:p?.color+"11"}}>
            {p?.icon} <span>{p?.models.find(x=>x.id===m.modelId)?.name||m.modelId}</span>
            {!hasKey&&<span className="badge-nokey">no key</span>}
          </span>;
        })}
      </div>
      <div className="prompt-wrap">
        <textarea ref={ref} className="prompt-ta" rows={3} placeholder="မေးချင်တာ ရိုက်ပါ… (Ctrl+Enter)" value={question} onChange={e=>setQuestion(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();askAll();}}} disabled={isLoading}/>
        <div className="prompt-footer">
          <span className="hint">Ctrl+Enter</span>
          {responses.length>0&&<button className="btn-clear" onClick={()=>{setQuestion("");setResponses([]);}}>✕ Clear</button>}
          <button className="btn-ask" onClick={askAll} disabled={isLoading||!question.trim()||!modelsWithKeys.length}>
            {isLoading?"⏳ Asking…":"⚡ Ask All"}
          </button>
        </div>
      </div>
      {!modelsWithKeys.length&&<div className="notice">⚠ Settings မှာ API key ထည့်ပါ</div>}
      {responses.length===0
        ? <div className="empty"><div className="empty-icon">⚡</div><p className="empty-title">AI Arena</p><p className="empty-sub">Models တွေကို တပြိုင်တည်း မေးပြီး အဖြေ ယှဉ်ကြည့်ပါ</p></div>
        : <div className="grid">
            {responses.map(r=>{
              const p=PROVIDERS.find(x=>x.id===r.providerId);
              const m=p?.models.find(x=>x.id===r.modelId);
              return <div key={r.providerId+r.modelId} className={`card ${r.status}`} style={{"--c":p?.color} as React.CSSProperties}>
                <div className="card-head">
                  <span className="card-icon">{p?.icon}</span>
                  <div><div className="card-model" style={{color:p?.color}}>{m?.name||r.modelId}</div><div className="card-co">{p?.company}</div></div>
                  {r.status==="done"&&<div className="card-stats">{r.elapsed.toFixed(1)}s{r.tokens?` · ${r.tokens}tok`:""}</div>}
                  {r.status==="loading"&&<span className="dots"><span/><span/><span/></span>}
                  {r.status==="error"&&<span className="err-badge">Error</span>}
                </div>
                <div className="card-body">
                  {r.status==="loading"&&<div className="shimmer"><div/><div className="s"/><div className="m"/></div>}
                  {r.status==="done"&&<pre className="card-text">{r.text}</pre>}
                  {r.status==="error"&&<p className="card-err">⚠ {r.error}</p>}
                </div>
              </div>;
            })}
          </div>
      }
    </div>
  );
}
