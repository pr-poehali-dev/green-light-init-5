import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки участницы конкурса Мисс и Миссис Интернет Краснокаменск 2026 на почту организатора."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')

    name = body.get('name', '').strip()
    age = body.get('age', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip()
    category = body.get('category', '').strip()
    about = body.get('about', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните обязательные поля: имя и телефон'})
        }

    smtp_password = os.environ['SMTP_PASSWORD']
    sender = 'kot_diana@internet.ru'
    recipient = 'kot_diana@internet.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка на конкурс: {name}'
    msg['From'] = sender
    msg['To'] = recipient

    html = f"""
    <html><body style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
      <h2 style="color: #9b59b6;">👑 Новая заявка — Мисс и Миссис Интернет Краснокаменск 2026</h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Имя</td><td style="padding:8px; border-bottom:1px solid #eee;">{name}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Возраст</td><td style="padding:8px; border-bottom:1px solid #eee;">{age or '—'}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Телефон</td><td style="padding:8px; border-bottom:1px solid #eee;">{phone}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Email</td><td style="padding:8px; border-bottom:1px solid #eee;">{email or '—'}</td></tr>
        <tr><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">Категория</td><td style="padding:8px; border-bottom:1px solid #eee;">{category or '—'}</td></tr>
        <tr><td style="padding:8px; font-weight:bold; vertical-align:top;">О себе</td><td style="padding:8px;">{about or '—'}</td></tr>
      </table>
    </body></html>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.internet.ru', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Заявка отправлена!'})
    }
