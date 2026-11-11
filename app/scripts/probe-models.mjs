const key = 'sk-6ee0133d5be48b7b-6d4cb4-75c64f4c';

async function test(m) {
  const start = Date.now();
  try {
    const res = await fetch('http://127.0.0.1:20128/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({
        model: m,
        messages: [{ role: 'user', content: 'Output JSON: {"status":"ok","model":"' + m + '"}' }],
        temperature: 0.1,
        max_tokens: 60
      }),
      signal: AbortSignal.timeout(15000)
    });
    const data = await res.json();
    const dur = Date.now() - start;
    if (data.choices && data.choices[0]) {
      console.log(`PASS [${dur}ms]: ${m} -> ${data.choices[0].message.content.trim().replace(/\n/g, ' ')}`);
      return true;
    } else {
      console.log(`FAIL [${dur}ms]: ${m} -> ${data.error ? data.error.message : JSON.stringify(data).slice(0, 100)}`);
      return false;
    }
  } catch (e) {
    console.log(`ERR [${Date.now() - start}ms]: ${m} -> ${e.message}`);
    return false;
  }
}

async function run() {
  const candidates = [
    'auto/chat',
    'auto/best-free',
    'auto/best-fast',
    'auto/pro-fast',
    'auto/coding',
    'groq/llama-3.3-70b-versatile',
    'groq/llama-3.1-8b-instant',
    'ddgw/gpt-4o-mini',
    'cl/claude-3-5-haiku-20241022',
    'openrouter/free'
  ];
  for (const c of candidates) {
    await test(c);
  }
}
run();

