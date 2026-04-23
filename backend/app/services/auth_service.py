import json
import re
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.exceptions import BadRequest, Conflict, Unauthorized

from app.config import DATA_DIR


USERS_FILE = DATA_DIR / "users.json"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ALLOWED_INVESTOR_TYPES = {"beginner", "existing"}


def register_user(fullname, email, password, investor_type):
    normalized_fullname = _normalize_fullname(fullname)
    normalized_email = _normalize_email(email)
    normalized_password = _normalize_password(password)
    normalized_investor_type = _normalize_investor_type(investor_type)

    users = _load_users()
    if any(user["email"] == normalized_email for user in users):
        raise Conflict("An account with this email already exists")

    user = {
        "id": str(uuid4()),
        "fullname": normalized_fullname,
        "email": normalized_email,
        "passwordHash": generate_password_hash(normalized_password),
        "investorType": normalized_investor_type,
        "createdAt": _now_iso(),
    }
    users.append(user)
    _save_users(users)
    return _public_user(user)


def authenticate_user(email, password):
    normalized_email = _normalize_email(email)
    normalized_password = _normalize_password(password)

    user = _find_user_by_email(normalized_email)
    if user is None or not check_password_hash(user["passwordHash"], normalized_password):
        raise Unauthorized("Invalid email or password")
    return _public_user(user)


def get_user_by_email(email):
    if not email:
        return None
    user = _find_user_by_email(email.strip().lower())
    if user is None:
        return None
    return _public_user(user)


def _find_user_by_email(email):
    users = _load_users()
    for user in users:
        if user["email"] == email:
            return user
    return None


def _load_users():
    if not USERS_FILE.exists():
        return []

    with USERS_FILE.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    if not isinstance(payload, list):
        raise BadRequest("User store is invalid")
    return payload


def _save_users(users):
    USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
    temp_file = Path(f"{USERS_FILE}.tmp")
    with temp_file.open("w", encoding="utf-8") as handle:
        json.dump(users, handle, indent=2)
    temp_file.replace(USERS_FILE)


def _normalize_fullname(fullname):
    text = (fullname or "").strip()
    if len(text) < 2:
        raise BadRequest("Full name must be at least 2 characters")
    return text


def _normalize_email(email):
    text = (email or "").strip().lower()
    if not EMAIL_RE.match(text):
        raise BadRequest("A valid email is required")
    return text


def _normalize_password(password):
    text = (password or "").strip()
    if len(text) < 6:
        raise BadRequest("Password must be at least 6 characters")
    return text


def _normalize_investor_type(investor_type):
    text = (investor_type or "").strip().lower()
    if text not in ALLOWED_INVESTOR_TYPES:
        raise BadRequest("Investor type must be either 'beginner' or 'existing'")
    return text


def _public_user(user):
    return {
        "id": user["id"],
        "fullname": user["fullname"],
        "email": user["email"],
        "investorType": user.get("investorType", "beginner"),
        "createdAt": user["createdAt"],
    }


def _now_iso():
    return datetime.now(timezone.utc).isoformat()
