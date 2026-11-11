import fs from "node:fs";
try { process.loadEnvFile(".env.local"); } catch {}

const res = await fetch("http://127.0.0.1:20128/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.OMNIROUTE_API_KEY,
  },
  body: JSON.stringify({
    model: "auto/best-fast",
    temperature: 0.2,
    max_tokens: 600,
    messages: [
      { role: "system", content: "You are an authentic Tamil onomastician. Return JSON." },
      { role: "user", content: "Provide 5 authentic Tamil boy names starting with letter Ya (ய). Format as valid JSON: {\"candidates\":[{\"nameTamil\":\"யுகன்\",\"nameLatin\":\"Yugan\",\"meaningTa\":\"காலத்தைக் குறிப்பது\",\"meaningEn\":\"Era or epoch\",\"root\":\"யுகம்\"}]}" }
    ]
  })
});
const data = await res.json();
console.log("Status:", res.status);
console.log("Model:", data.model);
console.log("Content:\n", data.choices?.[0]?.message?.content);

