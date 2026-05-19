import datetime

from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlmodel import Session, select

from db.database import get_session
from models.campaign import Campaign
from models.user import User
from schemas.campaign import CampaignCreate
from schemas.common import Response, PaginatedResponse
from utils.pagination import encode_cursor, decode_cursor
from api.deps import get_current_user

router = APIRouter()
@router.get("/stats")
def get_campaign_stats(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    campaigns = session.exec(select(Campaign)).all()

    total = len(campaigns)

    active = len([c for c in campaigns if c.status == "active"])
    completed = len([c for c in campaigns if c.status == "completed"])

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
    user: User = Depends(get_current_user)  
):
    cursor_id = decode_cursor(cursor) if cursor else 0

    stmt = (
        select(Campaign)
        .where(Campaign.campaign_id > cursor_id)
        .order_by(Campaign.campaign_id)
        .limit(limit + 1)
    )

    data = session.exec(stmt).all()
    
    now = datetime.utcnow()
    for c in data:
        if c.due_date and c.due_date < now:
            c.status = "completed"
        else:
            c.status = "active"

    base_url = str(request.url).split("?")[0]
    next_url = None

    if len(data) > limit:
        next_cursor = encode_cursor(data[:limit][-1].campaign_id)
        next_url = f"{base_url}?cursor={next_cursor}&limit={limit}"  

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
    db = Campaign.model_validate(campaign)

    session.add(db)
    session.commit()
    session.refresh(db)

    return {"data": db}


@router.put("/{id}", response_model=Response[Campaign])
def update_campaign(
    id: int,
    campaign: CampaignCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)  
):
    data = session.get(Campaign, id)

    if not data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    data.description = campaign.description
    data.status = campaign.status if campaign.status else data.status
    data.name = campaign.name
    data.due_date = campaign.due_date

    session.add(data)
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

    session.delete(data)
    session.commit()

    return None
