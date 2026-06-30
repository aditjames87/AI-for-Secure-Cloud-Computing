from fastapi import APIRouter

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/")
def get_reports():
    # TODO: Implement actual report generation logic
    return [
        {"id": 1, "title": "Weekly Security Report", "date": "2026-06-29", "summary": "No major incidents."},
        {"id": 2, "title": "Monthly Threat Analysis", "date": "2026-06-28", "summary": "Increased phishing attacks."},
    ]
