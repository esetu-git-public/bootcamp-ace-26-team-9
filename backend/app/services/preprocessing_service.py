import pandas as pd
from sklearn.preprocessing import LabelEncoder


class PreprocessingService:

    @staticmethod
    def preprocess(df):

        data = df.copy()

        # Remove duplicates
        data = data.drop_duplicates()

        # Remove missing values
        data = data.dropna()

        # Encode categorical columns
        label_encoders = {}

        categorical_columns = data.select_dtypes(include=["object"]).columns

        for column in categorical_columns:

            encoder = LabelEncoder()

            data[column] = encoder.fit_transform(data[column])

            label_encoders[column] = encoder

        return data, label_encoders