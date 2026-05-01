import React from 'react';
import electionData from '../data/electionData.json';
import * as LucideIcons from 'lucide-react';

const Timeline = () => {
  return (
    <div className="timeline-container fade-in">
      <div className="section-header">
        <h2>The Election Journey</h2>
        <p>Step-by-step process of how India conducts the world's largest democratic exercise.</p>
      </div>

      <div className="timeline">
        {electionData.map((item, index) => {
          const IconComponent = LucideIcons[item.icon] || LucideIcons.Circle;
          const isLeft = index % 2 === 0;

          return (
            <div key={item.id} className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
              <div className="timeline-content slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="timeline-icon">
                  <IconComponent size={24} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="step-number">{index + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
