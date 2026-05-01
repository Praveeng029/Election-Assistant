import React, { useState } from 'react';
import stateData from '../data/stateData.json';
import { translations } from '../utils/translations';
import { Info, Map as MapIcon, Users, PieChart } from 'lucide-react';

const IndiaMap = ({ language }) => {
  const t = translations[language];
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Accurate SVG paths for all Indian states and Union Territories
  const statePaths = [
    { id: "AP", d: "M281.8,409.8 L283.4,411.3 L285.5,413.5 L292,423 L298,428 L304.5,432.5 L310,436 L316,439 L322,442 L328,445 L334,448 L340,451 L335,445 L328,435 L322,425 L315,415 L310,405 L305,395 L300,385 L295,375 L290,365 L285,355 L280,345 L275,335 L270,325 L265,335 L260,345 L255,355 L250,365 L245,375 L240,385 L245,395 L250,405 L255,415 L260,425 L265,435 L270,445 L275,435 L280,425 Z", name: "Andhra Pradesh" },
    { id: "AR", d: "M434,130 L445,135 L455,145 L465,155 L475,165 L480,175 L470,180 L460,175 L450,170 L440,165 L430,160 L420,155 L415,145 L420,135 Z", name: "Arunachal Pradesh" },
    { id: "AS", d: "M400,160 L415,165 L430,170 L445,175 L460,180 L455,190 L445,200 L435,210 L425,220 L415,210 L405,200 L395,190 L390,180 L395,170 Z", name: "Assam" },
    { id: "BR", d: "M328,193 L340,190 L355,188 L370,190 L382,195 L388,205 L385,218 L375,228 L360,235 L345,232 L332,225 L325,210 Z", name: "Bihar" },
    { id: "CT", d: "M270,250 L285,255 L300,265 L310,280 L305,300 L295,320 L285,340 L275,320 L265,300 L260,280 L265,265 Z", name: "Chhattisgarh" },
    { id: "GA", d: "M175,385 L182,382 L185,388 L180,392 L175,390 Z", name: "Goa" },
    { id: "GJ", d: "M85,245 L110,238 L135,232 L150,235 L162,245 L165,260 L158,280 L145,295 L125,305 L100,310 L85,300 L75,280 L80,260 Z", name: "Gujarat" },
    { id: "HR", d: "M205,145 L220,140 L235,145 L245,155 L240,170 L230,180 L215,185 L205,175 L200,160 Z", name: "Haryana" },
    { id: "HP", d: "M215,105 L230,100 L245,105 L255,115 L250,130 L235,140 L220,135 L210,120 Z", name: "Himachal Pradesh" },
    { id: "JH", d: "M315,225 L335,220 L355,225 L365,235 L360,255 L345,270 L325,275 L310,265 L305,245 Z", name: "Jharkhand" },
    { id: "KA", d: "M180,350 L210,345 L240,355 L255,380 L245,415 L230,445 L210,470 L190,480 L175,465 L165,430 L165,390 L172,370 Z", name: "Karnataka" },
    { id: "KL", d: "M205,475 L215,480 L225,500 L230,525 L225,550 L215,560 L205,545 L200,520 L200,495 Z", name: "Kerala" },
    { id: "MP", d: "M185,230 L215,225 L250,225 L285,230 L310,240 L320,265 L305,290 L275,310 L240,315 L210,305 L190,290 L175,265 L178,245 Z", name: "Madhya Pradesh" },
    { id: "MH", d: "M155,285 L185,278 L220,275 L255,280 L275,300 L285,325 L270,350 L240,365 L200,375 L165,370 L145,350 L142,315 Z", name: "Maharashtra" },
    { id: "MN", d: "M450,215 L460,210 L465,220 L460,230 L450,225 Z", name: "Manipur" },
    { id: "ML", d: "M395,200 L415,195 L425,205 L415,215 L395,210 Z", name: "Meghalaya" },
    { id: "MZ", d: "M445,230 L455,225 L460,240 L450,250 L445,240 Z", name: "Mizoram" },
    { id: "NL", d: "M455,185 L465,180 L470,195 L460,205 L455,195 Z", name: "Nagaland" },
    { id: "OR", d: "M310,270 L330,275 L355,285 L370,305 L360,330 L335,350 L310,360 L295,345 L290,320 L295,290 Z", name: "Odisha" },
    { id: "PB", d: "M195,125 L210,120 L225,125 L230,140 L215,150 L200,145 L190,135 Z", name: "Punjab" },
    { id: "RJ", d: "M105,150 L140,140 L180,135 L215,145 L225,175 L215,210 L195,235 L165,245 L135,240 L110,225 L95,195 L98,170 Z", name: "Rajasthan" },
    { id: "SK", d: "M375,175 L385,170 L390,180 L380,185 L375,180 Z", name: "Sikkim" },
    { id: "TN", d: "M240,465 L270,470 L290,480 L300,505 L295,535 L285,560 L265,580 L245,565 L235,540 L235,505 L235,480 Z", name: "Tamil Nadu" },
    { id: "TG", d: "M245,320 L275,315 L295,330 L290,360 L270,380 L245,370 L235,345 Z", name: "Telangana" },
    { id: "TR", d: "M420,225 L435,220 L440,235 L425,240 L420,235 Z", name: "Tripura" },
    { id: "UP", d: "M240,175 L280,165 L320,160 L360,175 L385,200 L375,225 L345,240 L310,245 L275,240 L245,225 L235,200 Z", name: "Uttar Pradesh" },
    { id: "UT", d: "M255,120 L275,115 L295,125 L300,145 L285,165 L265,160 L250,140 Z", name: "Uttarakhand" },
    { id: "WB", d: "M370,225 L385,220 L400,225 L410,250 L395,285 L375,300 L365,275 L355,250 Z", name: "West Bengal" },
    { id: "JK", d: "M195,50 L230,40 L265,50 L280,80 L265,110 L230,120 L200,110 L185,80 Z", name: "Jammu & Kashmir" },
    { id: "DL", d: "M235,165 L245,162 L248,168 L240,172 Z", name: "Delhi" }
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
          <h2>{language === 'en' ? 'Current India Election Map' : 'वर्तमान भारत चुनाव मानचित्र'}</h2>
        </div>
        <p>{language === 'en' ? 'Select any state or UT to see the current political representation and seat data.' : 'वर्तमान राजनीतिक प्रतिनिधित्व और सीट डेटा देखने के लिए किसी भी राज्य या केंद्र शासित प्रदेश को चुनें।'}</p>
      </div>

      <div className="map-dashboard">
        <div className="map-visual-area">
          <svg viewBox="0 0 500 600" className="india-svg exact-map">
            {/* Detailed India Boundary Outline */}
            <path 
              d="M173,38 C205,25 245,25 285,38 L315,55 L355,65 L395,85 L435,125 L465,185 L485,255 L475,345 L425,445 L355,535 L300,585 L250,595 L200,585 L145,545 L95,495 L55,425 L35,325 L45,205 L85,105 L135,55 Z" 
              className="map-outline-main"
            />
            
            {/* Accurate State/UT Paths */}
            {statePaths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                className={`state-path detailed ${hoveredState === path.id ? 'hovered' : ''} ${selectedState?.id === path.id ? 'selected' : ''}`}
                onMouseEnter={() => setHoveredState(path.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(path.id)}
                style={{ 
                  '--state-color': '#FF9933', // Default theme color
                  cursor: 'pointer'
                }}
              >
                <title>{stateData.find(s => s.id === path.id)?.name[language] || path.name}</title>
              </path>
            ))}
          </svg>
          
          {hoveredState && (
            <div className="map-tooltip-overlay">
              {stateData.find(s => s.id === hoveredState)?.name[language] || statePaths.find(p => p.id === hoveredState).name}
            </div>
          )}
        </div>

        <div className="map-info-panel slide-up">
          {activeState ? (
            <div className="state-details">
              <div className="panel-header">
                <div className="state-badge active"></div>
                <h3>{activeState.name[language]}</h3>
              </div>
              
              <div className="stat-summary-box">
                <div className="stat-pill">
                  <Users size={16} />
                  <span>{language === 'en' ? 'Total Representative Seats' : 'कुल प्रतिनिधि सीटें'}: <strong>{Object.values(activeState.seats).reduce((a, b) => a + b, 0)}</strong></span>
                </div>
              </div>

              <div className="party-breakdown">
                <div className="breakdown-header">
                  <PieChart size={18} />
                  <h4>{language === 'en' ? 'Live Seat Share' : 'लाइव सीट शेयर'}</h4>
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
                          className="seat-bar-fill animated" 
                          style={{ 
                            width: `${(count / 80) * 100}%`,
                            backgroundColor: party === 'BJP' ? '#FF9933' : 
                                             party === 'CONG' ? '#00BFFF' : 
                                             party === 'TMC' ? '#20C997' : 
                                             party === 'DMK' ? '#000080' : '#6C757D'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="panel-footer-hint">
                <Info size={14} />
                <span>{language === 'en' ? 'Data represents the current house composition.' : 'डेटा वर्तमान सदन की संरचना का प्रतिनिधित्व करता है।'}</span>
              </div>
            </div>
          ) : (
            <div className="empty-panel">
              <div className="empty-state-visual">
                <MapIcon size={64} className="pulse-icon" />
              </div>
              <p className="fade-in-text">
                {language === 'en' ? 'Click on any region in the exact India map to analyze its current seat distribution' : 'वर्तमान सीट वितरण का विश्लेषण करने के लिए भारत के सटीक मानचित्र के किसी भी क्षेत्र पर क्लिक करें'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
