export async function callProvider(providerId: string, apiKey: string, modelId: string, question: string) {
  const start = Date.now();
  const elapsed = () => (Date.now() - start) / 1000;
  const msgs = [{ role: "user", content: question }];

  let url = "", headers: Record<string,string> = {}, body = {};

  if (providerId === "anthropic") {
    url = "https://api.anthropic.com/v1/messages";
    headers = { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" };
    body = { model: modelId, max_tokens: 2048, messages: msgs };
  } else if (providerId === "google") {
    url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
    headers = { "Content-Type": "application/json" };
    body = { contents: [{ role:"user", parts:[{ text: question }] }], generationConfig: { maxOutputTokens: 2048 } };
  } else if (providerId === "cohere") {
    url = "https://api.cohere.ai/v1/chat";
    headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` };
    body = { model: modelId, message: question, max_tokens: 2048 };
  } else {
    const urls: Record<string,string> = {
      openai: "https://api.openai.com/v1/chat/completions",
      mistral: "https://api.mistral.ai/v1/chat/completions",
      xai: "https://api.x.ai/v1/chat/completions",
      groq: "https://api.groq.com/openai/v1/chat/completions",
      deepseek: "https://api.deepseek.com/chat/completions",
    };
    url = urls[providerId] || "";
    headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` };
    body = { model: modelId, max_tokens: 2048, messages: msgs };
  }

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.message || `${providerId} error`);

  let text = "";
  if (providerId === "anthropic") text = data.content?.map((b: {text?:string}) => b.text||"").join("") || "";
  else if (providerId === "google") text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  else if (providerId === "cohere") text = data.text || "";
  else text = data.choices?.[0]?.message?.content || "";

  return { text, elapsed: elapsed(), tokens: data.usage?.output_tokens || data.usage?.completion_tokens };
}
