"""Render the agreement in content.py to an editable DOCX and an HTML file for PDF printing.

Run from this folder:  python3 build.py  then  node ../../../scripts/print-pdf.cjs agreement.html agreement.pdf
"""
import html
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, Mm, RGBColor

from content import TITLE, VERSION, PARTIES, RECITAL, CLAUSES, SIGN

OUT = "Middlemen_Bagh_Representation_Agreement_Draft"
INK = RGBColor(0x0B, 0x0B, 0x0C)
GREY = RGBColor(0x6E, 0x6A, 0x63)


def docx_build():
    d = Document()
    s = d.sections[0]
    s.page_width, s.page_height = Mm(210), Mm(297)
    s.left_margin = s.right_margin = Mm(20)
    s.top_margin, s.bottom_margin = Mm(18), Mm(16)
    st = d.styles["Normal"]
    st.font.name = "Arial"
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    st.font.size = Pt(9.5)
    st.paragraph_format.space_after = Pt(3)
    st.paragraph_format.line_spacing = 1.15

    p = d.add_paragraph()
    r = p.add_run(VERSION.upper())
    r.font.size, r.font.color.rgb = Pt(7.5), GREY
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT

    p = d.add_paragraph()
    r = p.add_run(TITLE)
    r.bold, r.font.size, r.font.color.rgb = True, Pt(16), INK
    p.paragraph_format.space_after = Pt(8)

    p = d.add_paragraph()
    p.add_run("This agreement is made between:").font.color.rgb = GREY
    for i, (_, text) in enumerate(PARTIES, 1):
        p = d.add_paragraph(f"({i})  {text}")
        p.paragraph_format.left_indent = Mm(4)
    d.add_paragraph(RECITAL).paragraph_format.space_after = Pt(6)

    for n, (head, paras) in enumerate(CLAUSES, 1):
        p = d.add_paragraph()
        r = p.add_run(f"{n}.  {head}")
        r.bold, r.font.size = True, Pt(10)
        p.paragraph_format.space_before = Pt(5)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.keep_with_next = True
        for k, t in enumerate(paras, 1):
            label = f"{n}.{k}  " if len(paras) > 1 else ""
            q = d.add_paragraph(label + t)
            q.paragraph_format.left_indent = Mm(6)

    d.add_paragraph().paragraph_format.space_after = Pt(4)
    t = d.add_table(rows=1, cols=2)
    for col, (who, lines) in zip(t.rows[0].cells, SIGN):
        col.paragraphs[0].add_run(who).bold = True
        for line in lines:
            q = col.add_paragraph()
            q.paragraph_format.space_before = Pt(10)
            r = q.add_run(f"{line}: ______________________")
            r.font.color.rgb = GREY
    for cell in t.rows[0].cells:
        tcPr = cell._tc.get_or_add_tcPr()
        w = OxmlElement("w:tcW")
        w.set(qn("w:w"), "4800")
        w.set(qn("w:type"), "dxa")
        tcPr.append(w)
    d.save(OUT + ".docx")


def html_build():
    e = html.escape
    clauses = "".join(
        f'<section><h2><span>{n}</span>{e(h)}</h2>'
        + "".join(f'<p><span class="sub">{n}.{k}</span>{e(t)}</p>' if len(ps) > 1 else f"<p>{e(t)}</p>"
                  for k, t in enumerate(ps, 1))
        + "</section>"
        for n, (h, ps) in enumerate(CLAUSES, 1))
    parties = "".join(f"<p><b>({i})</b> {e(t)}</p>" for i, (_, t) in enumerate(PARTIES, 1))
    sign = "".join(
        f'<div class="sig"><b>{e(w)}</b>' + "".join(f'<div class="line"><span>{e(l)}</span></div>' for l in ls) + "</div>"
        for w, ls in SIGN)
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><title>{e(TITLE)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Geist+Mono:wght@400&display=swap">
<style>
@page {{ size: A4; margin: 16mm 18mm 14mm; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: "Inter Tight", Arial, sans-serif; font-size: 9.1pt; line-height: 1.45; color: #0B0B0C; }}
.ver {{ font-family: "Geist Mono", monospace; font-size: 6.8pt; letter-spacing: .12em; text-transform: uppercase; color: #8a867f; text-align: right; }}
h1 {{ font-size: 17pt; font-weight: 700; letter-spacing: -.01em; margin: 4mm 0 4mm; }}
.intro {{ color: #6E6A63; margin-bottom: 1.5mm; }}
.parties p {{ margin: 0 0 1.6mm 3mm; }}
.recital {{ margin: 2.5mm 0 3mm; }}
.cols {{ column-count: 2; column-gap: 9mm; }}
section {{ break-inside: avoid; margin-bottom: 2.6mm; }}
h2 {{ font-size: 9.4pt; font-weight: 700; margin-bottom: .8mm; display: flex; gap: 2.5mm; }}
h2 span {{ font-family: "Geist Mono", monospace; font-weight: 400; color: #8a867f; min-width: 4mm; }}
section p {{ margin: 0 0 1mm 7.5mm; }}
.sub {{ font-family: "Geist Mono", monospace; font-size: 7pt; color: #8a867f; margin-left: -7.5mm; display: inline-block; width: 7.5mm; }}
.signs {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; margin-top: 5mm; padding-top: 4mm; border-top: 1px solid #0B0B0C; break-inside: avoid; }}
.sig b {{ display: block; margin-bottom: 1mm; }}
.line {{ border-bottom: 1px solid rgba(11,11,12,.3); height: 8.5mm; display: flex; align-items: flex-end; padding-bottom: .8mm; }}
.line span {{ font-family: "Geist Mono", monospace; font-size: 6.6pt; letter-spacing: .08em; text-transform: uppercase; color: #8a867f; }}
</style></head><body>
<div class="ver">{e(VERSION)}</div>
<h1>{e(TITLE)}</h1>
<p class="intro">This agreement is made between:</p>
<div class="parties">{parties}</div>
<p class="recital">{e(RECITAL)}</p>
<div class="cols">{clauses}</div>
<div class="signs">{sign}</div>
</body></html>"""
    open(OUT + ".html", "w").write(doc)


if __name__ == "__main__":
    docx_build()
    html_build()
    print("built", OUT)
