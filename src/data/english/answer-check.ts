/** Narrow, predictable answer checking for the fixed-source grammar exercises. */
const CONTRACTIONS: Readonly<Record<string, string>> = {
  "doesn't": 'does not', "don't": 'do not', "didn't": 'did not',
  "wasn't": 'was not', "weren't": 'were not', "isn't": 'is not',
  "aren't": 'are not', "hasn't": 'has not', "haven't": 'have not',
  "i'm": 'i am', "he's": 'he is', "she's": 'she is', "it's": 'it is',
  "we're": 'we are', "they're": 'they are', "i've": 'i have',
  "we've": 'we have', "i'd": 'i would', "we'd": 'we would',
};

export function normalizeAnswer(value: string): string {
  let result = value.normalize('NFKC').toLowerCase().replace(/[‘’]/g, "'").trim();
  result = result.replace(/\b(?:doesn't|don't|didn't|wasn't|weren't|isn't|aren't|hasn't|haven't|i'm|he's|she's|it's|we're|they're|i've|we've|i'd|we'd)\b/g, token => CONTRACTIONS[token] ?? token);
  return result.replace(/[.,?!:;“”"()]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function isCorrectAnswer(userAnswer: string, acceptedAnswers: readonly string[]): boolean {
  const answer = normalizeAnswer(userAnswer);
  return answer !== '' && acceptedAnswers.some(expected => normalizeAnswer(expected) === answer);
}
