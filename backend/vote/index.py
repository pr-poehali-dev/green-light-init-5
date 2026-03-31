import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Голосование за участницу конкурса. Один IP — один голос за одну участницу."""

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
    contestant_id = body.get('contestant_id')

    if not contestant_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Не указан ID участницы'})
        }

    voter_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    cur.execute(
        f"SELECT id FROM {schema}.votes WHERE voter_ip = %s AND contestant_id = %s",
        (voter_ip, contestant_id)
    )
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 409,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Вы уже голосовали за эту участницу'})
        }

    cur.execute(
        f"INSERT INTO {schema}.votes (contestant_id, voter_ip) VALUES (%s, %s)",
        (contestant_id, voter_ip)
    )
    cur.execute(
        f"UPDATE {schema}.contestants SET votes_count = votes_count + 1 WHERE id = %s RETURNING votes_count",
        (contestant_id,)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'votes': row[0] if row else 0})
    }
