import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../formdots.css';

const steps = [
  { path: '/month', label: 'Month' },
  { path: '/weather', label: 'Weather' },
  { path: '/stay', label: 'Stay' },
  { path: '/landscape', label: 'Landscape' },
  { path: '/activities', label: 'Activities' },
  { path: '/cuisine', label: 'Cuisine' },
];

const FormDots = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = steps.findIndex(step => step.path === location.pathname);

  return (
    <div className="progress-dots">
      {steps.map((step, index) => (
        <div
          key={step.path}
          className={`dot ${
            index < currentIndex ? 'done' :
            index === currentIndex ? 'current' : 'upcoming'
          }`}
          onClick={() => navigate(step.path)}
          title={step.label}
        />
      ))}
    </div>
  );
};

export default FormDots;
