/* ============================================================
   HINA'S BIRTHDAY WEBSITE: ALL YOUR PERSONAL CONTENT
   Edit this file only. You never need to touch the code.
   Rules: keep every text inside quotes, keep the commas,
   and after editing, raise the number V in sw.js (v3 -> v4).
   Everything below is sample text. Replace it with your own.
   ============================================================ */
window.HINA = {

  /* ---------- Basics ---------- */
  sender: 'Arif',                 // your name, used in chat and quiz
  dob: [2000, 12, 12],            // her birthday: year, month, day (used for "Hina by numbers")

  /* ---------- Your photos (optional) ----------
     Put the files in resources/photos/ and list them here (6 or more is best).
     Leave this list empty to keep the 6 built-in photos.
     Example: { file: 'one.jpg', caption: 'Our first trip', date: 'June 2024' } */
  photos: [],

  /* ---------- Love letter (the envelope on the home screen) ---------- */
  letter: "Dear Hina,\n\nOn your special day I want you to know how lucky I am to have a friend like you. You bring warmth, laughter and light to everyone around you.\n\nMay this year be as beautiful as your heart.\n\nHappy Birthday! 💖",

  /* ---------- Secret question lock (optional) ----------
     Leave question empty ('') to turn it off. Answers ignore capital letters and spaces. */
  secret: { question: '', answers: [], hint: 'Not quite, think about our first chat.' },

  /* ---------- Lyrics for song.mp3: put them in resources/lyrics.lrc (see lyrics.example.lrc) ---------- */
  lyrics: '',

  /* ---------- Open When letters: [emoji, title, message, optional voice file] ---------- */
  openWhen: [
    ['😔', 'Open when you feel sad',
      'Heavy days pass. You are much stronger than you think, and you are not alone. Take a deep breath, drink some water, and remember that I am right here. 💖'],
    ['🥺', 'Open when you miss me',
      'Distance never makes a real friendship smaller. Close your eyes and think of our happiest memory. I am missing you too, and we have plenty more to make. 🤗'],
    ['😄', 'Open when you need a smile',
      'Remember the last time we laughed until we cried? Hold on to that feeling. Your smile is the best update on any day. 😄'],
    ['😤', 'Open when you are angry',
      'Count to ten first. If you are still upset, eat something sweet and tell me about it. I am here to listen, not to argue. 😌'],
    ['🌙', 'Open when you cannot sleep',
      'Put the phone down and dim the lights. Whatever today was, tomorrow is a fresh page. You handled a lot today. Now rest. Good night, Hina. 🌙'],
    ['🎂', 'Open on your birthday morning',
      'Good morning, birthday girl! Today belongs completely to you. Do what you love, laugh a lot, and spoil yourself a little. Happy Birthday! 🎉']
  ],

  /* ---------- 26 Reasons (exactly 26) ---------- */
  reasons: [
    'Your laugh can fix almost any bad mood.',
    'You really listen when someone talks.',
    'You keep going even when things are hard.',
    'Your honesty is rare and precious.',
    'You remember the little things.',
    'Silence with you feels comfortable.',
    'You never make anyone feel small.',
    'Your kindness is real, not for show.',
    'When you are excited, everyone around you is too.',
    'Talking to you makes any day better.',
    'You know the right thing to say at the right time.',
    'Your simplicity is beautiful.',
    'You are always there for your friends.',
    'You admit your mistakes, and that takes courage.',
    'Hard tasks feel lighter when you are around.',
    'You joke around without hurting anyone.',
    'Your eyes show how honest you are.',
    'You are not afraid of hard work.',
    'You find the good in people.',
    'You have great taste and style.',
    'You speak kindly even when you are upset.',
    'You take your dreams seriously.',
    'You stand by people in their worst times.',
    'Your prayers carry a lot of heart.',
    'You are wonderful exactly as you are.',
    'Because you are Hina Naqvi, and there is no better reason. 💖'
  ],
  reasonsFinale: 'These are only 26 reasons, and the real list is much longer. Happy 26th Birthday, Hina! 💖',

  /* ---------- Photo Reveal game: p = photo number (0 to 5), o = options, a = correct option (starts at 0) ---------- */
  reveal: [
    { p: 0, q: 'What is the mood of this photo?', o: ['😄 Happy', '😎 Cool', '🥰 Lovely', 'All of them! 😍'], a: 3, cap: 'Lovely, as always. ✨' },
    { p: 1, q: 'How would you rate this smile?', o: ['8/10', '9/10', '10/10', '100/10'], a: 3, cap: 'The rating machine broke. 😄' },
    { p: 2, q: 'What should we call this look?', o: ['Princess mode', 'Boss mode', 'Birthday mode', 'Everything'], a: 3, cap: 'Perfect in every mode. 💖' },
    { p: 3, q: 'What was the vibe here?', o: ['Fun', 'Calm', 'Joy', 'All three'], a: 3, cap: 'This is the real Hina. 🌸' },
    { p: 4, q: 'The best part of this photo?', o: ['The smile', 'The style', 'The vibe', 'Everything'], a: 3, cap: 'No filter needed. ✨' },
    { p: 5, q: 'Last one: who is the star of the day?', o: ['The cake', 'The gifts', 'Hina Naqvi', 'The candles'], a: 2, cap: 'Happy 26th, Hina! 🎂' }
  ],

  /* ---------- Catch game (change the item to something only you two understand) ---------- */
  catchGame: {
    item: '🍰', title: 'Catch the cake', secs: 20, goal: 12,
    win: 'You caught them all. Cake queen! 🎂👑',
    lose: 'So close! Want to try once more? 😄'
  },

  /* ---------- Scratch coupons: [emoji, title, small note] ---------- */
  coupons: [
    ['🍰', 'One treat on me', 'Any time, anywhere'],
    ['🎬', 'One movie night', 'You pick the film, I bring the popcorn'],
    ['☕', 'One chai date', 'No rushing, just talking'],
    ['🎧', 'Your choice of song', 'Whatever you ask for, I will play']
  ],

  /* ---------- Quiz: how well do you know Arif? (a = index of the right option, starts at 0) ---------- */
  arifQuiz: [
    { q: 'What is my favourite food?', o: ['Biryani', 'Pizza', 'Burgers', 'Pasta'], a: 0 },
    { q: 'What do I do when I am nervous?', o: ['Talk faster', 'Go quiet', 'Crack jokes', 'Walk around'], a: 2 },
    { q: 'Which drink would I choose?', o: ['Chai', 'Coffee', 'Cold drink', 'Juice'], a: 0 },
    { q: 'What is my dream holiday?', o: ['Mountains', 'Beach', 'A big city', 'Desert'], a: 0 },
    { q: 'What would I save first in an emergency?', o: ['Phone', 'Wallet', 'Photos', 'Laptop'], a: 0 }
  ],

  /* ---------- Word game: 5-letter words, one per round ---------- */
  wordGame: {
    words: ['HEART', 'CANDY', 'SMILE', 'PARTY', 'HAPPY'],
    hints: ['A symbol of love', 'Something sweet', 'What you do when you are happy', 'A celebration', 'How we feel today']
  },

  /* ---------- Treasure hunt: each answer opens the next clue ---------- */
  treasure: {
    clues: [
      { text: 'I have hands but cannot clap, and a face but cannot smile. What am I?', answer: 'clock' },
      { text: 'The more you take, the more you leave behind. What am I?', answer: 'footsteps' },
      { text: 'I am full of holes, yet I still hold water. What am I?', answer: 'sponge' }
    ],
    prize: 'You solved every clue! Your real prize is waiting for you. Ask me for it. 🎁'
  },

  /* ---------- This or That: pairs ---------- */
  thisOrThat: [
    ['Tea ☕', 'Coffee 🥤'], ['Mountains ⛰️', 'Beach 🏖️'], ['Movie night 🎬', 'Game night 🎮'],
    ['Sunrise 🌅', 'Sunset 🌇'], ['Cake 🎂', 'Ice cream 🍨'], ['Books 📚', 'Music 🎧'], ['Early bird 🐦', 'Night owl 🦉']
  ],

  /* ---------- Chat replay: messages from you, shown like a chat ---------- */
  chat: [
    'Hey Hina! 👋',
    'I made a small something for your birthday.',
    'Honestly, you deserve far more than a website.',
    'But I hope it makes you smile today. 😊',
    'Thank you for being such a great friend.',
    'Happy 26th Birthday! 🎂💖'
  ],

  /* ---------- Compliment jar (shown one at a time) ---------- */
  compliments: [
    'You have a wonderful sense of humour.', 'You make people feel welcome.', 'Your kindness is contagious.',
    'You are more talented than you realise.', 'Your smile can brighten any room.', 'You are a great listener.',
    'You make hard things look easy.', 'You are braver than you believe.', 'You have a heart of gold.',
    'You are a true friend.', 'Your positivity is inspiring.', 'You have excellent taste.',
    'You are thoughtful in the smallest ways.', 'You make ordinary days special.', 'The world is better with you in it.'
  ],

  /* ---------- Fortune cookie ---------- */
  fortunes: [
    'A pleasant surprise is waiting for you this year.', 'Someone is quietly proud of you.',
    'Your next big idea will arrive over a cup of tea.', 'Good news comes before the month ends.',
    'This year, say yes to something that scares you a little.', 'A small kindness you did will come back to you.',
    'You will laugh until it hurts very soon.', 'An old dream is ready to wake up.',
    'The people who love you are closer than you think.', 'Your best chapter starts today.'
  ],

  /* ---------- Blessing cards (saved as a picture) ---------- */
  blessings: [
    'May this year bring you quiet mornings, loud laughter and beautiful moments.',
    'May every dream you carry find its way home.',
    'May you always be surrounded by people who value you.',
    'May your heart stay light and your days stay bright.',
    'May this year be kinder to you than the last.'
  ],

  /* ---------- 26 things to do at 26 (she ticks them off; exactly 26 is ideal) ---------- */
  bucket: [
    'Watch a sunrise', 'Try a new cuisine', 'Write a letter to your future self', 'Take a spontaneous trip',
    'Learn a new skill', 'Read a book in one weekend', 'Cook a dish for someone', 'Dance in the rain',
    'Visit somewhere you have never been', 'Start a small journal', 'Declutter your wardrobe', 'Plant something',
    'Take a photo every day for a week', 'Call an old friend', 'Try a new hobby', 'Go a day without social media',
    'Bake something from scratch', 'Learn a few words in a new language', 'Volunteer for a good cause',
    'Have a picnic', 'Watch a classic film', 'Make a vision board', 'Take a long walk with music',
    'Say thank you to someone special', 'Do something kind for a stranger', 'Celebrate a small win'
  ],

  /* ---------- Birthday bingo: 9 things that may happen today ---------- */
  bingo: [
    'Someone sings to you', 'You eat cake', 'You get a hug', 'A surprise call', 'You take a group photo',
    'You laugh until you cry', 'A gift arrives', 'You make a wish', 'Someone says "Happy Birthday" at midnight'
  ],

  /* ---------- Birthday schedule: [time, plan] ---------- */
  schedule: [
    ['Morning', 'Wake up slowly, read your Open When letter 💌'],
    ['Noon', 'Treat yourself to a delicious lunch 🍽️'],
    ['Afternoon', 'Photos, calls and messages from everyone 📸'],
    ['Evening', 'Cake time! Make a wish 🎂'],
    ['Night', 'A quiet moment to remember today 🌙']
  ],

  /* ---------- A year in review: [title, text] ---------- */
  yearInReview: [
    ['This year you grew', 'You handled challenges with more strength than you give yourself credit for.'],
    ['This year you laughed', 'Some of the best days were the simplest ones.'],
    ['This year you inspired', 'Without knowing it, you made the people around you better.'],
    ['Next year', 'More laughter, more adventures and more of everything you love.']
  ],

  /* ---------- Wish wall: wishes from family and friends (collect them yourself on WhatsApp) ---------- */
  wishWall: [
    { from: 'Your friends', text: 'Happy Birthday, Hina! Wishing you a year full of joy. 🎉' },
    { from: 'Your family', text: 'May you always be happy and healthy. We love you! 💖' }
  ],

  /* ---------- Daily sparks: one tiny idea per day (26 of them) ---------- */
  sparks: [
    'Drink an extra glass of water today.', 'Send a kind message to someone.', 'Take a five-minute walk outside.',
    'Write down three things you are grateful for.', 'Listen to a song that makes you happy.', 'Smile at a stranger.',
    'Stretch for two minutes.', 'Tidy one small corner.', 'Call someone you miss.', 'Eat something you really enjoy.',
    'Take a deep breath, five times.', 'Compliment someone sincerely.', 'Watch the sky for a minute.',
    'Learn one new fact.', 'Put your phone away for an hour.', 'Dance to one song.', 'Make your bed.',
    'Write a note to your future self.', 'Try something new for lunch.', 'Say thank you to someone.',
    'Look through old photos.', 'Do something just for fun.', 'Go to bed a little earlier.',
    'Forgive yourself for something small.', 'Plan something to look forward to.', 'Tell yourself: I am doing great.'
  ],

  /* ---------- Reply button: your WhatsApp number with country code and no + or spaces. Empty hides the button. ---------- */
  reply: { phone: '', text: 'Thank you for the birthday website, it made my day! 💖' },

  /* ---------- Candle wish: shown after she blows out the candles ---------- */
  candleWish: 'Make a wish, Hina. I hope every single one comes true. 🎂',

  /* ---------- Mood picker: label and which Open When letter (0 to 5) opens ---------- */
  moods: [
    ['😊 Happy', 5],
    ['😔 Sad', 0],
    ['🥺 Missing someone', 1],
    ['😤 Frustrated', 3],
    ['🌙 Tired', 4]
  ],

  /* ---------- Thank-you card ---------- */
  thanks: {
    title: 'Thank you for being you',
    text: 'Thank you for every laugh, every talk and every little moment. You made this website worth making. 💖',
    from: 'Arif'
  },

  /* ---------- Breaking-news ticker (scrolls at the bottom on her birthday) ---------- */
  ticker: [
    'BREAKING: Hina Naqvi turns 26 today',
    'The whole world is celebrating',
    'Sources confirm: she deserves every bit of this',
    'Stay tuned for more birthday surprises'
  ],

  /* ---------- Surprise reveal: curtain opens on 12 December (text, plus your voice note byme.mp3 if it exists) ---------- */
  surprise: {
    title: 'A special message',
    text: 'Happy 26th Birthday, Hina. Thank you for being someone I am proud to call my friend. Today is all about you. 💖'
  },

  /* ---------- Final credits (scroll up at the end, shown from the Credits menu) ---------- */
  credits: [
    'A Birthday Production',
    'Directed by Arif',
    'Starring Hina Naqvi',
    'Written with love, every line',
    'Special thanks to every friend who helped',
    'Thank you for being you',
    'THE END'
  ],

  /* ---------- Final gift clue (unlocks on her birthday, or after the treasure hunt) ---------- */
  gift: {
    unlock: '2026-12-12',
    title: 'Your real gift',
    clue: 'Your real gift is waiting for you. Ask me for the first clue. 🎁'
  }
};
