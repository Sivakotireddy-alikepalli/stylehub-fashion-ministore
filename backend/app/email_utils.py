import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_invoice_email(to_email: str, order_id: int, pdf_buffer):
    try:
        msg = EmailMessage()
        msg["Subject"] = f"StyleHub Invoice - Order #{order_id}"
        msg["From"] = SMTP_EMAIL
        msg["To"] = to_email

        msg.set_content(
            f"""
Hello,

Thank you for shopping with StyleHub.

Your payment was successful.
Please find attached your invoice for Order #{order_id}.

Best regards,
StyleHub Team
"""
        )

        pdf_buffer.seek(0)
        msg.add_attachment(
            pdf_buffer.read(),
            maintype="application",
            subtype="pdf",
            filename=f"invoice_order_{order_id}.pdf"
        )

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        print(f"Invoice email sent successfully to {to_email}")
        return True

    except Exception as e:
        print("Email send failed:", str(e))
        return False