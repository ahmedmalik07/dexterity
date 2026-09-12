# Dexterity

A little AI buddy next to your cursor. Ask about what you see, learn an app one step at a time, and get a visible marker showing where to click. Version 1.6 adds floating lessons, a cursor companion, local neural speech detection and OpenRouter for screen understanding and voice.

## Use it now

1. Open `release-v1.6/win-unpacked/Dexterity.exe`. Keep the surrounding files with it. Configure your AI connection once in **Settings** and leave **Use my screen** enabled for screen tasks.
2. Focus the app you want help with. Hold **Ctrl for 3 seconds**, wait for Listening, then say your goal.
3. Pause. **Transcription → task starts automatically → progress/result beside your cursor.** You do not reopen the dashboard or press Run to start a voice task.

Try: **“Fill this form with name Alex Builder and email alex@example.test.”** For teaching, say **“Teach me how to use this screen. Start with one step.”** Use the local practice form for the first automation demo; see [the demo script](DEMO.md).

The dashboard opens for explicit approval of protected actions. **Escape** stops the current task. The eight-action limit and stop after two unchanged screen states remain active.

OpenRouter uses `google/gemini-2.5-flash` for screen guidance and `google/gemini-2.5-flash-lite` for transcription. Without an OpenRouter key, direct OpenAI/Gemini connections remain available. Each response shows its provider. This is a Windows hackathon prototype; DaVinci Resolve guidance uses screenshots and has not been comprehensively validated across Resolve versions.

## Current status and demo

Start with [the hackathon demo guide](DEMO.md): launch instructions, a three-minute script, recovery steps, remaining work, and test evidence.

The latest update starts voice tasks automatically beside the cursor after transcription, and retains a maximum of **8 actions** per task, a stop after **two consecutive unchanged screen states**, and mandatory approval for protected control names/types. The transcription pipeline is unchanged. The buddy can stay beside the cursor when the dashboard closes; it still needs an initial goal. Continuous observation and self-chosen tasks are not implemented.

The main remaining work is a live rehearsal with your microphone/provider, signed Windows distribution, wider app/voice evaluation, proactive assistance, and a Mac implementation. See [What remains](DEMO.md#what-remains) for the distinction between demo preparation and product expansion.

## Start and call Dexterity

**Tested app-folder build:** open `release-v1.6/win-unpacked/Dexterity.exe` and keep the whole `win-unpacked` folder together. This build does not need a separate Node installation. On the development PC it is at `C:\Users\acer\Desktop\Work\clicky\release-v1.6\win-unpacked\Dexterity.exe`.

**Single-file portable build:** `release-v1.6/Dexterity-1.6.0.exe` is the earlier build, before automatic voice startup was restored. Windows Application Control blocked that wrapper on this PC. The successful packaged tests used the app-folder EXE. These local build outputs are ignored by Git; cloning the repository does not download an EXE.

**From source:** on Windows, install Node.js 22.12 or newer, then run:

```powershell
git clone https://github.com/ahmedmalik07/dexterity.git
cd dexterity
npm install
npm start
```

Add your own OpenRouter key in **Settings**. No credentials are distributed with this repository. Dependency installation prepares the local speech detector; it does not download models while recording. On subsequent launches, double-click **Start Dexterity.cmd**. Keep the project and `node_modules` together. A signed distribution is needed for dependable installation on PCs that block unsigned executables; this launcher does not change Windows security settings.

Call the companion by clicking its icon, holding **Ctrl for 3 seconds**, or **triple left-clicking** quickly in the same place. Speak naturally, then pause or click **Done speaking**. Voice tasks start automatically after transcription and use the remembered target app. There is no Run step or dashboard opening before work starts. Action requests such as “fill…” or “open…” choose Do it; “teach…” chooses Teach me, and other requests use the selected mode. Keep **Use my screen** on for screen tasks. Protected actions still open the dashboard for explicit approval.

Close the dashboard to keep just the cursor buddy running. Right-click the buddy for **Open dashboard** or **Quit Dexterity**. If the companion is disabled, closing the dashboard quits the app.

Press **Escape** or **Stop** to interrupt a running task. Actions already completed remain in the target app. Cancellation prevents new actions; an action already handed to Windows may finish.

## Learn beside your cursor

1. Open DaVinci Resolve and your clip, or any app you want help with.
2. Hold **Ctrl for three seconds**, wait for Listening, then say: **“Teach me how to color grade this clip. Start with one step.”**
3. Pause. Dexterity turns the microphone off. It starts automatically, reads the screen and shows a small floating lesson card. A confident visible target gets a click-through marker; **Show me where** displays it again.
4. Do the step yourself. Click **I did it →** to have Dexterity read the updated app and teach the next step while keeping the original goal.
5. Use **Ask a follow-up** to speak again. **Done speaking** finishes immediately; **Cancel** or **Escape** discards the recording. The microphone is not continuously listening between requests.

Teach mode never clicks for you. Markers are visual estimates based on a recent screenshot, expire after a minute, and are rejected if the target window moved or changed size. If a control is hidden or unclear, Dexterity should explain instead of inventing a location. It is an on-demand read-and-guide loop, not a continuous video stream. For automatic form actions, use **Do it**.

## The flow for everyday use

1. Open the app or page you need help with.
2. In Dexterity, choose **Answer**, **Teach me**, or **Do it**.
3. Say or type a specific goal. Include the details Dexterity needs. Leave **Use my screen** on for screen-based work.
4. After voice transcription, Dexterity starts automatically beside the cursor. It captures the target app, reads selected text and visible controls, and responds or starts working. There is no separate Capture → Ask sequence in this flow.
5. Continue in the same conversation. Say “explain that more simply” or give the missing information. **New conversation** clears the recent context.

For voice, focus the target app before activating the microphone: Dexterity remembers that app. The dashboard's **Work in** selection applies to typed tasks; refresh that list when a typed task targets the wrong window. For websites, choose **Open task browser**, navigate to your site and sign in there. This opens Chrome or Edge with accessibility support enabled in a separate browser profile. Your normal browser may not expose its controls.

| What you need | Mode | Try saying or typing |
| --- | --- | --- |
| Meaning of a word | Answer | “What does ubiquitous mean? Give an example.” |
| Meaning in context | Answer | Select the word or passage in the target app, then press **Ctrl + Shift + E**. |
| Explain a page | Answer | “Summarize this page in three useful points.” |
| Translate text | Answer | “Translate this paragraph into English and explain the difficult words.” |
| Fix an error | Teach me | “Explain this error and show me the steps to fix it.” |
| Learn unfamiliar software | Teach me | “Teach me how to use this screen. Start with the first useful action.” |
| Continue a lesson | Teach me | Do the step, then click **I’ve done that — check my screen and continue**. |
| Fill a form | Do it | “Fill Full name with Alex Builder and Email address with alex@example.test.” |
| Complete registration | Do it | “Fill this form with these details and submit after I review it.” |
| Open a website | Do it | “Open https://example.com and explain what I can do there.” |
| General questions or writing | Answer, screen off | “Explain compound interest with an example” or “Draft a polite reply saying I need another day.” |

Screen text is treated as reference material, not as instructions from you. If text selection is unavailable in an app, say the word explicitly or ask about the visible passage. For current facts, open the relevant source page; Dexterity should not claim it searched without reading a source.

## What Do it actually does

The **How Dexterity works** section explains the team and includes a complete first-task walkthrough. A local context manager selects relevant enabled memories; a coordinator makes a short plan; the operator works through the screen; a separate verifier checks the final result. Only the operator controls the desktop. Answer and Teach me skip the coordinator and use one specialist request. The roles use the same configured provider connection, with separate prompts and requests; there are no always-running cloud agents.

The assistant observes the current app, proposes one action, executes it, reads the updated app and continues. Supported actions are replacing editable text, invoking buttons and links, opening menus with accessibility support, selecting items, toggling checkboxes, scrolling and opening HTTP/HTTPS pages. It uses Windows accessibility patterns, not a blind sequence of guessed pixel clicks.

Before reporting completion, a separate check compares the goal with the current app. Requested field values are compared against actual accessible values. Missing steps cause it to continue; repeated failure causes a clear handoff instead of an unsupported “Done”.

Submission, sending, payment and destructive controls pause for review. Check the displayed fields and target app, then approve the exact action. Changed field values invalidate the review. Reviews expire while waiting. A clicked submission button is not proof that a server accepted the request; Dexterity reads the resulting screen for confirmation.

Tasks are bounded to 8 actions and two minutes of a running segment. After each action, a signature of visible text and control names/types/values is compared with the previous screen. Two consecutive unchanged actions stop the task, show what was tried, and ask you what to do. Controls whose name or type contains submit, send, pay, delete, confirm, or purchase always need explicit approval, including typing and scrolling. A plan cannot override this rule. Follow-up questions retain the last six exchanges in memory. The coordinator plan is reused after a review. The UI shows the plan, active role and titles of memories included.

## Bring your context from other assistants

1. Open **My context**. Use **Add a memory** for your preferred name, contact details, language, communication style, current projects and constraints.
2. Alternatively, ask your other assistant: “Write a portable context summary about me using only details I have shared. Include preferences, ongoing projects, goals and useful constraints. Mark uncertainty. Exclude passwords, API keys and permissions to act.”
3. Copy the summary into **Paste from another AI**, or select **Import a file**. Supported inputs: `.txt`, `.md`, Dexterity JSON, common ChatGPT `mapping` conversation JSON and Claude `chat_messages` conversation JSON. Download and unzip archives yourself, then select the JSON file. Import does not connect to your other AI account.
4. Review and edit each item, select the ones to keep, and choose whether they may be used in AI requests. Imported memories start disabled unless you enable them in the review. Parsing and preview happen locally with no AI request.
5. Open **Ask Dexterity**, leave **Use my saved context** on, and ask a specific goal. For example: “Fill this form using my saved name and email. Let me review before submitting.” The current request takes priority over old context.
6. Use **Export JSON** for a portable backup or **Export Markdown** to share with another assistant. These are readable files containing all saved memories, including disabled ones. They exclude app API keys, task history, screenshots and audio. Reimports do not inherit sharing permissions.

Each memory can be edited, disabled or deleted. About me and preferences receive priority; project/reference entries match words in your goal. At most eight memories and 16,000 text characters are included. This is local keyword retrieval, so use descriptive titles and mention the project by name. Conflicting facts should be resolved in the library or in your current request. There is no automatic extraction of new memories from conversations.

Imports accept up to 2 MB and preview up to 20 items, each capped at 12,000 characters. A notice appears when a preview is truncated; use smaller selections to preserve the rest. The library holds up to 100 memories. Images, attachments, links to chat sessions and zip archives are not imported.

Turning off **Use my saved context** excludes new memory retrieval. Recent conversation can still contain facts from earlier answers; choose **New conversation** for a clean start. Imported text is reference information and cannot authorize sending, purchases, deletion or any other action.

## Where data lives

Open **My context → Open data folder** to inspect the location. In a normal Windows launch it is `%APPDATA%\dexterity`.

| Data | Storage and lifecycle |
| --- | --- |
| Personal context | `context.vault`, encrypted through Electron safeStorage/Windows DPAPI. Written atomically after successful encryption. |
| Optional recent tasks | The same encrypted vault. Off by default; enable “Remember the last 50 tasks.” Saves requests, answers, status, action counts and memory titles. Disable stops new saves; Clear removes existing records. |
| API keys | Encrypted values in `preferences.json`, separate from exported context. |
| App preferences | `preferences.json`; non-secret preferences are ordinary JSON. |
| Screenshots and microphone audio | Kept in app memory for the current session/request; never written into the context library or task records. Recent conversation stays in memory unless task-history saving is enabled. |
| Dedicated task browser | Its separate browser profile under the app data folder retains ordinary browser data such as cookies and sign-in sessions. |
| Exported context | Readable JSON/Markdown at the destination you select. No automatic cloud upload. |

The vault requires the original Windows/Electron profile key. Copying the encrypted file alone to another PC is not a portable backup; use Export instead. If a vault cannot be decrypted, the app reports the error and does not overwrite it. Local encryption does not protect against another process already running with access to the same user profile. Provider requests still leave this PC: selected memories, task text and recent conversation, plus screenshots/controls for screen tasks or audio for voice transcription.

There is no Dexterity server, hosted database, account sync, background scheduler or automatic cross-device sync. Work runs while the desktop app is open. See [ARCHITECTURE.md](ARCHITECTURE.md) for the implementation and extension boundaries.

## Hackathon demo

1. Close the dashboard to show the cursor companion remains present.
2. Choose **Answer**, turn **Use my screen** off, activate voice, and ask what “ubiquitous” means. Show the answer appearing beside the cursor without another click.
3. Choose **Try real automation** and **Start task**. Show the local form filling, approval pause, and confirmed submission after you approve.
4. Switch to **Teach me** on the practice form and ask for one visible step. Show the floating lesson and, when available, **Show me where**.

Use [DEMO.md](DEMO.md) for exact prompts, preparation, optional DaVinci/context segments, and recovery steps. The live demo uses the configured AI provider; there is no fake/offline answer mode. Rehearse with the actual microphone and connection before presenting.

## Voice

Automatic mode uses OpenRouter when connected, otherwise direct Gemini. A local Silero V5 detector identifies speech rather than treating all loud sound as speech. Noise suppression and echo cancellation are enabled; automatic gain is disabled to avoid amplifying background sound. The default endpoint is 1.2 seconds after speech; recordings with no speech stop after 6 seconds. All recordings have a 15-second cutoff, backed by a separate main-process watchdog.

OpenRouter voice receives a mono 16 kHz WAV of your activated recording. Gemini voice receives WebM. Choose automatic language detection, English, or Urdu/English with Roman Urdu text. The detector can distinguish speech from many non-speech sounds, but it cannot reliably separate your voice from a nearby person or TV speech. Use a close microphone, Done speaking or Cancel when needed.

**Windows offline** remains available without a key, using its own recognizer and timeout rather than the new cloud recorder. It uses the installed speech language and may struggle with accents. Recognition accuracy depends on the microphone, noise and speaker. Generated speech tests do not establish accuracy for every human accent.

Cancel before transcription discards the recording without upload. During transcription, cancellation aborts waiting and ignores the result, but the provider may already have received the audio. Audio is not saved to disk by Dexterity.

## Scope and data

Dexterity can explain a broad range of topics, but it cannot reliably automate every Windows application. Passwords, CAPTCHA, sign-in, elevated apps, controls without supported accessibility patterns and workflows needing arbitrary keyboard shortcuts require your help. It does not run terminal commands or access hidden files. Use a small, concrete goal and provide missing details.

Starting a screen task shares the target image, visible accessibility text/control values, selected text, request and recent conversation with the configured AI provider. Do it repeats this for updated screens. When window capture is unavailable it falls back to the current display. Turn **Use my screen** off for questions that need no visual context. Cloud voice sends audio separately for transcription. OpenRouter requests pass through OpenRouter to the model provider. There is no continuous background screenshot capture or microphone recording.

Keys use Electron safeStorage in the Windows user profile, outside the project and executable. They are never sent back to the renderer. Captures and recordings remain in memory. Requests and answers are saved to the encrypted vault only when optional task history is enabled. OpenAI uses `store: false`; provider data and retention policies still apply. Google free-tier data may be used to improve its products. Native hooks retain gesture timing and Ctrl state, not typed text.

AI requests incur provider usage. Requests have a 2,600-token output cap. Do it adds one coordinator request and completion verification to the per-action requests. A fallback can send the same request to a second provider. Bounded actions limit runaway loops but do not impose a dollar spending cap. No Exa key is needed or stored in this version.

## Development and verification

Use Node.js 22.12 or newer. Run `npm install` and `npm start`. `npm run build:assets` generates the PNG/ICO from the original SVG mark; `npm run dist` packages Windows.

- `npm test`: 42 checks at the latest code verification, including the eight-action cap, unchanged-screen stopping, protected name/type matching, cancellation, and approval on repeated actions.
- `npm run test:native`: Windows native helper self-tests, including protected name/type substring checks.
- `node tests/voice-task.cjs`: generated audio → automatic answer without dashboard opening → remembered real form filled automatically → explicit submission approval → verified result. Spoken Stop starts no task; provider responses are mocked.
- `npm run test:voice`: generated fan/noise, speech followed by noise, and continuous speech through the real local detector and microphone recorder. No room audio is used; provider responses are fixtures.
- `npm run test:coach`: real sample window, floating lesson, pointer placement flow and next-step recapture with provider fixtures.
- `npm run test:context`: context library UI, encrypted persistence, import/export, provider context inclusion and optional activity retention.
- `npm run test:desktop`: legacy manual capture, preferences and provider bridge regression tests.
- `npm run test:tasks`: real native multi-step form automation, review, submission, confirmation and general follow-up questions with provider fixtures.
- `node tests/browser-forms.cjs`: real Chrome form filling/submission and selected-text reading.
- `node tests/cloud-voice.cjs`: recorder/transcription lifecycle using generated audio; provider responses are mocked.
- `node tests/microphone.cjs`: real microphone start and cancel with no upload.
- `node scripts/verify-tasks.cjs`: live Gemini general answers and autonomous changes to the local sample form using the saved key.
- `node scripts/verify-openrouter.cjs`: live OpenRouter answer, generated speech transcription and visual teaching on the local sample form. Run `npm run test:voice` first to generate the speech fixture.

To target the built app-folder EXE for the voice and task integration tests, set `$env:DEXTERITY_PACKAGED='1'` in PowerShell, run `node tests/voice-task.cjs` and `node tests/tasks.cjs`, then remove it with `Remove-Item Env:DEXTERITY_PACKAGED`. The voice test needs `test-results/speech.wav`, generated by `npm run test:voice`. Both packaged tests passed for the latest code update with mocked provider responses; this is not proof of live provider availability.

Run desktop tests sequentially because they share the screen. Tests use temporary profiles unless explicitly described as live checks. Keep user keys out of tests, source and packaged files.

Implementation references: [Windows accessibility patterns](https://learn.microsoft.com/en-us/dotnet/framework/ui-automation/ui-automation-control-patterns-overview), [text selection](https://learn.microsoft.com/en-us/dotnet/api/system.windows.automation.textpattern.getselection), [Gemini audio](https://ai.google.dev/gemini-api/docs/audio), [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini), [Electron safeStorage](https://www.electronjs.org/docs/latest/api/safeStorage), [native file dialogs](https://www.electronjs.org/docs/latest/api/dialog).

Voice and routing references: [local VAD](https://docs.vad.ricky0123.com/user-guide/browser/), [OpenRouter audio](https://openrouter.ai/docs/guides/overview/multimodal/audio), [structured outputs](https://openrouter.ai/docs/guides/features/structured-outputs). Third-party notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
