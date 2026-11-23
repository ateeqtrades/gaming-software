# Single source for the Bagh representation agreement. build.py renders it to DOCX and PDF.

TITLE = "Sales Representation and Commission Agreement"
VERSION = "Draft v1 · 23 November 2026"

PARTIES = [
    ("Bagh",
     "Bagh Import & Export (SMC-Private) Limited, incorporated in Pakistan under the Companies Act, 2017, "
     "CUIN 0233119, trading as Bagh Mining & Minerals, of [registered address], represented by "
     "[owner's full name], [designation] (\"Bagh\")."),
    ("Middlemen",
     "Syed Ahmad Hassan, CNIC [number], and Dayan Khan, CNIC [number], acting together as partners under "
     "the name Middlemen, of [address] (\"Middlemen\")."),
]

RECITAL = ("Bagh produces and sells bulk construction materials. Middlemen introduces suppliers to buyers. "
           "Bagh wants Middlemen to find and develop buyers for its products in the Maldives, and both "
           "parties agree as follows.")

CLAUSES = [
    ("Appointment",
     ["Bagh appoints Middlemen as its exclusive sales representative for the Products in the Republic of "
      "Maldives (the \"Territory\"), and Middlemen accepts.",
      "Middlemen may introduce Bagh to buyers, share material Bagh has approved, and negotiate on Bagh's behalf. "
      "Middlemen may not sign contracts or make binding commitments for Bagh.",
      "Bagh approves every price, delivery date, specification and payment term before it is sent to a buyer, "
      "and Bagh signs every sales contract."]),
    ("Products",
     ["Washed river sand; crush aggregate (5 mm, 10 mm, 20 mm); bajri / khaka gravel; and armour rock / sea "
      "defence boulders (1 to 5 tonne blocks). Other products may be added by written agreement."]),
    ("Term and exclusivity",
     ["This agreement starts on the date of signing and runs for 12 months. It renews for further 12 month "
      "periods unless either party gives 30 days' written notice before the end of a period.",
      "If no trial order has been placed by an Introduced Buyer within 6 months of signing, Bagh may end the "
      "exclusivity (but not the rest of this agreement) by written notice."]),
    ("Introduced Buyers",
     ["An \"Introduced Buyer\" is any company or person in the Territory that Middlemen names to Bagh in "
      "writing (email or WhatsApp is enough) before Bagh has dealt with it, together with its group companies.",
      "If Bagh already has a documented relationship with a named buyer, it will say so in writing within "
      "5 business days, otherwise that buyer is an Introduced Buyer."]),
    ("Commission",
     ["Bagh pays Middlemen USD 1.00 per metric tonne of river sand, aggregate and gravel shipped to an "
      "Introduced Buyer.",
      "For armour rock, the rate is [USD ___ per tonne / ___% of the FOB invoice value], or as agreed in writing "
      "for each project before the quotation is issued.",
      "Tonnage is taken from the bill of lading. Commission comes out of Bagh's price and is not added to the "
      "buyer's price unless both parties agree in writing."]),
    ("Payment",
     ["Bagh pays commission for each shipment within 7 days of receiving the buyer's payment for it, by bank "
      "transfer to the account Middlemen gives in writing, in USD or in PKR at the bank's rate on the day of payment.",
      "With each payment Bagh shares copies of the commercial invoice and bill of lading."]),
    ("Protection",
     ["Commission is due on every order from an Introduced Buyer, including repeat orders and orders placed "
      "directly with Bagh or through any other party, during this agreement and for 24 months after it ends.",
      "Neither party will go around the other to deal with an Introduced Buyer, or with a contact the other "
      "has shared, without the other's written consent."]),
    ("Costs",
     ["Bagh pays for samples, lab tests and courier. Travel to the Maldives is shared 50/50 when both parties "
      "agree the trip in writing beforehand. Each party otherwise pays its own costs."]),
    ("What each party does",
     ["Bagh provides current FOB prices with a validity date, monthly capacity, lab reports and export "
      "documents; answers quotation requests within 2 business days; and tells Middlemen about any contact "
      "or order from an Introduced Buyer.",
      "Middlemen represents Bagh honestly and only with approved information, keeps a record of every buyer "
      "contacted, and reports progress to Bagh every week."]),
    ("Confidentiality",
     ["Each party keeps the other's buyer lists, prices and terms confidential during this agreement and for "
      "2 years after it ends."]),
    ("Ending the agreement",
     ["Either party may end this agreement by written notice if the other seriously breaches it and does not "
      "put it right within 14 days of being asked to. Commission already earned, and the Protection and "
      "Confidentiality clauses, survive the end of this agreement."]),
    ("General",
     ["This agreement is governed by the laws of Pakistan. The parties will first try to settle any dispute "
      "by good-faith discussion for 30 days, then by the courts at [Karachi / Islamabad].",
      "Changes must be in writing and signed by both parties. Middlemen may transfer this agreement to a "
      "company it registers, with notice to Bagh.",
      "This is the whole agreement between the parties on this subject."]),
]

SIGN = [
    ("For Bagh Import & Export (SMC-Private) Limited", ["Name", "Designation", "Signature", "Date", "Company stamp"]),
    ("For Middlemen", ["Syed Ahmad Hassan", "Signature", "Dayan Khan", "Signature", "Date"]),
]
