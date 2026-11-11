# 01 – Numerology Methods Used in India

> **Correction note:** My first draft listed several methods and book titles/authors (e.g. "Shodashak Shakti", specific titles attributed to named authors) that I could not verify. They have been removed. Only references I am reasonably confident exist are listed below, and every reference still needs to be **verified against a library/catalogue before publishing**.

## Important context
- Numerology (ank jyotish) in India is **not a single codified tradition**. The popular systems used by Indian practitioners largely come from Western/Middle-Eastern lineages (Chaldean, Pythagorean/Cheiro-style) adapted to Indian astrology.
- Separately, India has a genuine classical tradition for **naming**, based on nakshatra (birth star) and its pada/charana syllable – that is astrology, not numerology, but parents often combine the two. The app should support both.

## Methods to support

| Method | What it does | Letter mapping | Commonly cited references (verify) |
|---|---|---|---|
| **Chaldean** | Sums name letters (1–8) and birth date; 9 treated as sacred and not assigned to letters | A=1, B=2, C=3, D=4, E=5, F=8, G=3, H=5, I=1, J=1, K=2, L=3, M=4, N=5, O=7, P=8, Q=1, R=2, S=3, T=4, U=6, V=6, W=6, X=5, Y=1, Z=7 | *The Kabala of Numbers* by Sepharial |
| **Pythagorean** | A–Z mapped 1–9 cyclically; Life Path from birth date, Expression/Soul Urge from name | A=1 … I=9, J=1 … R=9, S=1 … Z=8 | Works by Dr. Juno Jordan; Pythagorean number theory is the basis |
| **Cheiro-style (popular in India)** | Mulank (birth day), Bhagyank (full birth date), Namank (name number), commonly using Chaldean values | Chaldean | *Cheiro's Book of Numbers* by Cheiro (William John Warner) |
| **Nakshatra / naming-syllable (astrological, not numerology)** | Initial syllable of the name chosen by the Moon's nakshatra pada at birth | Syllable table per nakshatra pada | Classical Jyotish texts such as Brihat Parashara Hora Shastra and Muhurta literature; Namakarana (naming) samskara in the Grihya Sutras – verify exact chapter references |
| **Indic-script adaptations (Devanagari, Tamil, Telugu etc.)** | Applies numeric values to native-script letters | Varies by practitioner; **no single standard** | Practitioner traditions; needs expert review |

## Product implications
1. Let the user **choose the method** and always show the letter-to-number table and the formula used, so results are reproducible.
2. State clearly that different methods can give different answers for the same name; do not present one as the only truth.
3. Treat predictions as cultural/entertainment guidance, not scientific fact. Add a disclaimer. Numerology has no scientific validation, and the app should not make health, financial or legal claims.
4. Engage 2–3 practising numerologists/astrologers per major region to validate the interpretation text (the commonly attributed meanings of numbers 1–9).
5. Decide a policy for name spelling variants: numerology results change with spelling, so link this with the misspelling feature in `03-Name-Evaluation-Engine.md`.

## Interpretation content
Number meanings (1–9, with master numbers 11/22/33 for Pythagorean) differ by author. Write original interpretation text with expert review; do not copy copyrighted book text.

## To-do
- Collect and verify the exact book editions and publishers.
- Prepare letter-value tables for English plus each supported Indic script, signed off by an expert.
- Define test cases (name → expected number) per method.
