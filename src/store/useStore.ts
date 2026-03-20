import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Response { providerId:string; modelId:string; text:string; elapsed:number; tokens?:number; status:"loading"|"done"|"error"; error?:string; }
export interface HistoryEntry { id:string; question:string; responses:Response[]; ts:number; }

interface State {
  apiKeys: Record<string,string>;
  setApiKey: (id:string,k:string)=>void;
  removeApiKey: (id:string)=>void;
  activeModels: {providerId:string;modelId:string}[];
  setActiveModels: (m:{providerId:string;modelId:string}[])=>void;
  question: string;
  setQuestion: (q:string)=>void;
  responses: Response[];
  setResponses: (r:Response[])=>void;
  updateResponse: (pId:string,mId:string,u:Partial<Response>)=>void;
  history: HistoryEntry[];
  addHistory: (e:HistoryEntry)=>void;
  clearHistory: ()=>void;
}

export const useStore = create<State>()(persist((set)=>({
  apiKeys: {},
  setApiKey: (id,k) => set(s=>({apiKeys:{...s.apiKeys,[id]:k}})),
  removeApiKey: (id) => set(s=>{ const k={...s.apiKeys}; delete k[id]; return {apiKeys:k}; }),
  activeModels: [
    {providerId:"anthropic",modelId:"claude-opus-4-5"},
    {providerId:"openai",modelId:"gpt-4o"},
    {providerId:"google",modelId:"gemini-2.0-flash"},
    {providerId:"mistral",modelId:"mistral-large-latest"},
    {providerId:"groq",modelId:"llama-3.3-70b-versatile"},
    {providerId:"deepseek",modelId:"deepseek-chat"},
  ],
  setActiveModels: (m) => set({activeModels:m}),
  question: "",
  setQuestion: (q) => set({question:q}),
  responses: [],
  setResponses: (r) => set({responses:r}),
  updateResponse: (pId,mId,u) => set(s=>({responses:s.responses.map(r=>r.providerId===pId&&r.modelId===mId?{...r,...u}:r)})),
  history: [],
  addHistory: (e) => set(s=>({history:[e,...s.history].slice(0,100)})),
  clearHistory: () => set({history:[]}),
}), {name:"ai-arena", partialize:(s)=>({apiKeys:s.apiKeys,activeModels:s.activeModels,history:s.history})}));
