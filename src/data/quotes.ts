import type { QuoteItem, QuoteLength } from '../types/typing';

export const QUOTES: readonly QuoteItem[] = [
  {
    id: 'q-s-1',
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
    length: 'short',
  },
  {
    id: 'q-s-2',
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    length: 'short',
  },
  {
    id: 'q-s-3',
    text: 'Focus is a matter of deciding what things you are not going to do.',
    author: 'John Carmack',
    length: 'short',
  },
  {
    id: 'q-s-4',
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
    length: 'short',
  },
  {
    id: 'q-s-5',
    text: 'Well done is better than well said.',
    author: 'Benjamin Franklin',
    length: 'short',
  },
  {
    id: 'q-s-6',
    text: 'Stay hungry, stay foolish.',
    author: 'Steve Jobs',
    length: 'short',
  },
  {
    id: 'q-s-7',
    text: 'What we know is a drop, what we do not know is an ocean.',
    author: 'Isaac Newton',
    length: 'short',
  },
  {
    id: 'q-s-8',
    text: 'Action is the foundational key to all success.',
    author: 'Pablo Picasso',
    length: 'short',
  },

  {
    id: 'q-m-1',
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
    length: 'medium',
  },
  {
    id: 'q-m-2',
    text: 'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.',
    author: 'Antoine de Saint-Exupery',
    length: 'medium',
  },
  {
    id: 'q-m-3',
    text: 'It does not matter how slowly you go as long as you do not stop. Consistency turns small efforts into meaningful progress.',
    author: 'Confucius',
    length: 'medium',
  },
  {
    id: 'q-m-4',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts in the long run.',
    author: 'Winston Churchill',
    length: 'medium',
  },
  {
    id: 'q-m-5',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit formed through daily attention.',
    author: 'Will Durant',
    length: 'medium',
  },
  {
    id: 'q-m-6',
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
    length: 'medium',
  },
  {
    id: 'q-m-7',
    text: 'The secret of getting ahead is getting started. Break complex overwhelming tasks into small manageable steps and start on the first one.',
    author: 'Mark Twain',
    length: 'medium',
  },

  {
    id: 'q-l-1',
    text: 'Twenty years from now you will be more disappointed by the things that you did not do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.',
    author: 'H. Jackson Brown Jr.',
    length: 'long',
  },
  {
    id: 'q-l-2',
    text: 'The real voyage of discovery consists not in seeking new landscapes, but in having new eyes. Every quiet moment of deliberate practice sharpens our attention and reveals nuances that rushed effort overlooks.',
    author: 'Marcel Proust',
    length: 'long',
  },
  {
    id: 'q-l-3',
    text: 'Controlling complexity is the essence of computer programming. When we strip away unnecessary noise and focus purely on the essential structure of a task, clarity emerges naturally and every line serves a clear purpose.',
    author: 'Brian Kernighan',
    length: 'long',
  },
  {
    id: 'q-l-4',
    text: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. Mastery of any craft comes from patience, steady rhythm, and returning calmly to the fundamentals whenever your attention wanders.',
    author: 'Buddha',
    length: 'long',
  },
  {
    id: 'q-l-5',
    text: 'Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.',
    author: 'Dieter Rams',
    length: 'long',
  },
];

export function getRandomQuote(length: QuoteLength, excludeId?: string): QuoteItem {
  const matching = QUOTES.filter((q) => q.length === length);
  const candidates = matching.length > 1 && excludeId
    ? matching.filter((q) => q.id !== excludeId)
    : matching;
  const pool = candidates.length > 0 ? candidates : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}

