from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from io import BytesIO
from datetime import datetime

def generate_purchase_receipt(order):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#6366f1'), alignment=TA_CENTER)
    elements.append(Paragraph("PURCHASE RECEIPT", title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Company Info
    elements.append(Paragraph("<b>TempShop E-Commerce</b>", styles['Normal']))
    elements.append(Paragraph("Email: support@tempshop.com", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # Order Info
    order_data = [
        ['Order ID:', f'#{order.id}'],
        ['Order Date:', order.created_at.strftime('%B %d, %Y %I:%M %p')],
        ['Status:', order.status.upper()],
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
        ['Name:', f"{order.user.first_name} {order.user.last_name}" if order.user.first_name else order.user.username],
        ['Email:', order.user.email],
        ['Phone:', order.user.phone_number or 'N/A'],
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
    if order.address:
        elements.append(Paragraph("<b>Shipping Address:</b>", styles['Heading3']))
        elements.append(Paragraph(f"{order.address.street}, {order.address.city}", styles['Normal']))
        elements.append(Paragraph(f"{order.address.state} {order.address.postal_code}, {order.address.country}", styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))
    
    # Items Table
    elements.append(Paragraph("<b>Order Items:</b>", styles['Heading3']))
    items_data = [['Product', 'Quantity', 'Price', 'Total']]
    for item in order.items.all():
        items_data.append([
            item.product.name,
            str(item.quantity),
            f'₹{item.price}',
            f'₹{item.price * item.quantity}'
        ])
    
    items_table = Table(items_data, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6366f1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')]),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Total
    total_style = ParagraphStyle('Total', parent=styles['Normal'], fontSize=14, alignment=TA_RIGHT)
    elements.append(Paragraph(f"<b>Total Amount: ₹{order.total}</b>", total_style))
    elements.append(Spacer(1, 0.5*inch))
    
    # Footer
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, textColor=colors.grey, alignment=TA_CENTER)
    elements.append(Paragraph("Thank you for shopping with TempShop!", footer_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
