from rest_framework import generics, permissions
from .models import UserResponse
from .serializers import UserResponseSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
import joblib
from opencage.geocoder import OpenCageGeocode
import pandas as pd
from django.conf import settings

OPENCAGE_API_KEY = settings.OPENCAGE_API_KEY
geocoder = OpenCageGeocode(OPENCAGE_API_KEY)
import logging

logger = logging.getLogger(__name__)

PIPELINE_MODEL_PATH = "./model/pipeline_model.joblib"
DESTINATION_CUISINE_PATH = "./model/destination_cuisine_rates.csv"
DESTINATION_KEYWORDS_PATH = "./model/destinations_key_words.csv"
model_pipeline = joblib.load(PIPELINE_MODEL_PATH)
@api_view(['POST'])
def classify(request):
    try:
        months = request.data.get('months', [])
        if not months:
            month = request.data.get('month')
            if month:
                months = [month]
            else:
                return Response({'error': 'No months provided'}, status=400)

        all_predictions = []
        cuisine_importance = int(request.data['cuisine'])

        for month in months:
            user_input = pd.DataFrame({
                "month": [int(month)],
                "weather": [int(request.data['weather'])],
                "land_city": [int(request.data['land_city'])],
                "land_mountains": [int(request.data['land_mountains'])],
                "land_sea": [int(request.data['land_sea'])],
                "land_lake": [int(request.data['land_lake'])],
                "act_water": [int(request.data['act_water'])],
                "act_sightseeing": [int(request.data['act_sightseeing'])],
                "act_museums": [int(request.data['act_museums'])],
                "act_beach": [int(request.data['act_beach'])],
                "act_nature": [int(request.data['act_nature'])],
                "act_ex_sports": [int(request.data['act_sports'])],
                "act_nightlife": [int(request.data['act_nightlife'])],
                "acc_agrotourism": [int(request.data['acc_agrotourism'])],
                "acc_airbnb": [int(request.data['acc_airbnb'])],
                "acc_camping": [int(request.data['acc_camping'])],
                "acc_guesthouse": [int(request.data['acc_guesthouse'])],
                "acc_hostel": [int(request.data['acc_hostel'])],
                "acc_hotel": [int(request.data['acc_hotel'])],
            })

        probabilities = model_pipeline.predict_proba(user_input)[0]
        destinations = model_pipeline.classes_

        prob_df = pd.DataFrame({
            "destination": destinations,
            "probability": probabilities
        })

        destination_cuisine_df = pd.read_csv(DESTINATION_CUISINE_PATH)
        destination_keywords_df = pd.read_csv(DESTINATION_KEYWORDS_PATH)

        final_df = prob_df.merge(destination_cuisine_df, on="destination")
        final_df = final_df.merge(destination_keywords_df, on="destination")

        importance_weight = (cuisine_importance - 1) / 4
        final_df["final_score"] = (
                final_df["probability"] +
                final_df["cuisine"] * importance_weight * 0.2
        )

        final_df = final_df.sort_values(by="final_score", ascending=False)
        predictions_limit = 6 if len(months) > 1 else 3
        final_df = final_df.head(predictions_limit)

        for _, row in final_df.iterrows():
            query = row["destination"]
            result = geocoder.geocode(query)
            coordinates = {"lat": None, "lng": None}
            if result:
                coordinates = {
                    "lat": result[0]["geometry"]["lat"],
                    "lng": result[0]["geometry"]["lng"]
                }

            all_predictions.append({
                "place": query,
                "probability": row["probability"],
                "cuisine": row["cuisine"],
                "final_score": row["final_score"],
                "keywords": [row["w1"], row["w2"], row["w3"]],
                "coordinates": coordinates,
            })

        return Response({"predictions": all_predictions}, status=200)

    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_place_coordinates(request):
    place = request.GET.get('place')
    if not place:
        return Response({'error': 'Place not provided'}, status=400)

    try:
        geocoder = OpenCageGeocode(settings.OPENCAGE_API_KEY)
        result = geocoder.geocode(place)

        if result and len(result) > 0:
            coordinates = {
                "lat": result[0]["geometry"]["lat"],
                "lng": result[0]["geometry"]["lng"]
            }
            return Response({'coordinates': coordinates})
        else:
            return Response({'coordinates': {"lat": None, "lng": None}})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

class UserResponseCreateView(generics.CreateAPIView):
    queryset = UserResponse.objects.all()
    serializer_class = UserResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserResponseListView(generics.ListAPIView):
    serializer_class = UserResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserResponse.objects.filter(user=self.request.user)