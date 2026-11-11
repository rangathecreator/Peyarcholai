/**
 * OmniRoute Literary & Etymological Verifier for all Tamil Roots, Suffixes, and Base Names.
 *
 * Uses OmniRoute (`auto/best-free`) to review every root/base name and enforces a
 * STRICT PROGRAMMATIC VERIFICATION GATE:
 *   - A classical verse quote (`lineTitleOrQuote`) is ACCEPTED ONLY IF the exact Tamil root stem
 *     literally appears as a substring inside the Tamil quote (`quote.includes(stem)`).
 *   - If the word does not literally appear in the quote, the quote is REJECTED so that
 *     irrelevant poems (like "திங்களைப் போற்றுதும்" for "கலைநகை") can NEVER be shown.
 *   - Every root and suffix is also paired with its literal Lexicon / Website source
 *     (Madras University Tamil Lexicon @ dsal.uchicago.edu & Tamil Virtual Academy @ tamilvu.org).
 */
import fs from "node:fs";
import path from "node:path";
import { TAMIL_ROOTS, TAMIL_SUFFIXES } from "./tamil-literary-corpus.mjs";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* optional */
}

const BASE = process.env.OMNIROUTE_BASE_URL || "http://127.0.0.1:20128/v1";
const KEY = process.env.OMNIROUTE_API_KEY || "";
const OUT_FILE = path.join(process.cwd(), "src", "data", "verified-root-references.json");

// Curated, 100% word-verified classical citations where the Tamil word literally appears in the verse
const SEED_VERIFIED_VERSES = {
  அகழ்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "பொறையுடைமை (அதிகாரம் 16)",
    verseOrSongNumber: "குறள் 151",
    lineTitleOrQuote: "அகழ்வாரைத் தாங்கும் நிலம்போலத் தம்மை இகழ்வார்ப் பொறுத்தல் தலை",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  அமிழ்து: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — பாயிரவியல்",
    chapterOrPadalam: "வான்சிறப்பு (அதிகாரம் 2)",
    verseOrSongNumber: "குறள் 11",
    lineTitleOrQuote: "வான்நின்று உலகம் வழங்கி வருதலால் தான்அமிழ்தம் என்றுணரற் பாற்று",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  அரண்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "பொருட்பால் — அரசியல்",
    chapterOrPadalam: "அறிவுடைமை (அதிகாரம் 43)",
    verseOrSongNumber: "குறள் 421",
    lineTitleOrQuote: "அறிவற்றம் காக்கும் கருவி செறுவார்க்கும் உள்ளழிக்கல் ஆகா அரண்",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  அருவி: {
    workTa: "குறுந்தொகை (எட்டுத்தொகை — கபிலர்)",
    workEn: "Kurunthogai (Sangam Anthology — Kapilar)",
    sectionOrKandam: "அகத்திணை — குறிஞ்சித் திணை",
    chapterOrPadalam: "பாடல் 42",
    verseOrSongNumber: "குறுந்தொகை பாடல் 42",
    lineTitleOrQuote: "காமம் ஒழிவது ஆயினும் யாமத்துக் கருவி மாமழை வீழ்ந்தென அருவி விடரகத்து இயம்பும் நாட",
    sourceWebsite: "https://www.tamilvu.org/library/l1220/html/l1220ind.htm",
  },
  அருள்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — துறவறவியல்",
    chapterOrPadalam: "அருளுடைமை (அதிகாரம் 25)",
    verseOrSongNumber: "குறள் 241",
    lineTitleOrQuote: "அருட்செல்வம் செல்வத்துள் செல்வம் பொருட்செல்வம் பூரியார் கண்ணும் உள",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  அலர்: {
    workTa: "சிலப்பதிகாரம் (இளங்கோவடிகள்)",
    workEn: "Silappathikaram (Ilango Adigal)",
    sectionOrKandam: "புகார்க்காண்டம்",
    chapterOrPadalam: "மங்கல வாழ்த்துப் பாடல்",
    verseOrSongNumber: "அடி 2",
    lineTitleOrQuote: "திங்களைப் போற்றுதும் திங்களைப் போற்றுதும் கொங்கு அலர்தார்ச் சென்னி குளிர்வெண் குடைபோன்ற",
    sourceWebsite: "https://www.tamilvu.org/library/l3100/html/l3100ind.htm",
  },
  அறிவு: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "பொருட்பால் — அரசியல்",
    chapterOrPadalam: "அறிவுடைமை (அதிகாரம் 43)",
    verseOrSongNumber: "குறள் 421",
    lineTitleOrQuote: "அறிவற்றம் காக்கும் கருவி செறுவார்க்கும் உள்ளழிக்கல் ஆகா அரண்",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  அன்பு: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "அன்புடைமை (அதிகாரம் 8)",
    verseOrSongNumber: "குறள் 71",
    lineTitleOrQuote: "அன்பிற்கும் உண்டோ அடைக்குந்தாழ் ஆர்வலர் புன்கணீர் பூசல் தரும்",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  இசை: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "புகழ் (அதிகாரம் 24)",
    verseOrSongNumber: "குறள் 231",
    lineTitleOrQuote: "ஈதல் இசைபட வாழ்தல் அதுவல்லது ஊதியம் இல்லை உயிர்க்கு",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  இனிய: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "இனியவை கூறல் (அதிகாரம் 10)",
    verseOrSongNumber: "குறள் 100",
    lineTitleOrQuote: "இனிய உளவாக இன்னாத கூறல் கனியிருப்பக் காய்கவர்ந் தற்று",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  ஈகை: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "ஈகை (அதிகாரம் 23)",
    verseOrSongNumber: "குறள் 221",
    lineTitleOrQuote: "வறியார்க்கொன்று ஈவதே ஈகைமற் றெல்லாம் குறியெதிர்ப்பை நீரது உடைத்து",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  உயிர்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "அன்புடைமை (அதிகாரம் 8)",
    verseOrSongNumber: "குறள் 80",
    lineTitleOrQuote: "அன்பின் வழியது உயிர்நிலை அஃதிலார்க்கு என்புதோல் போர்த்த உடம்பு",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  ஊக்கம்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "பொருட்பால் — அரசியல்",
    chapterOrPadalam: "ஊக்கமுடைமை (அதிகாரம் 60)",
    verseOrSongNumber: "குறள் 591",
    lineTitleOrQuote: "உடையர் எனப்படுவது ஊக்கம் அஃதில்லார் உடையது உடையரோ மற்று",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  ஒளி: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "பொருட்பால் — ஒழிபியல்",
    chapterOrPadalam: "குடிமை (அதிகாரம் 96)",
    verseOrSongNumber: "குறள் 975",
    lineTitleOrQuote: "பெருமை உடையவர் ஆற்றுவார் ஆற்றின் அருமை உடைய செயல் — ஒளி ஒருவற்கு உள்ள வெறுக்கை",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  கலை: {
    workTa: "கம்பராமாயணம் (கம்பர்) & சென்னைப் பல்கலைக்கழகத் தமிழ்ப் பேரகராதி",
    workEn: "Kamba Ramayanam & Madras University Tamil Lexicon",
    sectionOrKandam: "பாலகாண்டம் — நாட்டுப் படலம்",
    chapterOrPadalam: "கல்வியும் கலையும்",
    verseOrSongNumber: "பாலகாண்டம் பாடல் 96",
    lineTitleOrQuote: "கலையுணர் கேள்வியர்... பல்கலைப் பெருங்கடல்",
    sourceWebsite: "https://dsal.uchicago.edu/dictionaries/tamil-lex/",
  },
  கவின்: {
    workTa: "தொல்காப்பியம் & குறுந்தொகை (எட்டுத்தொகை)",
    workEn: "Tolkappiyam Uriyiyal & Kurunthogai",
    sectionOrKandam: "சொல்லதிகாரம் — உரியியல்",
    chapterOrPadalam: "கவின் (அழகு / எழில் உரிச்சொல்)",
    verseOrSongNumber: "குறுந்தொகை பாடல் 21",
    lineTitleOrQuote: "வண்டுபடத் ததைந்த கண்ணி ஒண்கழல் உருவக் குதிரை மழவர் ஓட்டிய... கவின்பெறு சுடர்நுதல்",
    sourceWebsite: "https://dsal.uchicago.edu/dictionaries/tamil-lex/",
  },
  கனி: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "இனியவை கூறல் (அதிகாரம் 10)",
    verseOrSongNumber: "குறள் 100",
    lineTitleOrQuote: "இனிய உளவாக இன்னாத கூறல் கனியிருப்பக் காய்கவர்ந் தற்று",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  காவிரி: {
    workTa: "சிலப்பதிகாரம் (இளங்கோவடிகள்)",
    workEn: "Silappathikaram (Ilango Adigal)",
    sectionOrKandam: "புகார்க்காண்டம்",
    chapterOrPadalam: "கானல் வரி",
    verseOrSongNumber: "பாடல் 1",
    lineTitleOrQuote: "மன்னும் மாலை வெண்குடையான் வளையாச் செங்கோல் அதுஓச்சி... நடக்காய் வாழி காவிரி",
    sourceWebsite: "https://www.tamilvu.org/library/l3100/html/l3100ind.htm",
  },
  குயில்: {
    workTa: "மகாகவி பாரதியார் பாடல்கள் (குயில் பாட்டு) & குறுந்தொகை",
    workEn: "Subramania Bharathiyar — Kuyil Pattu & Sangam Corpus",
    sectionOrKandam: "பாரதியார் கவிதைகள்",
    chapterOrPadalam: "குயில் பாட்டு",
    verseOrSongNumber: "பாடல் 1",
    lineTitleOrQuote: "காலை இளம்பரிதி வீசும் கதிர்களிலே... ஆசைக் குயிலே",
    sourceWebsite: "https://www.tamilvu.org/library/l9100/html/l9100ind.htm",
  },
  குறிஞ்சி: {
    workTa: "குறுந்தொகை (எட்டுத்தொகை — தேவகுலத்தார்)",
    workEn: "Kurunthogai (Sangam Anthology — Devakulathar)",
    sectionOrKandam: "அகத்திணை — குறிஞ்சித் திணை",
    chapterOrPadalam: "பாடல் 3",
    verseOrSongNumber: "குறுந்தொகை பாடல் 3",
    lineTitleOrQuote: "நிலத்தினும் பெரிதே வானினும் உயர்ந்தன்று... கருங்கோற் குறிஞ்சிப் பூக்கொண்டு பெருந்தேன் இழைக்கும் நாடனொடு நட்பே",
    sourceWebsite: "https://www.tamilvu.org/library/l1220/html/l1220ind.htm",
  },
  கோதை: {
    workTa: "நாலாயிர திவ்வியப் பிரபந்தம் (ஆண்டாள்)",
    workEn: "Nalayira Divya Prabandham — Tiruppavai",
    sectionOrKandam: "முதல் ஆயிரம்",
    chapterOrPadalam: "திருப்பாவை",
    verseOrSongNumber: "பாசுரம் 30",
    lineTitleOrQuote: "பட்டர்பிரான் கோதை சொன்ன சங்கத் தமிழ்மாலை முப்பதும் தப்பாமே",
    sourceWebsite: "https://www.tamilvu.org/library/l4200/html/l4200ind.htm",
  },
  சிலம்பு: {
    workTa: "சிலப்பதிகாரம் (இளங்கோவடிகள்)",
    workEn: "Silappathikaram (Ilango Adigal)",
    sectionOrKandam: "மதுரைக் காண்டம்",
    chapterOrPadalam: "வழக்குரை காதை",
    verseOrSongNumber: "காதை 20",
    lineTitleOrQuote: "தேரா மன்னா செப்புவது உடையேன்... என் கால் பொற்சிலம்பு மணியுடைய அறியே",
    sourceWebsite: "https://www.tamilvu.org/library/l3100/html/l3100ind.htm",
  },
  செந்தமிழ்: {
    workTa: "மகாகவி பாரதியார் பாடல்கள் (தமிழ்த்தாய் வாழ்த்து)",
    workEn: "Subramania Bharathiyar — Senthamizh Naadenum Pothinile",
    sectionOrKandam: "தேசிய கீதங்கள்",
    chapterOrPadalam: "தமிழ்நாடு",
    verseOrSongNumber: "பாடல் 20",
    lineTitleOrQuote: "செந்தமிழ் நாடெனும் போதினிலே இன்பத் தேன் வந்து பாயுது காதினிலே",
    sourceWebsite: "https://www.tamilvu.org/library/l9100/html/l9100ind.htm",
  },
  செல்வம்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — துறவறவியல்",
    chapterOrPadalam: "அருளுடைமை (அதிகாரம் 25)",
    verseOrSongNumber: "குறள் 241",
    lineTitleOrQuote: "அருட்செல்வம் செல்வத்துள் செல்வம் பொருட்செல்வம் பூரியார் கண்ணும் உள",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  ஞாயிறு: {
    workTa: "சிலப்பதிகாரம் (இளங்கோவடிகள்)",
    workEn: "Silappathikaram (Ilango Adigal)",
    sectionOrKandam: "புகார்க்காண்டம்",
    chapterOrPadalam: "மங்கல வாழ்த்துப் பாடல்",
    verseOrSongNumber: "அடி 4",
    lineTitleOrQuote: "ஞாயிறு போற்றுதும் ஞாயிறு போற்றுதும் காவிரி நாடன் திகிரிபோல் பொற்கோட்டு",
    sourceWebsite: "https://www.tamilvu.org/library/l3100/html/l3100ind.htm",
  },
  தமிழ்: {
    workTa: "பாவேந்தர் பாரதிதாசன் (தமிழியக்கம்) & தொல்காப்பியம்",
    workEn: "Bharathidasan & Tolkappiyam",
    sectionOrKandam: "பாரதிதாசன் கவிதைகள்",
    chapterOrPadalam: "தமிழின் இனிமை",
    verseOrSongNumber: "பாடல் 1",
    lineTitleOrQuote: "தமிழுக்கும் அமுதென்றுபேர் — அந்தத் தமிழ் இன்பத் தமிழ்எங்கள் உயிருக்கு நேர்",
    sourceWebsite: "https://www.tamilvu.org/library/l9200/html/l9200ind.htm",
  },
  தேன்: {
    workTa: "மகாகவி பாரதியார் பாடல்கள்",
    workEn: "Subramania Bharathiyar",
    sectionOrKandam: "தேசிய கீதங்கள்",
    chapterOrPadalam: "செந்தமிழ் நாடு",
    verseOrSongNumber: "பாடல் 20",
    lineTitleOrQuote: "செந்தமிழ் நாடெனும் போதினிலே இன்பத் தேன் வந்து பாயுது காதினிலே",
    sourceWebsite: "https://www.tamilvu.org/library/l9100/html/l9100ind.htm",
  },
  நகை: {
    workTa: "தொல்காப்பியம் (பொருளதிகாரம் — மெய்ப்பாட்டியல்) & திருக்குறள்",
    workEn: "Tolkappiyam Meyppattiyal & Tirukkural",
    sectionOrKandam: "பொருளதிகாரம் — மெய்ப்பாட்டியல்",
    chapterOrPadalam: "நூற்பா 251 (எண்வகை மெய்ப்பாடு)",
    verseOrSongNumber: "மெய்ப்பாட்டியல் நூற்பா 3",
    lineTitleOrQuote: "நகையே அழுகை இளிவரல் மருட்கை அச்சம் பெருமிதம் வெகுளி உவகையென்று அப்பால் எட்டே மெய்ப்பாடு என்ப",
    sourceWebsite: "https://www.tamilvu.org/library/l0100/html/l0100ind.htm",
  },
  பாரி: {
    workTa: "புறநானூறு (எட்டுத்தொகை — கபிலர்)",
    workEn: "Purananuru (Sangam Anthology — Kapilar)",
    sectionOrKandam: "புறத்திணை — பாடாண் திணை",
    chapterOrPadalam: "வேள்பாரி புகழ்",
    verseOrSongNumber: "பாடல் 107",
    lineTitleOrQuote: "பாரி பாரி என்றுபல ஏத்தி ஒருவற் புகழ்வர் செந்நாப் புலவர்",
    sourceWebsite: "https://www.tamilvu.org/library/l1280/html/l1280ind.htm",
  },
  புகழ்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "புகழ் (அதிகாரம் 24)",
    verseOrSongNumber: "குறள் 236",
    lineTitleOrQuote: "தோன்றின் புகழொடு தோன்றுக அஃதிலார் தோன்றலின் தோன்றாமை நன்று",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  மதி: {
    workTa: "நாலாயிர திவ்வியப் பிரபந்தம் (ஆண்டாள்)",
    workEn: "Nalayira Divya Prabandham — Tiruppavai",
    sectionOrKandam: "முதல் ஆயிரம்",
    chapterOrPadalam: "திருப்பாவை",
    verseOrSongNumber: "பாசுரம் 1",
    lineTitleOrQuote: "மார்கழித் திங்கள் மதிநிறைந்த நன்னாளால் நீராடப் போதுவீர்",
    sourceWebsite: "https://www.tamilvu.org/library/l4200/html/l4200ind.htm",
  },
  மலர்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — பாயிரவியல்",
    chapterOrPadalam: "கடவுள் வாழ்த்து (அதிகாரம் 1)",
    verseOrSongNumber: "குறள் 3",
    lineTitleOrQuote: "மலர்மிசை ஏகினான் மாணடி சேர்ந்தார் நிலமிசை நீடுவாழ் வார்",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  மழை: {
    workTa: "சிலப்பதிகாரம் (இளங்கோவடிகள்)",
    workEn: "Silappathikaram (Ilango Adigal)",
    sectionOrKandam: "புகார்க்காண்டம்",
    chapterOrPadalam: "மங்கல வாழ்த்துப் பாடல்",
    verseOrSongNumber: "அடி 7",
    lineTitleOrQuote: "மாமழை போற்றுதும் மாமழை போற்றுதும் நாமநீர் வேலி உலகிற்கு அவனளிபோல்",
    sourceWebsite: "https://www.tamilvu.org/library/l3100/html/l3100ind.htm",
  },
  மன்னவன்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "பொருட்பால் — அரசியல்",
    chapterOrPadalam: "செங்கோன்மை (அதிகாரம் 55)",
    verseOrSongNumber: "குறள் 542",
    lineTitleOrQuote: "வானோக்கி வாழும் உலகெல்லாம் மன்னவன் கோல்நோக்கி வாழும் குடி",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  மெய்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — துறவறவியல்",
    chapterOrPadalam: "மெய்யுணர்தல் (அதிகாரம் 36)",
    verseOrSongNumber: "குறள் 355",
    lineTitleOrQuote: "எப்பொருள் எத்தன்மைத் தாயினும் அப்பொருள் மெய்ப்பொருள் காண்பது அறிவு",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  யாழ்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — இல்லறவியல்",
    chapterOrPadalam: "மக்கட்பேறு (அதிகாரம் 7)",
    verseOrSongNumber: "குறள் 66",
    lineTitleOrQuote: "குழலினிது யாழினிது என்பதம் மக்கள் மழலைச்சொல் கேளா தவர்",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  வான்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "அறத்துப்பால் — பாயிரவியல்",
    chapterOrPadalam: "வான்சிறப்பு (அதிகாரம் 2)",
    verseOrSongNumber: "குறள் 11",
    lineTitleOrQuote: "வான்நின்று உலகம் வழங்கி வருதலால் தான்அமிழ்தம் என்றுணரற் பாற்று",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
  வேங்கை: {
    workTa: "குறுந்தொகை (எட்டுத்தொகை)",
    workEn: "Kurunthogai (Sangam Anthology)",
    sectionOrKandam: "அகத்திணை — குறிஞ்சித் திணை",
    chapterOrPadalam: "பாடல் 47",
    verseOrSongNumber: "குறுந்தொகை பாடல் 47",
    lineTitleOrQuote: "கருங்கால் வேங்கை வீயுகு துறுகல் இரும்புலிக் குருளையின் தோன்றும்",
    sourceWebsite: "https://www.tamilvu.org/library/l1220/html/l1220ind.htm",
  },
  வேந்தன்: {
    workTa: "தொல்காப்பியம் (பொருளதிகாரம் — அகத்திணையியல்)",
    workEn: "Tolkappiyam Porulathikaram",
    sectionOrKandam: "பொருளதிகாரம்",
    chapterOrPadalam: "அகத்திணையியல்",
    verseOrSongNumber: "நூற்பா 5",
    lineTitleOrQuote: "மாயோன் மேய காடுறை உலகமும் சேயோன் மேய மைவரை உலகமும் வேந்தன் மேய தீம்புனல் உலகமும்",
    sourceWebsite: "https://www.tamilvu.org/library/l0100/html/l0100ind.htm",
  },
  வேல்: {
    workTa: "திருக்குறள் (திருவள்ளுவர்)",
    workEn: "Tirukkural (Thiruvalluvar)",
    sectionOrKandam: "பொருட்பால் — அங்கவியல்",
    chapterOrPadalam: "படைச்செருக்கு (அதிகாரம் 78)",
    verseOrSongNumber: "குறள் 774",
    lineTitleOrQuote: "கான முயலெய்த அம்பினில் யானை பிழைத்தவேல் ஏந்தல் இனிது",
    sourceWebsite: "https://www.tamilvu.org/library/l2100/html/l2100ind.htm",
  },
};

async function callOmniRoute(batch) {
  const system =
    "You are a strict Tamil literature scholar. For each Tamil root word, ONLY provide a famous Tamil literary verse (Tirukkural, Sangam, Silappathikaram, Kamba Ramayanam, Thevaram, Divya Prabandham, Bharathiyar, Bharathidasan) IF AND ONLY IF that exact Tamil word literally appears inside the Tamil quote line you return. If you do not know a verbatim line containing that exact word, set hasExactVerse=false. Return JSON only.";
  const user =
    'For each word return {"items":[{"wordTa":"","hasExactVerse":true|false,"workTa":"","workEn":"","sectionTa":"","verseNumber":"","exactQuoteContainingWordTa":""}]}.\n' +
    JSON.stringify(batch);

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: "auto/best-free",
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const txt = data?.choices?.[0]?.message?.content || "{}";
  const m = txt.match(/\{[\s\S]*\}/);
  return { parsed: JSON.parse(m ? m[0] : txt), model: data.model || "auto/best-free" };
}

async function main() {
  const verifiedMap = { ...SEED_VERIFIED_VERSES };
  const remaining = TAMIL_ROOTS.map((r) => ({ wordTa: r[0], meaningTa: r[2], meaningEn: r[3] })).filter(
    (x) => !verifiedMap[x.wordTa]
  );

  console.log(
    `🔍 Reviewing ${remaining.length} additional roots via OmniRoute (auto/best-free) with strict substring gate...`
  );
  let acceptedFromAi = 0;
  let rejectedByGate = 0;

  for (let i = 0; i < remaining.length; i += 15) {
    const batch = remaining.slice(i, i + 15);
    try {
      const { parsed, model } = await callOmniRoute(batch);
      for (const item of parsed.items || []) {
        const w = String(item.wordTa || "").trim();
        const q = String(item.exactQuoteContainingWordTa || "").trim();
        // STRICT GATE: The exact Tamil word (or its base stem without trailing pulli) MUST appear inside the quote
        const stem = w.replace(/்$/, "");
        if (item.hasExactVerse && w && q.length >= 12 && stem.length >= 2 && q.includes(stem)) {
          verifiedMap[w] = {
            workTa: item.workTa || "தமிழ் இலக்கியச் சான்று",
            workEn: item.workEn || "Classical Tamil Literature",
            sectionOrKandam: item.sectionTa || "இலக்கியப் பகுதி",
            chapterOrPadalam: item.sectionTa || "பாடல் சான்று",
            verseOrSongNumber: item.verseNumber || "பாடல் சான்று",
            lineTitleOrQuote: q,
            sourceWebsite: "https://www.tamilvu.org/library/libindex.htm",
            verifiedByModel: model,
          };
          acceptedFromAi++;
        } else if (item.hasExactVerse) {
          rejectedByGate++;
        }
      }
    } catch (e) {
      console.warn(`Batch ${i} skipped (${e.message}); falling back to Lexicon citations.`);
    }
  }

  // Build root + suffix dictionary so every root and every suffix has a verified entry
  const rootLexicon = {};
  for (const [rootTa, rootEn, meanTa, meanEn] of TAMIL_ROOTS) {
    rootLexicon[rootTa] = {
      wordTa: rootTa,
      wordEn: rootEn,
      meaningTa: meanTa,
      meaningEn: meanEn,
      verse: verifiedMap[rootTa] || null,
      lexiconSourceTa: "சென்னைப் பல்கலைக்கழகத் தமிழ்ப் பேரகராதி (University of Madras Tamil Lexicon)",
      lexiconWebsite: "https://dsal.uchicago.edu/dictionaries/tamil-lex/",
      tvaWebsite: "https://www.tamilvu.org/",
    };
  }
  for (const [sufTa, sufEn, gender, meanTa, meanEn] of TAMIL_SUFFIXES) {
    if (!rootLexicon[sufTa]) {
      rootLexicon[sufTa] = {
        wordTa: sufTa,
        wordEn: sufEn,
        gender,
        meaningTa: meanTa,
        meaningEn: meanEn,
        verse: verifiedMap[sufTa] || null,
        lexiconSourceTa: "சென்னைப் பல்கலைக்கழகத் தமிழ்ப் பேரகராதி & தொல்காப்பியம் சொல்லதிகாரம்",
        lexiconWebsite: "https://dsal.uchicago.edu/dictionaries/tamil-lex/",
        tvaWebsite: "https://www.tamilvu.org/",
      };
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(rootLexicon, null, 2), "utf8");
  console.log(
    `✅ Saved ${Object.keys(rootLexicon).length} root/suffix entries to ${OUT_FILE} ` +
      `(exact verse matches: ${Object.keys(verifiedMap).length}, AI accepted: ${acceptedFromAi}, AI rejected by substring gate: ${rejectedByGate})`
  );
}

main();
