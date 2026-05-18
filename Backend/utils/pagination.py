import base64
import json
from fastapi import HTTPException

def encode_cursor(value: int) -> str:
    raw = json.dumps({"id": value})
    return base64.urlsafe_b64encode(raw.encode()).decode()

def decode_cursor(cursor: str) -> int:
    try:
        raw = base64.urlsafe_b64decode(cursor.encode()).decode()
        return json.loads(raw)["id"]
    except:
        raise HTTPException(status_code=400, detail="Invalid cursor")