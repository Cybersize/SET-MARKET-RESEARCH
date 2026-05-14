import { DEFAULT_SEARCH_STOPWORDS, DEFAULT_SEARCH_SYNONYMS } from './searchDictionary';

export { DEFAULT_SEARCH_STOPWORDS, DEFAULT_SEARCH_SYNONYMS } from './searchDictionary';

export type SmartSearchField<T> = {
  key: keyof T;
  weight?: number;
  allowPartial?: boolean;
  allowPrefix?: boolean;
  allowTypo?: boolean;
  minPartialLength?: number;
};

export type SmartSearchMatchedField<T> = {
  key: keyof T | '__tag';
  query: string;
  term: string;
  matchType: MatchType;
  score: number;
};

export type SmartSearchIntent = {
  id: string;
  terms: string[];
  boostTags: string[];
  boost?: number;
};

export type SmartSearchIntentMatch = {
  id: string;
  score: number;
  matchedTags: string[];
};

export type SmartSearchResult<T> = {
  item: T;
  score: number;
  matchedTerms: number;
  totalTerms: number;
  matchedFields: SmartSearchMatchedField<T>[];
  intentMatches?: SmartSearchIntentMatch[];
  debug?: SmartSearchDebug<T>;
};

export type SmartSearchOptions<T> = {
  fields: SmartSearchField<T>[];
  synonyms?: string[][];
  stopWords?: string[];
  ignoreStopWords?: boolean;
  getTags?: (item: T) => string[];
  intents?: SmartSearchIntent[];
  requireAllTerms?: boolean;
  typoTolerance?: boolean;
  minScore?: number;
  diversityKey?: (item: T) => string | undefined;
  diversityWindow?: number;
  maxPerDiversityKey?: number;
  debug?: boolean;
};

export type SmartSearchDebug<T> = {
  queryTerms: string[];
  removedStopWords: string[];
  matchedFields: SmartSearchMatchedField<T>[];
  intentMatches: SmartSearchIntentMatch[];
  scoreBeforeThreshold: number;
};

type MatchType = 'exact' | 'phrase' | 'token' | 'prefix' | 'partial' | 'typo' | 'synonym';

type SearchCandidate = {
  term: string;
  isSynonym: boolean;
  isDictionaryBacked: boolean;
};

type FieldRules = {
  allowPartial: boolean;
  allowPrefix: boolean;
  allowTypo: boolean;
  minPartialLength: number;
};

type PreparedField<T> = {
  key: keyof T | '__tag';
  value: string;
  tokens: Set<string>;
  weight: number;
  rules: FieldRules;
};

type QueryUnit = {
  raw: string;
  candidates: SearchCandidate[];
};

type QueryParts = {
  include: string[];
  exclude: string[];
  removedStopWords: string[];
};

type RankedSearchResult<T> = SmartSearchResult<T> & {
  index: number;
  intentMatches: SmartSearchIntentMatch[];
  debug: SmartSearchDebug<T> | undefined;
};

const SEPARATOR_PATTERN = /[\s,;|/\\()[\]{}"'`~!@#$%^&*_+=<>?:.]+/g;
const QUERY_PART_PATTERN = /"([^"]+)"|'([^']+)'|[^\s,;|/\\()[\]{}"'`~!@#$%^&*_+=<>?:.]+/g;
const THAI_PATTERN = /[\u0E00-\u0E7F]/;
const LATIN_PATTERN = /^[a-z]+$/;
const TYPO_MAX_TOKEN_COUNT = 80;
const DEFAULT_MIN_SCORE = 950;
const DEFAULT_INTENT_BOOST = 1800;
const DEFAULT_DIVERSITY_WINDOW = 60;
const DEFAULT_MAX_PER_DIVERSITY_KEY = 12;

const thaiSegmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new (Intl as typeof Intl & {
        Segmenter: new (locale: string, options: { granularity: 'word' }) => {
          segment: (input: string) => Iterable<{ segment: string; isWordLike?: boolean }>;
        };
      }).Segmenter('th', { granularity: 'word' })
    : null;

function normalizeSearchText(value: unknown): string {
  return String(value ?? '')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(SEPARATOR_PATTERN, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function getEnglishStem(term: string): string {
  if (!LATIN_PATTERN.test(term) || term.length < 4) return term;
  if (term.endsWith('ies')) return `${term.slice(0, -3)}y`;
  if (term.endsWith('sses')) return term.slice(0, -2);
  if (term.endsWith('ses') || term.endsWith('xes') || term.endsWith('zes') || term.endsWith('ches') || term.endsWith('shes')) {
    return term.slice(0, -2);
  }
  if (term.endsWith('s') && !term.endsWith('ss')) return term.slice(0, -1);
  return term;
}

function tokenize(value: unknown): string[] {
  const normalized = normalizeSearchText(value);
  if (!normalized) return [];

  const tokens = normalized.split(' ');
  if (!THAI_PATTERN.test(normalized) || !thaiSegmenter) return uniqueTerms(tokens);

  const segmentedTokens = Array.from(thaiSegmenter.segment(normalized))
    .filter(part => part.isWordLike !== false)
    .map(part => normalizeSearchText(part.segment))
    .filter(Boolean);

  return uniqueTerms([...tokens, ...segmentedTokens]);
}

function uniqueTerms(terms: string[]): string[] {
  return Array.from(new Set(terms.map(normalizeSearchText).filter(Boolean)));
}

function getPhraseAcronym(term: string): string | null {
  const words = normalizeSearchText(term).split(' ').filter(Boolean);
  if (words.length < 2 || words.some(word => !LATIN_PATTERN.test(word))) return null;
  const acronym = words.map(word => word[0]).join('');
  return acronym.length >= 2 ? acronym : null;
}

function getCompactLength(term: string): number {
  return term.replace(/\s+/g, '').length;
}

function isShortThaiTerm(term: string): boolean {
  return THAI_PATTERN.test(term) && !term.includes(' ') && getCompactLength(term) <= 3;
}

function isShortLatinTerm(term: string): boolean {
  return LATIN_PATTERN.test(term) && term.length <= 2;
}

function shouldAllowSubstringPartial(term: string): boolean {
  return !isShortThaiTerm(term) && !isShortLatinTerm(term);
}

function getTokenPrefixScore<T>(field: PreparedField<T>, candidate: SearchCandidate): number {
  if (!field.rules.allowPrefix) return 0;
  if (candidate.term.includes(' ')) return 0;
  if (isShortThaiTerm(candidate.term) && !candidate.isDictionaryBacked) return 0;

  const minPrefixLength = field.key === 'symbol'
    ? 1
    : THAI_PATTERN.test(candidate.term) ? 2 : 3;
  if (getCompactLength(candidate.term) < minPrefixLength) return 0;

  for (const token of field.tokens) {
    if (token !== candidate.term && token.startsWith(candidate.term)) {
      return (candidate.isSynonym ? 70 : 230) * field.weight;
    }
  }

  return 0;
}

function withStem(term: string): string[] {
  const normalized = normalizeSearchText(term);
  const stem = getEnglishStem(normalized);
  return stem === normalized ? [normalized] : [normalized, stem];
}

function withSearchVariants(term: string): string[] {
  const acronym = getPhraseAcronym(term);
  return uniqueTerms([...withStem(term), ...(acronym ? withStem(acronym) : [])]);
}

function buildSynonymLookup(synonymGroups: string[][]): Map<string, string[]> {
  const lookup = new Map<string, string[]>();

  for (const group of synonymGroups) {
    const normalizedGroup = uniqueTerms(group.flatMap(withSearchVariants));

    for (const term of normalizedGroup) {
      lookup.set(term, normalizedGroup.filter(candidate => candidate !== term));
    }
  }

  return lookup;
}

const DEFAULT_SYNONYM_LOOKUP = buildSynonymLookup(DEFAULT_SEARCH_SYNONYMS);

function expandQueryTerm(term: string, synonymLookup: Map<string, string[]>): SearchCandidate[] {
  const directTerms = uniqueTerms(withStem(term));
  const synonymTerms = uniqueTerms(directTerms.flatMap(directTerm => synonymLookup.get(directTerm) ?? []));
  const isDictionaryBacked = synonymTerms.length > 0;

  return [
    ...directTerms.map(directTerm => ({ term: directTerm, isSynonym: false, isDictionaryBacked })),
    ...synonymTerms
      .filter(synonymTerm => !directTerms.includes(synonymTerm))
      .map(synonymTerm => ({ term: synonymTerm, isSynonym: true, isDictionaryBacked: true })),
  ];
}

function parseQueryParts(query: string, stopWords: Set<string>): QueryParts {
  const include: string[] = [];
  const exclude: string[] = [];
  const removedStopWords: string[] = [];
  const matches = query.matchAll(QUERY_PART_PATTERN);

  for (const match of matches) {
    const rawPart = match[1] ?? match[2] ?? match[0];
    const isExclude = rawPart.startsWith('-') || rawPart.startsWith('!');
    const normalized = normalizeSearchText(isExclude ? rawPart.slice(1) : rawPart);
    if (!normalized) continue;

    if (!isExclude && stopWords.has(normalized)) {
      removedStopWords.push(normalized);
      continue;
    }

    (isExclude ? exclude : include).push(normalized);
  }

  return {
    include: uniqueTerms(include),
    exclude: uniqueTerms(exclude),
    removedStopWords: uniqueTerms(removedStopWords),
  };
}

function buildPhraseTerms(parts: string[], synonymLookup: Map<string, string[]>): string[] {
  const phraseTerms: string[] = [];

  for (let size = 2; size <= Math.min(4, parts.length); size += 1) {
    for (let start = 0; start <= parts.length - size; start += 1) {
      const phrase = parts.slice(start, start + size).join(' ');
      if (synonymLookup.has(phrase)) phraseTerms.push(phrase);
    }
  }

  const fullPhrase = parts.join(' ');
  if (fullPhrase && synonymLookup.has(fullPhrase)) phraseTerms.push(fullPhrase);

  return uniqueTerms(phraseTerms);
}

function buildQueryUnits(
  query: string,
  synonymLookup: Map<string, string[]>,
  stopWords: Set<string>,
): { include: QueryUnit[]; exclude: QueryUnit[]; removedStopWords: string[] } {
  const parts = parseQueryParts(query, stopWords);
  const includeTerms = uniqueTerms([...parts.include, ...buildPhraseTerms(parts.include, synonymLookup)]);

  return {
    include: includeTerms.map(term => ({ raw: term, candidates: expandQueryTerm(term, synonymLookup) })),
    exclude: parts.exclude.map(term => ({ raw: term, candidates: expandQueryTerm(term, synonymLookup) })),
    removedStopWords: parts.removedStopWords,
  };
}

function resolveFieldRules<T>(field: SmartSearchField<T>): FieldRules {
  const key = String(field.key).toLocaleLowerCase();

  const defaults: FieldRules = {
    allowPartial: !['symbol', 'market', 'sector'].includes(key),
    allowPrefix: true,
    allowTypo: ['symbol', 'symbol_name'].includes(key),
    minPartialLength: THAI_PATTERN.test(key) ? 4 : 3,
  };

  if (key === 'description') {
    defaults.allowTypo = false;
    defaults.minPartialLength = 4;
  }

  if (key === 'symbol') {
    defaults.allowPartial = false;
    defaults.minPartialLength = 2;
  }

  return {
    allowPartial: field.allowPartial ?? defaults.allowPartial,
    allowPrefix: field.allowPrefix ?? defaults.allowPrefix,
    allowTypo: field.allowTypo ?? defaults.allowTypo,
    minPartialLength: field.minPartialLength ?? defaults.minPartialLength,
  };
}

function prepareFields<T>(item: T, options: SmartSearchOptions<T>): PreparedField<T>[] {
  const weightedFields = options.fields.map(field => {
    const value = normalizeSearchText(item[field.key]);
    return {
      key: field.key,
      value,
      tokens: new Set(tokenize(value)),
      weight: field.weight ?? 1,
      rules: resolveFieldRules(field),
    };
  });

  const tagValue = normalizeSearchText(options.getTags?.(item).join(' ') ?? '');
  const tagField: PreparedField<T>[] = tagValue
    ? [{
        key: '__tag',
        value: tagValue,
        tokens: new Set(tokenize(tagValue)),
        weight: 3,
        rules: {
          allowPartial: false,
          allowPrefix: true,
          allowTypo: false,
          minPartialLength: 4,
        },
      }]
    : [];

  return [...weightedFields, ...tagField].filter(field => field.value);
}

function getEditDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function getTypoScore(field: PreparedField<unknown>, candidate: SearchCandidate, typoTolerance: boolean): number {
  if (!typoTolerance || !field.rules.allowTypo || candidate.isSynonym || candidate.term.length < 4 || !LATIN_PATTERN.test(candidate.term)) return 0;
  if (field.tokens.size > TYPO_MAX_TOKEN_COUNT) return 0;

  for (const token of field.tokens) {
    if (token.length < 4 || !LATIN_PATTERN.test(token)) continue;
    const distance = getEditDistance(candidate.term, token);
    if (distance === 1) return 95 * field.weight;
    if (candidate.term.length >= 7 && distance === 2) return 70 * field.weight;
  }

  return 0;
}

function scorePreparedField<T>(
  field: PreparedField<T>,
  candidate: SearchCandidate,
  typoTolerance: boolean,
): { score: number; matchType: MatchType } {
  const exactScore = candidate.isSynonym ? 100 : 420;
  const phraseScore = candidate.isSynonym ? 90 : 340;
  const tokenScore = candidate.isSynonym ? 80 : 280;
  const partialScore = candidate.isSynonym ? 60 : 180;

  if (field.value === candidate.term) return { score: exactScore * field.weight, matchType: candidate.isSynonym ? 'synonym' : 'exact' };
  if (candidate.term.includes(' ') && field.value.includes(candidate.term)) {
    return { score: phraseScore * field.weight, matchType: candidate.isSynonym ? 'synonym' : 'phrase' };
  }
  if (field.tokens.has(candidate.term)) return { score: tokenScore * field.weight, matchType: candidate.isSynonym ? 'synonym' : 'token' };

  const prefixScore = getTokenPrefixScore(field, candidate);
  if (prefixScore) return { score: prefixScore, matchType: candidate.isSynonym ? 'synonym' : 'prefix' };

  if (
    field.rules.allowPartial
    && getCompactLength(candidate.term) >= field.rules.minPartialLength
    && shouldAllowSubstringPartial(candidate.term)
    && field.value.includes(candidate.term)
  ) {
    return { score: partialScore * field.weight, matchType: candidate.isSynonym ? 'synonym' : 'partial' };
  }

  const typoScore = getTypoScore(field as PreparedField<unknown>, candidate, typoTolerance);
  if (typoScore) return { score: typoScore, matchType: 'typo' };

  return { score: 0, matchType: 'partial' };
}

function bestMatchForUnit<T>(
  fields: PreparedField<T>[],
  unit: QueryUnit,
  typoTolerance: boolean,
): SmartSearchMatchedField<T> | null {
  let bestMatch: SmartSearchMatchedField<T> | null = null;

  for (const candidate of unit.candidates) {
    for (const field of fields) {
      const result = scorePreparedField(field, candidate, typoTolerance);
      if (!bestMatch || result.score > bestMatch.score) {
        bestMatch = {
          key: field.key,
          query: unit.raw,
          term: candidate.term,
          matchType: result.matchType,
          score: result.score,
        };
      }
    }
  }

  return bestMatch && bestMatch.score > 0 ? bestMatch : null;
}

function getActiveIntents(queryUnits: QueryUnit[], intents: SmartSearchIntent[] = []): SmartSearchIntent[] {
  if (intents.length === 0) return [];

  const queryTerms = new Set(queryUnits.flatMap(unit => [unit.raw, ...unit.candidates.map(candidate => candidate.term)]));
  return intents.filter(intent => uniqueTerms(intent.terms).some(term => queryTerms.has(term)));
}

function getIntentMatches<T>(fields: PreparedField<T>[], activeIntents: SmartSearchIntent[]): SmartSearchIntentMatch[] {
  const tagField = fields.find(field => field.key === '__tag');
  if (!tagField || activeIntents.length === 0) return [];

  return activeIntents
    .map(intent => {
      const matchedTags = uniqueTerms(intent.boostTags).filter(tag => (
        tagField.tokens.has(tag)
        || (tag.includes(' ') && tagField.value.includes(tag))
      ));

      return matchedTags.length > 0
        ? { id: intent.id, score: intent.boost ?? DEFAULT_INTENT_BOOST, matchedTags }
        : null;
    })
    .filter((match): match is SmartSearchIntentMatch => Boolean(match));
}

function diversifyResults<T>(
  results: RankedSearchResult<T>[],
  options: SmartSearchOptions<T>,
): RankedSearchResult<T>[] {
  if (!options.diversityKey) return results;

  const windowSize = options.diversityWindow ?? DEFAULT_DIVERSITY_WINDOW;
  const maxPerKey = options.maxPerDiversityKey ?? DEFAULT_MAX_PER_DIVERSITY_KEY;
  const topWindow = results.slice(0, windowSize);
  const rest = results.slice(windowSize);
  const counts = new Map<string, number>();
  const selected: RankedSearchResult<T>[] = [];
  const overflow: RankedSearchResult<T>[] = [];

  for (const result of topWindow) {
    const key = options.diversityKey(result.item) ?? '';
    const count = counts.get(key) ?? 0;
    if (!key || count < maxPerKey) {
      selected.push(result);
      counts.set(key, count + 1);
    } else {
      overflow.push(result);
    }
  }

  return [...selected, ...overflow, ...rest];
}

export function smartSearchWithMetadata<T>(items: T[], query: string, options: SmartSearchOptions<T>): SmartSearchResult<T>[] {
  const synonymLookup = options.synonyms
    ? buildSynonymLookup([...DEFAULT_SEARCH_SYNONYMS, ...options.synonyms])
    : DEFAULT_SYNONYM_LOOKUP;
  const stopWords = options.ignoreStopWords === false
    ? new Set<string>()
    : new Set(uniqueTerms([...(options.stopWords ?? []), ...DEFAULT_SEARCH_STOPWORDS]));
  const queryUnits = buildQueryUnits(query, synonymLookup, stopWords);
  if (queryUnits.include.length === 0) {
    return query.trim()
      ? []
      : items.map(item => ({ item, score: 0, matchedTerms: 0, totalTerms: 0, matchedFields: [] }));
  }

  const requireAllTerms = options.requireAllTerms ?? false;
  const typoTolerance = options.typoTolerance ?? true;
  const minScore = options.minScore ?? DEFAULT_MIN_SCORE;
  const activeIntents = getActiveIntents(queryUnits.include, options.intents);

  const results = items
    .map((item, index) => {
      const fields = prepareFields(item, options);
      const excluded = queryUnits.exclude.some(unit => bestMatchForUnit(fields, unit, false));
      if (excluded) return null;

      const matchedFields = queryUnits.include
        .map(unit => bestMatchForUnit(fields, unit, typoTolerance))
        .filter((match): match is SmartSearchMatchedField<T> => Boolean(match));

      const matchedTerms = matchedFields.length;
      if (matchedTerms === 0 || (requireAllTerms && matchedTerms < queryUnits.include.length)) return null;

      const intentMatches = getIntentMatches(fields, activeIntents);
      const intentBoost = intentMatches.reduce((sum, match) => sum + match.score, 0);
      const hasOnlyWeakMatches = matchedFields.every(match => match.matchType === 'partial' || match.matchType === 'typo');
      const allTermsBonus = matchedTerms === queryUnits.include.length && !hasOnlyWeakMatches ? 1500 : 0;
      const phraseBonus = matchedFields.filter(match => match.matchType === 'phrase').length * 350;
      const exactBonus = matchedFields.filter(match => match.matchType === 'exact').length * 500;
      const weakMatchPenalty = hasOnlyWeakMatches ? 450 : 0;
      const score = matchedFields.reduce((sum, match) => sum + match.score, 0)
        + matchedTerms * 1200
        + allTermsBonus
        + phraseBonus
        + exactBonus
        + intentBoost
        - weakMatchPenalty;

      if (score < minScore) return null;

      return {
        item,
        index,
        score,
        matchedTerms,
        totalTerms: queryUnits.include.length,
        matchedFields,
        intentMatches,
        debug: options.debug ? {
          queryTerms: queryUnits.include.map(unit => unit.raw),
          removedStopWords: queryUnits.removedStopWords,
          matchedFields,
          intentMatches,
          scoreBeforeThreshold: score,
        } : undefined,
      };
    })
    .filter((result): result is RankedSearchResult<T> => Boolean(result))
    .sort((a, b) => (
      b.matchedTerms - a.matchedTerms
      || b.score - a.score
      || a.index - b.index
    ));

  return diversifyResults(results, options)
    .map(({ index: _index, ...result }) => result);
}

export function smartSearch<T>(items: T[], query: string, options: SmartSearchOptions<T>): T[] {
  return smartSearchWithMetadata(items, query, options).map(result => result.item);
}
