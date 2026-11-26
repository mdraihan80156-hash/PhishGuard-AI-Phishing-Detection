from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

from feature_extraction import extract_features


# ==========================
# CREATE FLASK APP
# ==========================

app = Flask(__name__)

CORS(app)


# ==========================
# FIND MODEL
# ==========================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.pkl"
)


# ==========================
# LOAD ML MODEL
# ==========================

try:

    with open(MODEL_PATH, "rb") as file:

        model = pickle.load(file)

    print("Model loaded successfully!")

except Exception as e:

    print("ERROR: Could not load model.pkl")

    print(e)

    model = None


# ==========================
# HOME PAGE
# ==========================

@app.route("/")
def home():

    return "PhishGuard Backend is Running!"


# ==========================
# PREDICT URL
# ==========================

@app.route("/predict", methods=["POST"])
def predict():

    # Check model
    if model is None:

        return jsonify({

            "error":
            "Model is not loaded. Check model.pkl"

        }), 500


    try:

        # ==========================
        # GET DATA FROM FRONTEND
        # ==========================

        data = request.get_json()


        if not data:

            return jsonify({

                "error":
                "No JSON data received"

            }), 400


        # ==========================
        # GET URL
        # ==========================

        url = data.get("url")


        if not url:

            return jsonify({

                "error":
                "URL is required"

            }), 400


        # ==========================
        # EXTRACT FEATURES
        # ==========================

        features = extract_features(url)


        print("--------------------------------")

        print("URL:", url)

        print("Features:", features)


        # ==========================
        # MACHINE LEARNING PREDICTION
        # ==========================

        prediction = model.predict(
            [features]
        )[0]


        # ==========================
        # GET CONFIDENCE
        # ==========================

        probabilities = model.predict_proba(
            [features]
        )[0]


        # Find predicted class probability

        predicted_class_index = list(
            model.classes_
        ).index(prediction)


        confidence_percentage = (
            probabilities[predicted_class_index]
            * 100
        )


        confidence_percentage = round(
            confidence_percentage,
            2
        )


        # ==========================
        # RESULT
        # ==========================

        if int(prediction) == 1:

            result = "Phishing"

            risk = "HIGH"

        else:

            result = "Safe"

            risk = "LOW"


        # ==========================
        # PRINT RESULT
        # ==========================

        print("Prediction:", result)

        print(
            "Confidence:",
            confidence_percentage,
            "%"
        )

        print("--------------------------------")


        # ==========================
        # SEND RESULT TO FRONTEND
        # ==========================

        return jsonify({

            "url": url,

            "prediction": result,

            "risk": risk,

            "confidence":
            confidence_percentage,

            "features": features

        })


    except Exception as e:

        print("Prediction error:")

        print(e)


        return jsonify({

            "error": str(e)

        }), 500


# ==========================
# START SERVER
# ==========================

if __name__ == "__main__":

    app.run(

        debug=True,

        port=5000

    )