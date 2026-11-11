const key = 'sk-6ee0133d5be48b7b-6d4cb4-75c64f4c';
const prompt = `You are an expert UI/UX and web design critic reviewing a rebranding and visual alignment update for a Tamil baby naming web application named 'பெயர்ச்சோலை (Peyarcholai)'.

The user reported these 4 specific visual defects:
1. Top header logo had multiple borders top and bottom, and didn't gel with the light background.
2. Banner logo had a black box background that clashed with the wine-red/plum banner.
3. Active tab 'Explore Names / பெயர் தேடல் / 10092' text had an unreadable white-on-light appearance.
4. Review generated images and template in loop for better quality.

We made these engineering fixes:
1. Generated pixel-perfect transparent PNGs (logo-transparent.png and logo-white-transparent.png) keyed using .NET Bitmap chroma keying. Bounding box strictly circumscribes the celestial cradle and stars within radius 64, leaving 0 non-zero edge pixels. Removed all wrapper border-amber-300, bg-amber-50, and rounded-2xl containers from layout.tsx.
2. Removed the bg-black/50, border-amber-400, and box wrappers around the banner logo in NamingGuruDashboard.tsx and docs/page.tsx. Replaced with logo-white-transparent.png with drop-shadow-[0_4px_16px_rgba(251,191,36,0.45)], letting the glowing celestial stars and cradle float directly on the wine hero gradient.
3. Diagnosed that globals.css had a hardcoded near-white .bg-gradient-to-r (#fffbeb to #fff7ed), while the active tab button had text-white and text-amber-100, causing zero-contrast white text on cream background. Created dedicated .tab-btn-active with royal mahogany-plum gradient (#78350f to #3d0d27), pure white title (#ffffff), glowing warm gold Tamil subtitle (#fde68a), and vibrant golden badge (#fbbf24) with dark text (#180510) achieving >7:1 AAA contrast.

Provide a concise 3-part evaluation:
1. Defect resolution assessment (Are each of the user's 3 reported defects comprehensively solved?)
2. Contrast & typography accessibility score (WCAG AAA check)
3. Aesthetic harmony verdict for the brand 'பெயர்ச்சோலை' (Celestial Grove of Names).`;

async function main() {
  const res = await fetch('http://127.0.0.1:20128/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key
    },
    body: JSON.stringify({
      model: 'antigravity/gemini-3.1-flash-lite',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    })
  });
  const data = await res.json();
  if (data.choices && data.choices[0]) {
    console.log('=== OMNIROUTE DESIGN REVIEW ===\n');
    console.log(data.choices[0].message.content);
  } else {
    console.log('Response:', JSON.stringify(data));
  }
}

main().catch(console.error);
