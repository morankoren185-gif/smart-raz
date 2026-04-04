# ארכיטקטורת מערכת המשחקים — תכנון ייצוב והעמקה

מסמך זה מגדיר חוזה מוצרי־טכני בין **תוכן לימודי (Data)** לבין **מנוע משחק (Engine)** ולבין **חוויית ילד / הורה**, לפני הוספת משחקים נוספים. המטרה: כל משחק חדש יתווסף כמודול תוכן + הרשמה קטנה, בלי לשבור את המנוע.

---

## 1. עקרונות מנחים

| עקרון | משמעות |
|--------|--------|
| **Data driven** | כל מה שניתן לפרק לנתונים — בנק שאלות, מטא־דאטה, מיומנויות, הסבר להורה — נשאר מחוץ לקומפוננטות. |
| **חוזה יציב** | המנוע תומך ב־**ממשקים (interfaces)** וסוגי משחק כ־**variants**; שינוי במסך לא מחייב fork של המנוע. |
| **הרחבה ללא שבירה** | משחק חדש = קובץ תוכן + רישום ברשימת משחקים + (אם צריך) **Renderer** קטן לסוג פעילות — לא שכפול לוגיקת סשן. |
| **ביטחון לפני קושי** | זרימת סשן קבועה, רמזים, ושפה מעודדת — חלק מהמפרט, לא “נקודתי” ב UI. |
| **תובנות הורה** | איסוף אירועים ברמת סשן וברמת שאלה, לא רק מונים גולמיים. |

---

## 2. שלב 1 — חוזה טיפוסים (TypeScript)

להלן **מפרט שדות**. ביישום בפועל מומלל שימוש ב־**Discriminated Unions** ל־`Question` לפי `type`, כדי שלא יהיו שדות “ריקים” או סרומיים.

### 2.1 `SkillId` (מזהי מיומנות)

מחרוזות יציבות לדוחות ולהורה — לא תלויות בשפה:

דוגמאות: `letter-recognition`, `syllable-blending`, `vocabulary-receptive`, `vocabulary-expressive`, `addition-within-10`, `counting`, `number-sense`, `listening-discrimination` (להמשך).

### 2.2 `ProgressState`

מצב התקדמות **גלובלי** ונשמר (ב־MVP: `localStorage`; בהמשך: שרת).

```typescript
type DifficultyLevel = "gentle" | "steady" | "spark";

type WorldId = "english" | "hebrew" | "math";

interface WorldProgressSlice {
  /** רמת ברירת מחדל לסשן חדש בעולם */
  preferredLevel: DifficultyLevel;
  /** מפתחות מיומנות → מדד פנימי (0–1 או ציון יציב) */
  skillStrength: Partial<Record<string, number>>;
  /** משחקים שנפתחו / הושלמו */
  unlockedGameIds: string[];
  completedGameIds: string[];
  lastPlayedAt?: string;
}

interface ProgressState {
  version: number;
  playerId?: string;
  worlds: Record<WorldId, WorldProgressSlice>;
  /** מערכת חיזוקים כללית (כוכבים, חלקי חללית, מדבקות…) */
  rewards: RewardsInventory;
  /** סיכומים להורה (מקומן או מחושב מ־analytics) */
  parentInsightsCache?: ParentInsightsSnapshot;
  updatedAt: string;
}
```

**הערות:**

- `skillStrength` מתעדכן ממנגנון **decay + success** (ראו סעיף 6).
- `RewardsInventory` יכול להיות `{ stars: number; spaceshipParts: string[]; stickers: string[]; unlockedPlanets: string[] }` וכו’ — גמיש אך עם גרסת סכמה (`version`).

### 2.3 `Question` (יחידת משימה אטומית)

**לא כל משחק דורש את כל השדות.** לכל סוג שאלה יש `type` משלו; השדות המשותפים:

| שדה | תיאור |
|-----|--------|
| `id` | מזהה יציב לניטור ולדיווח הורה |
| `type` | `"multiple-choice"` \| `"matching"` \| `"drag-drop"` \| `"build"` \| `"listen-choose"` |
| `world` | `WorldId` |
| `level` | `DifficultyLevel` — רמת **השאלה** (יכולה לחפוף או להיות מעוגנת ל־session level) |
| `instructions` | הנחיה לילד (קצרה; שפה לפי עולם / שפת משחק) |
| `skills` | `SkillId[]` — למה משויך המדד |
| `hint` | אובייקט רמז ברירת־מחדל (ראו סעיף 7) |
| `explanation` | טקסט **להורה** — מה המטרה, למה התשובה נכונה |
| **Payload ספציפי** | למשל: `correctAnswer` + `distractors` ב־MC; זוגות ב־matching; יעדי drop ב־drag |

**דוגמת צורה למספר בחירה (רעיונית):**

```typescript
interface MultipleChoiceQuestion extends QuestionBase {
  type: "multiple-choice";
  correctAnswer: string;       // מזהה אפשרות נכונה
  distractors: string[];      // מזהי מסיחים (המנוע יטעין labels מהתוכן)
  choices?: Record<string, ChoicePresentation>; // תצוגה: טקסט, אימוג'י, נגישות
}
```

**Matching / drag / build** יורחבו בשדות `pairs`, `slots`, `tiles` וכו’ — המסמך קובע את **החוזה**: כל variant מגדיר סכימת JSON משלו תחת אותו מטיפוס `Question`.

### 2.4 `GameDefinition`

מטא־דאטה של **משחק שלם** (מודול תוכן), לא רק שאלה בודדת:

| שדה | תיאור |
|-----|--------|
| `id` | מזהה יציב |
| `slug` | ל־URL |
| `world` | `WorldId` |
| `title` | כותרת לילד |
| `tagline` | שורה אחת |
| `defaultSessionLevel` | `DifficultyLevel` — אם אין העדפה בשמירה |
| `supportedQuestionTypes` | רשימת סוגים — לוולידציה ולבחירת renderer |
| `questions` | `Question[]` או הפניה לבנקים לפי `level` |
| `banksByLevel` | `Record<DifficultyLevel, Question[]>` (מומלץ) |
| `sessionRecipe` | אופציונלי: כמה חימום, כמה ליבה, בונוס (ראו סעיף 5) |
| `parentSummary` | מטרות, סיכון קוגניטיבי, זמן משוער |
| `skills` | `SkillId[]` ברמת המשחק (ברירת מחדל לכל השאלות אם חסר בשאלה) |

כך **כל התוכן Data driven**; UI בוחר renderer לפי `question.type`.

### 2.5 `GameSessionResult`

פלט **לאחר סיום סשן** (לשמירה, לתובנות הורה, ולעדכון `ProgressState`):

```typescript
interface GameSessionResult {
  sessionId: string;
  gameId: string;
  world: WorldId;
  startedAt: string;
  endedAt: string;
  /** רמת הסשן בפועל (אחרי התאמות) */
  level: DifficultyLevel;
  phases: SessionPhaseResult[];
  /** אגרגציה מהירה */
  totals: {
    correct: number;
    attempts: number;
    hintsUsed: number;
    avgReactionTimeMs?: number;
  };
  /** לכל שאלה — אירועים (ללא PII) */
  questionEvents: QuestionTelemetry[];
  rewardsEarned: RewardGrant[];
  /** ציון “הרגשת הצלחה” פנימי 0–1 ליישום UX */
  confidenceScore: number;
}
```

`QuestionTelemetry` יכלול לכל ניסיון: `questionId`, `correct`, `latencyMs`, `hintType`, `optionsBefore/After` (לצמצום מסיחים).

---

## 3. שלב 2 — מנוע משחק כללי

### 3.1 אחריות המנוע

1. **מחזור חיים של סשן** — טעינת תוכן, שלבי חימום/ליבה/בונוס, סיום.
2. **הרצת “שלב פעילות”** — קבלת `Question`, הפעלת **Activity Runner** מתאים, איסוף טלמטריה.
3. **רמזים** — יישום מדיניות רמזים לפי הגדרות השאלה והמדיניות הגלובלית.
4. **חיזוקים** — חישוב `RewardGrant` ועדכון `ProgressState.rewards`.
5. **התאמת קושי בתוך הסשן ובין סשנים** — פונקציות טהורות שמקבלות מצב ומחזירות המלצה (ראו סעיף 6).

### 3.2 Activity Runners (פלגינים דקים)

| סוג | Runner | אחריות UI |
|-----|--------|-----------|
| multiple-choice | בוחר אפשרות אחת | `components/games/runners/MultipleChoiceRunner.tsx` |
| matching | התאמת זוגות | `MatchingRunner` |
| drag-drop | גרירה ליעדים | `DragDropRunner` |
| build | הרכבת מילה/מספר | `BuildRunner` |
| listen-choose | השמעה + בחירה | `ListenChooseRunner` (עתידי) |

המנוע **לא יודע** איך נראה כפתור; הוא מפעיל runner ומאזין לאירועים: `onAttempt`, `onHint`, `onCompletePhase`.

### 3.3 מבנה תיקיות מוצע

```text
lib/
  game-types/           # טיפוסים משותפים, unions, guards
  game-engine/          # session orchestration, state machine
    runners/            # לוגיקה משותפת ל-runners (לא UI)
    policies/           # hints, difficulty, rewards rules (טהור)
  session/              # בניית סשן מ-GameDefinition + ProgressState
  rewards/              # חישוב פרסים, אינבנטור
  analytics/            # אגרגציה ל-Parent Insights
content/
  english/
  hebrew/
  math/
  registry.ts           # רישום כל GameDefinition
components/
  games/
    session/            # GameSessionShell — flow קבוע
    runners/            # קומפוננטות לפי סוג שאלה
  ui/kid/               # כפתורים, משוב, אנימציות קלות
  layout/               # KidShell, ParentShell
  parent/               # דשבורד תובנות
```

**הפרדה:** `content/` = נתונים בלבד; `lib/game-engine` = לוגיקה; `components` = הצגה ונגישות.

---

## 4. שלב 3 — חוויית ילד: flow קבוע לסשן

### 4.1 מסלול מומלץ (Session Flow)

מומלל **מכונת מצבים (state machine)** עם שלבים קבועים — כך הילד תמיד יודע “איפה אני במסע”:

1. **מסך התחלה (Briefing)**  
   - מטרה אחת במשפט אחד + אייקון.  
   - כפתור “בואו נתחיל” (גדול).

2. **חימום (Warm-up)** — 1 משימה קלה מאותו `GameDefinition` או מבריכת־חימום ייעודית  
   - מניעת כישלון מוקדם; משוב מהיר וחם.

3. **ליבה (Core)** — 2–3 משימות ברמה הנבחרת  
   - עיבוד רמזים; עומס לא עולה פתאום.

4. **בונוס (Bonus)** — משימה קצרה עם **פרס מוגדש** (לא “ענישה” אם נכשל — תמיד ניסוח חיובי).

5. **סיום (Debrief)**  
   - חיזוקים + “מה השגנו היום” (לא ציון כושל).  
   - הצגת התקדמות בחללית / כוכב חדש / מדבקה.

ניתן להגדיר ב־`GameDefinition.sessionRecipe` אורכים, או להשתמש בברירות מחדל גלובליות.

### 4.2 סוגי חיזוקים (Rewards Layer)

| סוג | שימוש | הערה ל־UX |
|-----|--------|-----------|
| **כוכבים** | מטבע כללי, קל להבנה | תמיד עם אנימציה קצרה + צליל רך (אופציונלי) |
| **חלקי חללית** | מוטיבאריית התקדמות ארוכת טווח | תורם תחושת “בנייה” |
| **מדבקות** | איסוף קוסמטי | לא קשור לביצועים “מושלמים” — ניתן לפרס גם על ניסיון עקבי |
| **פתיחת כוכב לכת** | שלבים בעולם | מפריד עומס — לא כל המשחקים פתוחים בבת אחת |

עקרון: **לפחות חיזוק אחד “בטוח”** — ניתן גם כשהבונוס לא הושלם במלואו (למשל “הגענו לסוף המסלול”).

### 4.3 סוגי רמזים (Hints Policy)

| רמז | תיאור | מתי |
|-----|--------|-----|
| **צמצום אפשרויות** | הסרת מסיח אחד | אחרי ניסיון ראשון רך או בלחיצה על “רוצה רמז?” |
| **הדגשה עדינה** | outline / זוהר על אזור רלוונטי | כשהילד נתקע בלי לחשוף תשובה |
| **קריינות** | קריאת ההנחיה / אות | כשיש TTS; תמיד כפתור ולא אוטומטי מלא |
| **ביטול מסיחים** | דומה לצמצום — 2 שלבים | במצבי `spark` |

כל רמז נרשם בטלמטריה (`hintsUsed`, סוג) — חשוב לתובנות הורה.

---

## 5. שלב 4 — אזור הורה חכם (Parent Insights)

### 5.1 מה לאסוף (במהלך המשחק)

- זמן לתשובה ראשונה לשאלה (\(latency\)).  
- מספר ניסיונות לפני הצלחה.  
- שימוש ברמזים לפי סוג.  
- `skills` מצורפים לכל שאלה.  
- רמת קושי בפועל (`level`).

### 5.2 מבנה `ParentInsightsSnapshot` (מוצע)

```typescript
interface ParentInsightsSnapshot {
  generatedAt: string;
  strengths: {
    skill: SkillId;
    evidence: string;        // משפט בהיר להורה
    confidence: "high" | "medium";
  }[];
  growthAreas: {
    skill: SkillId;
    pattern: string;       // למשל: “הרבה רמזים + זמן תגובה ארוך”
    suggestion: string;    // תרגיל / משחק מתאים
  }[];
  engagement: {
    avgSessionMinutes: number;
    sessionsLast7Days: number;
  };
  pacing: {
    avgReactionTimeMs: number;
    hintRate: number;       // רמזים / שאלות
  };
  weeklyRecommendation: string;
}
```

### 5.3 חישוב תובנות (heuristic פשוט בתחילה)

- **חוזק:** מיומנות עם אחוז הצלחה גבוה + זמן תגובה נמוך יחסית + מעט רמזים.  
- **קושי:** ההפך; דגש על דפוסים (למשל רק בשאלות `listen-choose`).  
- **המלצה שבועית:** בחירת 1–2 `GameDefinition` ו־`skill` לפי פער מובהק — לא “תתרגל יותר” גנרי.

---

## 6. מנגנון רמות קושי

### 6.1 רמות

- **gentle** — פחות מסיחים, משימות קצרות, חימום מורחב (אופציונלי).  
- **steady** — איזון.  
- **spark** — יותר מסיחים / פחות רמזים אוטומטיים / משימות מורכבות יותר.

### 6.2 כללי עדכון

- **בתוך סשן:** העלאה רכה רק אם רצף הצלחות + זמן תגובה סביר; ללא הודעת “כשלון”.  
- **בין סשנים:** עדכון `preferredLevel` ב־`ProgressState` לפי ממוצע חודשי / 5 הסשנים האחרונים.  
- **רגרסיה:** אם `hintRate` ו־`attempts` גבוהים — חזרה ל־`gentle` רק לעולם הרלוונטי, עם הסבר להורה (“התאמת קצב”).

הכל כפונקציות טהורות ב־`lib/game-engine/policies/difficulty.ts`.

---

## 7. מנגנון רמזים (מימוש עתידי מול המפרט)

- `Question.hint` יגדיר: `kind`, `maxSteps`, `cooldownBetweenSteps`.  
- מדיניות גלובלית: מקסימום רמזים לשאלה; איסור על חשיפת תשובה במפגש הראשון.  
- נגישות: רמז טקסטואלי תמיד; הדגשה ויזואלית בנוסף.

---

## 8. שמירת התקדמות

- **גרסת סכמה** (`version`) ב־`ProgressState` למנוע שבירה בהעלאות.  
- **אירועים:** מומלל רשימת `GameSessionResult` אחרונים (למשל 20) לצורך תובנות — או אגרגציה מתגלגלת בלבד אם החשש לאחסון.  
- **פרטיות:** אין שמות, אין הקלטות ב־MVP; רק מזהי שאלות פנימיים.

---

## 9. איך מוסיפים משחק חדש למערכת

1. **מגדירים** `GameDefinition` ב־`content/<world>/<game>.ts` עם `banksByLevel`.  
2. **מוודאים** שכל `Question` כולל `type`, `skills`, `explanation` (להורה), ו־`hint`.  
3. **מרשמים** ב־`content/registry.ts` (או `index`).  
4. **אם** `type` קיים — אין שינוי מנוע; רק תוכן.  
5. **אם** `type` חדש — מוסיפים:
   - טיפוס ב־`lib/game-types/questions.ts`;
   - runner UI ב־`components/games/runners/`;
   - מתאם ב־`lib/game-engine/runners/registry.ts` שמקשר `type` → runner.

---

## 10. מיפוי מהקוד הקיים (MVP) לכיוון היעד

| היום | כיוון |
|------|--------|
| `GameModule` + `banks` | יעבור ל־`GameDefinition` + `banksByLevel` + `Question` מאוחד |
| `ChoiceGameClient` | יפוצל ל־`GameSessionShell` + `MultipleChoiceRunner` |
| `loadProgress` / כוכבים | יורחב ל־`ProgressState` + `GameSessionResult` + שכבת `analytics` |

המעבר יכול להיות **הדרגתי**: להשאיר משחק קיים כ־adapter שממפה ל־`Question` מסוג `multiple-choice` עד שכל התוכן מסודר.

---

## 11. סיכום

המסמך מגדיר:

- **חוזה דאטה** — `GameDefinition`, `Question` (עם variants), `GameSessionResult`, `ProgressState`.  
- **מנוע** — אורקסטרציית סשן + runners לפי סוג פעילות.  
- **UX** — flow קבוע, חיזוקים מגוונים, רמזים מדורגים.  
- **הורה** — תובנות מבוססות דפוסים ואירועים, לא רק מספרים.  
- **הרחבה** — משחק חדש = תוכן + רישום; סוג חדש = runner + רישום במנוע בלבד.

**שלב הבא מומלץ לאחר אישור המסמך:** יצירת `lib/game-types/` עם הטיפוסים בפועל + מיפוי משחק אחד קיים ל־`GameDefinition` החדש בלי להוסיף משחקים נוספים.
