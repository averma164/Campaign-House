from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from db.database import get_session
from models.notification import Notification
from models.user import User
from schemas.notification import NotificationRead
from schemas.common import Response
from api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=Response[list[NotificationRead]])
def list_notifications(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(Notification)
        .where(Notification.user_id == user.id)
        .order_by(Notification.created_at.desc())
    )
    items = session.exec(stmt).all()
    return {"data": items}


@router.patch("/{notification_id}/read", response_model=Response[NotificationRead])
def mark_notification_read(
    notification_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    notif = session.get(Notification, notification_id)

    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    if notif.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    notif.is_read = True
    session.add(notif)
    session.commit()
    session.refresh(notif)

    return {"data": notif}


@router.post("/read-all")
def mark_all_read(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    stmt = (
        select(Notification)
        .where(Notification.user_id == user.id)
        .where(Notification.is_read == False)  # noqa: E712 (SQLModel needs ==, not `is`)
    )
    items = session.exec(stmt).all()

    for n in items:
        n.is_read = True
        session.add(n)

    session.commit()

    return {"updated": len(items)}
