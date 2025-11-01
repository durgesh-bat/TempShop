from io import BytesIO
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    HRFlowable,
)


def generate_purchase_receipt(order):
    """Generate a polished PDF purchase receipt for the buyer."""

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )

    elements = []
    styles = getSampleStyleSheet()

    # ========== 🧾 Title ==========
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#4F46E5"),  # Indigo-600
        alignment=TA_CENTER,
        spaceAfter=20,
    )
    elements.append(Paragraph("PURCHASE RECEIPT", title_style))
    elements.append(HRFlowable(width="100%", thickness=1.2, color=colors.HexColor("#4F46E5")))
    elements.append(Spacer(1, 0.3 * inch))

    # ========== 🏢 Company Info ==========
    company_style = ParagraphStyle("Company", parent=styles["Normal"], fontSize=11, leading=14)
    elements.append(Paragraph("<b>TempShop E-Commerce</b>", styles["Heading2"]))
    elements.append(Paragraph("Email: support@tempshop.com", company_style))
    elements.append(Spacer(1, 0.25 * inch))

    # ========== 📦 Order Info ==========
    order_data = [
        ["Order ID:", f"#{order.id}"],
        ["Order Date:", order.created_at.strftime("%B %d, %Y %I:%M %p")],
        ["Status:", order.status.title()],
    ]
    order_table = Table(order_data, colWidths=[2.2 * inch, 3.8 * inch])
    order_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
    ]))
    elements.append(order_table)
    elements.append(Spacer(1, 0.25 * inch))

    # ========== 👤 Customer Info ==========
    user = order.user
    full_name = f"{user.first_name} {user.last_name}".strip() or user.username
    customer_data = [
        ["Name:", full_name],
        ["Email:", user.email],
        ["Phone:", getattr(user, "phone_number", "N/A")],
    ]
    customer_table = Table(customer_data, colWidths=[2.2 * inch, 3.8 * inch])
    customer_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
    ]))
    elements.append(Paragraph("<b>Customer Details:</b>", styles["Heading3"]))
    elements.append(customer_table)
    elements.append(Spacer(1, 0.25 * inch))

    # ========== 📍 Shipping Address ==========
    if getattr(order, "address", None):
        addr = order.address
        elements.append(Paragraph("<b>Shipping Address:</b>", styles["Heading3"]))
        elements.append(Paragraph(f"{addr.street}, {addr.city}", company_style))
        elements.append(Paragraph(f"{addr.state} {addr.postal_code}, {addr.country}", company_style))
        elements.append(Spacer(1, 0.3 * inch))

    # ========== 🛒 Items Table ==========
    elements.append(Paragraph("<b>Order Items:</b>", styles["Heading3"]))
    items_data = [["Product", "Quantity", "Price", "Subtotal"]]
    subtotal = 0

    for item in order.items.all():
        total_price = float(item.price * item.quantity)
        subtotal += total_price
        items_data.append([
            item.product.name,
            str(item.quantity),
            f"₹{item.price:.2f}",
            f"₹{total_price:.2f}",
        ])

    items_table = Table(items_data, colWidths=[3 * inch, 1 * inch, 1.25 * inch, 1.25 * inch])
    items_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#EEF2FF")]),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 0.3 * inch))

    # ========== 💰 Total Section ==========
    total_style = ParagraphStyle("Total", parent=styles["Normal"], fontSize=12, alignment=TA_RIGHT)
    elements.append(Spacer(1, 0.1 * inch))
    elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#4F46E5")))
    elements.append(Paragraph(f"<b>Total Amount: ₹{order.total:.2f}</b>", total_style))
    elements.append(Spacer(1, 0.4 * inch))

    # ========== 🧾 Footer ==========
    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER,
        leading=12,
    )
    elements.append(HRFlowable(width="100%", thickness=0.8, color=colors.lightgrey))
    elements.append(Spacer(1, 0.1 * inch))
    elements.append(Paragraph("Thank you for shopping with TempShop!", footer_style))
    elements.append(Paragraph("Generated automatically • No signature required", footer_style))

    # Build & return
    doc.build(elements)
    buffer.seek(0)
    return buffer
