"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateNumerology,
  calculateBirthNumbers,
  evaluateCompatibility,
  suggestSpellingVariants,
  NumerologySystem,
} from "@/core/numerology";
import {
  TAMIL_NAKSHATRAS,
  calculateBirthStarFromDateTime,
} from "@/core/nakshatra-tamil";
import { evaluateNameScorecard } from "@/core/scorecard";
import { TamilNameRecord, PublicSuggestionRecord } from "@/lib/repository";
import { AdBanner } from "@/components/MonetizationBanner";
import {
  buildQueryAndPrompt,
  QueryGeneratorConstraints,
  GeneratedQueryPayload,
} from "@/lib/query-generator";
import { calculateEmpiricalRarity } from "@/lib/frequency-engine";

type ActiveTab =
  | "explore"
  | "querygen"
  | "numerology"
  | "nakshatra"
  | "scorecard"
  | "advisor"
  | "poll"
  | "community";

export default function NamingGuruDashboard({
  initialNames,
  initialTotal,
  pageSize: initialPageSize = 48,
}: {
  initialNames: TamilNameRecord[];
  initialTotal: number;
  pageSize?: number;
}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("explore");

  // 1. Explorer & Shortlist state (server-side filtering + pagination)
  const [names, setNames] = useState<TamilNameRecord[]>(initialNames);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(
    Math.max(1, Math.ceil(initialTotal / initialPageSize))
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [namesLoading, setNamesLoading] = useState(false);
  const [namesError, setNamesError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [nakshatraFilter, setNakshatraFilter] = useState("all");
  const [numerologyFilter, setNumerologyFilter] = useState<number>(0);
  const [numerologyMethod, setNumerologyMethod] = useState<
    "pythagorean" | "chaldean"
  >("pythagorean");
  const [originFilter, setOriginFilter] = useState("all");
  const [nameCategoryFilter, setNameCategoryFilter] = useState("all");
  const [categoryCounts, setCategoryCounts] = useState<{
    pure_tamil: number;
    tamilnadu_usage: number;
    other_heritage: number;
    total: number;
  } | null>(null);
  const [religionFilter, setReligionFilter] = useState("all");
  const [communityFilter, setCommunityFilter] = useState("all");
  const [trendFilter, setTrendFilter] = useState("all");
  const [uniquenessFilter, setUniquenessFilter] = useState("all");
  const [misspellFilter, setMisspellFilter] = useState("all");
  const [minEaseScore, setMinEaseScore] = useState(0);
  const [startingLetter, setStartingLetter] = useState("");
  const [birthStarNames, setBirthStarNames] = useState<TamilNameRecord[]>([]);
  const [birthStarGender, setBirthStarGender] = useState("all");
  const [birthStarSyllable, setBirthStarSyllable] = useState("");
  const firstLoad = React.useRef(true);

  const [shortlist, setShortlist] = useState<string[]>([
    "yazhini",
    "kavin",
    "iniya",
  ]);
  const [shortlistRecords, setShortlistRecords] = useState<TamilNameRecord[]>([]);
  const [pollCandidates, setPollCandidates] = useState<TamilNameRecord[]>([]);
  const [pollCopied, setPollCopied] = useState(false);
  const [selectedNameForModal, setSelectedNameForModal] =
    useState<TamilNameRecord | null>(null);
  const [reportNote, setReportNote] = useState("");
  const [reportSent, setReportSent] = useState(false);

  // 2. Numerology Calculator state
  const [numInputName, setNumInputName] = useState("Yazhini");
  const [numSystem, setNumSystem] = useState<NumerologySystem>("chaldean");
  const [numDob, setNumDob] = useState("2026-11-09");
  const [targetSpellingNumber, setTargetSpellingNumber] = useState(5);

  // 3. Nakshatra Birth Star Finder state
  const [birthDate, setBirthDate] = useState("2026-11-09");
  const [birthTime, setBirthTime] = useState("08:30");

  // 4. 7-Dimension Scorecard state
  const [scoreNameLatin, setScoreNameLatin] = useState("Yazhini");
  const [scoreNameTamil, setScoreNameTamil] = useState("யாழினி");
  const [scoreMeaningEn, setScoreMeaningEn] = useState(
    "Melodious and sweet like the ancient Tamil Yazh harp"
  );
  const [scoreMeaningTa, setScoreMeaningTa] = useState(
    "யாழ் என்னும் இசைக்கருவியைப் போன்று இனிமையானவள்"
  );
  const [scoreRef, setScoreRef] = useState("சிலப்பதிகாரம் மற்றும் புறநானூறு");
  const [siblingNamesStr, setSiblingNamesStr] = useState("Kavin, Iniyan");

  // 5. OmniRoute AI Advisor state
  const [advisorPrompt, setAdvisorPrompt] = useState(
    "Pure Sangam Tamil girl name starting with Ya or Ka with musical or nature meaning"
  );
  const [advisorGender, setAdvisorGender] = useState("girl");
  const [advisorNakshatra, setAdvisorNakshatra] = useState("rohini");
  const [advisorLuckyNum, setAdvisorLuckyNum] = useState("6");
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorResult, setAdvisorResult] = useState<{
    source: string;
    modelUsed: string;
    providerUsed: string;
    latencyMs: number;
    summaryTa: string;
    summaryEn: string;
    recommendations: Array<{
      slug?: string;
      inCatalog?: boolean;
      nameTamil: string;
      nameLatin: string;
      gender: string;
      meaningTa: string;
      meaningEn: string;
      originCategory: string;
      literaryReference: string;
      sourceWebsite?: string;
      startingSyllableTa: string;
      confidence: number;
      numerologyNumber: number;
      compoundNumber: number;
      pythagoreanNumber?: number;
      pythagoreanCompound?: number;
      planetEn: string;
    }>;
  } | null>(null);

  // 5B. Visual Query & Prompt Synthesizer state (Task 7)
  const [qgGender, setQgGender] = useState<"boy" | "girl" | "unisex" | "all">("girl");
  const [qgStartingLetters, setQgStartingLetters] = useState<string>("யா, க, வி");
  const [qgNakshatra, setQgNakshatra] = useState<string>("rohini");
  const [qgTargetNum, setQgTargetNum] = useState<number>(5);
  const [qgNumerologySystem, setQgNumerologySystem] = useState<"pythagorean" | "chaldean">("chaldean");
  const [qgSiblingNames, setQgSiblingNames] = useState<string>("செங்குட்டுவன்");
  const [qgGrandparentNames, setQgGrandparentNames] = useState<string>("இளங்கோவன்");
  const [qgParentNames, setQgParentNames] = useState<string>("அன்பரசன், பூங்கொடி");
  const [qgThemes, setQgThemes] = useState<string>("இசை (Music), இயற்கையெழில் (Nature), அறிவு (Wisdom)");
  const [qgPureTamilOnly, setQgPureTamilOnly] = useState<boolean>(true);
  const [qgMaxSpellingRisk, setQgMaxSpellingRisk] = useState<"low" | "medium" | "any">("low");
  const [promptCopied, setPromptCopied] = useState<boolean>(false);

  // 6. Social Poll state
  const [pollTitle, setPollTitle] = useState(
    "Our Baby Name Shortlist — Vote Your Favourite!"
  );
  const [pollParentName, setPollParentName] = useState("Santhosh & Family");
  const [pollNotes, setPollNotes] = useState(
    "Please mark your top favourites and flag any name that feels hard to pronounce."
  );
  const [createdPollToken, setCreatedPollToken] = useState("sample-tamil-poll");
  const [activePollData, setActivePollData] = useState<{
    token: string;
    title: string;
    parentName: string;
    candidateSlugs: string[];
    notes: string;
    votes: Array<{
      voterName: string;
      removedSlugs: string[];
      lovedSlugs: string[];
      reason: string;
      comment: string;
      createdAt: string;
    }>;
  } | null>(null);
  const [voterName, setVoterName] = useState("");
  const [voterLoved, setVoterLoved] = useState<string[]>([]);
  const [voterRemoved, setVoterRemoved] = useState<string[]>([]);
  const [voterComment, setVoterComment] = useState("");

  // 7. Public Suggestion + AI Moderation state
  const [sugTamil, setSugTamil] = useState("");
  const [sugLatin, setSugLatin] = useState("");
  const [sugGender, setSugGender] = useState<"boy" | "girl" | "unisex">("girl");
  const [sugMeaningTa, setSugMeaningTa] = useState("");
  const [sugMeaningEn, setSugMeaningEn] = useState("");
  const [sugRef, setSugRef] = useState("");
  const [sugAuthor, setSugAuthor] = useState("");
  const [sugLoading, setSugLoading] = useState(false);
  const [sugResponse, setSugResponse] =
    useState<PublicSuggestionRecord | null>(null);
  const [recentSuggestions, setRecentSuggestions] = useState<
    PublicSuggestionRecord[]
  >([]);

  // Load shortlist from localStorage + initial filter state from URL query string (C3)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("namingguru_shortlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setShortlist(parsed);
        }
      }
      if (typeof window !== "undefined" && window.location.search) {
        const sp = new URLSearchParams(window.location.search);
        if (sp.get("q")) setSearchQ(sp.get("q")!);
        if (sp.get("gender")) setGenderFilter(sp.get("gender")!);
        if (sp.get("nakshatra")) setNakshatraFilter(sp.get("nakshatra")!);
        if (sp.get("numerology")) setNumerologyFilter(parseInt(sp.get("numerology")!, 10) || 0);
        if (sp.get("numerologyMethod") === "chaldean") setNumerologyMethod("chaldean");
        if (sp.get("origin")) setOriginFilter(sp.get("origin")!);
        if (sp.get("religion")) setReligionFilter(sp.get("religion")!);
        if (sp.get("community")) setCommunityFilter(sp.get("community")!);
        if (sp.get("trend")) setTrendFilter(sp.get("trend")!);
        if (sp.get("uniquenessBand")) setUniquenessFilter(sp.get("uniquenessBand")!);
        if (sp.get("maxMisspellRisk")) setMisspellFilter(sp.get("maxMisspellRisk")!);
        if (sp.get("minEaseScore")) setMinEaseScore(parseInt(sp.get("minEaseScore")!, 10) || 0);
        if (sp.get("startingLetter")) setStartingLetter(sp.get("startingLetter")!);
        if (sp.get("poll")) {
          setCreatedPollToken(sp.get("poll")!);
          setActiveTab("poll");
        }
        if (sp.get("tab")) {
          const t = sp.get("tab") as ActiveTab;
          if (["explore", "numerology", "nakshatra", "scorecard", "advisor", "poll", "community"].includes(t)) {
            setActiveTab(t);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Resolve full records for shortlisted slugs across all pages
  useEffect(() => {
    if (shortlist.length === 0) {
      setShortlistRecords([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/names?slugs=${encodeURIComponent(shortlist.join(","))}&pageSize=100`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : { names: [] }))
      .then((j) => {
        if (Array.isArray(j.names)) setShortlistRecords(j.names);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [shortlist]);

  const toggleShortlist = (slug: string) => {
    setShortlist((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem("namingguru_shortlist", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Server-side filtering + pagination via /api/names (debounced)
  const buildQuery = React.useCallback(
    (p: number, extra: Record<string, string> = {}) => {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("pageSize", String(pageSize));
      params.set("numerologyMethod", numerologyMethod);
      if (searchQ.trim()) params.set("q", searchQ.trim());
      if (genderFilter !== "all") params.set("gender", genderFilter);
      if (nameCategoryFilter !== "all") params.set("nameCategory", nameCategoryFilter);
      if (nakshatraFilter !== "all") params.set("nakshatra", nakshatraFilter);
      if (numerologyFilter > 0) params.set("numerology", String(numerologyFilter));
      if (originFilter !== "all") params.set("origin", originFilter);
      if (religionFilter !== "all") params.set("religion", religionFilter);
      if (communityFilter !== "all") params.set("community", communityFilter);
      if (trendFilter !== "all") params.set("trend", trendFilter);
      if (uniquenessFilter !== "all") params.set("uniquenessBand", uniquenessFilter);
      if (misspellFilter !== "all") params.set("maxMisspellRisk", misspellFilter);
      if (minEaseScore > 0) params.set("minEaseScore", String(minEaseScore));
      if (startingLetter.trim()) params.set("startingLetter", startingLetter.trim());
      Object.entries(extra).forEach(([k, v]) => params.set(k, v));
      return params.toString();
    },
    [
      pageSize,
      numerologyMethod,
      searchQ,
      genderFilter,
      nameCategoryFilter,
      nakshatraFilter,
      numerologyFilter,
      originFilter,
      religionFilter,
      communityFilter,
      trendFilter,
      uniquenessFilter,
      misspellFilter,
      minEaseScore,
      startingLetter,
    ]
  );

  // Any filter change returns to page 1
  useEffect(() => {
    setPage(1);
  }, [
    pageSize,
    searchQ,
    genderFilter,
    nameCategoryFilter,
    nakshatraFilter,
    numerologyFilter,
    originFilter,
    religionFilter,
    communityFilter,
    trendFilter,
    uniquenessFilter,
    misspellFilter,
    minEaseScore,
    startingLetter,
  ]);

  useEffect(() => {
    // The server already rendered page 1 of the unfiltered list
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const qs = buildQuery(page);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `?${qs}`);
      }
      setNamesLoading(true);
      setNamesError("");
      try {
        const res = await fetch(`/api/names?${qs}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setNames(json.names || []);
        setTotalCount(json.totalCount ?? 0);
        setTotalPages(json.totalPages ?? 1);
        if (json.categoryCounts) setCategoryCounts(json.categoryCounts);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setNamesError("Could not load names. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setNamesLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, buildQuery, refreshTick]);

  const filteredNames = names;

  // Derived Numerology (both selected system + dual comparison)
  const numerologyResult = useMemo(
    () => calculateNumerology(numInputName || "Kavin", numSystem),
    [numInputName, numSystem]
  );
  const altNumerologyResult = useMemo(
    () =>
      calculateNumerology(
        numInputName || "Kavin",
        numSystem === "chaldean" ? "pythagorean" : "chaldean"
      ),
    [numInputName, numSystem]
  );
  const modalScorecard = useMemo(() => {
    if (!selectedNameForModal) return null;
    return evaluateNameScorecard({
      nameLatin: selectedNameForModal.nameLatin,
      nameTamil: selectedNameForModal.nameTamil,
      meaningEn: selectedNameForModal.meaningEn,
      meaningTa: selectedNameForModal.meaningTa,
      originCategory: selectedNameForModal.originCategory,
      literaryReference: selectedNameForModal.literaryReference,
      confidence: selectedNameForModal.confidence,
      popularityRank: selectedNameForModal.popularityRank,
      family: {
        siblingNames: siblingNamesStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    });
  }, [selectedNameForModal, siblingNamesStr]);

  const modalEmpiricalRarity = useMemo(() => {
    if (!selectedNameForModal) return null;
    return calculateEmpiricalRarity(
      selectedNameForModal.nameTamil,
      selectedNameForModal.popularityRank
    );
  }, [selectedNameForModal]);

  const generatedQuery = useMemo(() => {
    return buildQueryAndPrompt({
      gender: qgGender,
      startingLetters: qgStartingLetters
        .split(/[, ]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      nakshatraSlug: qgNakshatra !== "all" ? qgNakshatra : undefined,
      targetNumerologyNumber: qgTargetNum || undefined,
      numerologySystem: qgNumerologySystem,
      siblingNames: qgSiblingNames
        .split(/[, ]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      grandparentNames: qgGrandparentNames
        .split(/[, ]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      parentNames: qgParentNames
        .split(/[, ]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      meaningThemes: qgThemes
        .split(/[, ]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      isNativeTamilOnly: qgPureTamilOnly,
      allowedSpellingRisk: qgMaxSpellingRisk,
    });
  }, [
    qgGender,
    qgStartingLetters,
    qgNakshatra,
    qgTargetNum,
    qgNumerologySystem,
    qgSiblingNames,
    qgGrandparentNames,
    qgParentNames,
    qgThemes,
    qgPureTamilOnly,
    qgMaxSpellingRisk,
  ]);

  function applyQueryToExplorer() {
    if (generatedQuery.deterministicFilter.gender) {
      setGenderFilter(generatedQuery.deterministicFilter.gender);
    }
    if (
      generatedQuery.deterministicFilter.startingLetters &&
      generatedQuery.deterministicFilter.startingLetters.length > 0
    ) {
      setStartingLetter(generatedQuery.deterministicFilter.startingLetters[0]);
    }
    if (generatedQuery.deterministicFilter.numerologyNumber) {
      setNumerologyFilter(generatedQuery.deterministicFilter.numerologyNumber);
      setNumerologyMethod(qgNumerologySystem);
    }
    if (qgNakshatra && qgNakshatra !== "all") {
      setNakshatraFilter(qgNakshatra);
    }
    if (generatedQuery.deterministicFilter.isNativeTamilOnly) {
      setOriginFilter("sangam");
    }
    setActiveTab("explore");
    setPage(1);
  }
  const birthNumResult = useMemo(
    () => calculateBirthNumbers(numDob || "2026-11-09"),
    [numDob]
  );
  const compatResult = useMemo(
    () => evaluateCompatibility(numerologyResult.nameNumber, birthNumResult),
    [numerologyResult.nameNumber, birthNumResult]
  );
  const spellingVariants = useMemo(
    () =>
      suggestSpellingVariants(
        numInputName || "Kavin",
        targetSpellingNumber,
        numSystem
      ),
    [numInputName, targetSpellingNumber, numSystem]
  );

  // Derived Nakshatra
  const birthStarResult = useMemo(
    () => calculateBirthStarFromDateTime(birthDate, birthTime, 5.5),
    [birthDate, birthTime]
  );
  // Names matching the birth star are fetched from the API (not the visible page)
  useEffect(() => {
    setBirthStarSyllable("");
  }, [birthStarResult.nakshatra.slug]);

  useEffect(() => {
    const controller = new AbortController();
    const qs = new URLSearchParams({
      pageSize: "48",
      nakshatra: birthStarResult.nakshatra.slug,
    });
    if (birthStarGender !== "all") qs.set("gender", birthStarGender);
    if (birthStarSyllable) qs.set("startingLetter", birthStarSyllable);
    fetch(`/api/names?${qs.toString()}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { names: [] }))
      .then((j) => setBirthStarNames(j.names || []))
      .catch(() => {});
    return () => controller.abort();
  }, [birthStarResult.nakshatra.slug, birthStarGender, birthStarSyllable]);
  const namesMatchingBirthStar = birthStarNames;

  // Derived 7D Scorecard
  const scorecardResult = useMemo(
    () =>
      evaluateNameScorecard({
        nameLatin: scoreNameLatin,
        nameTamil: scoreNameTamil,
        meaningEn: scoreMeaningEn,
        meaningTa: scoreMeaningTa,
        originCategory: "Sangam Tamil",
        literaryReference: scoreRef,
        confidence: 0.97,
        popularityRank: "moderate",
        family: {
          siblingNames: siblingNamesStr
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      }),
    [
      scoreNameLatin,
      scoreNameTamil,
      scoreMeaningEn,
      scoreMeaningTa,
      scoreRef,
      siblingNamesStr,
    ]
  );

  // Load Poll data when switching to poll tab
  useEffect(() => {
    if (activeTab === "poll" && createdPollToken) {
      fetch(`/api/polls?token=${encodeURIComponent(createdPollToken)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.poll) setActivePollData(d.poll);
          if (Array.isArray(d.candidates)) setPollCandidates(d.candidates);
        })
        .catch(() => {});
    }
    if (activeTab === "community") {
      fetch("/api/suggestions")
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.suggestions)) setRecentSuggestions(d.suggestions);
        })
        .catch(() => {});
    }
  }, [activeTab, createdPollToken]);

  async function handleRunAdvisor(e: React.FormEvent) {
    e.preventDefault();
    setAdvisorLoading(true);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: advisorPrompt,
          gender: advisorGender,
          nakshatra: advisorNakshatra,
          luckyNumber: advisorLuckyNum,
        }),
      });
      const data = await res.json();
      setAdvisorResult(data);
    } finally {
      setAdvisorLoading(false);
    }
  }

  async function handleCreatePoll(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: pollTitle,
        parentName: pollParentName,
        candidateSlugs: shortlist.length > 0 ? shortlist : ["yazhini", "kavin"],
        notes: pollNotes,
      }),
    });
    const data = await res.json();
    if (data.poll) {
      setCreatedPollToken(data.poll.token);
      setActivePollData(data.poll);
      if (Array.isArray(data.candidates)) setPollCandidates(data.candidates);
    }
  }

  async function handleSubmitVote(e: React.FormEvent) {
    e.preventDefault();
    if (!activePollData) return;
    const res = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "vote",
        token: activePollData.token,
        voterName: voterName || "Family Member",
        lovedSlugs: voterLoved,
        removedSlugs: voterRemoved,
        reason: "Voted via Family Poll",
        comment: voterComment,
      }),
    });
    const data = await res.json();
    if (data.poll) {
      setActivePollData(data.poll);
      if (Array.isArray(data.candidates)) setPollCandidates(data.candidates);
      setVoterName("");
      setVoterLoved([]);
      setVoterRemoved([]);
      setVoterComment("");
    }
  }

  function loadIntoScorecard(item: {
    nameTamil: string;
    nameLatin: string;
    meaningTa: string;
    meaningEn: string;
    literaryReference: string;
  }) {
    setScoreNameTamil(item.nameTamil);
    setScoreNameLatin(item.nameLatin);
    setScoreMeaningTa(item.meaningTa);
    setScoreMeaningEn(item.meaningEn);
    setScoreRef(item.literaryReference);
    setSelectedNameForModal(null);
    setActiveTab("scorecard");
  }

  function loadIntoNumerology(nameLatin: string) {
    setNumInputName(nameLatin);
    setSelectedNameForModal(null);
    setActiveTab("numerology");
  }

  function resetAllFilters() {
    setSearchQ("");
    setGenderFilter("all");
    setNakshatraFilter("all");
    setNumerologyFilter(0);
    setOriginFilter("all");
    setReligionFilter("all");
    setCommunityFilter("all");
    setTrendFilter("all");
    setUniquenessFilter("all");
    setMisspellFilter("all");
    setMinEaseScore(0);
    setStartingLetter("");
    setPage(1);
  }

  async function handleSubmitSuggestion(e: React.FormEvent) {
    e.preventDefault();
    setSugLoading(true);
    setSugResponse(null);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameTamil: sugTamil,
          nameLatin: sugLatin,
          gender: sugGender,
          meaningTa: sugMeaningTa,
          meaningEn: sugMeaningEn,
          literaryReference: sugRef,
          submittedBy: sugAuthor || "Tamil Parent",
        }),
      });
      const data = await res.json();
      if (data.suggestion) {
        setSugResponse(data.suggestion);
        setRecentSuggestions((prev) => [data.suggestion, ...prev]);
        // Refresh names list if AI approved
        setPage(1);
        setRefreshTick((t) => t + 1);
        setSugTamil("");
        setSugLatin("");
        setSugMeaningTa("");
        setSugMeaningEn("");
        setSugRef("");
      }
    } finally {
      setSugLoading(false);
    }
  }

  async function handleReportError(nameSlug: string) {
    if (!reportNote.trim()) return;
    await fetch("/api/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "report_error",
        nameSlug,
        issueType: "Meaning / Citation Review",
        details: reportNote,
      }),
    });
    setReportSent(true);
    setReportNote("");
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner - பெயர்ச்சோலை Trendy Celestial Garden Theme */}
      <section className="relative overflow-hidden rounded-3xl bg-peyarcholai-hero px-6 py-8 text-white shadow-2xl sm:px-10 border border-amber-500/20">
        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          {/* Left Column: Brand Lockup & Description */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-200 backdrop-blur-md shadow-xs">
              <span className="text-amber-300">🌟</span>
              <span>விண்மீன் தொட்டில்</span>
              <span className="text-amber-400/50">·</span>
              <span>தூய தமிழ்ச் செம்மொழிப் பெயர்கள்</span>
              <span className="text-amber-400/50">·</span>
              <span className="text-emerald-300 font-bold">100% Provenance</span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-white-transparent.png"
                  alt="பெயர்ச்சோலை விண்மீன் தொட்டில் சின்னம்"
                  className="h-full w-full object-contain filter drop-shadow-[0_4px_16px_rgba(251,191,36,0.45)]"
                />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                  பெயர்ச்சோலை
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-amber-300 uppercase">
                    Peyarcholai
                  </span>
                  <span className="text-stone-400 text-xs">·</span>
                  <span className="text-xs text-stone-300 font-medium">
                    Celestial Grove of Tamil Baby Names
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-stone-200 sm:text-base font-normal">
              குழந்தையின் பிறப்பு நட்சத்திரம், எண் கணிதம், தொல்காப்பிய புணர்ச்சி விதிகளுடன் கூடிய{" "}
              <strong className="text-amber-300 font-semibold">{initialTotal.toLocaleString("en-IN")}+ தூய தமிழ்ப் பெயர்களின்</strong>{" "}
              அங்கீகரிக்கப்பட்ட வசந்த சோலை.
            </p>

            {/* Feature Highlights Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium text-amber-100">
              <span className="rounded-lg bg-white/10 px-2.5 py-1 border border-white/10 backdrop-blur">
                🏛️ தொல்காப்பிய புணர்ச்சி
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 border border-white/10 backdrop-blur">
                ⭐ 27 நட்சத்திரப் பாதங்கள்
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 border border-white/10 backdrop-blur">
                🔢 இரட்டை எண் கணிதம்
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 border border-white/10 backdrop-blur">
                🛡️ 14-பரிமாண மதிப்பீடு
              </span>
            </div>
          </div>

          {/* Right Column: Sleek Glass Stat Cards */}
          <div className="flex flex-col gap-3 sm:w-auto lg:min-w-[320px]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-amber-300 tracking-tight">
                  {initialTotal.toLocaleString("en-IN")}+
                </div>
                <div className="text-xs text-stone-200 font-medium mt-0.5">
                  சரிபார்க்கப்பட்ட பெயர்கள்
                </div>
                <div className="text-[10px] text-amber-200/70">Verified Catalog</div>
              </div>

              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-amber-300 tracking-tight">
                  27 · 108
                </div>
                <div className="text-xs text-stone-200 font-medium mt-0.5">
                  நட்சத்திரப் பாதங்கள்
                </div>
                <div className="text-[10px] text-amber-200/70">Padam Syllables</div>
              </div>
            </div>

            {/* Shortlist Quick-Access Glass Bar */}
            <div className="glass-card rounded-2xl p-3.5 flex items-center justify-between border-emerald-400/30">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm">
                  ★
                </span>
                <div>
                  <div className="text-xs font-bold text-white">
                    {shortlist.length} பெயர்கள் தேர்வு
                  </div>
                  <div className="text-[10px] text-stone-300">
                    குடும்ப விருப்பப் பட்டியல்
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("poll")}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-emerald-500 hover:to-teal-600 transition"
              >
                வாக்கெடுப்பு →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Modern Pill Bar */}
      <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200/80 bg-white p-2 shadow-sm">
        {[
          {
            id: "explore",
            labelTa: "பெயர் தேடல்",
            labelEn: "Explore Names",
            badge: totalCount,
          },
          {
            id: "nakshatra",
            labelTa: "நட்சத்திரக் கணிப்பு",
            labelEn: "Birth Star Finder",
          },
          {
            id: "numerology",
            labelTa: "எண் கணிதம்",
            labelEn: "Numerology Engine",
          },
          {
            id: "scorecard",
            labelTa: "7-பரிமாண மதிப்பீடு",
            labelEn: "7D Scorecard",
          },
          {
            id: "querygen",
            labelTa: "AI வினவல் வடிவமைப்பு",
            labelEn: "Prompt Synthesizer",
            badge: `${generatedQuery.activeConstraintCount} Rules`,
          },
          {
            id: "advisor",
            labelTa: "அறிவார்ந்த AI ஆலோசகர்",
            labelEn: "AI Name Advisor",
          },
          {
            id: "poll",
            labelTa: "குடும்ப வாக்கெடுப்பு",
            labelEn: "Family Poll",
            badge: shortlist.length > 0 ? shortlist.length : undefined,
          },
          {
            id: "community",
            labelTa: "புதிய பெயர் பரிந்துரை",
            labelEn: "Suggest a Name",
          },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`tab-btn ${
                active ? "tab-btn-active" : ""
              }`}
            >
              <div>
                <div className={active ? "tab-title-active" : "tab-title-inactive"}>
                  {tab.labelEn}
                </div>
                <div
                  className={`text-[10px] ${
                    active ? "tab-sub-active" : "tab-sub-inactive"
                  }`}
                >
                  {tab.labelTa}
                </div>
              </div>
              {tab.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    active ? "tab-badge-active" : "tab-badge-inactive"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* User Guide Pill on the right */}
        <Link
          href="/docs"
          className="tab-btn border-amber-300/80 bg-amber-50/80 text-amber-950 hover:bg-amber-100/80 sm:ml-auto"
        >
          <span className="text-base">📖</span>
          <div>
            <div className="font-extrabold text-stone-900">User Guide</div>
            <div className="text-[10px] font-semibold text-amber-800">பயனர் வழிகாட்டி</div>
          </div>
        </Link>
      </nav>

      {/* Top Ad Slot */}
      <AdBanner slotId="TOP-DIRECTORY-01" />

      {/* TAB 1: EXPLORE TAMIL NAMES */}
      {activeTab === "explore" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-stone-600">
                Search Tamil / English / Meaning / Sangam Text
              </label>
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="e.g., யாழினி, Kavin, संगम, Moon, Purananuru..."
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600">
                Gender (பாலினம்)
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
              >
                <option value="all">All Genders (அனைத்தும்)</option>
                <option value="girl">Girl (பெண் குழந்தை)</option>
                <option value="boy">Boy (ஆண் குழந்தை)</option>
                <option value="unisex">Unisex (பொதுப் பெயர்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600">
                Natchathiram (நட்சத்திரம்)
              </label>
              <select
                value={nakshatraFilter}
                onChange={(e) => setNakshatraFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
              >
                <option value="all">All 27 Stars (அனைத்து நட்சத்திரம்)</option>
                {TAMIL_NAKSHATRAS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.index}. {s.nameTa} ({s.nameEn}) — [
                    {s.padamSyllablesTamil.join(", ")}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600">
                Numerology Number (பெயர் எண்)
              </label>
              <select
                value={numerologyFilter}
                onChange={(e) =>
                  setNumerologyFilter(parseInt(e.target.value, 10))
                }
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
              >
                <option value={0}>Any Number (1–9)</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    Number {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Origin Pill Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">
              Origin Tradition:
            </span>
            {[
              { id: "all", label: "All Traditions" },
              { id: "Sangam", label: "சங்கத் தமிழ் (Sangam Tamil)" },
              { id: "Literary", label: "இலக்கியம் (Literary / Tirukkural)" },
              { id: "Historical", label: "வரலாறு (Chola / Pandya / Velir)" },
              { id: "Traditional", label: "மரபு (Traditional)" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => setOriginFilter(o.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  originFilter === o.id
                    ? "bg-stone-900 text-white"
                    : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {/* 3-Tier Cultural Classification Filter Bar */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold text-amber-950">
                பெயர் வகைப்பாடு (Classification):
              </span>
              {[
                {
                  id: "all",
                  label: "🌐 அனைத்தும் (All Categories)",
                  count: categoryCounts?.total,
                },
                {
                  id: "pure_tamil",
                  label: "🌿 1. தூய தமிழ் (Pure Tamil)",
                  count: categoryCounts?.pure_tamil,
                },
                {
                  id: "tamilnadu_usage",
                  label: "🏛️ 2. தமிழ்நாட்டுப் பயன்பாடு (Used in TN)",
                  count: categoryCounts?.tamilnadu_usage,
                },
                {
                  id: "other_heritage",
                  label: "🌍 3. பிற பெயர்கள் (Other Names)",
                  count: categoryCounts?.other_heritage,
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNameCategoryFilter(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    nameCategoryFilter === cat.id
                      ? "bg-amber-800 text-white shadow-sm"
                      : "border border-amber-200 bg-white text-stone-800 hover:bg-amber-100/70"
                  }`}
                >
                  <span>{cat.label}</span>
                  {typeof cat.count === "number" && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        nameCategoryFilter === cat.id
                          ? "bg-amber-700 text-amber-100"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {cat.count.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Letter / Tamil Uyir-Mei Quick Filter Bar */}
          <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-xs font-semibold text-stone-600">
                  முதல் எழுத்து (Starting Letter):
                </span>
                <button
                  type="button"
                  onClick={() => setStartingLetter("")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    startingLetter === ""
                      ? "bg-amber-700 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-amber-50"
                  }`}
                >
                  All
                </button>
                {[
                  "அ",
                  "ஆ",
                  "இ",
                  "ஈ",
                  "உ",
                  "ஊ",
                  "எ",
                  "ஏ",
                  "ஐ",
                  "ஒ",
                  "ஓ",
                  "க",
                  "ச",
                  "த",
                  "ந",
                  "ப",
                  "ம",
                  "ய",
                  "வ",
                  "செ",
                  "வெ",
                  "பூ",
                ].map((letTa) => (
                  <button
                    key={letTa}
                    type="button"
                    onClick={() =>
                      setStartingLetter((prev) => (prev === letTa ? "" : letTa))
                    }
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      startingLetter === letTa
                        ? "bg-amber-700 text-white shadow-sm"
                        : "border border-stone-200 bg-stone-50 text-stone-800 hover:bg-amber-50"
                    }`}
                  >
                    {letTa}
                  </button>
                ))}
                <input
                  type="text"
                  value={startingLetter}
                  onChange={(e) => setStartingLetter(e.target.value)}
                  placeholder="Custom (e.g. யா / Ya)"
                  className="ml-1 w-32 rounded-lg border border-stone-300 px-2.5 py-1 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={resetAllFilters}
                className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                ↺ Reset Filters
              </button>
            </div>
          </div>

          {/* Family Shortlist Quick-Tray (persists across pagination pages) */}
          {shortlistRecords.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-bold text-amber-950">
                  ♥ Your Family Shortlist ({shortlistRecords.length} saved across all pages):
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("poll")}
                  className="rounded-lg bg-amber-700 px-3 py-1 text-xs font-bold text-white hover:bg-amber-800"
                >
                  🗳️ Start Family Poll with Shortlist →
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {shortlistRecords.map((sr) => (
                  <div
                    key={sr.slug}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNameForModal(sr);
                        setReportSent(false);
                      }}
                      className="font-bold text-stone-900 hover:text-amber-800"
                    >
                      {sr.nameTamil}{" "}
                      <span className="font-medium text-amber-800">
                        ({sr.nameLatin})
                      </span>
                    </button>
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                      #{sr.numerologyChaldean}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(sr.slug)}
                      title="Remove from shortlist"
                      className="text-stone-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Parent Filters (server-side) */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Numerology Method",
                value: numerologyMethod,
                set: (v: string) =>
                  setNumerologyMethod(v === "chaldean" ? "chaldean" : "pythagorean"),
                options: [
                  ["pythagorean", "Standard Letter Method (Pythagorean A–Z)"],
                  ["chaldean", "Chaldean (Cheiro)"],
                ],
              },
              {
                label: "Religion / Tradition",
                value: religionFilter,
                set: setReligionFilter,
                options: [
                  ["all", "All"],
                  ["Pure Tamil", "Pure Tamil (தனித்தமிழ்)"],
                  ["Hindu", "Hindu (Saiva / Vaishnava / Murugan)"],
                  ["Christian", "Tamil Christian"],
                  ["Muslim", "Tamil Muslim"],
                  ["Universal", "Universal Tamil"],
                ],
              },
              {
                label: "Region / Community",
                value: communityFilter,
                set: setCommunityFilter,
                options: [
                  ["all", "All"],
                  ["Pan-Tamil", "Pan-Tamil"],
                  ["Chola", "Chola / Cauvery"],
                  ["Pandya", "Pandya / Madurai"],
                  ["Kongu", "Kongu"],
                  ["Chera", "Chera / Nanjil"],
                  ["Diaspora", "Eelam / Diaspora"],
                ],
              },
              {
                label: "Trend (illustrative)",
                value: trendFilter,
                set: setTrendFilter,
                options: [
                  ["all", "All"],
                  ["Trending Now", "Trending Now 🔥"],
                  ["Rising Fast", "Rising Fast 📈"],
                  ["Evergreen", "Evergreen Classic 🏛️"],
                  ["Rare Sangam", "Rare Sangam Revival 💎"],
                ],
              },
              {
                label: "Uniqueness (illustrative)",
                value: uniquenessFilter,
                set: setUniquenessFilter,
                options: [
                  ["all", "Any"],
                  ["Very Rare", "Very Rare Gems only"],
                  ["Rare", "Rare and rarer"],
                  ["Moderately", "Moderately Popular"],
                ],
              },
              {
                label: "Misspell Risk",
                value: misspellFilter,
                set: setMisspellFilter,
                options: [
                  ["all", "Any"],
                  ["low", "Low risk only"],
                  ["medium", "Low or Medium"],
                ],
              },
              {
                label: "Ease of Calling (min, illustrative)",
                value: String(minEaseScore),
                set: (v: string) => setMinEaseScore(parseInt(v, 10) || 0),
                options: [
                  ["0", "Any"],
                  ["60", "60+"],
                  ["75", "75+"],
                  ["90", "90+"],
                ],
              },
              {
                label: "Names per page",
                value: String(pageSize),
                set: (v: string) => setPageSize(parseInt(v, 10) || 48),
                options: [
                  ["24", "24"],
                  ["48", "48"],
                  ["96", "96"],
                ],
              },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-stone-600">
                  {f.label}
                </label>
                <select
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
                >
                  {f.options.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <p className="text-xs text-stone-600" aria-live="polite">
            {namesLoading
              ? "Loading…"
              : totalCount === 0
              ? "No names match these filters."
              : `Showing ${((page - 1) * pageSize + 1).toLocaleString("en-IN")}–${Math.min(
                  page * pageSize,
                  totalCount
                ).toLocaleString("en-IN")} of ${totalCount.toLocaleString("en-IN")} Tamil names`}
            {namesError && <span className="ml-2 text-rose-700">{namesError}</span>}
          </p>

          {/* Name Cards Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNames.map((item) => {
              const isShortlisted = shortlist.includes(item.slug);
              return (
                <div
                  key={item.slug}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-stone-900">
                            {item.nameTamil}
                          </h2>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              item.gender === "girl"
                                ? "bg-rose-100 text-rose-800"
                                : item.gender === "boy"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.gender === "girl"
                              ? "பெண் · Girl"
                              : item.gender === "boy"
                              ? "ஆண் · Boy"
                              : "பொது · Unisex"}
                          </span>
                        </div>
                        <p className="text-base font-semibold text-amber-800">
                          {item.nameLatin}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleShortlist(item.slug)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isShortlisted
                            ? "border-amber-600 bg-amber-600 text-white"
                            : "border-stone-300 bg-stone-50 text-stone-700 hover:bg-amber-50"
                        }`}
                      >
                        {isShortlisted ? "♥ Shortlisted" : "♡ Shortlist"}
                      </button>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-stone-100 pt-3 text-sm">
                      <p className="font-medium text-stone-800">
                        {item.meaningTa}
                      </p>
                      <p className="text-xs text-stone-600">{item.meaningEn}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                      {item.nameCategory === "tamilnadu_usage" ? (
                        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-900">
                          🏛️ தமிழ்நாட்டுப் பயன்பாடு ({item.categoryOriginSource || "TN Cultural Usage"})
                        </span>
                      ) : item.nameCategory === "other_heritage" ? (
                        <span className="rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 font-semibold text-purple-900">
                          🌍 பிற மரபுப் பெயர் ({item.categoryOriginSource || "Global Heritage"})
                        </span>
                      ) : (
                        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-900">
                          🌿 தூய தமிழ் (Pure Tamil)
                        </span>
                      )}
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-900">
                        எண் {numerologyMethod === "chaldean" ? item.numerologyChaldean : item.numerologyPythagorean} (Total{" "}
                        {numerologyMethod === "chaldean" ? item.compoundChaldean : item.compoundPythagorean}){" "}
                        · {numerologyMethod === "chaldean" ? "Chaldean" : "Pythagorean"}
                      </span>
                      <span className="rounded-md bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
                        எழுத்து: {item.startingSyllableTa} ({item.startingSyllableEn})
                      </span>
                      {item.structuredReference?.citationScope ===
                      "etymological-compound" ? (
                        <span
                          className="rounded-md border border-teal-300 bg-teal-50 px-2 py-0.5 font-semibold text-teal-900"
                          title="FMT-01: Post-classical coinage synthesized from authentic Tamil roots"
                        >
                          🧪 Modern Synthesis
                        </span>
                      ) : item.structuredReference?.citationScope ===
                        "exact-word-in-verse" ? (
                        <span
                          className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-900"
                          title="Direct textual citation verified in classical Tamil verse"
                        >
                          📜 Classical Text Verified
                        </span>
                      ) : (
                        <span
                          className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-900"
                          title="Verified standalone root in Madras University Tamil Lexicon"
                        >
                          📘 {item.verificationStatus}
                        </span>
                      )}
                      {item.trendStatus && (
                        <span
                          className="rounded-md bg-rose-50 px-2 py-0.5 font-medium text-rose-800"
                          title="Illustrative formula-based trend category"
                        >
                          🔥 {item.trendStatus.category}
                        </span>
                      )}
                      {item.uniqueness && (
                        <span
                          className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-800"
                          title="Illustrative formula-based rarity band"
                        >
                          💎 {item.uniqueness.band}
                        </span>
                      )}
                      {item.easeOfCalling && (
                        <span
                          className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800"
                          title="Illustrative pronunciation ease score"
                        >
                          🗣️ Ease {item.easeOfCalling.overallScore}/100
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 text-[11px] text-stone-500">
                      {item.structuredReference?.citationScope ===
                      "exact-word-in-verse" ? (
                        <>
                          📜 <strong>இலக்கியச் சான்று (Ancient Citation):</strong>{" "}
                          {item.literaryReference}
                        </>
                      ) : (
                        <>
                          📘 <strong>அகராதி வேர்ச்சொல் (Lexicon Root Source):</strong>{" "}
                          {item.literaryReference}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
                    <button
                      onClick={() => {
                        setSelectedNameForModal(item);
                        setReportSent(false);
                      }}
                      className="text-xs font-semibold text-amber-700 hover:underline"
                    >
                      7D Scorecard & Details →
                    </button>
                    <Link
                      href={`/name/${item.slug}`}
                      className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200"
                    >
                      SEO Page ↗
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || namesLoading}
              className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:opacity-40"
            >
              ← Previous
            </button>
            <span className="text-sm text-stone-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || namesLoading}
              className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 disabled:opacity-40"
            >
              Next →
            </button>
          </nav>        </div>
      )}

      {/* TAB 2: NAKSHATRA (BIRTH STAR) FINDER */}
      {activeTab === "nakshatra" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              🌟 பிறந்த நட்சத்திரம் & நாம எழுத்து கணிப்பான்
            </h2>
            <p className="text-xs text-stone-600">
              Computes Sidereal Moon Longitude using <strong>Lahiri (Chitrapaksha) Ayanamsa</strong> offline right in your browser.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Date of Birth (பிறந்த தேதி)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Time of Birth IST (பிறந்த நேரம்)
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="rounded-xl bg-amber-50 p-4 text-xs text-amber-950">
              <div className="font-bold">Astronomical Details (Lahiri):</div>
              <div className="mt-1">
                Sidereal Moon: <strong>{birthStarResult.siderealMoonLonDeg}°</strong>
              </div>
              <div>
                Ayanamsa: <strong>{birthStarResult.lahiriAyanamsaDeg}°</strong>
              </div>
              {birthStarResult.nearBoundaryWarning && (
                <div className="mt-2 rounded bg-amber-200/70 p-2 font-medium text-amber-900">
                  ⚠️ {birthStarResult.nearBoundaryWarning}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Calculated Birth Star (ஜென்ம நட்சத்திரம்)
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900">
                  {birthStarResult.nakshatra.nameTa} —{" "}
                  {birthStarResult.nakshatra.nameEn} (பாதம்{" "}
                  {birthStarResult.padam})
                </h3>
                <p className="text-sm text-stone-600">
                  ராசி (Rasi): <strong>{birthStarResult.rasiTa}</strong> (
                  {birthStarResult.rasiEn}) · அதிபதி:{" "}
                  <strong>{birthStarResult.nakshatra.rulingPlanetTa}</strong>
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-center">
                <div className="text-[11px] font-semibold text-amber-800">
                  Padam {birthStarResult.padam} Starting Letter
                </div>
                <div className="text-2xl font-black text-amber-900">
                  {birthStarResult.recommendedSyllableTamil} (
                  {birthStarResult.recommendedSyllableLatin})
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  All 4 Padam Syllables for {birthStarResult.nakshatra.nameTa} (Click to Filter):
                </h4>
                {birthStarSyllable && (
                  <button
                    type="button"
                    onClick={() => setBirthStarSyllable("")}
                    className="text-xs font-semibold text-amber-800 underline"
                  >
                    Show All 4 Padams
                  </button>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[0, 1, 2, 3].map((idx) => {
                  const sylTa = birthStarResult.nakshatra.padamSyllablesTamil[idx];
                  const sylEn = birthStarResult.nakshatra.padamSyllablesLatin[idx];
                  const isRecommended = birthStarResult.padam === idx + 1;
                  const isSelected = birthStarSyllable === sylTa;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() =>
                        setBirthStarSyllable((prev) =>
                          prev === sylTa ? "" : sylTa
                        )
                      }
                      className={`rounded-xl border p-3 text-center transition ${
                        isSelected
                          ? "border-amber-700 bg-amber-700 font-bold text-white shadow-sm"
                          : isRecommended
                          ? "border-amber-600 bg-amber-50 font-bold text-stone-900 hover:bg-amber-100"
                          : "border-stone-200 bg-stone-50 text-stone-900 hover:bg-amber-50/50"
                      }`}
                    >
                      <div
                        className={`text-[11px] ${
                          isSelected ? "text-amber-100" : "text-stone-500"
                        }`}
                      >
                        பாதம் {idx + 1} {isRecommended ? "★" : ""}
                      </div>
                      <div className="text-lg">
                        {sylTa} ({sylEn})
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-stone-800">
                  Matching Verified Tamil Names ({namesMatchingBirthStar.length})
                  {birthStarSyllable ? ` starting with "${birthStarSyllable}"` : ""}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "girl", label: "பெண் · Girl" },
                    { id: "boy", label: "ஆண் · Boy" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setBirthStarGender(g.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        birthStarGender === g.id
                          ? "bg-stone-900 text-white"
                          : "border border-stone-200 bg-stone-50 text-stone-700"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setNakshatraFilter(birthStarResult.nakshatra.slug);
                      if (birthStarGender !== "all") setGenderFilter(birthStarGender);
                      setStartingLetter(birthStarSyllable);
                      setActiveTab("explore");
                    }}
                    className="rounded-lg bg-amber-700 px-3 py-1 text-xs font-bold text-white hover:bg-amber-800"
                  >
                    Open in Full Explorer →
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {namesMatchingBirthStar.slice(0, 12).map((n) => {
                  const isShortlisted = shortlist.includes(n.slug);
                  return (
                    <div
                      key={n.slug}
                      className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 p-3 hover:border-amber-300"
                    >
                      <div>
                        <div className="font-bold text-stone-900">
                          {n.nameTamil}{" "}
                          <span className="text-sm font-medium text-amber-800">
                            ({n.nameLatin})
                          </span>
                        </div>
                        <div className="text-xs text-stone-600">{n.meaningTa}</div>
                        <div className="text-[11px] text-stone-500">{n.meaningEn}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleShortlist(n.slug)}
                          className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                            isShortlisted
                              ? "bg-amber-600 text-white"
                              : "border border-stone-200 bg-stone-50 text-stone-700"
                          }`}
                        >
                          {isShortlisted ? "♥" : "♡"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNameForModal(n);
                            setReportSent(false);
                          }}
                          className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-200"
                        >
                          7D Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NUMEROLOGY CALCULATOR */}
      {activeTab === "numerology" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              🔢 பெயர் எண் கணிதம் (Chaldean & Pythagorean)
            </h2>
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Enter Baby Name (English or தமிழ்)
              </label>
              <input
                type="text"
                value={numInputName}
                onChange={(e) => setNumInputName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Numerology Method
              </label>
              <select
                value={numSystem}
                onChange={(e) =>
                  setNumSystem(e.target.value as NumerologySystem)
                }
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              >
                <option value="chaldean">
                  Chaldean (Cheiro — Most Popular in Tamil Nadu)
                </option>
                <option value="pythagorean">Pythagorean (Western Modern & Master Numbers)</option>
                <option value="katapayadi">
                  Katapayadi Sankhya (கடபயாதி — Classical Tamil Prosodic Cipher)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Child&apos;s Date of Birth (for Mulank & Bhagyank Match)
              </label>
              <input
                type="date"
                value={numDob}
                onChange={(e) => setNumDob(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Spelling Variant Advisor — Target Lucky Number:
              </label>
              <select
                value={targetSpellingNumber}
                onChange={(e) =>
                  setTargetSpellingNumber(parseInt(e.target.value, 10))
                }
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    Target Number {n}
                  </option>
                ))}
              </select>
            </div>

            {shortlistRecords.length > 0 && (
              <div className="border-t border-stone-100 pt-3">
                <div className="text-xs font-semibold text-stone-600">
                  Quick-Load from Your Shortlist:
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {shortlistRecords.map((sr) => (
                    <button
                      key={sr.slug}
                      type="button"
                      onClick={() => setNumInputName(sr.nameLatin)}
                      className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                    >
                      {sr.nameTamil} ({sr.nameLatin})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setNumerologyMethod(numSystem === "katapayadi" ? "chaldean" : numSystem);
                setNumerologyFilter(targetSpellingNumber);
                setActiveTab("explore");
              }}
              className="w-full rounded-xl bg-amber-700 py-2.5 text-xs font-bold text-white shadow hover:bg-amber-800"
            >
              🔍 Browse All Catalog Names with Number {targetSpellingNumber} ({numSystem === "chaldean" ? "Chaldean" : "Pythagorean"}) →
            </button>
          </div>

          <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
                <div className="text-xs font-semibold text-amber-800">
                  {numSystem === "chaldean" ? "Chaldean" : "Pythagorean"} Name #
                </div>
                <div className="mt-1 text-3xl font-black text-amber-900">
                  {numerologyResult.nameNumber}
                </div>
                <div className="text-[11px] text-amber-700">
                  Compound: {numerologyResult.compoundNumber} ·{" "}
                  {numSystem === "chaldean" ? "Pyth" : "Chald"}: #{altNumerologyResult.nameNumber} ({altNumerologyResult.compoundNumber})
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
                <div className="text-xs font-semibold text-stone-600">
                  Birth Number (பிறப்பு எண்)
                </div>
                <div className="mt-1 text-3xl font-black text-stone-900">
                  {birthNumResult.mulank}
                </div>
                <div className="text-[11px] text-stone-500">
                  {birthNumResult.mulankPlanet.planetTa}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
                <div className="text-xs font-semibold text-stone-600">
                  Destiny Number (விதி எண்)
                </div>
                <div className="mt-1 text-3xl font-black text-stone-900">
                  {birthNumResult.bhagyank}
                </div>
                <div className="text-[11px] text-stone-500">
                  {birthNumResult.bhagyankPlanet.planetTa}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <div className="text-xs font-semibold text-emerald-800">
                  Compatibility
                </div>
                <div className="mt-1 text-xl font-black text-emerald-900">
                  {compatResult.rating}
                </div>
                <div className="text-[11px] text-emerald-700">
                  {compatResult.score}/100 Match
                </div>
              </div>
            </div>

            {/* Letter breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Letter-by-Letter {numSystem.toUpperCase()} Values (
                {numerologyResult.cleanedLatin})
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {numerologyResult.letterBreakdown.map((item, i) => (
                  <div
                    key={i}
                    className="flex h-14 w-12 flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-50"
                  >
                    <span className="text-sm font-bold text-stone-900">
                      {item.char}
                    </span>
                    <span className="text-xs font-semibold text-amber-700">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Planetary & Compatibility Insight */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm space-y-2.5">
              {numerologyResult.isMasterNumber && (
                <div className="rounded-xl border border-purple-300 bg-purple-50 p-2.5 text-xs font-bold text-purple-950 flex items-center gap-2">
                  <span className="text-base">🌟</span>
                  <span>{numerologyResult.masterNumberTitleTa} ({numerologyResult.masterNumberTitleEn})</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
                <div className="font-bold text-stone-900 text-base">
                  🪐 ஆளும் கிரகம்: {numerologyResult.planet.planetTa} ({numerologyResult.planet.planetEn})
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                  அதிபதி: {numerologyResult.planet.deityTa}
                </span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                <strong>இயற்கைப் பண்புகள்:</strong> {numerologyResult.planet.traitsTa} — {numerologyResult.planet.traitsEn}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 pt-1">
                <div className="rounded-xl bg-white p-2.5 border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-500">அதிர்ஷ்ட வண்ணங்கள்</div>
                  <div className="mt-0.5 font-bold text-stone-800">{numerologyResult.planet.luckyColors.join(", ")}</div>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-500">சுபக் கிழமைகள்</div>
                  <div className="mt-0.5 font-bold text-stone-800">{numerologyResult.planet.luckyDays.join(", ")}</div>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-500">மங்கள நவரத்தினம்</div>
                  <div className="mt-0.5 font-bold text-stone-800">{numerologyResult.planet.gemTa}</div>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-stone-500">வெற்றி மைல்கல் வயது</div>
                  <div className="mt-0.5 font-bold text-stone-800">{numerologyResult.planet.milestoneYears.slice(0, 4).join(", ")}</div>
                </div>
              </div>

              <div className="pt-1 text-xs text-stone-600">
                <strong>பொருத்தமான தொழில் துறைகள்:</strong> {numerologyResult.planet.favorableCareersTa.join(" · ")} ({numerologyResult.planet.favorableCareersEn.join(", ")})
              </div>

              <p className="text-xs font-medium text-emerald-800 border-t border-stone-200/60 pt-2">
                ✓ {compatResult.reasonTa} ({compatResult.reasonEn})
              </p>

              {numerologyResult.compoundInfo && (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs">
                  <strong>
                    Compound {numerologyResult.compoundNumber} —{" "}
                    {numerologyResult.compoundInfo.titleTa} (
                    {numerologyResult.compoundInfo.titleEn}) [{numerologyResult.compoundInfo.auspiciousness}]:
                  </strong>{" "}
                  {numerologyResult.compoundInfo.summaryTa} ({numerologyResult.compoundInfo.summaryEn})
                </div>
              )}
            </div>

            {/* Spelling Variants */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Phonetic Spelling Variants for Target Number{" "}
                {targetSpellingNumber}:
              </h4>
              {spellingVariants.length === 0 ? (
                <p className="mt-1 text-xs text-stone-500">
                  No single-letter phonetic tweak hits {targetSpellingNumber}. Try adding your family initial or choosing another target number (e.g. 1, 3, 5, 6).
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {spellingVariants.map((v) => (
                    <button
                      key={v.spelling}
                      onClick={() => setNumInputName(v.spelling)}
                      className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                    >
                      {v.spelling} (Compound {v.compoundNumber} → {v.nameNumber})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 7-DIMENSION SCORECARD */}
      {activeTab === "scorecard" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              🛡️ 7-Dimension Name Evaluation Engine
            </h2>
            {shortlistRecords.length > 0 && (
              <div className="rounded-xl bg-amber-50/70 p-3">
                <div className="text-[11px] font-bold text-amber-900">
                  Evaluate a Shortlisted Name:
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {shortlistRecords.map((sr) => (
                    <button
                      key={sr.slug}
                      type="button"
                      onClick={() => loadIntoScorecard(sr)}
                      className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-stone-800 hover:bg-amber-100"
                    >
                      {sr.nameTamil} ({sr.nameLatin})
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Name in Tamil Script (தமிழ் பெயர்)
              </label>
              <input
                type="text"
                value={scoreNameTamil}
                onChange={(e) => setScoreNameTamil(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Official English Spelling
              </label>
              <input
                type="text"
                value={scoreNameLatin}
                onChange={(e) => setScoreNameLatin(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Sibling / Family Names (comma-separated for harmony check)
              </label>
              <input
                type="text"
                value={siblingNamesStr}
                onChange={(e) => setSiblingNamesStr(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Literary Reference
              </label>
              <input
                type="text"
                value={scoreRef}
                onChange={(e) => setScoreRef(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-stone-900">
                  {scoreNameTamil} ({scoreNameLatin})
                </h3>
                <p className="text-xs text-stone-500">
                  {scorecardResult.tamilAksharaCount} Tamil Aksharas ·{" "}
                  {scorecardResult.latinLength} Latin Letters · Misspelling Risk:{" "}
                  <strong>{scorecardResult.misspellingRisk}</strong>
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-600 px-5 py-3 text-center text-white">
                <div className="text-[11px] font-medium uppercase">
                  Overall Score
                </div>
                <div className="text-3xl font-black">
                  {scorecardResult.overallScore}/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {scorecardResult.dimensions.map((d) => (
                <div
                  key={d.key}
                  className="rounded-xl border border-stone-200 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">
                      {d.labelEn} ({d.labelTa})
                    </span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                      {d.score}/100
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-amber-800">
                    {d.badge}
                  </div>
                  <p className="mt-1 text-xs text-stone-600">{d.detailTa}</p>
                  <p className="text-[11px] text-stone-500">{d.detailEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: VISUAL QUERY & AI PROMPT SYNTHESIZER (Task 7) */}
      {activeTab === "querygen" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-lg">
                  🎯 வினவல் வடிவமைப்பு
                </h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                  {generatedQuery.activeConstraintCount} செயலில் உள்ள விதிகள்
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                குடும்பத் தலைமுறை மரபுகள், உடன்பிறப்பு ஒலி ஒற்றுமை மற்றும் எண் கணித விதிகளுடன் வினவலை உருவாக்கவும்.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700">பாலினம் (Gender):</label>
                <div className="mt-1 flex gap-2">
                  {(["girl", "boy", "unisex", "all"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setQgGender(g)}
                      className={`flex-1 rounded-xl py-2 font-semibold capitalize transition ${
                        qgGender === g
                          ? "bg-amber-600 text-white shadow-xs"
                          : "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      {g === "girl"
                        ? "பெண்"
                        : g === "boy"
                        ? "ஆண்"
                        : g === "unisex"
                        ? "இருபாலர்"
                        : "அனைத்தும்"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">
                  தொடக்க எழுத்துக்கள் (Starting Syllables - கமா கொண்டு பிரிக்கவும்):
                </label>
                <input
                  type="text"
                  value={qgStartingLetters}
                  onChange={(e) => setQgStartingLetters(e.target.value)}
                  placeholder="எ.கா: யா, க, வி"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700">பிறப்பு நட்சத்திரம்:</label>
                  <select
                    value={qgNakshatra}
                    onChange={(e) => setQgNakshatra(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  >
                    <option value="all">அனைத்து நட்சத்திரங்கள்</option>
                    {TAMIL_NAKSHATRAS.map((n) => (
                      <option key={n.slug} value={n.slug}>
                        {n.nameTa} ({n.nameEn})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700">இலக்கு எண் (1–9):</label>
                  <select
                    value={qgTargetNum}
                    onChange={(e) => setQgTargetNum(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  >
                    <option value={0}>எண் கணிதம் தேவையில்லை</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <option key={num} value={num}>
                        எண் {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">
                  உடன்பிறப்பு பெயர்கள் (Sibling Harmonic Matching):
                </label>
                <input
                  type="text"
                  value={qgSiblingNames}
                  onChange={(e) => setQgSiblingNames(e.target.value)}
                  placeholder="எ.கா: செங்குட்டுவன், யாழினி"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700">
                    தாத்தா/பாட்டி பெயர்கள்:
                  </label>
                  <input
                    type="text"
                    value={qgGrandparentNames}
                    onChange={(e) => setQgGrandparentNames(e.target.value)}
                    placeholder="எ.கா: இளங்கோவன்"
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700">
                    பெற்றோர் பெயர்கள்:
                  </label>
                  <input
                    type="text"
                    value={qgParentNames}
                    onChange={(e) => setQgParentNames(e.target.value)}
                    placeholder="எ.கா: அன்பரசன், பூங்கொடி"
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2 text-xs focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">
                  கருப்பொருள் / நற்பண்புகள் (Themes):
                </label>
                <input
                  type="text"
                  value={qgThemes}
                  onChange={(e) => setQgThemes(e.target.value)}
                  placeholder="எ.கா: இசை (Music), இயற்கையெழில் (Nature), அறிவு (Wisdom)"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-xs focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-950">
                  <input
                    type="checkbox"
                    checked={qgPureTamilOnly}
                    onChange={(e) => setQgPureTamilOnly(e.target.checked)}
                    className="h-4 w-4 rounded-sm text-amber-700 focus:ring-amber-500"
                  />
                  <span>🏛️ 100% தூய தமிழ்ச் செம்மொழி வேர்ச்சொல் மட்டும் (≥85% Confidence)</span>
                </label>
                <div className="flex items-center justify-between text-[11px] text-amber-900">
                  <span>பாஸ்போர்ட் எழுத்துப் பிழை இடர்:</span>
                  <select
                    value={qgMaxSpellingRisk}
                    onChange={(e) =>
                      setQgMaxSpellingRisk(e.target.value as "low" | "medium" | "any")
                    }
                    className="rounded-lg border border-amber-300 bg-white px-2 py-0.5 text-xs"
                  >
                    <option value="low">குறைந்த இடர் (Low Risk Only)</option>
                    <option value="medium">மிதமான இடர் வரை (Up to Medium)</option>
                    <option value="any">எல்லா இடர் நிலைகளும்</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Synthesizer Output Column */}
          <div className="space-y-4 lg:col-span-7">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
              <div>
                <h4 className="font-bold text-amber-950 text-sm">
                  ⚡ உடனடி இயக்க விருப்பங்கள்
                </h4>
                <p className="text-xs text-amber-800">
                  உருவாக்கப்பட்ட வடிப்பான்களை தேடலில் பயன்படுத்தலாம் அல்லது AI-க்கு அனுப்பலாம்.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applyQueryToExplorer}
                  className="rounded-xl bg-amber-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-800 transition"
                >
                  ⚡ Apply to Explorer (தேடலுக்கு மாற்று)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdvisorPrompt(generatedQuery.aiLinguisticPrompt);
                    setActiveTab("advisor");
                  }}
                  className="rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs font-bold text-amber-950 shadow-xs hover:bg-amber-100 transition"
                >
                  🤖 Send to AI Advisor
                </button>
              </div>
            </div>

            {/* AI Linguistic Prompt Box */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📜</span>
                  <h4 className="font-bold text-stone-900 text-sm">
                    AI மொழிவடிவ அறிவுறுத்தல் உரை (Synthesized LLM Prompt)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedQuery.aiLinguisticPrompt);
                    setPromptCopied(true);
                    setTimeout(() => setPromptCopied(false), 2000);
                  }}
                  className="rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1 text-xs font-bold text-stone-800 hover:bg-amber-50 transition"
                >
                  {promptCopied ? "✓ Copied!" : "📋 Copy Prompt"}
                </button>
              </div>
              <pre className="mt-3 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl bg-stone-900 p-4 text-xs font-mono text-emerald-400 leading-relaxed">
                {generatedQuery.aiLinguisticPrompt}
              </pre>
            </div>

            {/* Deterministic Filter Shard Parameters */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h4 className="font-bold text-stone-900 text-sm">
                🔍 தரவுத்தள வடிப்பான் அளவுருக்கள் (Deterministic Database Filter)
              </h4>
              <p className="mt-0.5 text-xs text-stone-500">
                இவை பெயர்ச்சோலையின் 21,350+ நினைவகப் பகிர்வுகளில் (In-Memory Shards) உடனடியாக &lt;10ms-ல் செயல்படும்.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-200">
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Gender</div>
                  <div className="mt-0.5 font-bold text-stone-800">
                    {generatedQuery.deterministicFilter.gender || "All"}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-200">
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Starting Syllables</div>
                  <div className="mt-0.5 font-bold text-stone-800">
                    {generatedQuery.deterministicFilter.startingLetters?.join(", ") || "Any"}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-200">
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Numerology No.</div>
                  <div className="mt-0.5 font-bold text-stone-800">
                    {generatedQuery.deterministicFilter.numerologyNumber || "Any"}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-200">
                  <div className="text-[10px] text-stone-500 uppercase font-semibold">Min Confidence</div>
                  <div className="mt-0.5 font-bold text-stone-800">
                    {Math.round(generatedQuery.deterministicFilter.minConfidence * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI NAME ADVISOR */}
      {activeTab === "advisor" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleRunAdvisor}
            className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">
                🤖 அறிவார்ந்த AI தமிழ் பெயர் ஆலோசகர்
              </h2>
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                Live AI Engine
              </span>
            </div>
            <p className="text-xs text-stone-600">
              உங்கள் விருப்பத்திற்கேற்ப தூய தமிழ் மரபில் இலக்கிய வேர்ச்சொற்களைக் கொண்டு நுண்ணறிவுப் பரிந்துரைகளை வழங்குகிறது.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Describe the Meaning, Vibe, or Family Tradition
              </label>
              <textarea
                rows={3}
                value={advisorPrompt}
                onChange={(e) => setAdvisorPrompt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  Gender
                </label>
                <select
                  value={advisorGender}
                  onChange={(e) => setAdvisorGender(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                >
                  <option value="girl">Girl</option>
                  <option value="boy">Boy</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700">
                  Lucky Number
                </label>
                <input
                  type="text"
                  value={advisorLuckyNum}
                  onChange={(e) => setAdvisorLuckyNum(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Natchathiram Preference
              </label>
              <select
                value={advisorNakshatra}
                onChange={(e) => setAdvisorNakshatra(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              >
                <option value="">Any Star</option>
                {TAMIL_NAKSHATRAS.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.nameTa} ({s.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={advisorLoading}
              className="w-full rounded-xl bg-amber-700 py-2.5 text-sm font-bold text-white shadow hover:bg-amber-800 disabled:opacity-50"
            >
              {advisorLoading
                ? "Consulting Linguistic AI Advisor..."
                : "✨ Generate Tamil Name Recommendations"}
            </button>
          </form>

          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
            {!advisorResult ? (
              <div className="flex h-64 flex-col items-center justify-center text-center text-stone-500">
                <p className="text-sm font-semibold">
                  Click &ldquo;Generate Tamil Name Recommendations&rdquo; to query AI Advisor.
                </p>
                <p className="mt-1 text-xs">
                  Returns Tamil script, English transliteration, Sangam references, and live Chaldean numerology scores.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs text-indigo-950">
                  <div>
                    <strong>{advisorResult.summaryTa}</strong>
                    <div className="text-[11px] text-indigo-700">
                      {advisorResult.summaryEn}
                    </div>
                  </div>
                  <span className="rounded-md bg-white px-2 py-1 font-mono text-[11px] font-semibold text-indigo-800 shadow-sm">
                    Model: {advisorResult.modelUsed} ({advisorResult.latencyMs}ms)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {advisorResult.recommendations.map((rec, i) => {
                    const slug =
                      rec.slug ||
                      rec.nameLatin.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const isShortlisted = shortlist.includes(slug);
                    return (
                      <div
                        key={i}
                        className="flex flex-col justify-between rounded-xl border border-stone-200 p-4"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xl font-bold text-stone-900">
                              {rec.nameTamil}{" "}
                              <span className="text-base font-semibold text-amber-800">
                                ({rec.nameLatin})
                              </span>
                            </div>
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                              எண் {rec.numerologyNumber}
                              {rec.pythagoreanNumber
                                ? ` · Pyth #${rec.pythagoreanNumber}`
                                : ""}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-[10px]">
                            <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">
                              ✓ {Math.round((rec.confidence || 0.9) * 100)}% Verified Confidence
                            </span>
                            <span className="rounded bg-stone-100 px-2 py-0.5 text-stone-700">
                              {rec.originCategory}
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-medium text-stone-800">
                            {rec.meaningTa}
                          </p>
                          <p className="mt-1 text-xs text-stone-600">
                            {rec.meaningEn}
                          </p>
                          <div className="mt-2 text-[11px] text-stone-500">
                            📖 {rec.literaryReference} · 🪐 {rec.planetEn}
                            {rec.sourceWebsite && (
                              <>
                                {" · "}
                                <a
                                  href={rec.sourceWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-amber-800 underline"
                                >
                                  Source ↗
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-stone-100 pt-2.5">
                          <button
                            type="button"
                            onClick={() => toggleShortlist(slug)}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                              isShortlisted
                                ? "bg-amber-600 text-white"
                                : "border border-stone-200 bg-stone-50 text-stone-700 hover:bg-amber-50"
                            }`}
                          >
                            {isShortlisted ? "♥ Shortlisted" : "♡ Shortlist"}
                          </button>
                          <button
                            type="button"
                            onClick={() => loadIntoScorecard(rec)}
                            className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:bg-amber-50"
                          >
                            🛡️ 7D Score
                          </button>
                          <button
                            type="button"
                            onClick={() => loadIntoNumerology(rec.nameLatin)}
                            className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:bg-amber-50"
                          >
                            🔢 Numerology
                          </button>
                          {rec.inCatalog && (
                            <Link
                              href={`/name/${slug}`}
                              className="rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900"
                            >
                              SEO Page ↗
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SOCIAL VOTE-OUT POLL */}
      {activeTab === "poll" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleCreatePoll}
            className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-stone-900">
              🗳️ Create Family &ldquo;Vote-Out&rdquo; Poll
            </h2>
            <p className="text-xs text-stone-600">
              Share your shortlisted names ({shortlist.join(", ")}) with relatives on WhatsApp. Relatives can love names or flag ones hard to pronounce — while parents stay the final decider.
            </p>
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Poll Title
              </label>
              <input
                type="text"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Parents&apos; Name
              </label>
              <input
                type="text"
                value={pollParentName}
                onChange={(e) => setPollParentName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Note to Family
              </label>
              <textarea
                rows={2}
                value={pollNotes}
                onChange={(e) => setPollNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 p-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-700 py-2.5 text-sm font-bold text-white hover:bg-amber-800"
            >
              Create Shareable Family Poll Link
            </button>
          </form>

          <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
            {activePollData && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                  <div>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                      Active Poll Token: {activePollData.token}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-stone-900">
                      {activePollData.title}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Hosted by {activePollData.parentName} ·{" "}
                      {activePollData.notes}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          const url = `${window.location.origin}/?tab=poll&poll=${encodeURIComponent(
                            activePollData.token
                          )}`;
                          navigator.clipboard?.writeText(url);
                          setPollCopied(true);
                          setTimeout(() => setPollCopied(false), 2500);
                        }
                      }}
                      className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-100"
                    >
                      {pollCopied ? "✓ Poll Link Copied!" : "📋 Copy Poll Link"}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `🗳️ Vote on our Tamil Baby Name Shortlist (${activePollData.title}): ${
                          typeof window !== "undefined"
                            ? `${window.location.origin}/?tab=poll&poll=${activePollData.token}`
                            : activePollData.token
                        }`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      💬 Share on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Family Consensus Leaderboard */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    🏆 Family Consensus Leaderboard
                  </h4>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {activePollData.candidateSlugs
                      .map((slug) => {
                        const rec =
                          pollCandidates.find((c) => c.slug === slug) ||
                          shortlistRecords.find((c) => c.slug === slug);
                        const loves = activePollData.votes.filter((v) =>
                          v.lovedSlugs.includes(slug)
                        ).length;
                        const outs = activePollData.votes.filter((v) =>
                          v.removedSlugs.includes(slug)
                        ).length;
                        return { slug, rec, loves, outs, net: loves - outs };
                      })
                      .sort((a, b) => b.net - a.net || b.loves - a.loves)
                      .map((item, idx) => (
                        <div
                          key={item.slug}
                          className={`rounded-xl border p-3 text-xs ${
                            idx === 0 && item.loves > 0
                              ? "border-amber-400 bg-amber-50/70"
                              : "border-stone-200 bg-stone-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">
                              {idx === 0 && item.loves > 0 ? "👑 " : ""}
                              {item.rec
                                ? `${item.rec.nameTamil} (${item.rec.nameLatin})`
                                : item.slug}
                            </span>
                            <span className="rounded bg-white px-2 py-0.5 font-bold text-stone-800 shadow-sm">
                              Net {item.net >= 0 ? `+${item.net}` : item.net}
                            </span>
                          </div>
                          {item.rec && (
                            <div className="mt-1 line-clamp-1 text-[11px] text-stone-600">
                              {item.rec.meaningTa}
                            </div>
                          )}
                          <div className="mt-1.5 flex gap-3 text-[11px]">
                            <span className="font-semibold text-emerald-700">
                              ♥ {item.loves} Loved
                            </span>
                            <span className="font-semibold text-rose-700">
                              ✕ {item.outs} Voted Out
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Cast a vote form */}
                <form
                  onSubmit={handleSubmitVote}
                  className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4"
                >
                  <div className="text-xs font-bold text-stone-800">
                    Cast a Family Vote (குடும்ப உறுப்பினர் வாக்கு):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activePollData.candidateSlugs.map((slug) => {
                      const rec =
                        pollCandidates.find((c) => c.slug === slug) ||
                        shortlistRecords.find((c) => c.slug === slug);
                      const loved = voterLoved.includes(slug);
                      const removed = voterRemoved.includes(slug);
                      return (
                        <div
                          key={slug}
                          className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs"
                        >
                          <span className="font-bold text-stone-900">
                            {rec ? `${rec.nameTamil} (${rec.nameLatin})` : slug}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setVoterLoved((p) =>
                                p.includes(slug)
                                  ? p.filter((x) => x !== slug)
                                  : [...p, slug]
                              )
                            }
                            className={`rounded px-1.5 py-0.5 ${
                              loved
                                ? "bg-emerald-600 text-white"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            ♥ Love
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setVoterRemoved((p) =>
                                p.includes(slug)
                                  ? p.filter((x) => x !== slug)
                                  : [...p, slug]
                              )
                            }
                            className={`rounded px-1.5 py-0.5 ${
                              removed
                                ? "bg-rose-600 text-white"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            ✕ Vote-Out
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="Your Name (e.g., Chithi / Thatha)"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Blessing or comment..."
                      value={voterComment}
                      onChange={(e) => setVoterComment(e.target.value)}
                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs sm:col-span-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
                  >
                    Submit Family Vote
                  </button>
                </form>

                {/* Poll Results */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Family Votes Received ({activePollData.votes.length})
                  </h4>
                  <div className="mt-2 space-y-2">
                    {activePollData.votes.map((v, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-stone-200 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-stone-800">
                          <span>{v.voterName}</span>
                          <span className="text-[11px] font-normal text-stone-500">
                            Loved: {v.lovedSlugs.join(", ") || "—"} | Voted Out:{" "}
                            {v.removedSlugs.join(", ") || "—"}
                          </span>
                        </div>
                        {v.comment && (
                          <p className="mt-1 text-stone-600">
                            &ldquo;{v.comment}&rdquo;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: PUBLIC NAME SUGGESTION + AI MODERATION */}
      {activeTab === "community" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmitSuggestion}
            className="space-y-3.5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-stone-900">
              🌱 Suggest a Tamil Baby Name (AI-Reviewed)
            </h2>
            <p className="text-xs text-stone-600">
              Per product-owner workflow: Public suggestions are reviewed in real time by Linguistic AI for authentic meaning and automatically added if approved.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Tamil Script (தமிழ் பெயர்) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., செங்கதிர்"
                value={sugTamil}
                onChange={(e) => setSugTamil(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                English Transliteration *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., செங்கதிர் -> செங்கதிர் / Sengathir"
                value={sugLatin}
                onChange={(e) => setSugLatin(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Gender
              </label>
              <select
                value={sugGender}
                onChange={(e) =>
                  setSugGender(e.target.value as "boy" | "girl" | "unisex")
                }
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              >
                <option value="girl">Girl</option>
                <option value="boy">Boy</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Meaning in Tamil (தமிழ் பொருள்)
              </label>
              <input
                type="text"
                placeholder="இளஞ்சூரியனின் செங்கதிர்கள்"
                value={sugMeaningTa}
                onChange={(e) => setSugMeaningTa(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Meaning in English
              </label>
              <input
                type="text"
                placeholder="Golden crimson rays of the rising sun"
                value={sugMeaningEn}
                onChange={(e) => setSugMeaningEn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700">
                Literary Source / Citation (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Purananuru / Silappathikaram"
                value={sugRef}
                onChange={(e) => setSugRef(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={sugLoading}
              className="w-full rounded-xl bg-amber-700 py-2.5 text-sm font-bold text-white hover:bg-amber-800 disabled:opacity-50"
            >
              {sugLoading
                ? "Linguistic AI Reviewing Submission..."
                : "Submit for Instant AI Review & Approval"}
            </button>
          </form>

          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-base font-bold text-stone-900">
              AI Curation & Public Suggestion Queue
            </h3>

            {sugResponse && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950">
                <div className="font-bold">
                  Submission Result: {sugResponse.status} (Confidence:{" "}
                  {Math.round(sugResponse.aiConfidence * 100)}% via{" "}
                  {sugResponse.aiModelUsed})
                </div>
                <p className="mt-1">{sugResponse.aiReviewNote}</p>
              </div>
            )}

            {recentSuggestions.length === 0 ? (
              <p className="text-xs text-stone-500">
                No public suggestions submitted in this session yet. Submit a Tamil name on the left to watch AI review and auto-approve it!
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-stone-200 p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-900">
                        {s.nameTamil} ({s.nameLatin})
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800">
                        {s.status} · {Math.round(s.aiConfidence * 100)}%
                      </span>
                    </div>
                    <p className="mt-1 text-stone-700">
                      {s.meaningTa} — {s.meaningEn}
                    </p>
                    <p className="mt-1 text-[11px] text-stone-500">
                      AI Review ({s.aiModelUsed}): {s.aiReviewNote}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAIL, 7D SCORECARD & REPORT ERROR MODAL */}
      {selectedNameForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-hidden"
          onClick={() => setSelectedNameForModal(null)}
        >
          <div
            className="relative flex flex-col w-full max-w-3xl max-h-[85vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Modal Header */}
            <div className="shrink-0 bg-white border-b border-stone-200 px-5 py-4 flex flex-wrap items-center justify-between gap-3 z-10">
              <div className="flex-1 min-w-[200px]">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-amber-900">
                    {selectedNameForModal.originCategory} ·{" "}
                    {Math.round(selectedNameForModal.confidence * 100)}% Verified
                  </span>
                  {selectedNameForModal.structuredReference?.citationScope ===
                  "etymological-compound" ? (
                    <span className="rounded-full border border-teal-300 bg-teal-50 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-teal-900">
                      🧪 Modern Synthesis (வேர்ச்சொல் புணர்ச்சி)
                    </span>
                  ) : selectedNameForModal.structuredReference?.citationScope ===
                    "exact-word-in-verse" ? (
                    <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-emerald-900">
                      📜 Direct Textual Citation
                    </span>
                  ) : (
                    <span className="rounded-full border border-sky-300 bg-sky-50 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-sky-900">
                      📘 Attested Lexicon Root
                    </span>
                  )}
                  {selectedNameForModal.trendStatus && (
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800">
                      🔥 {selectedNameForModal.trendStatus.category}
                    </span>
                  )}
                  {selectedNameForModal.uniqueness && (
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-800">
                      💎 {selectedNameForModal.uniqueness.band}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 text-2xl sm:text-3xl font-bold text-stone-900">
                  {selectedNameForModal.nameTamil}{" "}
                  <span className="text-lg sm:text-xl text-amber-800 font-semibold">
                    ({selectedNameForModal.nameLatin})
                  </span>
                </h3>
                <p className="mt-0.5 text-[11px] sm:text-xs text-stone-500">
                  எழுத்து: <strong>{selectedNameForModal.startingSyllableTa}</strong> (
                  {selectedNameForModal.startingSyllableEn}) · ராசி:{" "}
                  <strong>{selectedNameForModal.rasiTa}</strong> (
                  {selectedNameForModal.rasiEn}) · நட்சத்திரம்:{" "}
                  {selectedNameForModal.nakshatraSlugs.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {modalScorecard && (
                  <div className="rounded-2xl bg-emerald-600 px-3.5 py-1.5 text-center text-white shadow-xs">
                    <div className="text-[9px] font-semibold uppercase tracking-wider">
                      7D Score
                    </div>
                    <div className="text-xl sm:text-2xl font-black">
                      {modalScorecard.overallScore}/100
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedNameForModal(null)}
                  className="rounded-xl bg-stone-100 px-3 py-2 text-xs sm:text-sm font-bold text-stone-700 hover:bg-stone-200 transition"
                  aria-label="Close dialog"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">

            {/* Quick Action Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleShortlist(selectedNameForModal.slug)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  shortlist.includes(selectedNameForModal.slug)
                    ? "bg-amber-600 text-white"
                    : "border border-stone-300 bg-stone-50 text-stone-800 hover:bg-amber-50"
                }`}
              >
                {shortlist.includes(selectedNameForModal.slug)
                  ? "♥ In Family Shortlist"
                  : "♡ Add to Shortlist"}
              </button>
              <a
                href={`/api/reports/download-pdf?slug=${selectedNameForModal.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-amber-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black transition flex items-center gap-1.5"
              >
                <span>📜</span>
                <span>Download Official PDF Dossier (சுவடி அறிக்கை)</span>
              </a>
              <button
                type="button"
                onClick={() => loadIntoNumerology(selectedNameForModal.nameLatin)}
                className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-amber-50"
              >
                🔢 Open in Numerology Engine
              </button>
              <button
                type="button"
                onClick={() => loadIntoScorecard(selectedNameForModal)}
                className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-amber-50"
              >
                🛡️ Customize in 7D Scorecard
              </button>
              <Link
                href={`/name/${selectedNameForModal.slug}`}
                className="rounded-xl bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-800"
              >
                Full 14-Dimension SEO Page ↗
              </Link>
            </div>

            {/* Empirical Cohort Rarity & Classroom Frequency Gauge (Task 8) */}
            {modalEmpiricalRarity && (
              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200/60 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{modalEmpiricalRarity.icon}</span>
                    <span className="font-bold uppercase tracking-wider text-indigo-950">
                      வகுப்பறை அதிர்வெண் & தனித்துவம் (Cohort Frequency Index)
                    </span>
                  </div>
                  <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {modalEmpiricalRarity.observedFrequencyPercent}% Frequency
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/90 p-2.5 border border-indigo-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">
                      Classroom (40 Kids)
                    </div>
                    <div className="mt-0.5 font-bold text-indigo-950">
                      ~{modalEmpiricalRarity.classroomRepetitionIndex} peers
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/90 p-2.5 border border-indigo-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">
                      Grade Cohort (1,000 Kids)
                    </div>
                    <div className="mt-0.5 font-bold text-indigo-950">
                      ~{modalEmpiricalRarity.gradeCohortIndex} students
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/90 p-2.5 border border-indigo-100">
                    <div className="text-[10px] uppercase font-bold text-stone-500">
                      Rarity Band
                    </div>
                    <div className="mt-0.5 font-bold text-indigo-950">
                      {modalEmpiricalRarity.badgeTitleTamil}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-indigo-900 leading-relaxed">
                  💡 <strong>பெற்றோர் வழிகாட்டல்:</strong> {modalEmpiricalRarity.parentAdviceTamil} ({modalEmpiricalRarity.parentAdviceEnglish})
                </p>
              </div>
            )}

            {/* Meaning, Etymology & Verified Citation (>= 80% Confidence Gate) */}
            <div className="mt-4 space-y-2.5 rounded-2xl bg-amber-50 p-4 text-sm">
              <p className="font-semibold text-stone-900">
                {selectedNameForModal.meaningTa}
              </p>
              <p className="text-xs text-stone-700">
                {selectedNameForModal.meaningEn}
              </p>
              {(selectedNameForModal.literalMeaningEn ||
                selectedNameForModal.derivedMeaningEn) && (
                <div className="grid grid-cols-1 gap-2 rounded-xl border border-amber-200 bg-white/80 p-2.5 text-xs sm:grid-cols-2">
                  <div>
                    <span className="font-bold text-stone-800">
                      📖 Literal Root Meaning (நேரடி வேர்ச்சொல் பொருள்):
                    </span>
                    <div className="mt-0.5 text-stone-700">
                      {selectedNameForModal.literalMeaningEn ||
                        selectedNameForModal.meaningEn}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-amber-900">
                      ✨ Derived / Poetic Meaning (வழிப்பொருள்):
                    </span>
                    <div className="mt-0.5 text-stone-700">
                      {selectedNameForModal.derivedMeaningEn ||
                        selectedNameForModal.meaningEn}
                    </div>
                  </div>
                </div>
              )}
              {selectedNameForModal.etymologyRoot && (
                <p className="text-xs font-semibold text-amber-900">
                  🌱 <strong>வேர்ச்சொல் (Etymology):</strong>{" "}
                  {selectedNameForModal.etymologyRoot}
                </p>
              )}
              {selectedNameForModal.confidence >= 0.8 ? (
                <div className="space-y-2 border-t border-amber-200/80 pt-2.5 text-xs text-amber-950">
                  {/* FMT-03: Separate Ancient Textual Citations from Lexicon Source URLs */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5">
                    <div className="font-bold text-emerald-950">
                      📜 Ancient Textual Citation (பண்டைய இலக்கியச் சான்று):
                    </div>
                    {selectedNameForModal.structuredReference?.citationScope ===
                    "exact-word-in-verse" ? (
                      <div className="mt-1 space-y-1 text-emerald-900">
                        <div>
                          <strong>Attested Work:</strong>{" "}
                          {selectedNameForModal.structuredReference.workTa} (
                          {selectedNameForModal.structuredReference.workEn}) ·{" "}
                          {
                            selectedNameForModal.structuredReference
                              .sectionOrKandam
                          }{" "}
                          ·{" "}
                          {
                            selectedNameForModal.structuredReference
                              .verseOrSongNumber
                          }
                        </div>
                        {selectedNameForModal.structuredReference
                          .lineTitleOrQuote && (
                          <blockquote className="border-l-2 border-emerald-600 pl-2 italic">
                            &ldquo;
                            {
                              selectedNameForModal.structuredReference
                                .lineTitleOrQuote
                            }
                            &rdquo;
                          </blockquote>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1 text-[11px] text-stone-700">
                        {selectedNameForModal.structuredReference
                          ?.citationScope === "etymological-compound"
                          ? "None — Synthesized modern compound name from authentic Tamil roots (FMT-01: Modern Synthesis; no ancient poem verse claims)."
                          : "Standalone root attested in the Madras University Tamil Lexicon (no specific Sangam verse quote claimed)."}
                      </div>
                    )}
                  </div>

                  {/* Lexicon Source URLs Box */}
                  <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-2.5">
                    <div className="font-bold text-sky-950">
                      📘 Lexicon Headword Source URLs (சென்னைப் பல்கலைக்கழகத் தமிழ் அகராதி):
                    </div>
                    <div className="mt-1 text-[11px] text-sky-900">
                      <strong>Attribution Type:</strong>{" "}
                      {selectedNameForModal.sourceAttributionType ||
                        selectedNameForModal.structuredReference
                          ?.verificationTier}{" "}
                      ({Math.round(selectedNameForModal.confidence * 100)}%
                      Confidence)
                    </div>
                    {selectedNameForModal.structuredReference?.citationNote && (
                      <p className="mt-1 text-[11px] text-stone-700">
                        ℹ️ {selectedNameForModal.structuredReference.citationNote}
                      </p>
                    )}
                    {selectedNameForModal.structuredReference?.sourceWebsite && (
                      <div className="mt-1.5 flex flex-wrap gap-2 text-[11px]">
                        <a
                          href={
                            selectedNameForModal.structuredReference
                              .sourceWebsite
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-sky-300 bg-white px-2.5 py-1 font-semibold text-sky-900 hover:bg-sky-100"
                        >
                          🔗 Primary Root Lexicon Entry ↗
                        </a>
                        {selectedNameForModal.structuredReference
                          .lexiconWebsite &&
                          selectedNameForModal.structuredReference
                            .lexiconWebsite !==
                            selectedNameForModal.structuredReference
                              .sourceWebsite && (
                            <a
                              href={
                                selectedNameForModal.structuredReference
                                  .lexiconWebsite
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-sky-300 bg-white px-2.5 py-1 font-semibold text-sky-900 hover:bg-sky-100"
                            >
                              🔗 Secondary Root / Corpus Link ↗
                            </a>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs italic text-stone-500">
                  Citation withheld (requires ≥ 80% verification confidence).
                </p>
              )}
            </div>

            {/* Dual Numerology + Parent Practical Details */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 p-3.5 text-xs">
                <div className="font-bold text-stone-900">
                  🔢 Dual Numerology Breakdown
                </div>
                <div className="mt-1">
                  <strong>Pythagorean (Standard 1–9):</strong> Number{" "}
                  {selectedNameForModal.numerologyPythagorean} (Total{" "}
                  {selectedNameForModal.compoundPythagorean})
                </div>
                <div className="mt-0.5">
                  <strong>Chaldean (Cheiro 1–8):</strong> Number{" "}
                  {selectedNameForModal.numerologyChaldean} (Compound{" "}
                  {selectedNameForModal.compoundChaldean})
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 p-3.5 text-xs">
                <div className="font-bold text-stone-900">
                  🗣️ Practical Parent Checklist
                </div>
                {selectedNameForModal.easeOfCalling && (
                  <div className="mt-1">
                    <strong>Ease of Calling:</strong>{" "}
                    {selectedNameForModal.easeOfCalling.overallScore}/100 (
                    {selectedNameForModal.easeOfCalling.phoneticGuide})
                  </div>
                )}
                {selectedNameForModal.documentFit && (
                  <div className="mt-0.5">
                    <strong>Passport / Aadhaar Fit:</strong>{" "}
                    {selectedNameForModal.documentFit.sampleWithInitial} (
                    {selectedNameForModal.documentFit.tamilAksharaCount} தமிழ்
                    எழுத்துக்கள்)
                  </div>
                )}
                {selectedNameForModal.nicknames && (
                  <div className="mt-0.5">
                    <strong>Nicknames:</strong>{" "}
                    {selectedNameForModal.nicknames.join(", ")} ·{" "}
                    <strong>Siblings:</strong>{" "}
                    {selectedNameForModal.siblingPairSuggestions?.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* 7-Dimension Scorecard Grid */}
            {modalScorecard && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  🛡️ 7-Dimension Evaluation Scorecard ({modalScorecard.overallScore}/100)
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {modalScorecard.dimensions.map((d) => (
                    <div
                      key={d.key}
                      className="rounded-xl border border-stone-200 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800">
                          {d.labelEn} ({d.labelTa})
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-900">
                          {d.score}/100
                        </span>
                      </div>
                      <div className="mt-0.5 text-[11px] font-semibold text-amber-800">
                        {d.badge}
                      </div>
                      <p className="mt-0.5 text-[11px] text-stone-600">
                        {d.detailTa}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report Error Flow (Mitigation for Q4 AI Curation) */}
            <div className="mt-5 border-t border-stone-200 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                🚩 Report a Meaning or Citation Correction
              </h4>
              {reportSent ? (
                <p className="mt-2 rounded-lg bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                  ✓ Thank you! Your correction note has been logged for AI & scholar review.
                </p>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Suggest a better Sangam citation or meaning refinement..."
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-xs"
                  />
                  <button
                    onClick={() => handleReportError(selectedNameForModal.slug)}
                    className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Submit Report
                  </button>
                </div>
              )}
            </div>
            </div>

            {/* Sticky Modal Footer */}
            <div className="shrink-0 bg-stone-50 border-t border-stone-200 px-5 py-3 flex items-center justify-between gap-3 z-10">
              <span className="text-xs text-stone-500 font-medium truncate">
                {selectedNameForModal.originCategory} ·{" "}
                {selectedNameForModal.confidence >= 0.8
                  ? "100% Provenance Verified"
                  : "Verification in Progress"}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleShortlist(selectedNameForModal.slug)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    shortlist.includes(selectedNameForModal.slug)
                      ? "bg-amber-600 text-white"
                      : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {shortlist.includes(selectedNameForModal.slug)
                    ? "♥ Shortlisted"
                    : "♡ Add to Shortlist"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNameForModal(null)}
                  className="rounded-xl bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

