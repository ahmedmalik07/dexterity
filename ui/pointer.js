window.dexterity.onPoint(p => { const t = document.getElementById('target'); t.style.left = p.x + 'px'; t.style.top = p.y + 'px'; document.getElementById('label').textContent = p.title; });
