import type { Difficulty } from '../types/typing';

const EASY_WORDS: readonly string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'make', 'can', 'like', 'time', 'no',
  'just', 'him', 'know', 'take', 'into', 'year', 'your', 'good', 'some', 'see',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'also', 'back',
  'use', 'two', 'how', 'our', 'work', 'well', 'way', 'even', 'new', 'want',
  'any', 'give', 'day', 'most', 'us', 'need', 'own', 'live', 'call', 'life',
  'turn', 'word', 'each', 'hand', 'line', 'went', 'off', 'play', 'read', 'move',
  'page', 'home', 'long', 'air', 'away', 'near', 'add', 'food', 'keep', 'eye',
  'last', 'door', 'city', 'tree', 'hard', 'saw', 'far', 'sea', 'draw', 'left',
  'late', 'run', 'open', 'seem', 'next', 'got', 'walk', 'ease', 'both', 'mark',
  'mile', 'car', 'feet', 'care', 'book', 'took', 'eat', 'room', 'idea', 'fish',
  'stop', 'once', 'base', 'hear', 'cut', 'sure', 'face', 'wood', 'main', 'girl',
  'ever', 'red', 'list', 'feel', 'talk', 'bird', 'soon', 'body', 'dog', 'pose',
  'song', 'wind', 'ship', 'area', 'half', 'rock', 'fire', 'told', 'knew', 'pass',
  'top', 'king', 'fast', 'slow', 'calm', 'cool', 'warm', 'soft', 'dark', 'blue',
  'gold', 'rain', 'snow', 'star', 'moon', 'sun', 'road', 'path', 'hill', 'lake',
];

const NORMAL_WORDS: readonly string[] = [
  ...EASY_WORDS,
  'would', 'there', 'their', 'what', 'about', 'which', 'when', 'people', 'could', 'other',
  'think', 'after', 'first', 'because', 'these', 'great', 'between', 'large', 'under', 'might',
  'still', 'found', 'small', 'number', 'always', 'water', 'place', 'where', 'little', 'world',
  'system', 'problem', 'never', 'again', 'right', 'write', 'state', 'point', 'change', 'light',
  'house', 'spell', 'animal', 'letter', 'mother', 'answer', 'study', 'learn', 'should', 'every',
  'cross', 'since', 'start', 'story', 'while', 'press', 'close', 'night', 'north', 'together',
  'white', 'children', 'begin', 'example', 'paper', 'group', 'music', 'those', 'often', 'until',
  'river', 'second', 'carry', 'science', 'friend', 'began', 'mountain', 'horse', 'watch', 'color',
  'enough', 'plain', 'usual', 'young', 'ready', 'above', 'though', 'family', 'direct', 'leave',
  'measure', 'product', 'black', 'short', 'numeral', 'class', 'question', 'happen', 'complete',
  'order', 'south', 'piece', 'whole', 'space', 'morning', 'practice', 'focus', 'natural', 'simple',
  'clean', 'quiet', 'modern', 'balance', 'energy', 'design', 'rhythm', 'speed', 'steady', 'smooth',
  'clear', 'screen', 'memory', 'signal', 'effort', 'center', 'future', 'method', 'reason', 'growth',
];

const ADVANCED_WORDS: readonly string[] = [
  'algorithm', 'architecture', 'articulate', 'authentic', 'background', 'benchmark',
  'chronology', 'collection', 'comfortable', 'comparison', 'completely', 'complexity',
  'composition', 'comprehensive', 'concentrate', 'configuration', 'connection', 'consecutive',
  'consequence', 'consistency', 'construction', 'continuous', 'contribution', 'coordination',
  'curiosity', 'declaration', 'definition', 'deliverable', 'demonstrate', 'dependable',
  'description', 'determination', 'development', 'difference', 'discipline', 'distraction',
  'distribution', 'efficiency', 'elaborate', 'elementary', 'encouragement', 'environment',
  'equilibrium', 'especially', 'essential', 'evaluation', 'eventually', 'everything',
  'evolution', 'examination', 'excellence', 'exception', 'experience', 'experiment',
  'explanation', 'expression', 'extraordinary', 'flexibility', 'foundation', 'framework',
  'frequently', 'fundamental', 'generation', 'guideline', 'harmony', 'highlight',
  'hypothesis', 'identify', 'imagination', 'immediate', 'implement', 'importance',
  'improvement', 'independent', 'indication', 'individual', 'information', 'innovation',
  'inspiration', 'instrument', 'integration', 'intellectual', 'intelligence', 'interaction',
  'interface', 'intermediate', 'interpretation', 'introduction', 'investment', 'keyboard',
  'knowledge', 'landscape', 'leadership', 'limitation', 'literature', 'maintenance',
  'management', 'measurement', 'mechanics', 'meditation', 'membership', 'methodology',
  'minimalist', 'modernization', 'modification', 'motivation', 'navigation', 'necessary',
  'negotiation', 'network', 'observation', 'occasionally', 'operation', 'opportunity',
  'optimization', 'organization', 'orientation', 'particular', 'performance', 'persistent',
  'perspective', 'phenomenon', 'philosophy', 'photograph', 'platform', 'possibility',
  'potential', 'practical', 'precision', 'preference', 'preparation', 'presentation',
  'principle', 'probability', 'procedure', 'processing', 'production', 'profession',
  'progression', 'proportion', 'protection', 'psychology', 'publication', 'punctuation',
  'purposeful', 'qualification', 'reasonable', 'recognition', 'recommendation', 'reflection',
  'relationship', 'reliability', 'repetition', 'replacement', 'representation', 'requirement',
  'resolution', 'responsibility', 'responsive', 'restaurant', 'satisfaction', 'scientific',
  'selection', 'separation', 'sequence', 'significant', 'simplicity', 'simulation',
  'situation', 'software', 'solution', 'sophisticated', 'specification', 'stability',
  'standard', 'statement', 'statistics', 'strategy', 'structure', 'substantial',
  'suggestion', 'sustainability', 'synchronization', 'systematic', 'technique', 'technology',
  'temperature', 'terminology', 'theoretical', 'tolerance', 'traditional', 'transaction',
  'transformation', 'transition', 'transparent', 'typography', 'understand', 'university',
  'validation', 'variable', 'variation', 'vocabulary', 'wavelength', 'workspace',
];

const WORD_BANKS: Record<Difficulty, readonly string[]> = {
  easy: EASY_WORDS,
  normal: NORMAL_WORDS,
  advanced: ADVANCED_WORDS,
};

interface GenerateTextOptions {
  wordCount: number;
  difficulty: Difficulty;
  punctuation: boolean;
  numbers: boolean;
}

const END_PUNCTUATION = ['.', '.', '.', '!', '?'] as const;
const MID_PUNCTUATION = [',', ',', ',', ';', ':'] as const;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumberToken(): string {
  const roll = Math.random();
  if (roll < 0.4) return String(randomInt(1, 99));
  if (roll < 0.8) return String(randomInt(100, 999));
  return String(randomInt(1980, 2026));
}

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function generatePracticeText({
  wordCount,
  difficulty,
  punctuation,
  numbers,
}: GenerateTextOptions): string {
  const bank = WORD_BANKS[difficulty] ?? NORMAL_WORDS;
  const bankLen = bank.length;
  const tokens: string[] = [];

  let previousWord = '';
  let capitalizeNext = punctuation;
  let wordsSinceSentenceStart = 0;

  for (let i = 0; i < wordCount; i++) {
    const isLastWord = i === wordCount - 1;

    if (numbers && i > 0 && Math.random() < 0.12) {
      let numToken = generateRandomNumberToken();
      if (punctuation && isLastWord) {
        numToken += '.';
      }
      tokens.push(numToken);
      previousWord = '';
      wordsSinceSentenceStart++;
      capitalizeNext = false;
      continue;
    }

    let word = bank[Math.floor(Math.random() * bankLen)];
    while (word === previousWord) {
      word = bank[Math.floor(Math.random() * bankLen)];
    }
    previousWord = word;

    if (punctuation) {
      if (capitalizeNext) {
        word = capitalize(word);
        capitalizeNext = false;
      }

      wordsSinceSentenceStart++;

      if (isLastWord) {
        const endMark = END_PUNCTUATION[Math.floor(Math.random() * END_PUNCTUATION.length)];
        word += endMark;
      } else if (wordsSinceSentenceStart >= 5 && Math.random() < 0.25) {
        const endMark = END_PUNCTUATION[Math.floor(Math.random() * END_PUNCTUATION.length)];
        word += endMark;
        capitalizeNext = true;
        wordsSinceSentenceStart = 0;
      } else if (wordsSinceSentenceStart >= 3 && Math.random() < 0.18) {
        const midMark = MID_PUNCTUATION[Math.floor(Math.random() * MID_PUNCTUATION.length)];
        word += midMark;
      } else if (Math.random() < 0.05 && word.length > 3) {
        word = `"${word}"`;
      }
    }

    tokens.push(word);
  }

  return tokens.join(' ');
}
