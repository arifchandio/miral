# Hina's Birthday Website

A personal birthday website, in English only.

## Files you will edit

| File / folder | What it is |
|---|---|
| `resources/content.js` | **All the text.** Letters, 26 reasons, quizzes, coupons, games, lists, the reply button, the gift clue, the secret question, and the optional photo list. Edit this file only. |
| `resources/song.mp3` | Background song. Add your own file. |
| `resources/byme.mp3` | Your voice note. Its menu item appears only when this file exists. |
| `resources/lyrics.lrc` | Lyrics that scroll along with the song. Format: see `resources/lyrics.example.lrc`. |
| `resources/openwhen/*.mp3` | Optional voice note for each "Open When" letter (`sad`, `miss`, `smile`, `angry`, `sleep`, `birthday`). |
| `resources/photos/` | Optional. Your own photos (listed in `content.js` under `photos`). |

Nothing else needs to change. If a file is missing, the site still works, and that feature is simply hidden or uses a built-in fallback.

## After you edit content

Open `sw.js` and raise the number in `const V = 'hina-b26-v4'` (for example to `v5`). This makes phones fetch the new version instead of the cached one.

## Main features

- Tap-to-open cinematic start with a candle
- Song with synced lyrics and a voice note player
- Love letter, 26 wishes, Open When letters
- Midnight surprise on 12 December (countdown, then confetti)
- Games: quiz about you, 5-letter word game, treasure hunt, This or That, photo reveal, catch game, balloons, scratch card, spin wheel, memory match, photo puzzle
- Keepsakes: 26 reasons, compliment jar, fortune cookie, blessing card, bucket list, birthday bingo, daily spark, year in review, wish wall, chat replay, birthday plan, gift clue
- Share QR code, WhatsApp reply button (set `reply.phone` in `content.js`)
- Optional secret-question lock (set `secret` in `content.js`)
- Mood picker (opens the matching Open When letter), Thank-you card, Photo slideshow, Text size option, and a candle wish that appears after the candles are blown out (`candleWish` in `content.js`)
- Preview buttons in Settings are hidden. To show them (for you only), tap the first Settings heading 5 times quickly.

## Put it on GitHub Pages (free, no domain needed)

1. Create a new public repository on GitHub, for example `hina-birthday`.
2. Upload all the files and folders from this zip to the repository root (`index.html` must be at the top level).
3. Go to **Settings > Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/hina-birthday/`.
5. Put that link in `og-image.jpg` / meta tags later if you want a nicer share preview.

## Test before you send it

- Open the link on your phone (Chrome on Android, Safari on iPhone) and check: the candle tap, the song and voice note, the lyrics, and the menu.
- Test the midnight part without waiting: add `?fake=2026-12-11T23:59:40` to the link. This is for you only.
- Check that the reply button and QR code point to the right place.

## Notes

- Audio starts after the first tap, because phones block autoplay.
- Everything is stored only on Hina's phone (her photos, games scores and ticked items). Nothing is sent to a server.
- Keep MP3 files small (128 kbps is enough) so the site loads fast.
