declare module "wink-sentiment" {
  interface WinkSentimentResult {
    score: number;
    normalizedScore: number;
    tokenizedPhrase: Array<{
      value: string;
      tag: string;
      normal?: string;
      pos?: string;
      lemma?: string;
      negation?: boolean;
    }>;
  }

  function winkSentiment(text: string): WinkSentimentResult;
  export = winkSentiment;
}
