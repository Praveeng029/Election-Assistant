import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, BarChart3, Globe, ExternalLink, Clock } from 'lucide-react';
import { translations } from '../utils/translations';

const Insights = ({ language }) => {
  const t = translations[language];
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOthers, setShowOthers] = useState(false);

  // Fallback image for news if sources fail
  const fallbackImg = "https://images.unsplash.com/photo-1540910419892-f0c74b0e8966?q=80&w=800&auto=format&fit=crop";

  // Mock seat data (Current projections/results)
  const seatData = [
    { party: 'BJP', seats: 285, color: '#FF9933', percentage: 52 },
    { party: 'Congress', seats: 95, color: '#00BFFF', percentage: 17 },
    { party: 'TMC', seats: 29, color: '#20C997', percentage: 5 },
    { 
      party: 'Others', 
      seats: 134, 
      color: '#6C757D', 
      percentage: 26,
      othersBreakdown: [
        { name: 'YSRCP', count: 22 },
        { name: 'DMK', count: 24 },
        { name: 'SHS', count: 18 },
        { name: 'BJD', count: 12 },
        { name: 'BSP', count: 10 },
        { name: 'TRS', count: 9 },
        { name: 'SAD', count: 2 },
        { name: 'Independent', count: 37 }
      ]
    },
  ];

  useEffect(() => {
    // Simulating a News API Fetch
    const fetchNews = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockNews = [
          {
            id: 1,
            title: language === 'en' ? "ECI Announces Phase-wise Polling Schedule" : "चुनाव आयोग ने चरणबद्ध मतदान कार्यक्रम की घोषणा की",
            source: "Election Times",
            image: "https://images.unsplash.com/photo-1540910419892-f0c74b0e8966?q=80&w=800&auto=format&fit=crop",
            date: "2 hours ago",
            url: "https://elections24.eci.gov.in"
          },
          {
            id: 2,
            title: language === 'en' ? "Voter Turnout Hits Record High in Phase 1" : "पहले चरण में मतदान का प्रतिशत रिकॉर्ड स्तर पर पहुँचा",
            source: "National Review",
            image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=800&auto=format&fit=crop",
            date: "5 hours ago",
            url: "https://pib.gov.in"
          },
          {
            id: 3,
            title: language === 'en' ? "New Tech in EVMs ensures 100% Security" : "ईवीएम में नई तकनीक 100% सुरक्षा सुनिश्चित करती है",
            source: "Tech Democracy",
            image: "https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=800&auto=format&fit=crop",
            date: "1 day ago",
            url: "https://www.eci.gov.in/voter-education"
          }
        ];
        setNews(mockNews);
        setLoading(false);
      }, 800);
    };

    fetchNews();
  }, [language]);

  const handleImageError = (e) => {
    e.target.src = fallbackImg;
  };

  return (
    <div className="insights-container fade-in">
      <div className="section-header">
        <h2>{t.nav.insights}</h2>
        <p>{language === 'en' ? 'Stay updated with the latest trends, news, and seat projections.' : 'नवीनतम रुझानों, समाचारों और सीट अनुमानों के साथ अपडेट रहें।'}</p>
      </div>

      <div className="insights-dashboard no-map">
        {/* Seat Tracker Section */}
        <div className="insight-card tracker-card slide-up">
          <div className="card-header">
            <TrendingUp className="header-icon" />
            <h3>{t.app.seatTracker}</h3>
          </div>
          <div className="seat-summary">
            <div className="total-badge">
              <span>{t.app.totalSeats}</span>
              <strong>543</strong>
            </div>
          </div>
          <div className="chart-area">
            {seatData.map((party) => (
              <div key={party.party} className="party-row-container">
                <div 
                  className={`party-row ${party.party === 'Others' ? 'clickable' : ''}`}
                  onClick={() => party.party === 'Others' && setShowOthers(!showOthers)}
                >
                  <div className="party-info">
                    <span className="party-name">{party.party} {party.party === 'Others' && (showOthers ? '▲' : '▼')}</span>
                    <span className="party-seats">{party.seats}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill animated" 
                      style={{ 
                        width: `${party.percentage}%`, 
                        backgroundColor: party.color,
                        boxShadow: `0 0 10px ${party.color}44`
                      }}
                    ></div>
                  </div>
                </div>
                
                {party.party === 'Others' && showOthers && (
                  <div className="others-breakdown-list slide-down">
                    {party.othersBreakdown.map((p) => (
                      <div key={p.name} className="other-party-item">
                        <span>{p.name}</span>
                        <strong>{p.count}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="disclaimer">
            {language === 'en' ? '*Based on recent projections. Click "Others" for breakdown.' : '*नवीनतम अनुमानों पर आधारित। विवरण के लिए "अन्य" पर क्लिक करें।'}
          </p>
        </div>

        {/* News Section */}
        <div className="news-section full-width">
          <div className="section-title">
            <Newspaper />
            <h3>{t.app.latestNews}</h3>
          </div>
          <div className="news-grid-expanded">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="news-skeleton"></div>
              ))
            ) : (
              news.map((item) => (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="news-card clickable-card premium-style"
                >
                  <div className="news-image-wrapper">
                    <img 
                      src={item.image} 
                      alt="news" 
                      className="news-img" 
                      onError={handleImageError}
                    />
                    <div className="news-overlay">
                      <span className="news-tag">{item.source}</span>
                    </div>
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <Clock size={14} />
                      <span>{item.date}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <span className="open-btn">
                      {language === 'en' ? 'Read Original Story' : 'मूल कहानी पढ़ें'}
                      <ExternalLink size={14} />
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
