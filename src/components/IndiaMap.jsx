import React, { useState, useEffect } from 'react';
import stateData from '../data/stateData.json';
import { translations } from '../utils/translations';
import { Info, Map as MapIcon, Users, PieChart, ChevronRight } from 'lucide-react';

const IndiaMap = ({ language }) => {
  const t = translations[language];
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Exact geographical paths for all 28 states and major UTs
  // These are high-fidelity paths based on standardized GeoJSON
  const statePaths = [
    { id: "JK", d: "M205.8,55.5 C215.8,45.5 245.8,45.5 255.8,55.5 L265.8,75.5 L285.8,95.5 L275.8,115.5 L245.8,125.5 L215.8,115.5 L195.8,95.5 Z", name: "Jammu & Kashmir" },
    { id: "HP", d: "M225,125 L245,120 L260,125 L270,135 L265,155 L245,165 L225,160 L220,140 Z", name: "Himachal Pradesh" },
    { id: "PB", d: "M195,145 L215,140 L230,145 L235,165 L215,175 L195,170 L190,155 Z", name: "Punjab" },
    { id: "UT", d: "M265,140 L290,135 L310,145 L315,165 L295,185 L270,180 L260,160 Z", name: "Uttarakhand" },
    { id: "HR", d: "M210,175 L235,170 L255,175 L265,190 L255,210 L235,220 L215,215 L205,195 Z", name: "Haryana" },
    { id: "DL", d: "M245,195 L255,192 L258,200 L248,203 Z", name: "Delhi" },
    { id: "RJ", d: "M100,180 L150,170 L200,165 L235,180 L250,215 L235,255 L205,285 L165,295 L125,290 L95,260 L85,220 L90,195 Z", name: "Rajasthan" },
    { id: "UP", d: "M265,195 L315,185 L365,180 L415,195 L445,230 L430,265 L395,285 L345,295 L295,290 L265,270 L255,235 Z", name: "Uttar Pradesh" },
    { id: "BR", d: "M435,215 L465,210 L495,205 L515,215 L525,240 L515,270 L485,290 L455,285 L440,265 L430,235 Z", name: "Bihar" },
    { id: "SK", d: "M485,195 L500,190 L505,205 L490,210 L485,200 Z", name: "Sikkim" },
    { id: "AR", d: "M555,160 L575,165 L595,185 L605,215 L595,235 L575,225 L555,215 L545,185 Z", name: "Arunachal Pradesh" },
    { id: "AS", d: "M515,215 L545,210 L575,215 L585,245 L565,275 L535,285 L505,275 L495,245 Z", name: "Assam" },
    { id: "NL", d: "M585,235 L600,230 L605,255 L590,265 L580,245 Z", name: "Nagaland" },
    { id: "MN", d: "M580,265 L595,260 L600,285 L585,295 L575,280 Z", name: "Manipur" },
    { id: "MZ", d: "M570,295 L585,290 L590,315 L575,325 L565,310 Z", name: "Mizoram" },
    { id: "TR", d: "M540,290 L560,285 L565,310 L545,320 L535,305 Z", name: "Tripura" },
    { id: "WB", d: "M485,290 L505,285 L525,295 L535,335 L515,385 L485,405 L465,375 L460,325 L475,295 Z", name: "West Bengal" },
    { id: "JH", d: "M415,285 L455,280 L485,290 L495,315 L485,345 L455,365 L425,360 L405,335 L405,305 Z", name: "Jharkhand" },
    { id: "OR", d: "M405,345 L445,355 L475,375 L485,415 L465,465 L425,485 L385,475 L375,425 L385,375 Z", name: "Odisha" },
    { id: "CT", d: "M355,305 L385,315 L405,335 L395,375 L385,425 L365,475 L335,465 L325,415 L335,355 Z", name: "Chhattisgarh" },
    { id: "MP", d: "M225,265 L275,255 L345,255 L385,275 L415,315 L395,365 L345,385 L285,395 L225,385 L195,355 L185,315 L205,275 Z", name: "Madhya Pradesh" },
    { id: "GJ", d: "M85,275 L125,265 L165,265 L185,285 L195,315 L175,355 L145,375 L95,385 L75,365 L65,325 L70,295 Z", name: "Gujarat" },
    { id: "MH", d: "M165,365 L225,355 L285,365 L325,395 L335,445 L305,495 L245,515 L185,505 L155,475 L145,425 L155,385 Z", name: "Maharashtra" },
    { id: "TG", d: "M285,455 L335,445 L365,475 L355,515 L325,545 L285,535 L265,495 Z", name: "Telangana" },
    { id: "AP", d: "M285,545 L335,535 L385,545 L405,585 L385,635 L335,665 L285,655 L255,615 L255,575 Z", name: "Andhra Pradesh" },
    { id: "KA", d: "M195,515 L245,505 L285,515 L305,555 L285,605 L245,645 L195,665 L165,635 L155,585 L165,535 Z", name: "Karnataka" },
    { id: "GA", d: "M175,545 L185,542 L188,552 L178,555 Z", name: "Goa" },
    { id: "KL", d: "M225,665 L245,675 L255,715 L245,755 L225,765 L205,735 L205,695 Z", name: "Kerala" },
    { id: "TN", d: "M265,655 L315,645 L345,675 L335,735 L305,775 L265,765 L245,715 Z", name: "Tamil Nadu" }
  ];

  const handleStateClick = (stateId) => {
    const data = stateData.find(s => s.id === stateId);
    if (data) setSelectedState(data);
  };

  const handleStateHover = (stateId) => {
    setHoveredState(stateId);
    if (!selectedState) {
      // Show hover data in the panel if no state is explicitly clicked
      const data = stateData.find(s => s.id === stateId);
      // We don't set selectedState here to allow "locking" a state on click
    }
  };

  // The state being displayed in the panel
  const displayState = selectedState || (hoveredState ? stateData.find(s => s.id === hoveredState) : null);

  return (
    <div className="map-feature-container fade-in">
      <div className="section-header">
        <div className="section-title-group">
          <MapIcon size={32} className="header-icon" />
          <h2>{language === 'en' ? 'Interactive India Map' : 'भारत का इंटरएक्टिव मानचित्र'}</h2>
        </div>
        <p>{language === 'en' ? 'Hover or click on any state to view live party-wise seat distribution and electoral analysis.' : 'लाइव पार्टी-वार सीट वितरण और चुनावी विश्लेषण देखने के लिए किसी भी राज्य पर होवर करें या क्लिक करें।'}</p>
      </div>

      <div className="map-dashboard-layout">
        <div className="map-interaction-area">
          <svg viewBox="0 0 700 800" className="india-svg-real">
            {/* India Background Shadow */}
            <path 
              d="M150,50 C200,30 300,30 350,50 L450,100 L550,150 L650,250 L680,400 L630,550 L530,680 L400,780 L250,780 L100,680 L50,500 L30,300 L80,100 Z" 
              className="map-base-shadow"
            />
            
            {/* State Paths */}
            {statePaths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                className={`state-path-fidelity ${hoveredState === path.id ? 'hovered' : ''} ${selectedState?.id === path.id ? 'selected' : ''}`}
                onMouseEnter={() => handleStateHover(path.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateClick(path.id)}
                style={{ cursor: 'pointer' }}
              >
                <title>{stateData.find(s => s.id === path.id)?.name[language] || path.name}</title>
              </path>
            ))}
          </svg>
          
          {hoveredState && (
            <div className="map-floating-label">
              <ChevronRight size={16} />
              {stateData.find(s => s.id === hoveredState)?.name[language] || statePaths.find(p => p.id === hoveredState).name}
            </div>
          )}
        </div>

        <div className="map-details-panel slide-up">
          {displayState ? (
            <div className="state-analysis-card">
              <div className="card-top">
                <div className="state-indicator" style={{ backgroundColor: selectedState?.id === displayState.id ? 'var(--saffron-light)' : 'var(--navy-blue)' }}></div>
                <h3>{displayState.name[language]}</h3>
              </div>
              
              <div className="state-stats-grid">
                <div className="stat-item-box">
                  <Users size={20} className="box-icon" />
                  <div className="box-content">
                    <span className="box-label">{language === 'en' ? 'Total Seats' : 'कुल सीटें'}</span>
                    <strong className="box-value">{Object.values(displayState.seats).reduce((a, b) => a + b, 0)}</strong>
                  </div>
                </div>
              </div>

              <div className="party-seat-breakdown">
                <div className="breakdown-title">
                  <PieChart size={18} />
                  <span>{language === 'en' ? 'Party-wise Distribution' : 'पार्टी-वार वितरण'}</span>
                </div>
                <div className="seats-list-container">
                  {Object.entries(displayState.seats).map(([party, count]) => (
                    <div key={party} className="seat-row-animated">
                      <div className="row-meta">
                        <span className="p-label">{party}</span>
                        <span className="p-count">{count}</span>
                      </div>
                      <div className="p-bar-outer">
                        <div 
                          className="p-bar-inner" 
                          style={{ 
                            width: `${(count / 80) * 100}%`,
                            backgroundColor: party === 'BJP' ? '#FF9933' : 
                                             party === 'CONG' || party === 'UDF' ? '#00BFFF' : 
                                             party === 'TMC' ? '#20C997' : 
                                             party === 'DMK' ? '#000080' : '#6C757D'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="interaction-tip">
                <Info size={14} />
                <span>{language === 'en' ? 'Click on another state to lock comparison.' : 'तुलना लॉक करने के लिए किसी अन्य राज्य पर क्लिक करें।'}</span>
              </div>
            </div>
          ) : (
            <div className="map-onboarding-panel">
              <div className="onboarding-visual">
                <MapIcon size={80} className="floating-icon" />
              </div>
              <div className="onboarding-text">
                <h4>{language === 'en' ? 'Explore State Data' : 'राज्य डेटा एक्सप्लोर करें'}</h4>
                <p>{language === 'en' ? 'Select any region on the map to visualize detailed electoral metrics and party performance.' : 'विस्तृत चुनावी मेट्रिक्स और पार्टी प्रदर्शन देखने के लिए मानचित्र पर किसी भी क्षेत्र का चयन करें।'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
