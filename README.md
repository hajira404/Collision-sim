# 🚀 Satellite‑Debris Collision Prediction System


An immersive 3D visualization and ML-powered pipeline to simulate and predict satellite-debris collision risks. This project blends astrodynamics, real satellite data, and machine learning into one interactive experience — all visualized beautifully in the browser.

---

## ✨ Features

* **🛰 Real NORAD TLE Data** — Simulates satellite motion using real-world Two-Line Elements.
* **🧭 Physics-first SGP4 Propagation** — Precise orbit mechanics via SGP4 orbital model.
* **🧠 ML-Driven Risk Analysis** — Random Forest classifier predicts real-time collision threats.
* **🌍 3D Earth Simulation** — Fully interactive globe, satellites, and debris orbiting with realism.
* **🎮 Live Control** — Users can manipulate debris paths, and the model responds in real-time.

---

## 📚 Data & Orbital Mechanics

* **Sources**: TLE data from [CelesTrak](https://celestrak.org).
* **SGP4 Propagation**: Implemented using the `sgp4` Python library to get the accurate orbital motion values for prediction.
* **Debris Simulation**: Injected based on user-defined parameters or random entries at LEO altitudes.
* **Collision Metrics**: Based on relative position vectors, velocities, and proximity (<500 km threshold).

---

## 🧠 ML Model Workflow

* **Training Dataset**: `collision_dataset_500km.csv`
* **Model**: `RandomForestClassifier` from `scikit-learn`
* **Features Used**:

  * Satellite and debris position vectors (x, y, z)
  * Relative distances
  * Velocity deltas
* **Output**: Binary prediction of collision risk

> ✅ The ML model was trained in Google Colab and exported as `collision_pipeline.pkl` using joblib.

---

## ⚠️ Roadblocks Faced

* 🔁 **CORS Errors**: Fixed via FastAPI's CORSMiddleware.
* 🔍 **Tuning Orbit Physics**: SGP4 time drifts initially misaligned trajectories.
* 🌐 **Frontend API Fetch Fails**: Had to align ports and local network origins.
* 🧪 **Overfitting in ML**: Balanced the dataset and performed proper train/test splitting.

---

## 🛠️ Tech Stack

### Frontend
- **Three.js** - 3D graphics and visualization
- **Vite** - Build tool and development server
- **Vanilla JavaScript** - Core application logic

### Backend
- **FastAPI** - High-performance Python web framework
- **scikit-learn** - Machine learning model (Random-Forest)
- **Pandas** - Data processing
- **Uvicorn** - ASGI server

## 📁 Project Structure

```
myearthproject/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── index.js            # Three.js application
│   ├── index.css           # Styling
│   └── texture/            # Earth and space textures
│       ├── earth_clouds/
│       └── space/
└── MLmodel/
    ├── main.py             # FastAPI backend
    ├── requirements.txt    # Python dependencies
    ├── collision_pipeline.pkl   # Trained ML model
    └── collision_dataset_500km.csv # Training data
```

## 🚀 Local Development

### Backend Setup
1. Navigate to the MLmodel directory:
   ```bash
   cd MLmodel
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   python main.py
   ```
   Server will start at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Frontend will start at `http://localhost:3000`

## 🌐 Deployment

in process😭


### Environment Variables:
- `VITE_API_URL` - Backend API URL for frontend

## 🎮 Usage

1. **View the 3D Earth** - Use mouse to orbit around the Earth
2. **Watch Simulations** - Observe satellite and debris trajectories
3. **Predict Collisions** - Click "Predict" to get ML-based risk assessment
4. **Reset Simulation** - Use "Reset" to restart the visualization

## 📊 ML Model

The collision prediction model uses:
- Relative position coordinates (x, y, z)
- Distance between objects
- Trained on collision scenarios with 500km threshold

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0.

## 🔗 Links

- [Three.js Documentation](https://threejs.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [scikit-learn Documentation](https://scikit-learn.org/)
- [SGP4 Theory - AIAA Paper](https://celestrak.org/publications/AIAA/2008-6770/)
- [CelesTrak TLE Feeds](https://celestrak.org/NORAD/elements/) 

