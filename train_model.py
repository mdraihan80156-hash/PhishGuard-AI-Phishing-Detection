import os
import pickle
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from feature_extraction import extract_features


# ==============================
# 1. Dataset location
# ==============================

dataset_path = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "dataset",
    "phishing_dataset.csv"
)


# ==============================
# 2. Load dataset
# ==============================

print("Loading dataset...")

data = pd.read_csv(dataset_path)

print("Dataset loaded successfully!")
print("Total rows:", len(data))
print("Columns:", list(data.columns))


# ==============================
# 3. Check columns
# ==============================

if "url" not in data.columns or "label" not in data.columns:
    raise ValueError(
        "CSV must contain two columns: url and label"
    )


# ==============================
# 4. Extract features
# ==============================

print("Extracting URL features...")

X = []
y = []

for _, row in data.iterrows():

    url = str(row["url"])
    label = int(row["label"])

    features = extract_features(url)

    X.append(features)
    y.append(label)


print("Feature extraction completed!")

print("Number of features:", len(X[0]))
print("Safe URLs:", y.count(0))
print("Phishing URLs:", y.count(1))


# ==============================
# 5. Train/Test split
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ==============================
# 6. Create model
# ==============================

print("Training model...")

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)


# ==============================
# 7. Train
# ==============================

model.fit(X_train, y_train)

print("Model training completed!")


# ==============================
# 8. Test model
# ==============================

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Model Accuracy:", accuracy)


# ==============================
# 9. Save model
# ==============================

model_path = os.path.join(
    os.path.dirname(__file__),
    "model.pkl"
)

with open(model_path, "wb") as file:
    pickle.dump(model, file)


print("--------------------------------")
print("SUCCESS!")
print("model.pkl created successfully")
print("Location:", model_path)
print("--------------------------------")