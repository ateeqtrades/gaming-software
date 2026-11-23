"""Build the Bagh FOB quotation template (Excel). Run: python3 build_quote.py"""
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

INK, BONE, GOLD, GREY, PALE = "0B0B0C", "F2EFE8", "C8B88A", "6E6A63", "F7F5F0"
thin = Side(style="thin", color="D9D4CA")
F = lambda **k: Font(name="Arial", **k)

wb = Workbook()
ws = wb.active
ws.title = "Quotation"
ws.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", [4, 26, 20, 24, 14, 14, 18]):
    ws.column_dimensions[col].width = w

def put(cell, value, **style):
    c = ws[cell]
    c.value = value
    for k, v in style.items():
        setattr(c, k, v)
    return c

# Header band
for r in range(1, 5):
    for col in "ABCDEFG":
        ws[f"{col}{r}"].fill = PatternFill("solid", fgColor=INK)
put("B2", "BAGH MINING & MINERALS", font=F(bold=True, size=16, color=BONE))
put("B3", "Bagh Import & Export (SMC-Private) Limited · CUIN 0233119 · Pakistan", font=F(size=9, color=GOLD))
put("G2", "QUOTATION", font=F(bold=True, size=14, color=BONE), alignment=Alignment(horizontal="right"))
put("G3", "FOB Karachi · Incoterms 2020", font=F(size=9, color=GOLD), alignment=Alignment(horizontal="right"))

# Reference block
labels = [("Quotation ref", "BAGH-MV-[YYMM]-[001]"), ("Date", "[DD Mon YYYY]"), ("Valid until", "[DD Mon YYYY]"),
          ("Buyer", "[Company name]"), ("Attention", "[Name, role]"), ("Delivery to", "[Port / island], Maldives"),
          ("Loading port", "[Karachi / Port Qasim]"), ("Prepared by", "Middlemen, for Bagh")]
r = 6
for i, (k, v) in enumerate(labels):
    row = r + i // 2
    kc, vc = ("B", "C") if i % 2 == 0 else ("E", "F")
    put(f"{kc}{row}", k, font=F(size=9, color=GREY))
    put(f"{vc}{row}", v, font=F(size=10, bold=True))
    if vc == "F":
        ws.merge_cells(f"F{row}:G{row}")

# Line items
hr = 12
heads = ["#", "Product", "Size / specification", "Standard", "Quantity (t)", "FOB USD / t", "Amount USD"]
for col, h in zip("ABCDEFG", heads):
    put(f"{col}{hr}", h, font=F(bold=True, size=9, color=BONE), fill=PatternFill("solid", fgColor=INK),
        alignment=Alignment(horizontal="left" if col in "BCD" else "right", vertical="center"))
ws.row_dimensions[hr].height = 22

products = [
    ("Washed river sand", "0 to 4.75 mm", "BS EN 12620 / ASTM C33"),
    ("Crush aggregate", "5 mm", "BS EN 12620 / ASTM C33"),
    ("Crush aggregate", "10 mm", "BS EN 12620 / ASTM C33"),
    ("Crush aggregate", "20 mm", "BS EN 12620 / ASTM C33"),
    ("Bajri gravel", "Natural, rounded", "To buyer spec"),
    ("Armour rock", "1 to 5 t blocks", "EN 13383"),
]
first = hr + 1
for i, (p, s, std) in enumerate(products):
    row = first + i
    vals = [i + 1, p, s, std, None, None, f'=IF(AND(E{row}<>"",F{row}<>""),E{row}*F{row},"")']
    for col, v in zip("ABCDEFG", vals):
        c = put(f"{col}{row}", v, font=F(size=10), border=Border(bottom=thin))
        if col in "EFG":
            c.alignment = Alignment(horizontal="right")
            c.number_format = '#,##0' if col == "E" else '#,##0.00'
        if col in "EF":
            c.fill = PatternFill("solid", fgColor=PALE)
last = first + len(products) - 1
tr = last + 1
put(f"D{tr}", "Total", font=F(bold=True, size=10))
put(f"E{tr}", f"=SUM(E{first}:E{last})", font=F(bold=True), number_format="#,##0", alignment=Alignment(horizontal="right"))
put(f"G{tr}", f"=SUM(G{first}:G{last})", font=F(bold=True), number_format='"USD "#,##0.00', alignment=Alignment(horizontal="right"))
for col in "DEFG":
    ws[f"{col}{tr}"].border = Border(top=Side(style="medium", color=INK))
put(f"B{tr + 1}", "Fill the shaded cells. Delete rows for products not quoted.", font=F(size=8, italic=True, color=GREY))

# Terms
terms = [
    ("Price basis", "FOB [Karachi / Port Qasim], Incoterms 2020. Freight, insurance and Maldives import costs are for the buyer's account. A CFR price is available on request once freight is confirmed."),
    ("Payment", "[Irrevocable LC at sight / ___% advance, balance against shipping documents]."),
    ("Loading window", "[Dates], subject to order confirmation by [date]."),
    ("Quantity tolerance", "Plus or minus [10]% at the seller's option, settled on bill of lading weight."),
    ("Inspection", "Independent inspection at loading by [inspection company]. Sealed reference samples kept by both parties."),
    ("Documents", "Commercial invoice, packing list, bill of lading, certificate of origin, lab test report per lot, inspection certificate."),
    ("Validity", "Prices are valid until the date above. After that they are subject to reconfirmation."),
]
r = tr + 3
put(f"B{r}", "TERMS", font=F(bold=True, size=9, color=GREY))
r += 1
for k, v in terms:
    put(f"B{r}", k, font=F(bold=True, size=9), alignment=Alignment(vertical="top"))
    put(f"C{r}", v, font=F(size=9), alignment=Alignment(wrap_text=True, vertical="top"))
    ws.merge_cells(f"C{r}:G{r}")
    ws.row_dimensions[r].height = 30
    r += 1

r += 1
put(f"B{r}", "For Bagh Import & Export (SMC-Private) Limited", font=F(bold=True, size=9))
put(f"E{r}", "Accepted by the buyer", font=F(bold=True, size=9))
r += 3
for col in ("B", "C", "E", "F", "G"):
    ws[f"{col}{r}"].border = Border(top=Side(style="thin", color=INK))
put(f"B{r}", "Name, signature, stamp", font=F(size=8, color=GREY))
put(f"E{r}", "Name, signature, stamp, date", font=F(size=8, color=GREY))

ws.print_area = f"A1:G{r}"
ws.page_setup.orientation = "portrait"
ws.page_setup.fitToWidth = 1
ws.sheet_properties.pageSetUpPr.fitToPage = True
ws.page_setup.fitToHeight = 1

# Internal sheet: never sent to buyers
it = wb.create_sheet("Internal · do not send")
it.sheet_view.showGridLines = False
it.sheet_properties.tabColor = "C8442F"
for col, w in zip("ABCDEFGH", [30, 14, 16, 16, 18, 18, 18, 20]):
    it.column_dimensions[col].width = w
it["A1"] = "INTERNAL ONLY. Delete this sheet or save the Quotation sheet as PDF before sending."
it["A1"].font = F(bold=True, color="C8442F")
it["A3"] = "Commission rate, sand / aggregate / gravel (USD per t)"
it["E3"] = 1.0
it["A4"] = "Commission rate, armour rock (USD per t)"
it["E4"] = None
it["A5"] = "Freight estimate (USD per t). UNVERIFIED placeholder until a Karachi agent quotes"
it["E5"] = None
for a in ("A3", "A4", "A5"):
    it[a].font = F(size=9)
for c in ("E3", "E4", "E5"):
    it[c].fill = PatternFill("solid", fgColor=PALE)
    it[c].number_format = "0.00"
heads = ["Line", "Quantity (t)", "FOB USD / t", "Commission USD", "Est. CFR USD / t", "Est. CFR total USD", "Bagh net after commission"]
for col, h in zip("ABCDEFG", heads):
    c = it[f"{col}7"]
    c.value = h
    c.font = F(bold=True, size=9, color=BONE)
    c.fill = PatternFill("solid", fgColor=INK)
for i in range(len(products)):
    qr, row = first + i, 8 + i
    rate = "$E$4" if i == len(products) - 1 else "$E$3"
    it[f"A{row}"] = f"=Quotation!B{qr}&\" \"&Quotation!C{qr}"
    it[f"B{row}"] = f'=IF(Quotation!E{qr}="","",Quotation!E{qr})'
    it[f"C{row}"] = f'=IF(Quotation!F{qr}="","",Quotation!F{qr})'
    it[f"D{row}"] = f'=IF(AND(B{row}<>"",{rate}<>""),B{row}*{rate},"")'
    it[f"E{row}"] = f'=IF(AND(C{row}<>"",$E$5<>""),C{row}+$E$5,"")'
    it[f"F{row}"] = f'=IF(AND(B{row}<>"",E{row}<>""),B{row}*E{row},"")'
    it[f"G{row}"] = f'=IF(AND(B{row}<>"",C{row}<>"",D{row}<>""),B{row}*C{row}-D{row},"")'
    for col in "BCDEFG":
        it[f"{col}{row}"].number_format = "#,##0.00"
        it[f"{col}{row}"].font = F(size=10)
    it[f"A{row}"].font = F(size=10)
tot = 8 + len(products)
it[f"A{tot}"] = "Total"
it[f"A{tot}"].font = F(bold=True)
for col in "BDFG":
    it[f"{col}{tot}"] = f"=SUM({col}8:{col}{tot - 1})"
    it[f"{col}{tot}"].font = F(bold=True)
    it[f"{col}{tot}"].number_format = "#,##0.00"
it[f"A{tot + 2}"] = "Commission is paid by Bagh out of its price. It is never added to the buyer's price."
it[f"A{tot + 2}"].font = F(size=9, italic=True, color=GREY)

dv = DataValidation(type="decimal", operator="greaterThanOrEqual", formula1="0", allow_blank=True)
ws.add_data_validation(dv)
dv.add(f"E{first}:F{last}")

wb.save("Bagh_FOB_Quotation_Template.xlsx")
print("saved")
