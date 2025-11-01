from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable


def generate_selling_receipt(order_item, shopkeeper):
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

    # ========== 🎯 Title ==========
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#7C3AED"),
        alignment=TA_CENTER,
        spaceAfter=20,
    )
    elements.append(Paragraph("SELLING RECEIPT", title_style))
    elements.append(HRFlowable(width="100%", thickness=1.2, color=colors.HexColor("#7C3AED")))
    elements.append(Spacer(1, 0.25 * inch))

    # ========== 🏪 Shopkeeper Info ==========
    shop_name = shopkeeper.business_name or shopkeeper.username
    shop_style = ParagraphStyle("ShopInfo", parent=styles["Normal"], fontSize=11, leading=14)
    elements.append(Paragraph(f"<b>{shop_name}</b>", styles["Heading2"]))
    elements.append(Paragraph(f"Email: {shopkeeper.email}", shop_style))
    if getattr(shopkeeper, "phone_number", None):
        elements.append(Paragraph(f"Phone: {shopkeeper.phone_number}", shop_style))
    elements.append(Spacer(1, 0.25 * inch))

    # ========== 📦 Order Info ==========
    order_data = [
        ["Order ID:", f"#{order_item.order.id}"],
        ["Order Date:", order_item.order.created_at.strftime("%B %d, %Y %I:%M %p")],
        ["Status:", order_item.order.status.title()],
    ]
    order_table = Table(order_data, colWidths=[2.2 * inch, 3.8 * inch])
    order_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
    ]))
    elements.append(order_table)
    elements.append(Spacer(1, 0.2 * inch))

    # ========== 👤 Customer Info ==========
    customer = order_item.order.user
    full_name = f"{customer.first_name} {customer.last_name}".strip() or customer.username
    customer_data = [
        ["Name:", full_name],
        ["Email:", customer.email],
        ["Phone:", getattr(customer, "phone_number", "N/A")],
    ]
    customer_table = Table(customer_data, colWidths=[2.2 * inch, 3.8 * inch])
    customer_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
    ]))
    elements.append(Paragraph("<b>Customer Details:</b>", styles["Heading3"]))
    elements.append(customer_table)
    elements.append(Spacer(1, 0.2 * inch))

    # ========== 🏠 Shipping Address ==========
    if getattr(order_item.order, "address", None):
        addr = order_item.order.address
        elements.append(Paragraph("<b>Shipping Address:</b>", styles["Heading3"]))
        elements.append(Paragraph(f"{addr.street}, {addr.city}", shop_style))
        elements.append(Paragraph(f"{addr.state} {addr.postal_code}, {addr.country}", shop_style))
        elements.append(Spacer(1, 0.25 * inch))

    # ========== 🛍 Product Details ==========
    product = order_item.product
    subtotal = float(order_item.price * order_item.quantity)
    elements.append(Paragraph("<b>Product Details:</b>", styles["Heading3"]))

    product_data = [
        ["Product", "Quantity", "Price", "Subtotal"],
        [product.name, str(order_item.quantity), f"₹ {order_item.price:.2f}", f"₹{subtotal:.2f}"],
    ]
    product_table = Table(product_data, colWidths=[3 * inch, 1 * inch, 1.25 * inch, 1.25 * inch])
    product_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#7C3AED")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ]))
    elements.append(product_table)
    elements.append(Spacer(1, 0.3 * inch))

    # ========== 💰 Financial Breakdown ==========
    commission_rate = 0.15
    commission = subtotal * commission_rate
    net_earnings = subtotal - commission

    # Format numbers first
    subtotal_text = f"₹{subtotal:.2f}"
    commission_text = f"- ₹{commission:.2f}"
    net_earnings_text = f"₹{net_earnings:.2f}"

    # Define styles
    currency_style = ParagraphStyle("Currency", fontSize=10, alignment=TA_RIGHT)
    label_style = ParagraphStyle("Label", fontSize=10)
    highlight_style = ParagraphStyle("Highlight", fontSize=11, textColor=colors.HexColor("#7C3AED"), alignment=TA_RIGHT)

    financial_data = [
        [Paragraph("Subtotal:", label_style), Paragraph(subtotal_text, currency_style)],
        [Paragraph(f"Platform Commission ({commission_rate * 100:.0f}%):", label_style),
         Paragraph(commission_text, currency_style)],
        [Paragraph("<b>Net Earnings:</b>", label_style),
         Paragraph(f"<b>{net_earnings_text}</b>", highlight_style)],
    ]

    fin_table = Table(financial_data, colWidths=[4.5 * inch, 2 * inch])
    fin_table.setStyle(TableStyle([
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("LINEABOVE", (0, -1), (-1, -1), 1.5, colors.HexColor("#7C3AED")),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(fin_table)
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
    elements.append(Paragraph("Thank you for being a valued TempShop seller!", footer_style))
    elements.append(Paragraph("Generated automatically by TempShop • No signature required", footer_style))

    # Build & return
    doc.build(elements)
    buffer.seek(0)
    return buffer
