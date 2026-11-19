import re

src = open('book.src.html').read()
wm = re.search(r'd: "([^"]+)"', open('../../site/components/wordmarkPath.ts').read()).group(1)


def M(fill, extra=''):
    return (f'<g fill="{fill}" {extra}><rect x="20" y="22" width="16" height="76"/>'
            f'<rect x="84" y="22" width="16" height="76"/><circle cx="60" cy="60" r="10"/></g>')


toc = [("01", "The idea"), ("02", "The mark"), ("03", "Three dimensions"), ("04", "Colour and material"),
       ("05", "Wordmark and lockups"), ("06", "Typography"), ("07", "Voice"), ("08", "Motion and use")]
TOC = ''.join(
    f'<div style="display:grid;grid-template-columns:110px 1fr;align-items:baseline;padding:30px 0;'
    f'border-bottom:1px solid var(--line)"><span class="k">{n}</span>'
    f'<span class="d" style="font-size:52px;font-stretch:118%">{t}</span></div>' for n, t in toc)

SUBS = ''.join(
    f'<div style="display:flex;align-items:center;gap:22px"><svg viewBox="0 0 120 120" style="width:52px">{M("#ECE8E1")}</svg>'
    f'<svg viewBox="0 -686 8483 686" style="width:300px;color:#ECE8E1"><path fill="currentColor" d="{wm}"/></svg>'
    f'<span style="font-family:var(--display);font-weight:400;font-stretch:118%;font-size:30px;color:#8E8B85;'
    f'letter-spacing:.06em">{s}</span></div>' for s in ["DEALS", "CAPITAL", "STUDIO", "SUPPLY"])

mis = [
    ("Rotate it", M("#0B0B0C", 'transform="rotate(18 60 60)"')),
    ("Recolour it", M("#C8442F")),
    ("Stretch it", f'<g transform="translate(-30 0) scale(1.5 1)">{M("#0B0B0C")}</g>'),
    ("Outline it", '<g fill="none" stroke="#0B0B0C" stroke-width="2"><rect x="20" y="22" width="16" height="76"/>'
                   '<rect x="84" y="22" width="16" height="76"/><circle cx="60" cy="60" r="10"/></g>'),
    ("Move the point", '<g fill="#0B0B0C"><rect x="20" y="22" width="16" height="76"/>'
                       '<rect x="84" y="22" width="16" height="76"/><circle cx="60" cy="34" r="10"/></g>'),
    ("Add a shadow", f'<g transform="translate(5 5)" opacity=".3">{M("#0B0B0C")}</g>{M("#0B0B0C")}'),
    ("Box it in a circle", f'<circle cx="60" cy="60" r="56" fill="#0B0B0C"/>{M("#ECE8E1")}'),
    ("Change the gap", '<g fill="#0B0B0C"><rect x="36" y="22" width="16" height="76"/>'
                       '<rect x="68" y="22" width="16" height="76"/><circle cx="60" cy="60" r="7"/></g>'),
]
MISUSE = ''.join(
    f'<div style="position:relative;border:1px solid var(--lineD);display:grid;place-items:center">'
    f'<svg viewBox="0 0 120 120" style="width:170px">{g}</svg>'
    f'<svg viewBox="0 0 120 120" style="position:absolute;inset:0;width:100%;height:100%" preserveAspectRatio="none">'
    f'<line x1="0" y1="120" x2="120" y2="0" stroke="#C8442F" stroke-width=".35"/></svg>'
    f'<span class="k" style="position:absolute;left:22px;bottom:18px">{t}</span></div>' for t, g in mis)


def fr(sp, d):
    off = 32 * sp
    return (f'<g fill="#ECE8E1"><rect x="{60 - off - 8:.1f}" y="22" width="16" height="76"/>'
            f'<rect x="{60 + off - 8:.1f}" y="22" width="16" height="76"/><circle cx="60" cy="60" r="{10 * d:.1f}"/></g>')


frames = [(0.2, 0), (0.55, 0), (0.85, 0.3), (1, 0.85), (1, 1)]
FRAMES = ''.join(
    f'<div style="aspect-ratio:1;border:1px solid var(--line);display:grid;place-items:center;background:var(--graphite)">'
    f'<svg viewBox="0 0 120 120" style="width:62%">{fr(s, d)}</svg></div>' for s, d in frames)


def hood(body, hood_, strc, mark):
    return (f'<svg viewBox="0 0 300 320" style="width:470px;filter:drop-shadow(0 40px 50px rgba(0,0,0,.22))">'
            f'<path d="M98 58Q150 40 202 58L262 92L292 232L256 242L240 156V302H60V156L44 242L8 232L38 92Z" fill="{body}"/>'
            f'<path d="M108 60Q150 6 192 60Q150 86 108 60Z" fill="{hood_}"/>'
            f'<path d="M138 72V118M162 72V118" stroke="{strc}" stroke-width="2"/>'
            f'<rect x="96" y="214" width="108" height="56" rx="6" fill="none" stroke="{strc}" stroke-opacity=".3"/>'
            f'<g transform="translate(139 128) scale(.18)">{M(mark)}</g></svg>')


HOODIES = hood("#141416", "#0e0e10", "rgba(236,232,225,.4)", "#ECE8E1") + hood("#E2DDD4", "#D6D0C6", "rgba(11,11,12,.35)", "#0B0B0C")

out = (src.replace('{{WM}}', wm).replace('{{TOC}}', TOC).replace('{{SUBS}}', SUBS)
       .replace('{{MISUSE}}', MISUSE).replace('{{FRAMES}}', FRAMES).replace('{{HOODIES}}', HOODIES))
open('book.html', 'w').write(out)
print('ok', out.count('{{'))
