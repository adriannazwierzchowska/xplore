import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import FormMonth from './views/FormMonth';
import FormWeather from './views/FormWeather';
import FormStay from './views/FormStay';
import FormLandscape from './views/FormLandscape';
import FormActivities from './views/FormActivities';
import FormCuisine from './views/FormCuisine';
import FormAnalise from './views/FormAnalise';
import Recommendation from './views/Recommendation';
import Favorites from './views/Favorites';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/month" element={<FormMonth />} />
            <Route path="/weather" element={<FormWeather />} />
            <Route path="/stay" element={<FormStay />} />
            <Route path="/landscape" element={<FormLandscape />} />
            <Route path="/activities" element={<FormActivities />} />
            <Route path="/cuisine" element={<FormCuisine />} />
            <Route path="/analise" element={<FormAnalise />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
      </Router>
  );
}

export default App;
