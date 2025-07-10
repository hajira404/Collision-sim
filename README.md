# Satellite-Debris Collision Prediction System

A 3D interactive visualization system that predicts satellite-debris collision risks using machine learning and Three.js.

## ✨ Features

- **3D Earth Visualization** - Interactive Earth model with realistic textures and cloud layers
- **Real-time Orbit Simulation** - Dynamic satellite and debris trajectory tracking
- **ML-Powered Predictions** - FastAPI backend with trained collision prediction model
- **Interactive Controls** - Orbit, zoom, and pan controls for exploration
- **Real-time Risk Assessment** - Live collision risk calculation and visualization

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

