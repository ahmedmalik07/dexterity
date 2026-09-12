const { _electron: electron } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
 const env = { ...process.env, DEXTERITY_TEST: '1' }; delete env.ELECTRON_RUN_AS_NODE;
 const app = await electron.launch({ args: ['.'], env });
 try {
  await app.firstWindow();
  let page;
  for (let attempt = 0; attempt < 100; attempt++) {
   page = app.windows().find(window => window.url().endsWith('/index.html'));
   if (page) break;
   await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(page, 'Dashboard window opened');
  await page.locator('[data-page="home"]').click();await page.waitForSelector('#start');
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  assert.equal(await page.title(),'Dexterity');
  assert.ok(!(await page.locator('body').innerText()).toLowerCase().includes('notebook'));
  await page.locator('#forms-nav').click();await page.locator('#practice-form').click();
  await page.locator('[data-field-id]').first().waitFor({timeout:30000});
  assert.equal(await page.locator('[data-field-id]').count(),2);
  await page.locator('[data-page="settings"]').click(); await page.locator('#voice').uncheck();
  assert.equal(await page.locator('#model').inputValue(),'gpt-5.4-mini');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await page.locator('[data-page="guide"]').click(); assert.equal(await page.locator('#empty-screen').isVisible(), true);
  await page.locator('#capture').click(); await page.locator('#screenshot').waitFor({ state: 'visible', timeout: 20000 });
  assert.match(await page.locator('#screenshot').getAttribute('src'), /^data:image/);
  await page.locator('#question').fill('What do I see?'); await page.locator('#ask').click(); await page.locator('#settings').waitFor({ state: 'visible' });
  await page.locator('#api-key').fill('sk-offline-test-key'); await page.getByRole('button', { name: 'Save preferences' }).click();
  const publicPrefs = await page.evaluate(() => window.dexterity.settings()); assert.equal(publicPrefs.hasKey, true); assert.equal(publicPrefs.key, undefined);
  await app.evaluate(() => {
   globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    if (url !== 'https://api.openai.com/v1/responses' || body.store !== false || !body.input[0].content[1].image_url.startsWith('data:image/')) throw new Error('Invalid API request');
    const guide = { summary: 'Offline API fixture', steps: [{ title: 'Visible target', detail: 'This validates the API bridge without network access.', x: .5, y: .5 }] };
    return { ok: true, json: async () => ({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(guide) }] }] }) };
   };
  });
  await page.locator('[data-page="guide"]').click(); await page.locator('#ask').click();
  try { await page.getByText('Offline API fixture').waitFor({timeout:10000}); } catch(e) { console.log(await page.evaluate(()=>({demoSession,busy,prefs,question:$('question').value,toast:$('toast').textContent,summary:$('summary').textContent})));throw e; }
  await page.getByRole('button', { name: 'Show me where' }).click();
  const pointerVisible = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().some(w => w.webContents.getURL().endsWith('pointer.html') && w.isVisible())); assert.equal(pointerVisible, true);
  await page.evaluate(() => window.dexterity.dismiss());
  await app.evaluate(() => { globalThis.fetch = async () => ({ ok: false, status: 401 }); });
  await page.locator('#ask').click(); await page.getByRole('status').filter({ hasText: 'API key was rejected' }).waitFor();
  await page.locator('[data-page="settings"]').click();await page.locator('#gemini-key').fill('test-backup');await page.getByRole('button',{name:'Save preferences'}).click();
  const backupPrefs=await page.evaluate(()=>window.dexterity.settings());assert.equal(backupPrefs.hasGeminiKey,true);assert.equal(backupPrefs.geminiKey,undefined);
  await app.evaluate(()=>{globalThis.fetch=async url=>url.includes('openai.com')?{ok:false,status:429}:{ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify({summary:'Gemini fallback fixture',steps:[]})}]}}]})};});
  await page.locator('[data-page="guide"]').click();await page.locator('#ask').click();await page.getByText('Gemini fallback fixture').waitFor();
  assert.match(await page.locator('#answer-tag').innerText(),/Gemini.*BACKUP/);
  await page.locator('[data-page="history"]').click();assert.equal(await page.locator('.history-item').count(),2);await page.locator('[data-page="guide"]').click();
  await page.locator('#clear').click(); assert.equal(await page.locator('#screenshot').isVisible(), false);
  await page.locator('[data-page="home"]').click(); const companionBefore=await page.locator('#companion').getAttribute('aria-pressed'); await page.locator('#companion').click(); assert.notEqual(await page.locator('#companion').getAttribute('aria-pressed'), companionBefore); await page.locator('#companion').click();
  fs.mkdirSync('test-results', { recursive: true }); await page.evaluate(() => { document.getElementById('toast').hidden = true; window.scrollTo(0, 0); }); await page.screenshot({ path: 'test-results/dashboard.png', fullPage: true });
  assert.deepEqual(errors, []); console.log('PASS: real form demo, history, defaults, capture, OpenAI fixture, Gemini fallback, encrypted key isolation, pointer, clear, companion and renderer.');
 } finally { await app.close(); }
})().catch(e => { console.error(e); process.exit(1); });
