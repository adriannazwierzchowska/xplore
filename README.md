# xplore

A travel recommendation system that helps users discover destinations based on their preferences and manage favorite places.

## Features (Current)

### Backend (Django REST Framework)
- **User Authentication**: JWT-based registration/login system
- **Questionnaire**: Preference collection system with:
  - Month/weather preferences
  - Accommodation types
  - Landscape preferences
  - Activity interests
  - Cuisine 
- **Machine learning recommendation model**: 
  - Destination suggestions based on user input
  - Geographical coordinates lookup via OpenCage API
- **Favorites System**: Save and manage preferred destinations

### Frontend (React)
- Interactive questionnaire form
- Interactive map visualization (Leaflet)
- Destination recommendations with Wikipedia integration
- Favorites management

### Running the project
```bash
start_xplore.bat
```

### Preview
##### Choosing your preferences - activities
![](views/activities.png)

##### Recommended destinations
![](views/recommendations.png)

##### Destination details
![](views/place.png)

### Future improvements 
- Google Places API integration for showing nearby attractions, user reviews
- Trip planning dashboard
- Technical improvements such as docker deployment, automated testing, enhanced responsive design

**Note**: the project is a work in progress