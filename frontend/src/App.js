import { Routes, Route, useLocation } from 'react-router-dom';
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
import Sidebar from './Sidebar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  const username = localStorage.getItem("authToken");

  const isHome = location.pathname === '/';

  return (
    <>
      <Sidebar username={username} isHome={isHome} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                className="animation-stage"
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
                className="animation-stage"
                key="/login"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <Login />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/register"
            element={
              <motion.div
                className="animation-stage"
                key="/register"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <Register />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/month"
            element={
              <motion.div
                className="animation-stage"
                key="/month"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <FormMonth />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/weather"
            element={
              <motion.div
                className="animation-stage"
                key="/weather"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <FormWeather />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/stay"
            element={
              <motion.div
                className="animation-stage"
                key="/stay"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <FormStay />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/landscape"
            element={
              <motion.div
                className="animation-stage"
                key="/landscape"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <FormLandscape />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/activities"
            element={
              <motion.div
                className="animation-stage"
                key="/activities"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <FormActivities />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/cuisine"
            element={
              <motion.div
                className="animation-stage"
                key="/cuisine"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <FormCuisine />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/analise"
            element={
              <motion.div
                className="animation-stage"
                key="/analise"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container">
                  <FormAnalise />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/recommendation"
            element={
              <motion.div
                className="animation-stage"
                key="/recommendation"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container recommendation-page-container">
                  <Recommendation />
                </div>
              </motion.div>
            }
          />

          <Route
            path="/favorites"
            element={
              <motion.div
                className="animation-stage"
                key="/favorites"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="page-container recommendation-page-container">
                  <Favorites />
                </div>
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <ToastContainer />
    </>
  );
}

export default App;
