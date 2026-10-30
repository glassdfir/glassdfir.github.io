/* Suite hand-off: how the jon.glass tools pass data to each other.
 *
 * Sending tool:   Suite.send('shifu', 'mill', { kind: 'table', name, data, meta })  → Promise<url to open>
 * Receiving tool: Suite.receive('mill', params.get('from'))                         → Promise<handoff | null>
 *
 * The data waits in this origin's localStorage under 'suite.handoff.<to>' as
 *   { v: 2, from, to, kind, name, enc: 'gzip' | 'raw', data: <base64>, meta, at: <ms> }
 * and the receiver opens /<to>/?from=<from>, reads it once and deletes it. Nothing leaves the browser.
 *
 * Kinds are the shared data types every tool speaks:
 *   table     CSV text with a header row                  Shifu, Mill, Spoke
 *   bytes     a file's raw bytes                          Hexes
 *   events    CSV of timestamped events (time_utc first)  Mill, Scrimmage
 *   playbook  Huddle playbook JSON                        Huddle
 * meta carries hints the receiver may use, e.g. { timeCols: ['timestamp'], tz: 0 } for Mill
 * or { offset, length } for Hexes. A receiver ignores meta it does not know.
 *
 * Works only between pages on the same origin (jon.glass, or localhost while developing).
 */
(function () {
  'use strict';
  var V = 2, PREFIX = 'suite.handoff.', MAX_AGE = 10 * 60 * 1000, MAX_BYTES = 256 << 20;
  var KINDS = ['table', 'bytes', 'events', 'playbook'];
  var TOOLS = {
    spoke: { name: 'Spoke', accepts: [] },
    huddle: { name: 'Huddle', accepts: [] },
    mill: { name: 'Mill', accepts: ['table', 'events'] },
    shifu: { name: 'Shifu', accepts: [] },
    scrimmage: { name: 'Scrimmage', accepts: [] },
    hexes: { name: 'Hexes', accepts: ['bytes'] },
  };

  var toolName = function (id) { return (TOOLS[id] && TOOLS[id].name) || cleanName(id, 'another tool'); };
  function cleanName(s, d) { return String(s || '').replace(/[\x00-\x1f\x7f\/\\]+/g, '_').trim().slice(0, 120) || d; }
  function fail(code, msg) { var e = new Error(msg); e.code = code; return e; }

  /* Hand-offs need a page on the same origin as the tools: not a file:// copy or an embedded artifact */
  function available() { return /^https?:$/.test(location.protocol) && !(window.claude && window.claude.use) && typeof localStorage !== 'undefined'; }
  function url(to, from) { return '/' + to + '/' + (from ? '?from=' + encodeURIComponent(from) : ''); }
  function accepts(to, kind) { return !!(TOOLS[to] && TOOLS[to].accepts.indexOf(kind) >= 0); }

  function toB64(u8) {
    var s = '';
    for (var i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function fromB64(s) { return Uint8Array.from(atob(String(s || '')), function (c) { return c.charCodeAt(0); }); }

  async function gzip(u8) {
    return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
  }
  async function gunzip(u8, max) {
    var reader = new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
    var parts = [], n = 0;
    for (;;) {
      var r = await reader.read();
      if (r.done) break;
      n += r.value.length;
      if (n > max) { reader.cancel(); throw fail('too-big', 'it unpacks to more than ' + Math.round(max / 1048576) + ' MB'); }
      parts.push(r.value);
    }
    var out = new Uint8Array(n), at = 0;
    parts.forEach(function (p) { out.set(p, at); at += p.length; });
    return out;
  }

  /* Store env for `to` and return the URL to open. Rejects with e.code 'unavailable', 'unsupported' or 'too-big'. */
  async function send(from, to, env) {
    if (!available()) throw fail('unavailable', 'Hand-offs only work on jon.glass. Download the file instead.');
    if (KINDS.indexOf(env.kind) < 0 || !accepts(to, env.kind)) throw fail('unsupported', toolName(to) + ' does not accept ' + env.kind + ' data.');
    var raw = typeof env.data === 'string' ? new TextEncoder().encode(env.data) : new Uint8Array(env.data);
    var enc = 'raw', body = raw;
    if (typeof CompressionStream !== 'undefined') { body = await gzip(raw); enc = 'gzip'; }
    var rec = { v: V, from: from, to: to, kind: env.kind, name: cleanName(env.name, env.kind), enc: enc, data: toB64(body), meta: env.meta || {}, at: Date.now() };
    try { localStorage.setItem(PREFIX + to, JSON.stringify(rec)); }
    catch (e) { throw fail('too-big', 'This is too big to hand off directly. Download it and drop it into ' + toolName(to) + '.'); }
    return url(to, from);
  }

  /* Take the waiting hand-off for `me` (opened as ?from=<from>), or null when there is no ?from.
     Resolves to { from, fromName, kind, name, meta, bytes, text() }; rejects with a message for a toast. */
  async function receive(me, from, opts) {
    if (!from) return null;
    var max = (opts && opts.maxBytes) || MAX_BYTES, raw = null;
    try { raw = localStorage.getItem(PREFIX + me); localStorage.removeItem(PREFIX + me); } catch (e) { /* storage blocked */ }
    if (!raw) throw fail('missing', 'nothing was waiting. Send it from ' + toolName(from) + ' again.');
    var h;
    try { h = JSON.parse(raw); } catch (e) { throw fail('format', 'the hand-off is damaged. Send it again.'); }
    if (h.v !== V) throw fail('format', 'it uses a hand-off format this version does not know');
    if (h.to !== me) throw fail('format', 'it was meant for ' + toolName(h.to));
    if (!accepts(me, h.kind)) throw fail('unsupported', toolName(me) + ' does not accept ' + h.kind + ' data');
    if (!h.at || Date.now() - h.at > MAX_AGE) throw fail('stale', 'it is more than 10 minutes old. Send it again.');
    var bytes = fromB64(h.data);
    if (h.enc === 'gzip') {
      if (typeof DecompressionStream === 'undefined') throw fail('unsupported', 'this browser cannot unpack it');
      bytes = await gunzip(bytes, max);
    } else if (bytes.length > max) throw fail('too-big', 'it is larger than ' + Math.round(max / 1048576) + ' MB');
    return {
      from: h.from, fromName: toolName(h.from), kind: h.kind, name: cleanName(h.name, h.kind),
      meta: h.meta && typeof h.meta === 'object' ? h.meta : {}, bytes: bytes,
      text: function () { return new TextDecoder().decode(bytes); },
    };
  }

  window.Suite = { tools: TOOLS, kinds: KINDS, available: available, accepts: accepts, url: url, send: send, receive: receive };
})();
