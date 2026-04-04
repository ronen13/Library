# INNO-TECH | ספריית הסרטונים

אתר סטטי שמציג את כל סרטוני הערוץ @inno-tech מ-YouTube — עם חיפוש, מיון וצפייה מוטמעת.

## קבצים
```
index.html   ← מבנה הדף
style.css    ← עיצוב (dark, mobile-first)
app.js       ← שליפת סרטונים מ-YouTube API, חיפוש, מיון, מודאל
render.yaml  ← קונפיגורציה לפריסה על Render
```

## פריסה על Render

1. צור ריפו GitHub ודחף את 4 הקבצים
2. כנס ל-[render.com](https://render.com) → **New → Static Site**
3. חבר את הריפו
4. **Publish directory**: `.`
5. לחץ **Create Static Site**

האתר יעלה בדקה אחת. כל push לגיטהאב מעדכן אוטומטית.

## עדכון API Key / Channel ID
פתח `app.js` ועדכן בראש הקובץ:
```js
const API_KEY    = 'YOUR_API_KEY';
const CHANNEL_ID = 'YOUR_CHANNEL_ID';
```
