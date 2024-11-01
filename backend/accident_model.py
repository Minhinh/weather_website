import pandas as pd  # Importing the pandas library for data manipulation
import joblib  # Importing joblib for saving and loading the model
import os  # Importing os for file path operations
from sklearn.ensemble import GradientBoostingRegressor  # Importing the Gradient Boosting Regressor

class AccidentModel:
    def __init__(self):
        """
        Initializes the AccidentModel class, loading the trained Gradient Boosting model
        if it exists, or creating a new model if it doesn't.
        """
        # Set the path to the model file
        self.model_path = os.path.join("data", "accident_model.pkl")
        
        # Check if the model file exists
        if os.path.exists(self.model_path):
            # Load the existing model
            self.model = joblib.load(self.model_path)
        else:
            # Create a new Gradient Boosting model if no model file exists
            self.model = GradientBoostingRegressor(n_estimators=100, random_state=42)

    def train(self):
        """
        Trains the Gradient Boosting model using the dataset of rainfall and accidents.
        It reads the data, preprocesses it, fits the model, and saves the trained model.
        """
        try:
            # Set the path to the CSV file containing the accident data
            data_path = os.path.join("data", "Merged_Accidents_and_Rainfall.csv")
            
            # Load the data into a pandas DataFrame
            data = pd.read_csv(data_path)
            
            # Drop any rows with missing values to ensure clean data for training
            data = data.dropna()
            
            # Define the features (Rainfall) and label (Total Accidents) for the model
            X = data[['Rainfall']]  # Features
            y = data['TOTAL_ACCIDENTS']  # Target variable
            
            # Train the model on the prepared data
            self.model.fit(X, y)
            
            # Save the trained model to a file for future use
            joblib.dump(self.model, self.model_path)
            print("Model trained and saved successfully.")
        
        except Exception as e:
            # Print any errors that occur during the training process
            print(f"An error occurred during training: {e}")

    def predict(self, rainfall):
        """
        Predicts the total number of accidents based on the provided rainfall input.
        
        Parameters:
        - rainfall (float): The amount of rainfall for which to predict accidents.

        Returns:
        - float: The predicted number of accidents based on the input rainfall.
        """
        try:
            # Ensure the rainfall input is converted to a float for prediction
            rainfall = float(rainfall)  
            
            # Use the trained model to predict the number of accidents for the given rainfall
            prediction = self.model.predict([[rainfall]])
            
            # Return the predicted value
            return prediction[0]  # Return the first (and only) element of the prediction array
        
        except Exception as e:
            # Print any errors that occur during the prediction process
            print(f"An error occurred during prediction: {e}")
            return None  # Return None in case of an error

if __name__ == "__main__":
    # This block will execute when the script is run directly
    accident_model = AccidentModel()  # Create an instance of the AccidentModel
    accident_model.train()  # Train the model
