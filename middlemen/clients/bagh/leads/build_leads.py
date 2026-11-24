"""Merge the researched lead CSVs into one tracker workbook.

Usage: python3 build_leads.py <maldives.csv> <world.csv> <output.xlsx>
Contact details come only from pages that were read during research; blanks mean nothing was published.
"""
import csv
import sys
from collections import Counter

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

INK, BONE = "06171D", "F5F2EC"
REQUESTED = ["nalahiya", "gravier", "compass global", "central line"]
TOP_MV = ["mtcc", "sto ", "state trading", "apollo", "heavy force", "rcc", "road development", "sas e", "højgaard", "hojgaard", "powermix"]
STAGES = ["Not contacted", "Contacted", "Replied", "Qualified", "Meeting held", "Docs sent", "Quote sent", "Negotiating", "PO / Contract", "Lost / Paused"]
SRC = ["Company", "Country", "City/Island", "Category", "Why relevant", "Website", "General email", "Phone", "Named contact", "Contact role", "Source URL", "Verified"]
HEAD = ["Priority"] + SRC + ["Stage", "Last contact", "Next action", "Next follow-up", "Notes"]
WIDTHS = [14, 30, 14, 16, 26, 44, 26, 30, 22, 22, 18, 40, 11, 16, 13, 26, 14, 30]


def load(path):
    with open(path, newline="", encoding="utf-8") as f:
        return [{k: (r.get(k) or "").strip() for k in SRC} for r in csv.DictReader(f) if (r.get("Company") or "").strip()]


def priority(row, maldives):
    name = row["Company"].lower()
    if maldives and any(k in name for k in REQUESTED):
        return "1 Requested"
    if maldives and any(k in name for k in TOP_MV):
        return "2 High"
    has_contact = row["General email"] or row["Phone"]
    if row["Verified"] == "Yes" and row["General email"]:
        return "3 Ready" if maldives else "3 Ready"
    return "4 Has phone" if has_contact else "5 Needs contact"


def sheet(wb, title, rows, maldives):
    ws = wb.create_sheet(title)
    ws.append(HEAD)
    for r in rows:
        r["_p"] = priority(r, maldives)
    rows.sort(key=lambda r: (r["_p"], r["Country"], r["Company"].lower()))
    for r in rows:
        ws.append([r["_p"]] + [r[k] for k in SRC] + ["Not contacted", None, None, None, None])
    for c in ws[1]:
        c.font = Font(name="Arial", bold=True, color=BONE, size=10)
        c.fill = PatternFill("solid", fgColor=INK)
        c.alignment = Alignment(vertical="center", wrap_text=True)
    ws.row_dimensions[1].height = 28
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.font = Font(name="Arial", size=10)
            c.alignment = Alignment(vertical="top", wrap_text=True)
        if row[0].value == "1 Requested":
            for c in row:
                c.fill = PatternFill("solid", fgColor="E2D3B0")
    for i, w in enumerate(WIDTHS, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = "C2"
    ws.auto_filter.ref = ws.dimensions
    dv = DataValidation(type="list", formula1='"' + ",".join(STAGES) + '"', allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(f"N2:N{max(2, ws.max_row)}")
    return ws


def main():
    mv, world, out = sys.argv[1:4]
    mv_rows, w_rows = load(mv), load(world)
    wb = Workbook()
    start = wb.active
    start.title = "Start here"
    lines = [
        ("Bagh sales list", True),
        ("Researched 24 November 2026 from public web pages. Nobody on this list has been contacted.", False),
        ("", False),
        ("Rules", True),
        ("Do not contact any buyer until the Bagh representation agreement is signed.", False),
        ("Every email, phone and name was copied from a page that was read. Blank means nothing was published. Nothing was guessed.", False),
        ("Verified: Yes = from the company's own or an official page. Directory = third-party listing, may be old. No = name only.", False),
        ("Check each contact on the Source URL before the first message. Directory rows and tender mailboxes are the least reliable.", False),
        ("", False),
        ("Priority", True),
        ("1 Requested = the companies Bagh's owner asked for. 2 High = strongest Maldives prospects. 3 Ready = verified email.", False),
        ("4 Has phone = phone or unverified email only. 5 Needs contact = find a contact first.", False),
        ("", False),
        (f"Maldives: {len(mv_rows)} companies. Worldwide: {len(w_rows)} companies.", True),
    ]
    for text, bold in lines:
        start.append([text])
        start.cell(row=start.max_row, column=1).font = Font(name="Arial", size=14 if text == "Bagh sales list" else 10, bold=bold)
    start.column_dimensions["A"].width = 120
    start.append([""])
    start.append(["Worldwide by country"])
    start.cell(row=start.max_row, column=1).font = Font(name="Arial", size=10, bold=True)
    for country, n in sorted(Counter(r["Country"] for r in w_rows).items(), key=lambda x: -x[1]):
        start.append([f"{country}: {n}"])
        start.cell(row=start.max_row, column=1).font = Font(name="Arial", size=10)
    sheet(wb, "Maldives", mv_rows, True)
    sheet(wb, "Worldwide", w_rows, False)
    wb.save(out)
    for name, rows in (("Maldives", mv_rows), ("Worldwide", w_rows)):
        print(name, len(rows), dict(sorted(Counter(r["_p"] for r in rows).items())),
              "with email:", sum(1 for r in rows if r["General email"]))


if __name__ == "__main__":
    main()
