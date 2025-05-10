import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';

const AskToContinue = () => {
    const navigate = useNavigate();
    const { soundClick, soundSelect } = useSoundContext();


    const handleNext = () => {
        soundClick();
        navigate(localStorage.getItem("lastFormPath") || "/month");
    };

     const handleStartOver = () => {
         soundClick();
         const keysToRemove = [
           'selectedMonths',
           'weather',
           'acc_hotel',
           'acc_hostel',
           'acc_guesthouse',
           'acc_agrotourism',
           'acc_camping',
           'acc_airbnb',
           'land_mountains',
           'land_sea',
           'land_lake',
           'land_city',
           'act_water',
           'act_sightseeing',
           'act_museums',
           'act_nightlife',
           'act_beach',
           'act_nature',
           'act_sports',
           'cuisine',
           'lastFormPath'
         ];
 
         keysToRemove.forEach(key => localStorage.removeItem(key));
         navigate('/month');
     };

     return (
        <motion.div
          className="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Do you want to continue your previous journey?</h1>
            <div className="right-buttons">
              <motion.button
                type="button1"
                onClick={handleNext}  
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
              <motion.button
                type="button3"
                onClick={handleStartOver}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Over
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      );
};

export default AskToContinue;