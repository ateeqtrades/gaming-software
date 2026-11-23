"""Build the buyer pipeline and freight agent workbook from public-source research (23 Nov 2026)."""
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

INK, BONE = "0B0B0C", "F2EFE8"
wb = Workbook()

def sheet(ws, heads, widths, rows):
    ws.append(heads)
    for c in ws[1]:
        c.font = Font(name="Arial", bold=True, color=BONE, size=10)
        c.fill = PatternFill("solid", fgColor=INK)
        c.alignment = Alignment(vertical="center", wrap_text=True)
    ws.row_dimensions[1].height = 30
    for r in rows:
        ws.append(r)
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.font = Font(name="Arial", size=10)
            c.alignment = Alignment(vertical="top", wrap_text=True)
    for i, w in enumerate(widths):
        ws.column_dimensions[chr(65 + i)].width = w
    ws.freeze_panes = "B2"

b = wb.active
b.title = "Buyers"
stages = ["Not contacted", "Contacted", "Replied", "Qualified", "Meeting held", "Docs sent", "Quote requested from Bagh",
          "Quote sent", "Negotiating", "PO / Contract", "Shipped", "Lost / Paused"]
sheet(b, ["Company", "Tier", "Type", "Contact person", "Role", "Email", "Phone", "Website", "Source", "Verified?", "Stage",
          "Last contact", "Next action", "Next follow-up", "Notes"],
      [26, 6, 18, 26, 20, 30, 22, 22, 34, 12, 18, 13, 30, 13, 46],
      [
          ["Nalahiya Trading Pvt Ltd", 1, "Materials importer and trader", "Ismail Jumayyil Waheed", "Managing Director", "md@nalahiyatrading.com", "+960 333 1999", "nalahiyatrading.com", "nalahiyatrading.com/our-team, /contact-us", "Yes", "Not contacted", None, "Send intro email once agreement is signed", None, "General: info@nalahiyatrading.com. Founder Ibrahim Waheed (Chairman). Own shipping arm and private port at Thilafushi. No procurement name published."],
          ["Central Line Pvt Ltd", 1, "Contractor and trader", None, None, "info@centralline.mv", "+960 333 4989 · sales +960 999 2746", "centralline.mv", "centralline.mv/contact", "Yes (general only)", "Not contacted", None, "Find a named buyer", None, "MVR 40.95M award from the brief is unconfirmed (search shows 19.79M on 24 Aug 2025 and 40.62M on 4 Nov 2025)."],
          ["Gravier Trading", 1, "Materials supplier (unverified)", None, None, None, None, "facebook.com/graviermv", "Facebook page only", "No", "Not contacted", None, "Ask introducer for contact", None, "No website or contact details found."],
          ["Compass Global", 1, "Unknown", None, None, None, None, None, None, "No", "Not contacted", None, "Confirm exact company name with introducer", None, "No Maldivian company found under this name."],
          ["STO plc, Construction Solutions", 2, "State importer of cement, sand, aggregate", None, None, "construction@sto.mv", "(960) 747 8585", "sto.mv", "sto.mv/business-areas/3", "Yes (general only)", "Not contacted", None, "Aim for approved supplier status", None, "Hulhumalé: construction.hm@sto.mv. Thilafushi: thilafushi@sto.mv. Unverified: Aminath Sama, tenders@sto.mv (2023 tender)."],
          ["MTCC plc", 2, "State marine and civil contractor", "General Manager, Procurement Division", "Procurement", "info@mtcc.com.mv", None, "mtcc.com.mv", "stockexchange.mv; gazette.gov.mv/iulaan/view/150952 (2021)", "Partly", "Not contacted", None, "Track boulder tenders", None, "Plans 2.5M t of boulders (Atoll Times, Oct 2025). tenders@mtcc.com.mv unverified."],
      ])
dv = DataValidation(type="list", formula1='"' + ",".join(stages) + '"', allow_blank=True)
b.add_data_validation(dv)
dv.add("K2:K200")

f = wb.create_sheet("Freight agents")
sheet(f, ["Firm", "Email", "Phone", "Address", "Source", "Why", "Quote requested", "Rate USD / t", "Transit days", "Valid until", "Notes"],
      [24, 32, 28, 28, 30, 30, 14, 12, 12, 12, 34],
      [
          ["Bulk Shipping (BSL)", "bulkshipping@bulkshipping.com.pk", "+92 21 35643371-4", "34-A/2 Lalazar Drive, Karachi", "bulkshipping.com.pk/contact-us", "Ship agency, cargo brokerage, bulk"],
          ["AIG Shipping", "info@aigshipping.com", "+92 21 34530165 · freight 34530164", "PECHS, Sharah-e-Faisal, Karachi", "aigshipping.com/page9.html", "Charters for break-bulk and minerals"],
          ["Pak Shaheen Group", "info@pakshaheen.com.pk", "+92 21 3285 7790-3 · UAN 111-725-742", "Timber Pond, Keamari, Karachi", "pakshaheen.com.pk", "Chartering and brokerage"],
          ["PNSC", "communication@pnsc.com.pk", "+92 21 99203980-99", "Karachi", "pnsc.com.pk", "National carrier, dry bulk"],
          ["Salamat AK", None, "+92 21 35308694", "Suite 421, The Plaza, Clifton", "magicport.ai (unverified listing)", "Break bulk, chartering"],
      ])
wb.save("Bagh_Maldives_Pipeline.xlsx")
print("saved")
