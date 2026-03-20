import { useState } from "react";
import { PROVIDERS } from "../lib/providers";
import { useStore } from "../store/useStore";
import { callProvider } from "../lib/api";

export function SettingsPage() {
  const { apiKeys, setApiKey, removeApiKey, activeModels, setActiveModels } = useStore();
  const [sel, setSel] = useState(PROVIDERS[0].id);
  const [vals, setVals] = useState<Record<string,string>>({});
  const [show, setShow] = useState<Record<string,boolean>>({});
  const [test, setTest] = useState<Record<string,string>>({});
  const p = PROVIDERS.find(x=>x.id===sel)!;
  const key = vals[sel]??apiKeys[sel]??"";

  async function runTest() {
    if (!key) return;
    setTest(s=>({...s,[sel]:"testing"}));
    try {
      const m = p.models.find(x=>x.recommended)||p.models[0];
      await callProvider(sel, key, m.id, "Hi");
      setTest(s=>({...s,[sel]:"ok"}));
      setApiKey(sel, key);
    } catch { setTest(s=>({...s,[sel]:"fail"})); }
  }

  const isActive = (pId:string, mId:string) => activeModels.some(m=>m.providerId===pId&&m.modelId===mId);

  return (
    <div className="settings">
      <aside className="s-sidebar">
        {PROVIDERS.map(x=>(
          <button key={x.id} className={`s-item${sel===x.id?" active":""}`} onClick={()=>setSel(x.id)}>
            <span>{x.icon}</span>
            <span className="s-name">{x.name}</span>
            <span className={`dot${apiKeys[x.id]?" on":""}`}/>
          </button>
        ))}
      </aside>
      <div className="s-main">
        <div className="s-head">
          <span style={{fontSize:32}}>{p.icon}</span>
          <div><div className="s-title">{p.name}</div><div className="s-co">{p.company}</div></div>
          {apiKeys[p.id]&&<span className="connected">✓ Connected</span>}
        </div>
        <div className="s-label">API KEY</div>
        <div className="key-row">
          <div className="key-wrap">
            <input className="key-input" type={show[sel]?"text":"password"} placeholder="Enter API key…"
              value={key} onChange={e=>setVals(s=>({...s,[sel]:e.target.value}))}/>
            <button className="eye-btn" onClick={()=>setShow(s=>({...s,[sel]:!s[sel]}))}>
              {show[sel]?"🙈":"👁"}
            </button>
          </div>
          <button className="btn-save" onClick={()=>{if(key)setApiKey(sel,key);}}>Save</button>
          <button className={`btn-test ${test[sel]||""}`} onClick={runTest} disabled={!key||test[sel]==="testing"}>
            {test[sel]==="testing"?"…":test[sel]==="ok"?"✓ OK":test[sel]==="fail"?"✗ Fail":"Test"}
          </button>
          {apiKeys[p.id]&&<button className="btn-del" onClick={()=>removeApiKey(sel)}>🗑</button>}
        </div>
        <a className="key-link" href={p.apiKeyUrl} target="_blank" rel="noreferrer">Get API key ↗</a>
        <div className="s-label" style={{marginTop:24}}>MODELS</div>
        {p.models.map(m=>{
          const active = isActive(p.id, m.id);
          return <div key={m.id} className={`model-row${active?" active":""}`}>
            <div>
              <span className="model-name">{m.name}</span>
              {m.recommended&&<span className="rec">Recommended</span>}
            </div>
            <button className={`model-btn${active?" rm":""}`}
              onClick={()=>active
                ? setActiveModels(activeModels.filter(x=>!(x.providerId===p.id&&x.modelId===m.id)))
                : setActiveModels([...activeModels,{providerId:p.id,modelId:m.id}])
              }>{active?"Remove":"+ Add"}</button>
          </div>;
        })}
      </div>
    </div>
  );
}
