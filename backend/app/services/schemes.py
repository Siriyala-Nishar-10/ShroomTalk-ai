import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import SchemeDocument
from app.services.seed_data import SCHEMES


def seed_schemes(db: Session) -> None:
    for scheme in SCHEMES:
        for language, (title, content) in scheme["texts"].items():
            existing = db.scalar(
                select(SchemeDocument).where(
                    SchemeDocument.scheme_code == scheme["code"],
                    SchemeDocument.language_code == language,
                )
            )

            if existing is None:
                db.add(
                    SchemeDocument(
                        scheme_code=scheme["code"],
                        language_code=language,
                        title=title,
                        content=content,
                        official_url=scheme["url"],
                        source_name=scheme["source"],
                    )
                )
            elif (
                existing.title != title
                or existing.content != content
                or existing.official_url != scheme["url"]
            ):
                existing.title = title
                existing.content = content
                existing.official_url = scheme["url"]
                existing.source_name = scheme["source"]
                existing.embedding = None

    db.commit()


def _to_dict(doc: SchemeDocument) -> dict:
    return {
        "scheme_code": doc.scheme_code,
        "language_code": doc.language_code,
        "title": doc.title,
        "content": doc.content,
        "official_url": doc.official_url,
        "source_name": doc.source_name,
        "source_checked_at": doc.source_checked_at,
        "verified": doc.source_checked_at is not None,
    }


def list_schemes(db: Session, language: str, query: str = "") -> list[dict]:
    by_code: dict[str, dict[str, SchemeDocument]] = {}
    for doc in db.scalars(select(SchemeDocument)).all():
        by_code.setdefault(doc.scheme_code, {})[doc.language_code] = doc

    tokens = [token for token in re.split(r"\s+", query.lower().strip()) if token]
    ranked = []

    for code, versions in by_code.items():
        shown = versions.get(language) or versions.get("en")
        if shown is None:
            continue

        english = versions.get("en")
        haystack = " ".join(
            part
            for part in (
                code,
                shown.title,
                shown.content,
                english.title if english else "",
                english.content if english else "",
            )
            if part
        ).lower()

        score = sum(1 for token in tokens if token in haystack)
        if tokens and score == 0:
            continue

        ranked.append((score, code, shown))

    ranked.sort(key=lambda item: (-item[0], item[1]))
    return [_to_dict(doc) for _, _, doc in ranked]