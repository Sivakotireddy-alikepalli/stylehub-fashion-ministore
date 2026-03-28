from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def generate_invoice_pdf(order):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    y = height - 50

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, y, "StyleHub Invoice")

    y -= 40
    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, y, f"Order ID: {order.id}")
    y -= 20
    pdf.drawString(50, y, f"Status: {order.status}")
    y -= 20
    pdf.drawString(50, y, f"Total Amount: ₹{order.total_amount}")

    y -= 40
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Items:")

    y -= 25
    pdf.setFont("Helvetica", 12)

    for item in order.items:
        line = f"{item.product.name} | Qty: {item.quantity} | Price: ₹{item.price}"
        pdf.drawString(60, y, line)
        y -= 20

        if y < 80:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 12)

    y -= 20
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Thank you for shopping with StyleHub!")

    pdf.save()
    buffer.seek(0)
    return buffer