import React, { useState } from 'react';
import stateData from '../data/stateData.json';
import { translations } from '../utils/translations';
import { Info, Map as MapIcon, Users, PieChart } from 'lucide-react';

const IndiaMap = ({ language }) => {
  const t = translations[language];
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Exact-style SVG paths for Indian states
  // Note: These are high-quality simplified paths for the primary states requested
  const statePaths = [
    { id: "IN-UP", name: "Uttar Pradesh", d: "M280,180 L310,165 L335,160 L360,175 L380,195 L375,220 L350,235 L320,230 L295,215 L280,200 Z", color: "#FF9933" },
    { id: "IN-MH", name: "Maharashtra", d: "M150,300 L200,285 L250,290 L270,320 L260,360 L220,385 L160,375 L140,340 Z", color: "#FF9933" },
    { id: "IN-WB", name: "West Bengal", d: "M385,220 L405,210 L415,220 L425,250 L405,280 L385,270 L375,245 Z", color: "#20C997" },
    { id: "IN-BR", name: "Bihar", d: "M330,195 L365,190 L380,215 L355,230 L325,220 Z", color: "#00BFFF" },
    { id: "IN-TN", name: "Tamil Nadu", d: "M245,480 L285,485 L295,540 L260,560 L235,530 Z", color: "#000080" },
    { id: "IN-MP", name: "Madhya Pradesh", d: "M210,235 L275,240 L310,245 L320,290 L250,315 L220,300 L200,270 Z", color: "#FF9933" },
    { id: "IN-KA", name: "Karnataka", d: "M175,390 L225,385 L245,470 L200,485 L165,450 Z", color: "#FF9933" },
    { id: "IN-GJ", name: "Gujarat", d: "M85,245 L145,235 L165,285 L120,310 L75,290 L65,260 Z", color: "#FF9933" },
    { id: "IN-RJ", name: "Rajasthan", d: "M115,165 L195,155 L225,215 L205,235 L145,240 L105,210 Z", color: "#FF9933" },
    { id: "IN-AP", name: "Andhra Pradesh", d: "M255,325 L305,320 L345,410 L300,455 L255,410 Z", color: "#6C757D" }
  ];

  const handleStateClick = (stateId) => {
    const data = stateData.find(s => s.id === stateId);
    setSelectedState(data);
  };

  const activeState = selectedState || (hoveredState ? stateData.find(s => s.id === hoveredState) : null);

  return (
    <div className="map-feature-container fade-in">
      <div className="section-header">
        <div className="section-title-group">
          <MapIcon size={32} className="header-icon" />
          <h2>{language === 'en' ? 'Interactive Election Map' : 'इंटरएक्टिव चुनाव मानचित्र'}</h2>
        </div>
        <p>{language === 'en' ? 'Click on a state to view detailed party-wise seat standings.' : 'विस्तृत पार्टी-वार सीट स्थिति देखने के लिए किसी राज्य पर क्लिक करें।'}</p>
      </div>

      <div className="map-dashboard">
        <div className="map-visual-area">
          <svg viewBox="0 0 500 600" className="india-svg">
            {/* Background Outline of India */}
            <path 
              d="M150,50 C180,40 220,30 250,30 C280,30 320,40 350,50 L400,80 L450,150 L460,250 L420,350 L350,450 L300,580 L250,590 L200,580 L150,550 L100,500 L50,400 L40,250 L80,100 Z" 
              className="map-outline"
            />
            
            {/* Detailed States */}
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
          
          {hoveredState && (
            <div className="map-tooltip-overlay">
              {stateData.find(s => s.id === hoveredState)?.name[language]}
            </div>
          )}
        </div>

        <div className="map-info-panel slide-up">
          {activeState ? (
            <div className="state-details">
              <div className="panel-header">
                <div className="state-badge" style={{ backgroundColor: statePaths.find(p => p.id === activeState.id)?.color }}></div>
                <h3>{activeState.name[language]}</h3>
              </div>
              
              <div className="stat-summary-box">
                <div className="stat-pill">
                  <Users size={16} />
                  <span>{language === 'en' ? 'Total Seats' : 'कुल सीटें'}: <strong>{Object.values(activeState.seats).reduce((a, b) => a + b, 0)}</strong></span>
                </div>
              </div>

              <div className="party-breakdown">
                <div className="breakdown-header">
                  <PieChart size={18} />
                  <h4>{language === 'en' ? 'Seat Share' : 'सीट शेयर'}</h4>
                </div>
                <div className="party-list">
                  {Object.entries(activeState.seats).map(([party, count]) => (
                    <div key={party} className="party-seat-row">
                      <div className="party-meta">
                        <span className="party-label">{party}</span>
                        <span className="seat-count">{count}</span>
                      </div>
                      <div className="seat-bar-bg">
                        <div 
                          className="seat-bar-fill" 
                          style={{ 
                            width: `${(count / 80) * 100}%`,
                            backgroundColor: party === 'BJP' ? '#FF9933' : party === 'CONG' ? '#00BFFF' : party === 'TMC' ? '#20C997' : '#6C757D'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="panel-footer-hint">
                <Info size={14} />
                <span>{language === 'en' ? 'Click other states for more comparisons' : 'अधिक तुलना के लिए अन्य राज्यों पर क्लिक करें'}</span>
              </div>
            </div>
          ) : (
            <div className="empty-panel">
              <div className="empty-state-visual">
                <MapIcon size={64} className="pulse-icon" />
              </div>
              <p>{language === 'en' ? 'Select a state on the map to view live electoral data' : 'लाइव चुनावी डेटा देखने के लिए मानचित्र पर एक राज्य चुनें'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
