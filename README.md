# Weather and Accident Prediction with AI App

This project is a full-stack application that predicts weather conditions and accident likelihood based on weather data. It consists of a FastAPI backend and a React front-end.

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point, you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and medium deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you're ready for it.

## Technologies Used

- **Frontend**: React.js, Material-UI
- **Backend**: FastAPI
- **Machine Learning**: Scikit-learn, Joblib
- **Database**: CSV files for data storage
- **Others**: Pandas, Uvicorn, CORS middleware, HTTP Exception, pydantic, pkl

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.x
- Node.js and npm (Node Package Manager)
- A suitable IDE (like VSCode or PyCharm) for coding

### Backend Setup
1. Navigate to the Backend Directory:
cd backend

2. Create a Virtual Environment (optional but recommended):
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3. Install Required Libraries:
pip install fastapi uvicorn joblib pandas

4. Prepare Data: Ensure your CSV files (weather data and accident data) are located in the data directory.

5. Run the Backend:
uvicorn main:app --reload

### Frontend Setup
1. Navigate to the Frontend Directory:
cd frontend

2. Install Required Libraries:
npm install @mui/material @emotion/react @emotion/styled

3. Run the Frontend:
npm start
This will start the React app in development mode. You can view it in your browser at http://localhost:3000.

## Running Instructions
1. Start the Backend: Follow the steps in the Backend Setup to run the FastAPI server.

2. Start the Frontend: Follow the steps in the Frontend Setup to run the React application.

## Configuration Steps for AI Model Integration
1. Model Training: Ensure that your machine learning models are trained and saved in the data directory. The models should be saved as .pkl files using Joblib.

2. Model Loading: The FastAPI application will load the models at startup. Ensure that the file paths in main.py match the locations of your .pkl files.

3. Testing Predictions: After starting both the backend and frontend, select a location from the dropdown in the React app and click on "Get Prediction". The app will display weather and accident predictions based on your selected location.

### Clone the Repository
```bash
git clone https://github.com/your-username/weather-accident-prediction-app.git
cd weather-accident-prediction-app

