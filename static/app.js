// P3 frontend — vanilla JS, no build step. Mock-first, real /api when present.
let MOCK = null;
const $ = (id) => document.getElementById(id);

async function loadMock() {
  try {
    const r = await fetch('./mock.json');
    MOCK = await r.json();
  } catch (e) {
    // file:// fallback — inline minimal
    MOCK = { hotspots: [], alloc: { works: [], referrals: [] }, national: { constituencies: [] }, impact: [], locations: [], provenance: {} };
  }
  if (!MOCK.meta?.verified_2023) $('verified-banner').classList.remove('hidden');
}

function termCell(t) {
  if (!t) return '—';
  if (t.status === 'DATA_MISSING') return `<span class="flag-warn">${t.value.toFixed(2)} · ⚠ DATA_MISSING</span><br><small>${t.source_vintage}</small>`;
  return `<a class="num" href="#tab-receipt">${t.value.toFixed(2)}</a><br><small>${t.source_vintage}</small>`;
}

// Tabs
document.querySelectorAll('.tabs button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    $('tab-' + b.dataset.tab).classList.add('active');
  };
});

function renderLocations() {
  const ds = [...new Set(MOCK.locations.map(l => l.district))];
  $('loc-district').innerHTML = ds.map(d => `<option>${d}</option>`).join('');
  const upd = () => {
    const d = $('loc-district').value;
    const subs = [...new Set(MOCK.locations.filter(l => l.district === d).map(l => l.subdistrict))];
    $('loc-sub').innerHTML = subs.map(s => `<option>${s}</option>`).join('');
    const s = $('loc-sub').value;
    const vs = MOCK.locations.filter(l => l.district === d && l.subdistrict === s);
    $('loc-village').innerHTML = vs.map(v => `<option value="${v.shrid}">${v.village}</option>`).join('');
    $('loc-shrid').textContent = $('loc-village').value || '—';
  };
  $('loc-district').onchange = upd; $('loc-sub').onchange = upd; $('loc-village').onchange = () => $('loc-shrid').textContent = $('loc-village').value;
  upd();
}

function renderHotspots() {
  const theme = $('hotspot-theme').value;
  const rows = MOCK.hotspots.filter(h => h.theme === theme);
  $('hotspot-table').querySelector('tbody').innerHTML = rows.map(h => `<tr>
    <td>${h.subdistrict}<br><small>${h.district} · ${h.ac} · ${h.pc}</small></td>
    <td class="num"><a class="num" href="#tab-receipt" data-prov="${h.provenance_id}">${h.score.toFixed(2)}</a><br><small>${h.evidence_count} complaints</small></td>
    <td>gap ${termCell(h.terms.infra_gap)}<br>eq ${termCell(h.terms.equity)}<br>dem ${termCell(h.terms.demand_adj)}</td>
    <td>${h.top_quotes.map(q => `“${q.text}” <small>[${q.lang} · synthetic:${q.synthetic}]</small>`).join('<br>')}</td>
    <td><small>${Object.entries(h.vintages).map(([k,v]) => k+': '+v).join('<br>')}</small></td></tr>`).join('')
    || '<tr><td colspan="5">No hotspots for theme. Unscored themes show demand only, no ranked works.</td></tr>';
  $('map').textContent = rows.map(h => `● ${h.subdistrict} score ${h.score.toFixed(2)} (${h.lat},${h.lon})`).join('   ') || 'No dots.';
  document.querySelectorAll('[data-prov]').forEach(a => a.onclick = () => loadReceipt(a.dataset.prov));
}

function weights() {
  return { gap: +$('w-gap').value || 0, eq: +$('w-equity').value || 0, dem: +$('w-demand').value || 0, inv: +$('w-invest').value || 0, urg: +$('w-urgency').value || 0 };
}

function renderAlloc() {
  const a = MOCK.alloc;
  $('works-table').querySelector('tbody').innerHTML = a.works.map(w => `<tr>
    <td>${w.rank}</td><td>${w.theme}<br><small>${w.village}, ${w.subdistrict}</small></td>
    <td class="num">${w.amount_cr.toFixed(2)}</td><td class="num">${w.estimated_beneficiaries.toLocaleString('en-IN')}</td>
    <td class="num">₹${w.cost_per_beneficiary}</td>
    <td class="num"><a class="num" href="#tab-receipt" data-prov="${w.provenance_id}">${w.score.toFixed(2)}</a></td>
    <td>${w.eligibility_status}<br><small>${w.sector_flag}</small></td>
    <td><button data-prov="${w.provenance_id}">Receipt →</button></td></tr>`).join('');
  const tot = a.total_budget, sc = a.constraints.sc_pct, st = a.constraints.st_pct;
  $('cbar-sc').style.width = sc + '%'; $('cbar-st').style.width = st + '%'; $('cbar-rest').style.width = Math.max(0, 100 - sc - st) + '%';
  $('constraint-text').textContent = `SC ${sc}% (≥15) · ST ${st}% (≥7.5) · ${a.constraints.ok ? 'OK' : 'FAIL'}`;
  $('unallocated').textContent = '₹' + (a.unallocated / 1e7).toFixed(2) + ' Cr unallocated (honest figure)';
  $('referrals').querySelector('ul').innerHTML = a.referrals.map(r => `<li><code>${r.reason_code}</code> — ${r.message} Route: ${r.route}</li>`).join('');
  document.querySelectorAll('#works-table [data-prov]').forEach(b => b.onclick = () => {
    document.querySelector('[data-tab="receipt"]').click();
    loadReceipt(b.dataset.prov);
  });
}

function loadReceipt(id) {
  const p = MOCK.provenance[id];
  if (!p) { $('receipt').innerHTML = 'No provenance row we cannot produce — receipt missing for ' + id; return; }
  $('receipt').innerHTML = `
    <p class="mono">WHY THIS WORK? <span class="pill">SYNTHETIC COMPLAINTS · REAL DATA</span></p>
    <p>score <a class="num">${p.score}</a></p>
    <p class="mono">${p.calc}</p>
    <h4>EVIDENCE — ${p.complaints.length} complaints (originals)</h4>
    <ul>${p.complaints.map(c => `<li>“${c.text}” <small>[${c.lang} · ${c.theme} · ${c.severity} · synthetic:${c.synthetic} · ${c.shrid}]</small></li>`).join('')}</ul>
    <h4>Data rows used</h4>
    <ul>${p.data_rows.map(r => `<li class="mono">${JSON.stringify(r)}</li>`).join('')}</ul>
    <h4>DATA VINTAGE</h4><ul>${Object.entries(p.vintages).map(([k,v]) => `<li>${k}: ${v}</li>`).join('')}</ul>
    <h4>FLAGS</h4><ul>${Object.entries(p.flags).map(([k,v]) => `<li>${k}: ${v}</li>`).join('')}</ul>`;
}

function renderNational() {
  $('national-table').querySelector('tbody').innerHTML = MOCK.national.constituencies.map(c => {
    const u = MOCK.national.state_utilisation_context[0] || {}, s = MOCK.national.state_sanction_context[0] || {};
    return `<tr><td>${c.pc}</td><td class="num">${c.need.toFixed(2)}</td><td class="num">${u.util_pct ?? '—'}% <small>${u.dated ?? ''}</small></td><td class="num">${s.avg_days ?? '—'}d <small>${s.dated ?? ''}</small></td></tr>`;
  }).join('');
  $('ledger-table').querySelector('tbody').innerHTML = MOCK.impact.map(l => `<tr><td>${l.project}</td><td>${l.requests}</td><td>${l.demand_delta}</td><td>${l.latency}</td></tr>`).join('');
}

// Intake: try real API, fallback mock
$('btn-submit').onclick = async () => {
  const payload = { text: $('intake-text').value, language: $('intake-lang').value, channel: $('intake-channel').value, shrid: $('loc-shrid').textContent, synthetic: true };
  try {
    const r = await fetch('/api/ingest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw 0;
    $('ingest-result').textContent = JSON.stringify(await r.json(), null, 2);
  } catch {
    $('ingest-result').textContent = JSON.stringify({ complaint_id: 'c-mock-1', transcript: payload.text || '(empty)', language: payload.language, theme: 'drinking_water', severity: 'high', urgency: 0.8, shrid: payload.shrid, created_at: new Date().toISOString(), synthetic: true, _note: 'mock fallback — real /api/ingest when P2 serves' }, null, 2);
  }
};

// Mic: MediaRecorder → /api/ingest, graceful text-only fallback (G3a)
let rec = null, chunks = [];
$('btn-mic').onclick = async () => {
  $('voice-status').textContent = 'Attempting mic…';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    rec = new MediaRecorder(stream); chunks = [];
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
      const fd = new FormData(); fd.append('audio', blob); fd.append('shrid', $('loc-shrid').textContent);
      try {
        const r = await fetch('/api/ingest', { method: 'POST', body: fd });
        $('ingest-result').textContent = JSON.stringify(await r.json(), null, 2);
        $('voice-status').textContent = 'Voice live';
      } catch { $('voice-status').textContent = 'Text intake active (voice API absent)'; }
    };
    rec.start(); $('btn-mic').textContent = '⏹ Stop';
    $('btn-mic').onclick = () => { rec.stop(); $('btn-mic').textContent = '🎤 Record (browser capture → /api/ingest)'; location.reload(); };
  } catch { $('voice-status').textContent = 'Text intake active (mic denied — G3a pivot ready)'; $('mic-hint').textContent = 'Mic unavailable — text intake is the supported path. Say so on stage.'; }
};

$('btn-rescore').onclick = renderHotspots;
$('btn-alloc').onclick = renderAlloc;
$('hotspot-theme').onchange = renderHotspots;

(async () => { await loadMock(); renderLocations(); renderHotspots(); renderAlloc(); renderNational(); })();
