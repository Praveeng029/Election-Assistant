import React, { useState } from 'react';
import stateData from '../data/stateData.json';
import { translations } from '../utils/translations';
import { Info, Map as MapIcon, Users, PieChart } from 'lucide-react';

const IndiaMap = ({ language }) => {
  const t = translations[language];
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Simplified SVG paths for major Indian states (demonstration purposes)
  // In a real production app, use a complete GeoJSON/SVG library
  const statePaths = [
    { id: "IN-UP", d: "M280,180 L320,160 L360,180 L340,220 L300,230 Z", color: "#FF9933" },
    { id: "IN-MH", d: "M150,300 L220,280 L250,320 L220,380 L140,360 Z", color: "#FF9933" },
    { id: "IN-WB", d: "M380,220 L410,210 L430,250 L400,280 L370,250 Z", color: "#20C997" },
    { id: "IN-BR", d: "M330,190 L370,185 L385,215 L350,225 L325,215 Z", color: "#00BFFF" },
    { id: "IN-TN", d: "M240,480 L280,480 L290,550 L250,560 L230,520 Z", color: "#000080" },
    { id: "IN-MP", d: "M220,230 L300,235 L310,290 L240,300 L210,270 Z", color: "#FF9933" },
    { id: "IN-KA", d: "M180,400 L230,390 L250,470 L190,480 L170,440 Z", color: "#FF9933" },
    { id: "IN-GJ", d: "M80,240 L150,230 L160,290 L100,310 L70,280 Z", color: "#FF9933" },
    { id: "IN-RJ", d: "M120,160 L200,150 L220,220 L140,240 L110,200 Z", color: "#FF9933" },
    { id: "IN-AP", d: "M260,330 L310,320 L330,420 L270,450 L250,400 Z", color: "#6C757D" }
  ];

  const handleStateClick = (stateId) => {
    const data = stateData.find(s => s.id === stateId);
    setSelectedState(data);
  };

  const activeState = selectedState || (hoveredState ? stateData.find(s => s.id === hoveredState) : null);

  return (
    <div className="map-feature-container fade-in">
      <div className="section-header">
        <h2>{language === 'en' ? 'Interactive State Map' : 'इंटरएक्टिव राज्य मानचित्र'}</h2>
        <p>{language === 'en' ? 'Click on a state to view local election insights and party positions.' : 'स्थानीय चुनाव विश्लेषण और पार्टी स्थितियों को देखने के लिए किसी राज्य पर क्लिक करें।'}</p>
      </div>

      <div className="map-dashboard">
        <div className="map-visual-area">
          <svg viewBox="0 0 500 600" className="india-svg">
            {/* Background Map Shape (Simplified Outline) */}
            <path 
              d="M150,50 L350,50 L450,200 L400,400 L300,580 L100,500 L50,250 Z" 
              className="map-outline"
            />
            
            {/* Interactive States */}
            {statePaths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                className={`state-path ${hoveredState === path.id ? 'hovered' : ''} ${selectedState?.id === path.id ? 'selected' : ''}`}
                onMouseEnter={() => setHoveredState(path.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(path.id)}
                style={{ 
                  '--state-color': path.color,
                  cursor: 'pointer'
                }}
              >
                <title>{stateData.find(s => s.id === path.id)?.name[language]}</title>
              </path>
            ))}
          </svg>
          
          {/* Floating Tooltip */}
          {hoveredState && (
            <div className="map-tooltip" style={{ 
              position: 'absolute',
              top: '10px',
              left: '10px'
            }}>
              {stateData.find(s => s.id === hoveredState)?.name[language]}
            </div>
          )}
        </div>

        <div className="map-info-panel slide-up">
          {activeState ? (
            <div className="state-details">
              <div className="panel-header">
                <MapIcon size={24} className="icon-orange" />
                <h3>{activeState.name[language]}</h3>
              </div>
              
              <div className="stat-grid">
                <div className="stat-item">
                  <Users size={18} />
                  <span>{language === 'en' ? 'Total Seats' : 'कुल सीटें'}</span>
                  <strong>{Object.values(activeState.seats).reduce((a, b) => a + b, 0)}</strong>
                </div>
              </div>

              <div className="party-breakdown">
                <div className="breakdown-header">
                  <PieChart size={18} />
                  <h4>{language === 'en' ? 'Party-wise Seats' : 'पार्टी-वार सीटें'}</h4>
                </div>
                <div className="party-list">
                  {Object.entries(activeState.seats).map(([party, count]) => (
                    <div key={party} className="party-seat-row">
                      <span className="party-label">{party}</span>
                      <div className="seat-bar-bg">
                        <div 
                          className="seat-bar-fill" 
                          style={{ 
                            width: `${(count / 80) * 100}%`,
                            backgroundColor: party === 'BJP' ? '#FF9933' : party === 'CONG' ? '#00BFFF' : '#6C757D'
                          }}
                        ></div>
                      </div>
                      <span className="seat-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="info-footer">
                <Info size={14} />
                <p>{language === 'en' ? 'Data based on latest representative elections.' : 'नवीनतम प्रतिनिधि चुनावों पर आधारित डेटा।'}</p>
              </div>
            </div>
          ) : (
            <div className="empty-panel">
              <MapIcon size={48} className="empty-icon" />
              <p>{language === 'en' ? 'Hover or click a state to explore results' : 'परिणाम देखने के लिए किसी राज्य पर होवर करें या क्लिक करें'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
