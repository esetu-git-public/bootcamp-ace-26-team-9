import os
import json
import time
from pathlib import Path
from sqlalchemy.orm import Session
from database.models import UserDataset

PREDICTIONS_DIR = Path("uploads/predictions")

class DatasetService:

    @staticmethod
    def save_user_dataset(db: Session, user_id: str, filename: str, predictions: list):
        """
        Saves prediction results to a local file, compiles stats, and saves metadata to the database.
        """
        # Ensure target directory exists
        PREDICTIONS_DIR.mkdir(parents=True, exist_ok=True)

        # 1. Compute stats
        total = len(predictions)
        high_risk = 0
        medium_risk = 0
        low_risk = 0
        risk_pcts = []

        for p in predictions:
            risk_pct = p.get("Risk_Percentage") or p.get("Confidence") or 0.0
            risk_pcts.append(risk_pct)
            
            risk_lvl = p.get("Risk_Level", "Low")
            if risk_lvl == "High":
                high_risk += 1
            elif risk_lvl == "Medium":
                medium_risk += 1
            else:
                low_risk += 1

        avg_risk = round(sum(risk_pcts) / total, 2) if total > 0 else 0.0

        # 2. Write predictions to a local file
        timestamp = int(time.time() * 1000)
        safe_user_id = str(user_id).replace("/", "_").replace("\\", "_")
        file_name = f"report_{safe_user_id}_{timestamp}.json"
        file_path = PREDICTIONS_DIR / file_name

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(predictions, f, ensure_ascii=False)

        # 3. Save to database
        dataset_record = UserDataset(
            user_id=user_id,
            filename=filename,
            filepath=str(file_path),
            total_records=total,
            high_risk_count=high_risk,
            medium_risk_count=medium_risk,
            low_risk_count=low_risk,
            avg_risk_percentage=avg_risk
        )
        db.add(dataset_record)
        db.commit()
        db.refresh(dataset_record)
        
        return dataset_record

    @staticmethod
    def get_user_datasets(db: Session, user_id: str):
        """
        Fetches metadata and statistics for all reports belonging to the user.
        Extremely fast as it doesn't parse files or handle heavy payloads.
        """
        records = db.query(UserDataset).filter(UserDataset.user_id == user_id).order_by(UserDataset.created_at.desc()).all()
        
        datasets_list = []
        for r in records:
            datasets_list.append({
                "id": r.id,
                "filename": r.filename,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "total_records": r.total_records,
                "high_risk_count": r.high_risk_count,
                "medium_risk_count": r.medium_risk_count,
                "low_risk_count": r.low_risk_count,
                "avg_risk_percentage": r.avg_risk_percentage
            })
            
        return datasets_list

    @staticmethod
    def get_user_dataset_by_id(db: Session, dataset_id: int, user_id: str):
        """
        Retrieves user dataset record.
        """
        return db.query(UserDataset).filter(UserDataset.id == dataset_id, UserDataset.user_id == user_id).first()

    @staticmethod
    def load_predictions_from_file(filepath: str) -> list:
        """
        Loads and parses the predictions list from the local JSON file.
        """
        if not filepath or not os.path.exists(filepath):
            return []
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"DEBUG: Failed to read local predictions file {filepath}: {e}")
            return []

    @staticmethod
    def delete_user_dataset(db: Session, dataset_id: int, user_id: str):
        """
        Deletes a user dataset record and its local JSON file.
        """
        dataset_record = db.query(UserDataset).filter(UserDataset.id == dataset_id, UserDataset.user_id == user_id).first()
        if dataset_record:
            # Delete local file
            if dataset_record.filepath and os.path.exists(dataset_record.filepath):
                try:
                    os.remove(dataset_record.filepath)
                except Exception as e:
                    print(f"DEBUG: Failed to delete local report file {dataset_record.filepath}: {e}")
            
            db.delete(dataset_record)
            db.commit()
            return True
        return False
