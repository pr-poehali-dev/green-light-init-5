import json
import smtplib
import os
import base64
import hmac
import hashlib
import datetime
import urllib.request
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage


def s3_put(key: str, data: bytes, content_type: str):
    access_key = os.environ['AWS_ACCESS_KEY_ID']
    secret_key = os.environ['AWS_SECRET_ACCESS_KEY']
    bucket = 'files'
    host = 'bucket.poehali.dev'
    region = 'us-east-1'
    service = 's3'

    now = datetime.datetime.utcnow()
    date_stamp = now.strftime('%Y%m%d')
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')

    payload_hash = hashlib.sha256(data).hexdigest()
    canonical_headers = f'host:{host}\nx-amz-content-sha256:{payload_hash}\nx-amz-date:{amz_date}\n'
    signed_headers = 'host;x-amz-content-sha256;x-amz-date'
    canonical_request = f'PUT\n/{bucket}/{key}\n\n{canonical_headers}\n{signed_headers}\n{payload_hash}'
    credential_scope = f'{date_stamp}/{region}/{service}/aws4_request'
    string_to_sign = f'AWS4-HMAC-SHA256\n{amz_date}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode()).hexdigest()}'

    def sign(key_bytes, msg):
        return hmac.new(key_bytes, msg.encode(), hashlib.sha256).digest()

    signing_key = sign(sign(sign(sign(f'AWS4{secret_key}'.encode(), date_stamp), region), service), 'aws4_request')
    signature = hmac.new(signing_key, string_to_sign.encode(), hashlib.sha256).hexdigest()

    authorization = (
        f'AWS4-HMAC-SHA256 Credential={access_key}/{credential_scope}, '
        f'SignedHeaders={signed_headers}, Signature={signature}'
    )

    url = f'https://{host}/{bucket}/{key}'
    req = urllib.request.Request(url, data=data, method='PUT')
    req.add_header('Host', host)
    req.add_header('Content-Type', content_type)
    req.add_header('x-amz-date', amz_date)
    req.add_header('x-amz-content-sha256', payload_hash)
    req.add_header('Authorization', authorization)
    with urllib.request.urlopen(req) as resp:
        return resp.status


def handler(event: dict, context) -> dict:
    """Отправка заявки участницы конкурса Мисс и Миссис Интернет Краснокаменск 2026 с фото и согласиями."""

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
    consent_personal = body.get('consentPersonal', False)
    consent_photos = body.get('consentPhotos', False)
    photos = body.get('photos', [])

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните обязательные поля: имя и телефон'})
        }

    if len(photos) < 3:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Необходимо прикрепить 3 фотографии'})
        }

    if not consent_personal or not consent_photos:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Необходимо дать все согласия'})
        }

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    safe_name = ''.join(c if c.isalnum() else '_' for c in name.lower())
    photo_urls = []
    photo_data_list = []

    for i, photo_b64 in enumerate(photos[:3]):
        if ',' in photo_b64:
            photo_b64 = photo_b64.split(',', 1)[1]
        photo_bytes = base64.b64decode(photo_b64)
        key = f'applications/{safe_name}_{phone[-4:]}_photo{i+1}.jpg'
        s3_put(key, photo_bytes, 'image/jpeg')
        cdn_url = f"https://cdn.poehali.dev/projects/{access_key}/files/{key}"
        photo_urls.append(cdn_url)
        photo_data_list.append(photo_bytes)

    smtp_password = os.environ['SMTP_PASSWORD']
    sender = 'kot_diana@internet.ru'
    recipient = 'kot_diana@internet.ru'

    msg = MIMEMultipart('mixed')
    msg['Subject'] = f'Заявка [{category}]: {name}'
    msg['From'] = sender
    msg['To'] = recipient

    photos_html = "".join([
        f'<div style="display:inline-block;margin:4px;"><img src="{url}" style="width:160px;height:160px;object-fit:cover;border-radius:8px;border:2px solid #ddd;" /></div>'
        for url in photo_urls
    ])

    yes_color = 'green'
    no_color = 'red'
    cp_text = '&#10003; Дано' if consent_personal else '&#10007; Не дано'
    cp_color = yes_color if consent_personal else no_color
    cph_text = '&#10003; Дано' if consent_photos else '&#10007; Не дано'
    cph_color = yes_color if consent_photos else no_color

    html = f"""
    <html><body style="font-family:Arial,sans-serif;color:#333;max-width:640px;">
      <h2 style="color:#9b59b6;">&#128081; Новая заявка &mdash; Мисс и Миссис Интернет Краснокаменск 2026</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:160px;">Категория</td><td style="padding:8px;border-bottom:1px solid #eee;"><b>{category}</b></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Имя</td><td style="padding:8px;border-bottom:1px solid #eee;">{name}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Возраст</td><td style="padding:8px;border-bottom:1px solid #eee;">{age or '&mdash;'}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Телефон</td><td style="padding:8px;border-bottom:1px solid #eee;">{phone}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">{email or '&mdash;'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">О себе</td><td style="padding:8px;">{about or '&mdash;'}</td></tr>
      </table>
      <h3 style="color:#9b59b6;">Фотографии</h3>
      <div style="margin-bottom:20px;">{photos_html}</div>
      <h3 style="color:#9b59b6;">Согласия участницы</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">Согласие на обработку персональных данных</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;color:{cp_color};">{cp_text}</td>
        </tr>
        <tr>
          <td style="padding:8px;">Согласие на использование фотографий для интернет-голосования</td>
          <td style="padding:8px;font-weight:bold;color:{cph_color};">{cph_text}</td>
        </tr>
      </table>
    </body></html>
    """

    msg.attach(MIMEText(html, 'html'))

    for i, photo_bytes in enumerate(photo_data_list):
        img = MIMEImage(photo_bytes, _subtype='jpeg')
        img.add_header('Content-Disposition', 'attachment', filename=f'photo_{i+1}_{safe_name}.jpg')
        msg.attach(img)

    with smtplib.SMTP_SSL('smtp.internet.ru', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    age_val = int(age) if age else None
    cur.execute(
        f"INSERT INTO {schema}.contestants (name, age, phone, email, category, about, photo1_url, photo2_url, photo3_url) "
        f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (name, age_val, phone, email or None, category, about or None,
         photo_urls[0] if len(photo_urls) > 0 else None,
         photo_urls[1] if len(photo_urls) > 1 else None,
         photo_urls[2] if len(photo_urls) > 2 else None)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Заявка отправлена!'})
    }