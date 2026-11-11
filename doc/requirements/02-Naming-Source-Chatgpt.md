# Comprehensive Source Directory for a Tamil Naming Web App

## Purpose

This document is a research and implementation reference for building a
Tamil naming web application. It expands the source categories discussed
in the planning conversation and proposes a data model, classification
system, collection workflow, and quality controls.

The app should be more than a list of baby names. It should function as
a **Tamil Name Knowledge Database**, showing where each name or word
comes from, what it means, how it is pronounced, whether it is
linguistically Tamil, and whether it is historically attested as a
personal name.

> **Important distinction:** A Tamil word is not automatically a
> historically attested personal name. Store these separately:
>
> 1.  Historically attested personal names.
> 2.  Tamil words that are suitable for use as names.
> 3.  Newly coined names generated from Tamil roots.

------------------------------------------------------------------------

# 1. Classical Tamil Literature and Digital Libraries

These are core sources for authentic Tamil words, historical names,
characters, places, values, and cultural references.

## 1.1 Major classical literature collections

  -----------------------------------------------------------------------------------------
  Source                  Relevant content        Link
  ----------------------- ----------------------- -----------------------------------------
  Central Institute of    Classical Tamil works,  https://www.cict.in/
  Classical Tamil (CICT)  Sangam texts, epics,    
                          grammar, manuscripts    
                          and research material   

  CICT Digital Archives / Classical literature,   https://www.cict.in/
  resources               concordances, Nikaṇṭu   
                          dictionaries and        
                          manuscripts; check the  
                          current archive         
                          navigation              

  Tamil Virtual Academy   Literature from Sangam  https://www.tamilvu.org/
  (TVA)                   to modern periods,      
                          dictionaries,           
                          commentaries and        
                          cultural resources      

  Project Madurai         Unicode editions of     https://www.projectmadurai.org/
                          Tamil books, epics,     
                          poems and devotional    
                          literature              

  Sangam Tamil            Searchable Sangam       https://sangamtamil.com/
                          literature, poems,      
                          poets, landscapes and   
                          related information     

  Tamil Concordance       Search words across     https://www.tamilconcordance.in/
                          classical Tamil texts;  
                          verify current access   
                          and coverage            

  Digital Dictionaries of Digitized historical    https://dsal.uchicago.edu/dictionaries/
  South Asia (DDSA)       dictionaries, including 
                          the University of       
                          Madras Tamil Lexicon    

  Tamil Digital Library   Digitized Tamil books,  https://tamildigitallibrary.in/
                          manuscripts and         
                          historical documents    
  -----------------------------------------------------------------------------------------

### What to extract

-   Names of poets, kings, queens and literary characters.
-   Words describing bravery, beauty, wisdom, generosity and kindness.
-   Words associated with mountains, rivers, flowers and landscapes.
-   Words for the sun, moon, rain, wind, sea and sky.
-   Names of ancient Tamil communities, kingdoms and historical places.
-   Words appearing in poems that may be suitable as personal names.

## 1.2 Individual classical works and collections

Do not restrict the database to famous character names. Extract
meaningful vocabulary from the actual verses, with the verse or passage
reference retained.

  -----------------------------------------------------------------------
  Literature / collection             Potential naming material
  ----------------------------------- -----------------------------------
  Ettuthokai (எட்டுத்தொகை)              Poets, patrons, historical
                                      personalities, nature and virtues

  Pattuppattu (பத்துப்பாட்டு)            Landscapes, mountains, rivers,
                                      flowers, kings and cultural terms

  Pathinenkilkanakku (பதினெண்கீழ்க்கணக்கு) Ethics, knowledge, character, good
                                      conduct and wisdom

  Tolkappiyam (தொல்காப்பியம்)            Tamil phonology, grammar, word
                                      formation and linguistic structure

  Silappathikaram (சிலப்பதிகாரம்)       Character names, historical
                                      settings and cultural vocabulary

  Manimekalai (மணிமேகலை)              Character names, virtues and
                                      philosophical vocabulary

  Civaka Cintamani (சீவக சிந்தாமணி)     Literary character names and
                                      classical vocabulary

  Valayapathi (வளையாபதி)              Fragmentary epic material; use only
                                      where text and provenance can be
                                      verified

  Muthollayiram (முத்தொள்ளாயிரம்)        Chera, Chola and Pandya kings,
                                      royal culture and praise
                                      terminology

  Pazhamozhi Naanuru (பழமொழி நானூறு)  Traditional expressions, wisdom and
                                      virtues
  -----------------------------------------------------------------------

Useful discovery portals:

-   Project Madurai: https://www.projectmadurai.org/
-   Tamil Virtual Academy: https://www.tamilvu.org/
-   Central Institute of Classical Tamil: https://www.cict.in/

------------------------------------------------------------------------

# 2. Classical Tamil Dictionaries, Lexicons and Nikaṇṭu

This category is essential for meaning verification and distinguishing
Tamil roots from borrowed or mixed vocabulary.

  ---------------------------------------------------------------------------------------------------
  Source                  Why it matters          Link
  ----------------------- ----------------------- ---------------------------------------------------
  University of Madras    Historical word         https://dsal.uchicago.edu/dictionaries/tamil-lex/
  Tamil Lexicon           meanings, root          
                          references and literary 
                          citations               

  Digital Dictionaries of Search access to        https://dsal.uchicago.edu/dictionaries/
  South Asia              several South Asian     
                          historical dictionaries 

  Tamil Virtual Academy   Tamil-Tamil,            https://www.tamilvu.org/
  dictionaries            Tamil-English, literary 
                          and specialist          
                          vocabulary              

  Tamil University,       Lexicographical and     https://www.tamiluniversity.ac.in/
  Thanjavur               scholarly Tamil         
                          resources               

  Winslow's Tamil         Historical              https://dsal.uchicago.edu/dictionaries/
  Dictionary              Tamil-English           
                          vocabulary; access      
                          through dictionary      
                          collections             

  Fabricius Tamil         Historical Tamil        https://dsal.uchicago.edu/dictionaries/
  Dictionary              vocabulary; access      
                          through dictionary      
                          collections             

  Kriya's Contemporary    Contemporary usage and  https://www.kriya.in/
  Tamil Dictionary        modern meanings;        
                          copyright restrictions  
                          may apply               

  Chendhan Divakaram      Traditional Tamil       https://www.cict.in/
  (செந்தன் திவாகரம்)         synonyms and word       
                          collections             

  Pingala Nigandu (பிங்கல  Classical synonym       https://www.cict.in/
  நிகண்டு)                 classification and      
                          vocabulary              

  Choodamani Nigandu      Traditional lexical and https://www.cict.in/
  (சூடாமணி நிகண்டு)        synonym material        
  ---------------------------------------------------------------------------------------------------

**Use these sources to record:** headword, spelling, grammatical
category, meanings, alternate meanings, etymology where available,
literary citations, dictionary title, edition, page or entry number, and
URL.

Do not assume that every dictionary headword is a suitable personal
name. Human review is recommended.

------------------------------------------------------------------------

# 3. Tamil Grammar, Word Roots and Word Formation

These resources help the app generate new names from validated Tamil
words instead of simply retrieving existing names.

  -----------------------------------------------------------------------
  Source                              Application
  ----------------------------------- -----------------------------------
  Tolkappiyam                         Tamil phonology, morphology,
                                      grammar and word structure

  Nannool (நன்னூல்)                     Classical grammar and linguistic
                                      rules

  Tamil Lexicon                       Root-word and meaning verification

  Dravidian Etymological Dictionary   Comparison of Tamil roots with
                                      related Dravidian languages

  TVA grammar and language resources  Tamil language learning and grammar
                                      references
  -----------------------------------------------------------------------

Links:

-   CICT: https://www.cict.in/
-   Tamil Virtual Academy: https://www.tamilvu.org/
-   University of Madras Tamil Lexicon:
    https://dsal.uchicago.edu/dictionaries/tamil-lex/
-   Dravidian Etymological Dictionary resources:
    https://dsal.uchicago.edu/dictionaries/

### Example name-generation process

1.  Select two verified Tamil roots.
2.  Retrieve each root's meaning and grammatical properties.
3.  Check whether the combination is pronounceable and grammatically
    plausible.
4.  Check whether the combined form already exists.
5.  Ask a Tamil language reviewer to validate the combined meaning.
6.  Label the result as **newly coined** unless a historical source
    attests it as a personal name.

Never present an AI-generated combination as an ancient or historically
attested name without evidence.

------------------------------------------------------------------------

# 4. Historical Names, Tamil Kings and Inscriptions

Historical inscriptions are especially valuable because they can reveal
names actually used by people, rather than names merely described as
ancient by modern naming websites.

  ------------------------------------------------------------------------------------
  Source                  What can be extracted   Link
  ----------------------- ----------------------- ------------------------------------
  Tamil Nadu Department   Epigraphy,              https://www.tnarch.gov.in/
  of Archaeology          archaeological records, 
                          historical persons and  
                          inscriptions            

  Archaeological Survey   Published inscription   https://asi.nic.in/
  of India (ASI)          collections and         
                          archaeological records  

  BharatSHRI              Digitized inscription   https://bharatshri.gov.in/
                          records and estampages; 
                          check current search    
                          coverage                

  SIDDHAM Asian           Searchable Asian        https://siddham.network/
  Inscription Database    epigraphic records,     
                          including relevant      
                          South Indian material   

  Tamil Digital Library   Historical books and    https://tamildigitallibrary.in/
                          digitized documents     

  Tamil University        Epigraphy, history and  https://www.tamiluniversity.ac.in/
                          Tamil research          
                          resources               
  ------------------------------------------------------------------------------------

### Historical groups and personalities to investigate

-   Chera rulers and associated personalities.
-   Chola rulers, queens and officials.
-   Pandya rulers and personalities.
-   Pallava rulers and personalities.
-   Sangam kings and chieftains.
-   Velir chiefs.
-   Historical poets and scholars.
-   Temple donors and patrons.
-   Historical women's names.
-   Common people named in inscriptions.

### Metadata to retain

-   Exact name as it appears in the inscription.
-   Normalized Tamil spelling (kept separately from the original
    transcription).
-   Transliteration.
-   Inscription identifier.
-   Dynasty or historical period, if established.
-   Location and present-day district.
-   Publication, volume, page and line reference.
-   Whether the text is an original reading, edited transcription or
    later interpretation.
-   Confidence and reviewer notes.

Do not automatically classify every royal title or historical name as
Pure Tamil. Some names may be Sanskrit-derived, mixed, titles rather
than personal names, or uncertain readings.

------------------------------------------------------------------------

# 5. Tamil Nature, Plants, Flowers, Animals and Geography

Nature is a rich source of meaningful Tamil naming vocabulary.

## 5.1 The five Tamil landscapes -- ஐந்திணை

  Landscape   Tamil     Associated ideas and vocabulary
  ----------- --------- --------------------------------------------------
  Kurinji     குறிஞ்சி   Mountains, flowers, waterfalls and mountain life
  Mullai      முல்லை     Jasmine, forests, cattle and pastoral life
  Marutham    மருதம்     Agriculture, fertile land, rivers and villages
  Neithal     நெய்தல்     Sea, waves, fish, pearls and coastal life
  Palai       பாலை      Wilderness, courage, resilience and endurance

Reference portals:

-   Sangam Tamil: https://sangamtamil.com/
-   Tamil Virtual Academy: https://www.tamilvu.org/
-   Project Madurai: https://www.projectmadurai.org/

### Example word families to investigate

  Theme            Example Tamil vocabulary
  ---------------- --------------------------
  Mountains        மலை, குன்று, வெற்பு
  Water            ஆறு, அருவி, கடல், அலை
  Sky              வான், விண், முகில்
  Wind             தென்றல், காற்று
  Moon and light   நிலா, மதி, ஒளி, கதிர்
  Flowers          மலர், பூ, முல்லை, குவளை
  Trees            வேங்கை, புன்னை, ஆல், இலுப்பை

These are example word families to investigate, not all verified
personal names.

## 5.2 Plant and flower databases

  ---------------------------------------------------------------------------------
  Source                  Information             Link
  ----------------------- ----------------------- ---------------------------------
  University of Melbourne Tamil plant names       https://www.unimelb.edu.au/
  -- Tamil Plant Name     mapped to botanical     
  Index                   species; verify current 
                          availability            

  eFlora of India         Plant names, botanical  https://efloraofindia.com/
                          references and regional 
                          plant information       

  National Medicinal      Medicinal plant         https://nmpb.nic.in/
  Plants Board            information and         
                          vernacular names        

  Tamil Virtual Academy   Tamil vocabulary and    https://www.tamilvu.org/
                          cultural resources      

  Tamil Digital Library   Digitized books,        https://tamildigitallibrary.in/
                          including historical    
                          botanical references    
  ---------------------------------------------------------------------------------

Potential name categories:

-   Flower names.
-   Tree names.
-   Medicinal plants.
-   Fruits.
-   Birds.
-   Animals.
-   Butterflies.
-   Fish and marine life.
-   Precious stones and natural materials.

For plant-derived names, retain the scientific species name to avoid
confusing similar Tamil regional names.

## 5.3 Geographical vocabulary

Use classical literature and historical references to create categories
for:

-   Rivers and waterfalls.
-   Mountains and hills.
-   Lakes and ponds.
-   Seas and beaches.
-   Forests and gardens.
-   Ancient Tamil towns.
-   Historical ports.
-   Regions and kingdoms.

Examples of geographical references to research include Kaveri, Vaigai
and Pothigai. Store place names separately from personal names, and
indicate when a personal name is inspired by a place.

------------------------------------------------------------------------

# 6. Devotional, Spiritual and Religious Literature

This category supports users looking for traditional devotional names.
Keep devotional classification separate from linguistic origin: a
devotional name is not necessarily a Pure Tamil name.

  ---------------------------------------------------------------------------------
  Source                  Naming material         Link
  ----------------------- ----------------------- ---------------------------------
  Thevaram (தேவாரம்)       Saivite hymns and       https://www.projectmadurai.org/
                          devotional vocabulary   

  Thiruvasagam            Spiritual concepts,     https://www.projectmadurai.org/
  (திருவாசகம்)             devotion and virtues    

  Thirumurai (திருமுறை)   Saivite religious       https://www.tamilvu.org/
                          literature              

  Thiruppugazh            Murugan-related         https://www.projectmadurai.org/
  (திருப்புகழ்)             devotional terminology  

  Kandar Anubhuthi (கந்தர்  Murugan devotional      https://www.projectmadurai.org/
  அனுபூதி)                names and concepts      

  Kandar Alangaram (கந்தர்  Murugan epithets and    https://www.projectmadurai.org/
  அலங்காரம்)                devotional vocabulary   

  Naalayira Divya         Vaishnavite literature  https://www.tamilvu.org/
  Prabandham              and traditional names   

  Thiruppavai (திருப்பாவை) Andal, devotional names https://www.projectmadurai.org/
                          and poetic vocabulary   

  Abirami Anthathi        Goddess-related         https://www.projectmadurai.org/
  (அபிராமி அந்தாதி)        traditional names and   
                          attributes              

  Siddhar literature      Wisdom, philosophy,     https://www.projectmadurai.org/
                          nature and spiritual    
                          vocabulary              
  ---------------------------------------------------------------------------------

Suggested subcategories:

-   Murugan-related names.
-   Shiva-related names.
-   Amman-related names.
-   Vishnu-related names.
-   Andal-related names.
-   Siddhar-inspired names.
-   Spiritual virtue names.
-   Names of saints and religious scholars.

------------------------------------------------------------------------

# 7. Tamil Folk Literature, Proverbs and Traditional Culture

This category can uncover vocabulary and names that are less common in
ordinary baby-name collections.

  ---------------------------------------------------------------------------------
  Source                  What it provides        Link
  ----------------------- ----------------------- ---------------------------------
  Tamil Virtual Academy   Folk literature,        https://www.tamilvu.org/
                          language and cultural   
                          resources               

  Pazhamozhi Naanuru      Ancient proverbs and    https://www.projectmadurai.org/
  (பழமொழி நானூறு)         traditional wisdom      

  Project Madurai         Folk and literary       https://www.projectmadurai.org/
                          collections             

  Tamil Digital Library   Old Tamil books and     https://tamildigitallibrary.in/
                          cultural records        
  ---------------------------------------------------------------------------------

Extract and classify:

-   Traditional village names and personal names.
-   Folk heroes.
-   Folk goddesses and village deities.
-   Traditional expressions of courage.
-   Words describing affection, kindness and generosity.
-   Words related to music, dance and art.
-   Traditional occupation and cultural vocabulary.

Be careful with community-specific naming traditions. Do not infer a
person's caste or community from a name.

------------------------------------------------------------------------

# 8. Tamil Baby-Name Portals and Existing Naming Websites

These are useful for competitor benchmarking, identifying common names,
understanding user search patterns and discovering naming categories.
Treat them as secondary sources, not linguistic authorities.

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Website / discovery     Useful features         Link
  source                                          
  ----------------------- ----------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Tamilcube               Tamil baby names,       https://www.tamilcube.com/
                          dictionary, alphabet    
                          and language resources  

  Tamilcube Dictionary    Tamil-English meanings  https://www.tamilcube.com/
                          and vocabulary          

  Pure Tamil name         Names marketed as தூய   https://www.google.com/search?q=%E0%AE%A4%E0%AF%82%E0%AE%AF+%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D+%E0%AE%AA%E0%AF%86%E0%AE%AF%E0%AE%B0%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D
  collections             தமிழ்; verify each entry 
                          independently           

  Modern Tamil baby-name  Contemporary naming     https://www.google.com/search?q=modern+Tamil+baby+names+with+meaning
  collections             trends                  

  Tamil baby-name portal  Find additional portals https://www.google.com/search?q=Tamil+baby+names+with+meaning
  discovery               for manual evaluation   
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Do not assume that a name is Pure Tamil merely because a website labels
it that way. Verify roots and meanings using dictionaries and scholarly
sources.

------------------------------------------------------------------------

# 9. Modern Tamil Literature, Authors and Poetry

Modern writers provide contemporary vocabulary, character names, poetic
expressions and naming ideas.

  ---------------------------------------------------------------------------------
  Author / source         What to explore         Discovery link
  ----------------------- ----------------------- ---------------------------------
  Subramania Bharathiyar  Freedom, courage,       https://www.projectmadurai.org/
                          women, nature and       
                          patriotism              

  Bharathidasan           Tamil identity, nature, https://www.projectmadurai.org/
                          equality and social     
                          values                  

  Kavimani                Nature, affection and   https://www.projectmadurai.org/
  Desigavinayagam Pillai  poetry                  

  Kannadasan              Love, philosophy and    https://www.projectmadurai.org/
                          contemporary            
                          expressions             

  Namakkal Kavignar       Courage, patriotism and https://www.projectmadurai.org/
                          values                  

  Kalki Krishnamurthy     Historical              https://www.projectmadurai.org/
                          personalities and       
                          character names         

  Modern Tamil poetry     New vocabulary and      https://www.projectmadurai.org/
                          poetic names            
  ---------------------------------------------------------------------------------

For contemporary copyrighted literature, use books for research and
reference, not bulk copying into a commercial database without
permission.

------------------------------------------------------------------------

# 10. Tamil Linguistic and Computational Resources

These resources help turn a manually curated collection into an
automated naming engine.

  ---------------------------------------------------------------------------------------------------
  Resource                Purpose                 Link
  ----------------------- ----------------------- ---------------------------------------------------
  Tamil Virtual Academy   Tamil language learning https://www.tamilvu.org/
                          and digital language    
                          resources               

  Tamil Wiktionary        Word meanings,          https://ta.wiktionary.org/
                          linguistic information  
                          and translations        

  Dravidian Etymological  Dravidian root          https://dsal.uchicago.edu/dictionaries/
  Dictionary resources    comparison              

  Tamil Lexicon           Historical root and     https://dsal.uchicago.edu/dictionaries/tamil-lex/
                          meaning verification    

  Tamil Unicode Character Tamil script and        https://www.unicode.org/charts/PDF/U0B80.pdf
  Chart                   digital text handling   

  Tamil Concordance       Search words across     https://www.tamilconcordance.in/
                          classical texts         
  ---------------------------------------------------------------------------------------------------

Useful computational functions:

-   Tamil Unicode validation.
-   Tamil-to-English transliteration.
-   English-to-Tamil search.
-   Word-root identification.
-   Duplicate detection.
-   Syllable and pronunciation analysis.
-   Tamil alphabetical sorting.
-   Tamil character and sound combinations.
-   Gender-neutral vocabulary classification.

------------------------------------------------------------------------

# 11. Naming Categories and Taxonomy for the App

Go beyond conventional male/female and alphabet filters.

  -----------------------------------------------------------------------
  Main category                       Suggested subcategories
  ----------------------------------- -----------------------------------
  Classical Tamil                     Sangam, post-Sangam, epic,
                                      classical poetry

  Pure Tamil                          Native Tamil roots, traditional
                                      Tamil vocabulary

  Historical                          Chera, Chola, Pandya, Pallava,
                                      Sangam personalities

  Nature                              Flowers, plants, trees, birds,
                                      animals, mountains

  Elements                            Sun, moon, rain, wind, fire, water,
                                      earth

  Virtues                             Love, courage, wisdom, generosity,
                                      kindness

  Arts                                Music, poetry, dance, literature,
                                      sculpture

  Devotional                          Murugan, Shiva, Amman, Vishnu,
                                      Siddhar

  Royal                               Kings, queens, princes, princesses,
                                      warriors

  Modern                              Contemporary Tamil words and coined
                                      names

  Regional                            Kongu Tamil, Madurai, Chettinad,
                                      Jaffna and other regional
                                      traditions

  Astrological                        Rasi, nakshatra, starting syllable

  Unisex                              Names suitable for boys and girls

  Literary                            Poet names, character names, words
                                      from literary verses
  -----------------------------------------------------------------------

Regional classification should be based on documented usage rather than
assumptions about a name's origin.

------------------------------------------------------------------------

# 12. Recommended Database Structure

Do not store only name and meaning. Maintain a detailed record for every
name or candidate word.

## 12.1 Main `names` table

  -----------------------------------------------------------------------
  Field                               Example / description
  ----------------------------------- -----------------------------------
  `name_id`                           TN000001

  `tamil_name`                        நிலா

  `english_transliteration`           Nila

  `pronunciation`                     Ni-la

  `meaning`                           Moon

  `gender_suitability`                Female / Male / Unisex / Unknown

  `origin`                            Tamil / Sanskrit / Dravidian /
                                      Mixed / Unknown

  `linguistic_classification`         Native Tamil / Sanskrit-derived /
                                      Mixed / Unverified

  `literary_period`                   Sangam / Medieval / Modern /
                                      Contemporary / Not established

  `source_category`                   Nature

  `original_source`                   Dictionary / Literature /
                                      Inscription / Website

  `source_title`                      Exact book or dictionary title

  `verse_or_page`                     Exact reference, where available

  `historical_usage`                  Attested / Not established /
                                      Unverified

  `starting_tamil_letter`             நி

  `starting_sound`                    Ni

  `name_length`                       Calculated consistently using a
                                      documented Tamil text-length rule

  `popularity`                        To be determined from app data

  `verification_status`               Verified / Needs review / Rejected

  `source_url`                        Original reference link
  -----------------------------------------------------------------------

## 12.2 Supporting tables

1.  `names` -- All collected name candidates.
2.  `meanings` -- Multiple meanings and contextual explanations.
3.  `sources` -- Literature, dictionaries, books and websites.
4.  `name_sources` -- Links names to their original sources.
5.  `word_roots` -- Tamil roots and derivations.
6.  `categories` -- Nature, virtues, history, devotional etc.
7.  `name_variants` -- Alternative spellings and transliterations.
8.  `pronunciations` -- Tamil and Roman pronunciation.
9.  `name_reviews` -- Linguistic verification and corrections.
10. `popularity` -- User searches, favourites and trends.

## 12.3 Example record: நிலா (Nila)

This is an illustrative schema example. Validate the exact dictionary
entry and record its citation before publishing.

  Attribute                           Value
  ----------------------------------- ---------------------------------------------
  Tamil name / word                   நிலா
  Transliteration                     Nila
  Meaning                             Moon
  Word type                           Tamil vocabulary
  Category                            Nature / Celestial
  Gender suitability                  Commonly feminine; may be used more broadly
  Source type                         Tamil dictionary
  Historical personal-name evidence   Not established by this example
  Starting sound                      நி
  Verification                        Pending exact source-entry capture

The app should distinguish the word's dictionary meaning from evidence
that it was used historically as a person's name.

------------------------------------------------------------------------

# 13. Source Collection and Verification Workflow

Use a repeatable pipeline for every candidate.

1.  **Discover:** Find a word or personal name in a literature,
    dictionary, inscription or other source.
2.  **Capture:** Save the exact Tamil spelling and original form.
3.  **Reference:** Record the book, edition, verse/page/entry, URL and
    retrieval date.
4.  **Normalize:** Create a normalized spelling without overwriting the
    original transcription.
5.  **Translate:** Record meanings and context, not just a single
    English gloss.
6.  **Classify:** Record linguistic origin, theme, gender suitability
    and historical period separately.
7.  **Check variants:** Identify alternate spellings and
    transliterations.
8.  **Review:** Have a Tamil language reviewer validate meaning and
    classification.
9.  **Publish:** Display the source and verification status in the app.
10. **Maintain:** Keep corrections, source changes and reviewer
    decisions in an audit trail.

### Suggested verification labels

-   **Primary-source attested:** The name appears in a primary text or
    inscription.
-   **Dictionary verified:** The word and meaning are confirmed in a
    reliable dictionary.
-   **Literature-derived word:** The word occurs in literature, but
    personal-name usage is not established.
-   **Modern usage observed:** The name is used today, but historical
    origin is not established.
-   **Newly coined:** Generated from Tamil roots and reviewed.
-   **Unverified:** Needs further research.

------------------------------------------------------------------------

# 14. Copyright, Licensing and Data Collection

Before importing thousands of names into the application, check the
rights for each source.

-   A publicly accessible website does not necessarily permit bulk
    scraping or commercial reuse.
-   Project Madurai provides texts under stated distribution conditions.
    Check the terms for the individual work, retain required
    acknowledgements and verify the rights of the particular edition:
    https://www.projectmadurai.org/
-   The Tamil Lexicon's digital edition has licensing information on its
    host site. Check the exact licence and its conditions before reuse:
    https://dsal.uchicago.edu/dictionaries/tamil-lex/
-   Kriya's contemporary dictionary has copyright restrictions. Do not
    copy its contents into a commercial database without permission:
    https://www.kriya.in/
-   Historical books may be public domain, but modern editions,
    translations, annotations and digital transcriptions can have
    separate rights.
-   Always retain original source, attribution, licence, edition and
    retrieval date.

For commercial use, prioritize public-domain texts, openly licensed
datasets and direct permissions. When uncertain, link to the source
rather than copying its full contents.

------------------------------------------------------------------------

# 15. Recommended Collection Priorities

The project does not need to collect every source at once.

## Stage 1 -- Core database

Start with:

-   Tamil Lexicon.
-   Tamil Virtual Academy dictionaries.
-   CICT digital archives.
-   Project Madurai.
-   Sangam Tamil.
-   Tamil Concordance.

Goal: establish a clean, source-linked foundation and a repeatable
verification process.

## Stage 2 -- Historical and cultural expansion

Add:

-   Tamil Nadu inscription resources.
-   BharatSHRI.
-   SIDDHAM.
-   Devotional literature.
-   Folk literature.
-   Historical Tamil personalities.

Goal: add genuinely attested historical names and culturally grounded
vocabulary.

## Stage 3 -- Nature and modern vocabulary

Add:

-   Botanical databases.
-   eFlora India.
-   National Medicinal Plants Board.
-   Modern Tamil dictionaries.
-   Contemporary Tamil literature.

Goal: broaden meaningful name suggestions and modern vocabulary.

## Stage 4 -- Competitor and naming trends

Evaluate:

-   Tamilcube.
-   Pure Tamil name collections.
-   Modern baby-name portals.
-   Search trends and user preferences.

Goal: understand user expectations, common names, spelling variants and
underserved categories.

------------------------------------------------------------------------

# 16. Build a Tamil Name Intelligence Engine

Design the app around three distinct kinds of recommendations.

## Type 1 -- Historically attested names

Names actually found in Sangam literature, inscriptions, epics and
documented historical records.

Examples to investigate: பாரி, கபிலர், கண்ணகி.

Each should link to the actual source passage or inscription. Do not
infer historical attestation from a modern website.

## Type 2 -- Traditional Tamil vocabulary suitable as names

Words whose meanings and linguistic roots are validated, but whose
historical use as personal names may not be established.

Examples to investigate: தென்றல், மலர், கதிர், அறிவு.

Show the dictionary meaning and clearly distinguish it from
personal-name evidence.

## Type 3 -- AI-generated Tamil names

New combinations generated from verified Tamil roots, with explanations
of the individual components and their proposed combined meaning.

Every generated name should be labelled **newly coined** unless a
reliable historical source attests it.

------------------------------------------------------------------------

# 17. Recommended Web App Features

1.  Search names in Tamil and English.
2.  Boy, girl and unisex filters.
3.  Pure Tamil name filter.
4.  Sangam Tamil name filter.
5.  Names by Tamil starting letter.
6.  Names by starting syllable.
7.  Names by meaning.
8.  Names based on nature, virtues and culture.
9.  Names by Rasi and Nakshatra.
10. Historical names with original source references.
11. AI-generated unique names.
12. Meaning, pronunciation and linguistic origin.
13. Favourite names and shortlist.
14. Duplicate and spelling-variant detection.
15. Source verification and confidence indicators.
16. Shareable name pages with citations.
17. Report-a-correction feature.
18. Filters for short, long, traditional, modern and unisex names.

------------------------------------------------------------------------

# 18. Initial Dataset Target

A reasonable initial research target is **10,000--20,000 Tamil naming
candidates**, each with a source reference and linguistic
classification, before a broad public launch.

This is a project target, not a claim that 10,000--20,000 verified
personal names already exist in the listed sources.

A candidate can be a historically attested personal name, a verified
Tamil word suitable as a name, or a newly coined suggestion. Keep those
types separate in the database and in the user interface.

The app's strongest differentiator should be that a user can open a name
and see:

-   Where it came from.
-   What it means and in what context.
-   Whether its linguistic roots are genuinely Tamil.
-   Whether it was historically used as a personal name.
-   How it is pronounced.
-   Which source supports the information.
-   Whether the record has been reviewed.

------------------------------------------------------------------------

# 19. Top Research Recommendation

Prioritize the **Central Institute of Classical Tamil (CICT)** and its
scholarly resources, alongside the Tamil Lexicon, Tamil Virtual Academy,
Project Madurai and inscription databases.

Useful starting links:

-   CICT: https://www.cict.in/
-   Tamil Lexicon: https://dsal.uchicago.edu/dictionaries/tamil-lex/
-   Tamil Virtual Academy: https://www.tamilvu.org/
-   Project Madurai: https://www.projectmadurai.org/
-   Sangam Tamil: https://sangamtamil.com/
-   Tamil Digital Library: https://tamildigitallibrary.in/

Together, these sources offer a stronger research foundation than
relying on unverified baby-name websites.

------------------------------------------------------------------------

## Appendix: Source Quality Checklist

Before adding a source or importing its data, check:

-   [ ] Is the publisher, institution or author identifiable?
-   [ ] Is the text an original source, a scholarly edition, a
    transcription or a user-generated list?
-   [ ] Is the Tamil spelling visible and reliable?
-   [ ] Is the meaning supported by a dictionary or context?
-   [ ] Is there a precise page, verse, entry or inscription reference?
-   [ ] Is the language origin established or still uncertain?
-   [ ] Is personal-name usage actually attested?
-   [ ] Are alternate spellings recorded separately?
-   [ ] Is the licence compatible with the intended commercial use?
-   [ ] Is attribution retained?
-   [ ] Has a competent Tamil reviewer checked the entry?

**Core principle:** Prefer traceable evidence over a large but
unreliable list. A smaller, well-sourced database will build more trust
than thousands of names with uncertain meanings.
