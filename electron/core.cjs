const schema = { type: 'object', additionalProperties: false, properties: {
 summary: { type: 'string' }, steps: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { title: { type: 'string' }, detail: { type: 'string' }, x: { type: ['number', 'null'] }, y: { type: ['number', 'null'] } }, required: ['title', 'detail', 'x', 'y'] } }
}, required: ['summary', 'steps'] };
function parseGuide(response) {
 if (response.status && response.status !== 'completed') throw new Error('The answer was incomplete. Please retry.');
 const text = (response.output || []).flatMap(o => o.content || []).filter(c => c.type === 'output_text').map(c => c.text).join('');
 if (!text) throw new Error('No guidance returned. Try a different question.');
 const guide = JSON.parse(text);
 if (typeof guide.summary !== 'string' || !Array.isArray(guide.steps)) throw new Error('Invalid guidance format.');
 guide.steps = guide.steps.slice(0, 6).map(s => {
  if (typeof s.title !== 'string' || typeof s.detail !== 'string') throw new Error('Invalid step format.');
  const valid = Number.isFinite(s.x) && Number.isFinite(s.y) && s.x >= 0 && s.x <= 1 && s.y >= 0 && s.y <= 1;
  return { title: s.title, detail: s.detail, x: valid ? s.x : null, y: valid ? s.y : null };
 }); return guide;
}
function toScreenPoint(p, b) {
 if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y) || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) return null;
 return { x: Math.round(b.x + p.x * b.width), y: Math.round(b.y + p.y * b.height) };
}
module.exports = { schema, parseGuide, toScreenPoint };
