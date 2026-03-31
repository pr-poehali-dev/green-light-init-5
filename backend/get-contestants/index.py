import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список участниц конкурса, отсортированных по количеству голосов."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    cur.execute(f"""
        SELECT id, name, age, category, about, photo1_url, photo2_url, photo3_url, votes_count
        FROM {schema}.contestants
        ORDER BY votes_count DESC, created_at ASC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    contestants = [
        {
            'id': r[0],
            'name': r[1],
            'age': r[2],
            'category': r[3],
            'about': r[4],
            'photo1': r[5],
            'photo2': r[6],
            'photo3': r[7],
            'votes': r[8],
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'contestants': contestants})
    }
