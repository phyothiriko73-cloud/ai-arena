import { useState } from "react";
import { ArenaPage } from "./pages/ArenaPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  const [tab, setTab] = useState<"arena"|"history"|"settings">("arena");
  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo"><span>⚡</span><small>AI<br/>Arena</small></div>
        <div className="nav-items">
          {(["arena","history","settings"] as const).map(t => (
            <button key={t} className={`nav-btn${tab===t?" active":""}`} onClick={()=>setTab(t)}>
              <span>{t==="arena"?"⚡":t==="history"?"📋":"⚙️"}</span>
              <small>{t.charAt(0).toUpperCase()+t.slice(1)}</small>
            </button>
          ))}
        </div>
      </nav>
      <main className="main">
        <header className="header">
          <h1>{tab==="arena"?"⚡ Arena":tab==="history"?"📋 History":"⚙️ Settings"}</h1>
        </header>
        <div className="content">
          {tab==="arena"&&<ArenaPage/>}
          {tab==="history"&&<HistoryPage/>}
          {tab==="settings"&&<SettingsPage/>}
        </div>
      </main>
    </div>
  );
}
