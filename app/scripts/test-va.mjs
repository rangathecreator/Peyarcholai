import fs from "node:fs";
try { process.loadEnvFile(".env.local"); } catch {}

const letter = process.argv[2] || "வ";
const res = await fetch("http://127.0.0.1:20128/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.OMNIROUTE_API_KEY,
  },
  body: JSON.stringify({
    model: "auto/best-fast",
    temperature: 0.2,
    max_tokens: 500,
    messages: [
      { role: "system", content: "You are an authentic Tamil onomastician. Return JSON." },
      { role: "user", content: `Provide 5 authentic Tamil baby names starting with letter ${letter}. Return valid JSON with format: {"candidates":[{"nameTamil":"...","nameLatin":"...","meaningTa":"...","meaningEn":"...","root":"..."}]}` }
    ]
  })
});
const data = await res.json();
console.log("Model:", data.model);
console.log("Response:", data.choices?.[0]?.message?.content);

