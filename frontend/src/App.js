import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AnimatePresence>
        <Routes>
          <Route
            path="/"
            element={
              <motion.div
                key="/"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Home />
              </motion.div>
            }
          />

          <Route
            path="/login"
            element={
              <motion.div
                key="/login"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Login />
              </motion.div>
            }
          />

          <Route
            path="/register"
            element={
              <motion.div
                key="/register"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Register />
              </motion.div>
            }
          />

          <Route
            path="/month"
            element={
              <motion.div
                key="/month"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <FormMonth />
              </motion.div>
            }
          />

          <Route
            path="/weather"
            element={
              <motion.div
                key="/weather"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <FormWeather />
              </motion.div>
            }
          />

          <Route
            path="/stay"
            element={
              <motion.div
                key="/stay"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <FormStay />
              </motion.div>
            }
          />

          <Route
            path="/landscape"
            element={
              <motion.div
                key="/landscape"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <FormLandscape />
              </motion.div>
            }
          />

          <Route
            path="/activities"
            element={
              <motion.div
                key="/activities"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <FormActivities />
              </motion.div>
            }
          />

          <Route
            path="/cuisine"
            element={
              <motion.div
                key="/cuisine"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <FormCuisine />
              </motion.div>
            }
          />

          <Route
            path="/analise"
            element={
              <motion.div
                key="/analise"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <FormAnalise />
              </motion.div>
            }
          />

          <Route
            path="/recommendation"
            element={
              <motion.div
                key="/recommendation"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Recommendation />
              </motion.div>
            }
          />

          <Route
            path="/favorites"
            element={
              <motion.div
                key="/favorites"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Favorites />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <ToastContainer />
    </Router>
  );
}

export default App;
