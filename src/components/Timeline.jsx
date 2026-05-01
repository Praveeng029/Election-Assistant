import electionData from '../data/electionData.json';
import * as LucideIcons from 'lucide-react';
import { translations } from '../utils/translations';

const Timeline = ({ language }) => {
  const t = translations[language];

  return (
    <div className="timeline-container fade-in">
      <div className="section-header">
        <h2>{language === 'en' ? 'The Election Journey' : 'चुनावी सफर'}</h2>
        <p>{language === 'en' ? 'Step-by-step process of how India conducts the world\'s largest democratic exercise.' : 'भारत दुनिया के सबसे बड़े लोकतांत्रिक अभ्यास को कैसे संचालित करता है, इसकी चरण-दर-चरण प्रक्रिया।'}</p>
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
                <h3>{item.title[language] || item.title}</h3>
                <p>{item.description[language] || item.description}</p>
                <div className="timeline-dot"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
