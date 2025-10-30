from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from io import BytesIO

def generate_selling_receipt(order_item, shopkeeper):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#8b5cf6'), alignment=TA_CENTER)
    elements.append(Paragraph("SELLING RECEIPT", title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Shopkeeper Info
    elements.append(Paragraph(f"<b>{shopkeeper.business_name or shopkeeper.username}</b>", styles['Heading2']))
    elements.append(Paragraph(f"Email: {shopkeeper.email}", styles['Normal']))
    if shopkeeper.phone_number:
        elements.append(Paragraph(f"Phone: {shopkeeper.phone_number}", styles['Normal']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Order Info
    order_data = [
        ['Order ID:', f'#{order_item.order.id}'],
        ['Order Date:', order_item.order.created_at.strftime('%B %d, %Y %I:%M %p')],
        ['Status:', order_item.order.status.upper()],
    ]
    order_table = Table(order_data, colWidths=[2*inch, 4*inch])
    order_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(order_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Customer Info
    elements.append(Paragraph("<b>Customer Details:</b>", styles['Heading3']))
    customer_data = [
        ['Name:', f"{order_item.order.user.first_name} {order_item.order.user.last_name}" if order_item.order.user.first_name else order_item.order.user.username],
        ['Email:', order_item.order.user.email],
        ['Phone:', order_item.order.user.phone_number or 'N/A'],
    ]
    customer_table = Table(customer_data, colWidths=[2*inch, 4*inch])
    customer_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(customer_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Shipping Address
    if order_item.order.address:
        elements.append(Paragraph("<b>Shipping Address:</b>", styles['Heading3']))
        addr = order_item.order.address
        elements.append(Paragraph(f"{addr.street}, {addr.city}", styles['Normal']))
        elements.append(Paragraph(f"{addr.state} {addr.postal_code}, {addr.country}", styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))
    
    # Product Details
    elements.append(Paragraph("<b>Product Details:</b>", styles['Heading3']))
    product_data = [
        ['Product', 'Quantity', 'Price', 'Subtotal'],
        [order_item.product.name, str(order_item.quantity), f'₹{order_item.price}', f'₹{order_item.price * order_item.quantity}']
    ]
    
    product_table = Table(product_data, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
    product_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8b5cf6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
    ]))
    elements.append(product_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Financial Breakdown
    subtotal = float(order_item.price * order_item.quantity)
    commission_rate = 0.15
    commission = subtotal * commission_rate
    net_earnings = subtotal - commission
    
    financial_data = [
        ['Subtotal:', f'₹{subtotal:.2f}'],
        ['Platform Commission (15%):', f'- ₹{commission:.2f}'],
        ['Net Earnings:', f'₹{net_earnings:.2f}'],
    ]
    financial_table = Table(financial_data, colWidths=[4.5*inch, 2*inch])
    financial_table.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('LINEABOVE', (0, -1), (-1, -1), 2, colors.HexColor('#8b5cf6')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(financial_table)
    elements.append(Spacer(1, 0.5*inch))
    
    # Footer
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, textColor=colors.grey, alignment=TA_CENTER)
    elements.append(Paragraph("Thank you for being a valued TempShop seller!", footer_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
