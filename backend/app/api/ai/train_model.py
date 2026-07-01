import pandas as pd
import joblib
from pathlib import Path

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# ==========================================================
# Paths
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = BASE_DIR / "training_data.csv"
MODEL_PATH = BASE_DIR / "threat_model.pkl"

# ==========================================================
# Check dataset exists
# ==========================================================

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found:\n{DATASET_PATH}"
    )

# ==========================================================
# Load Dataset
# ==========================================================

df = pd.read_csv(DATASET_PATH)

print("\nDataset Loaded Successfully")
print(df.head())

# ==========================================================
# Validate Required Columns
# ==========================================================

required_columns = [
    "cpu",
    "memory",
    "label",
]

missing = [
    col for col in required_columns
    if col not in df.columns
]

if missing:
    raise ValueError(
        f"Dataset is missing columns: {missing}"
    )

# ==========================================================
# Features & Labels
# ==========================================================

X = df[["cpu", "memory"]]
y = df["label"]

# ==========================================================
# Train/Test Split
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ==========================================================
# Train Model
# ==========================================================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# ==========================================================
# Evaluate Model
# ==========================================================

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\n==============================")
print(f"Model Accuracy : {accuracy * 100:.2f}%")
print("==============================\n")

print(classification_report(y_test, predictions))

# ==========================================================
# Save Model
# ==========================================================

joblib.dump(model, MODEL_PATH)

print(f"\nModel saved successfully at:\n{MODEL_PATH}")