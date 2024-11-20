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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/questionnaire_1" element={<FormMonth />} />
            <Route path="/questionnaire_2" element={<FormWeather />} />
            <Route path="/questionnaire_3" element={<FormStay />} />
            <Route path="/questionnaire_4" element={<FormLandscape />} />
            <Route path="/questionnaire_5" element={<FormActivities />} />
            <Route path="/questionnaire_6" element={<FormCuisine />} />
            <Route path="/analise" element={<FormAnalise />} />
          </Routes>
      </Router>
  );
}

export default App;
