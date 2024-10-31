import pandas as pd
import joblib
import os
from sklearn.ensemble import GradientBoostingRegressor

class AccidentModel:
    def __init__(self):
        # Initialize the Gradient Boosting model
        self.model = GradientBoostingRegressor(n_estimators=100, random_state=42)

    def train(self):
        # Set the path to the CSV file relative to the current script
        data_path = os.path.join("data", "Merged_Accidents_and_Rainfall.csv")
        
        # Load the data
        data = pd.read_csv(data_path)

        # Drop rows with NaN values
        data = data.dropna()

        # Prepare the features (Rainfall) and label (Total Accidents)
        X = data[['Rainfall']]
        y = data['TOTAL_ACCIDENTS']

        # Train the model
        self.model.fit(X, y)

        # Save the model
        joblib.dump(self.model, 'accident_model.pkl')
        print("Model trained and saved successfully.")

    def predict(self, rainfall):
        # Load the model and predict total accidents based on rainfall
        model = joblib.load('accident_model.pkl')
        prediction = model.predict([[rainfall]])
        return prediction[0]

if __name__ == "__main__":
    # Initialize and train the model
    accident_model = AccidentModel()
    accident_model.train()
