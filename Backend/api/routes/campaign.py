from datetime import datetime 
from fastapi import APIRouter, Depends, Query, Request, HTTPException
from rich import _console
from sqlmodel import Session, select

from db.database import get_session
from models.campaign import Campaign
from models.user import User
from schemas.campaign import CampaignCreate, CampaignUpdate
from schemas.common import Response, PaginatedResponse
from utils.pagination import encode_cursor, decode_cursor
from api.deps import get_current_user
from models.history import History
from models.notification import Notification

router = APIRouter()
@router.get("/stats")
def get_campaign_stats(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    campaigns = session.exec(select(Campaign)).all()
    
    now = datetime.now()
    total = len(campaigns)

    completed = len([c for c in campaigns if c.due_date and c.due_date < now])
    active = total - completed

    return {
        "total": total,
        "active": active,
        "completed": completed
    }

@router.get("", response_model=PaginatedResponse[list[Campaign]])
def read_campaigns(
    request: Request,
    session: Session = Depends(get_session),
    cursor: str | None = Query(None),
    limit: int = 20,
    q: str | None = Query(None, description="Search by name or description (partial, case-insensitive)"),
    category_id: int | None = Query(None, description="Filter by category id"),
    state: str | None = Query(None, description="Filter by state (partial, case-insensitive)"),
    city: str | None = Query(None, description="Filter by city (partial, case-insensitive)"),
    due_by: datetime | None = Query(None, description="Only campaigns due on or before this datetime"),
    status: str | None = Query(None, description="Filter by computed status: 'active' or 'completed'"),
    user: User = Depends(get_current_user)
):
    cursor_id = decode_cursor(cursor) if cursor else 0
    now = datetime.now()

    stmt = (
        select(Campaign)
        .where(Campaign.campaign_id > cursor_id)
    )

    
    if q:
        term = f"%{q.strip()}%"
        stmt = stmt.where(
            (Campaign.name.ilike(term)) | (Campaign.description.ilike(term))
        )

    
    if category_id is not None:
        stmt = stmt.where(Campaign.category_id == category_id)
    if state:
        stmt = stmt.where(Campaign.state.ilike(f"%{state.strip()}%"))
    if city:
        stmt = stmt.where(Campaign.city.ilike(f"%{city.strip()}%"))
    if due_by is not None:
        stmt = stmt.where(Campaign.due_date.is_not(None))
        stmt = stmt.where(Campaign.due_date <= due_by)

    
    if status:
        s = status.lower().strip()
        if s == "active":
            stmt = stmt.where(
                (Campaign.due_date.is_(None)) | (Campaign.due_date > now)
            )
        elif s == "completed":
            stmt = stmt.where(Campaign.due_date.is_not(None))
            stmt = stmt.where(Campaign.due_date <= now)

    stmt = stmt.order_by(Campaign.campaign_id).limit(limit + 1)
    data = session.exec(stmt).all()
    for c in data:
        if c.due_date and c.due_date < now:
            c.status = "completed"
        else:
            c.status = "active"

    base_url = str(request.url).split("?")[0]
    next_url = None

    if len(data) > limit:
        from urllib.parse import quote_plus
        next_cursor = encode_cursor(data[:limit][-1].campaign_id)
        parts = [f"cursor={next_cursor}", f"limit={limit}"]
        if q:
            parts.append(f"q={quote_plus(q)}")
        if category_id is not None:
            parts.append(f"category_id={category_id}")
        if state:
            parts.append(f"state={quote_plus(state)}")
        if city:
            parts.append(f"city={quote_plus(city)}")
        if due_by is not None:
            parts.append(f"due_by={quote_plus(due_by.isoformat())}")
        if status:
            parts.append(f"status={quote_plus(status)}")
        next_url = f"{base_url}?{'&'.join(parts)}"

    return {
        "data": data[:limit],
        "next": next_url
    }



@router.get("/{id}", response_model=Response[Campaign])
def get_campaign(
    id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)  
):
    data = session.get(Campaign, id)

    if not data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    return {"data": data}


@router.post("", status_code=201, response_model=Response[Campaign])
def create_campaign(
    campaign: CampaignCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user) 
):
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admins can create campaigns",
        )

    db = Campaign(**campaign.model_dump())
    db.owner_id = user.id
    db.category_id = campaign.category_id 
    session.add(db)
    session.commit()
    session.refresh(db)
    history = History(
        campaign_id= db.campaign_id,
        action="created",
        changed_by=user.id
    )
    session.add(history)

    user_ids = session.exec(select(User.id)).all()
    notifications = [
        Notification(
            user_id=uid,
            campaign_id=db.campaign_id,
            message="created",
        )
        for uid in user_ids
    ]
    session.add_all(notifications)

    session.commit()
    return {"data": db}


@router.put("/{id}", response_model=Response[Campaign])
def update_campaign(
    id: int,
    campaign: CampaignUpdate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)  
):
    data = session.get(Campaign, id)

    if not data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if data.owner_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the campaign owner can update this campaign",
        )

    update_data = campaign.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(data, key):
            setattr(data, key, value)
    history = History(
        campaign_id= data.campaign_id,
        action="updated",
        changed_by=user.id
    )
    
    notification = Notification(
        user_id=data.owner_id,
        campaign_id=data.campaign_id,
        message="updated"
    )
    session.add(notification)
    session.add(history)
   
    print(data)
    session.commit()
    session.refresh(data)

    return {"data": data}


@router.delete("/{id}", status_code=204)
def delete_campaign(
    id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user) 
):
    data = session.get(Campaign, id)

    if not data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if data.owner_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the campaign owner can delete this campaign",
        )

    deleted_campaign_id = data.campaign_id
    owner_id = data.owner_id

    existing_history = session.exec(
        select(History).where(History.campaign_id == deleted_campaign_id)
    ).all()
    for h in existing_history:
        session.delete(h)

    existing_notifs = session.exec(
        select(Notification).where(Notification.campaign_id == deleted_campaign_id)
    ).all()
    for n in existing_notifs:
        n.campaign_id = None
        session.add(n)

    session.delete(data)
    session.flush()

    session.add(
        Notification(
            user_id=owner_id,
            campaign_id=None,
            message=f"deleted CMP-{deleted_campaign_id}",
        )
    )

    session.commit()

    return None
