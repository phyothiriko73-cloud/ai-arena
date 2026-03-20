export const PROVIDERS = [
  { id:"anthropic", name:"Claude", company:"Anthropic", icon:"🟠", color:"#d4956a", apiKeyUrl:"https://console.anthropic.com/settings/keys", models:[{id:"claude-opus-4-5",name:"Claude Opus 4.5",recommended:true},{id:"claude-sonnet-4-5",name:"Claude Sonnet 4.5"},{id:"claude-haiku-4-5",name:"Claude Haiku 4.5"}]},
  { id:"openai", name:"GPT", company:"OpenAI", icon:"🟢", color:"#19c37d", apiKeyUrl:"https://platform.openai.com/api-keys", models:[{id:"gpt-4o",name:"GPT-4o",recommended:true},{id:"gpt-4o-mini",name:"GPT-4o Mini"},{id:"o1",name:"o1"},{id:"o3-mini",name:"o3-mini"}]},
  { id:"google", name:"Gemini", company:"Google", icon:"🔵", color:"#4285f4", apiKeyUrl:"https://aistudio.google.com/app/apikey", models:[{id:"gemini-2.0-flash",name:"Gemini 2.0 Flash",recommended:true},{id:"gemini-1.5-pro",name:"Gemini 1.5 Pro"},{id:"gemini-1.5-flash",name:"Gemini 1.5 Flash"}]},
  { id:"mistral", name:"Mistral", company:"Mistral AI", icon:"🔶", color:"#ff7000", apiKeyUrl:"https://console.mistral.ai/api-keys", models:[{id:"mistral-large-latest",name:"Mistral Large",recommended:true},{id:"mistral-small-latest",name:"Mistral Small"}]},
  { id:"xai", name:"Grok", company:"xAI", icon:"✖️", color:"#cccccc", apiKeyUrl:"https://console.x.ai", models:[{id:"grok-2-latest",name:"Grok 2",recommended:true},{id:"grok-2-mini",name:"Grok 2 Mini"}]},
  { id:"groq", name:"Llama", company:"Meta/Groq", icon:"🦙", color:"#a855f7", apiKeyUrl:"https://console.groq.com/keys", models:[{id:"llama-3.3-70b-versatile",name:"Llama 3.3 70B",recommended:true},{id:"llama-3.1-8b-instant",name:"Llama 3.1 8B"}]},
  { id:"deepseek", name:"DeepSeek", company:"DeepSeek", icon:"🔷", color:"#1e6eff", apiKeyUrl:"https://platform.deepseek.com/api_keys", models:[{id:"deepseek-chat",name:"DeepSeek V3",recommended:true},{id:"deepseek-reasoner",name:"DeepSeek R1"}]},
  { id:"cohere", name:"Command", company:"Cohere", icon:"🌀", color:"#39d353", apiKeyUrl:"https://dashboard.cohere.com/api-keys", models:[{id:"command-r-plus",name:"Command R+",recommended:true},{id:"command-r",name:"Command R"}]},
];
export const getProvider = (id: string) => PROVIDERS.find(p => p.id === id);
