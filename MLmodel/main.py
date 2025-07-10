from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from pydantic import BaseModel

app = FastAPI()

#  Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to "http://localhost:3000"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class CollisionInput(BaseModel):
    rel_x: float
    rel_y: float
    rel_z: float
    distance_km: float

# Load model pipeline
with open("MLmodel/collision_pipeline.pkl", "rb") as f:
    pipeline = pickle.load(f)

@app.post("/predict")
def predict(input: CollisionInput):
    input_data = pd.DataFrame([input.model_dump()])
    result = pipeline.predict(input_data)[0]
    return {
        "collision_risk": "Yes" if result == 1 else "No",
        "input": input.model_dump()
    }
