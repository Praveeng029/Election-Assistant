import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, BarChart3, Globe, ExternalLink, Clock } from 'lucide-react';
import { translations } from '../utils/translations';

/**
 * Insights Component
 * Displays election seat trackers and segmented news feeds.
 * Includes 'Daily Updates' and 'For You' sections with direct article deep-linking.
 */
const NewsCard = ({ item, language, isPremium }) => (
  <a 
    href={item.url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`news-card clickable-card ${isPremium ? 'premium-style' : ''}`}
    aria-label={`${language === 'en' ? 'Read full story:' : 'पूरी कहानी पढ़ें:'} ${item.title}`}
  >
    <div className="news-image-wrapper">
      <img 
        src={item.image} 
        alt="" 
        className="news-img" 
        loading="lazy"
        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540910419892-f0c74b0e8966?q=80&w=800&auto=format&fit=crop"; }}
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
);

const Insights = ({ language }) => {
  const t = translations[language];
  const [dailyNews, setDailyNews] = useState([]);
  const [forYouNews, setForYouNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOthers, setShowOthers] = useState(false);

  // Seat Data (Optimized with memoization logic if needed in future)
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
    const fetchData = async () => {
      setLoading(true);
      // Simulate API Fetch Delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Daily Updates: Latest News
      const mockDaily = [
        {
          id: 'd1',
          title: language === 'en' ? "General Election 2024: Phase 2 Voting Begins" : "आम चुनाव 2024: दूसरे चरण का मतदान शुरू",
          source: "ECI News",
          image: "https://images.unsplash.com/photo-1540910419892-f0c74b0e8966?q=80&w=800&auto=format&fit=crop",
          date: "4 hours ago",
          url: "https://www.eci.gov.in/files/file/15647-general-election-2024-schedule/"
        },
        {
          id: 'd2',
          title: language === 'en' ? "High Tech Monitoring System Deployed for Fair Elections" : "निष्पक्ष चुनाव के लिए हाई टेक निगरानी प्रणाली तैनात",
          source: "National Review",
          image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=800&auto=format&fit=crop",
          date: "6 hours ago",
          url: "https://pib.gov.in/PressReleasePage.aspx?PRID=2015842"
        },
        {
          id: 'd3',
          title: language === 'en' ? "Security Tightened Across Borders Ahead of Phase 3" : "तीसरे चरण से पहले सीमाओं पर सुरक्षा कड़ी की गई",
          source: "Security Watch",
          image: "https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=800&auto=format&fit=crop",
          date: "1 day ago",
          url: "https://www.ndtv.com/india-news/election-2024-phase-3-voting-on-may-7-full-list-of-constituencies-5582963"
        }
      ];

      // For You: Explanations & Importance
      const mockForYou = [
        {
          id: 'f1',
          title: language === 'en' ? "How EVMs and VVPATs Work: An In-depth Guide" : "ईवीएम और वीवीपीएटी कैसे काम करते हैं: एक विस्तृत गाइड",
          source: "Knowledge Hub",
          image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop",
          date: "Recommended",
          url: "https://www.eci.gov.in/evm-vvpat"
        },
        {
          id: 'f2',
          title: language === 'en' ? "Understanding the Model Code of Conduct (MCC)" : "आदर्श चुनाव आचार संहिता (MCC) को समझना",
          source: "Electoral Law",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
          date: "Importance: High",
          url: "https://www.eci.gov.in/mcc/"
        },
        {
          id: 'f3',
          title: language === 'en' ? "Role of the District Election Officer (DEO)" : "जिला निर्वाचन अधिकारी (DEO) की भूमिका",
          source: "Democracy Guide",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
          date: "Must Read",
          url: "https://www.eci.gov.in/handbooks-for-election-officials"
        }
      ];

      setDailyNews(mockDaily);
      setForYouNews(mockForYou);
      setLoading(false);
    };

    fetchData();
  }, [language]);

  return (
    <div className="insights-container fade-in" role="region" aria-label="Election Insights">
      <div className="section-header">
        <h2>{t.nav.insights}</h2>
        <p>{language === 'en' ? 'Stay updated with the latest trends and educational election content.' : 'नवीनतम रुझानों और शैक्षिक चुनाव सामग्री के साथ अपडेट रहें।'}</p>
      </div>

      <div className="insights-dashboard no-map">
        {/* Seat Tracker Section */}
        <section className="insight-card tracker-card slide-up" aria-labelledby="tracker-title">
          <div className="card-header">
            <TrendingUp className="header-icon" />
            <h3 id="tracker-title">{t.app.seatTracker}</h3>
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
                  role={party.party === 'Others' ? "button" : "presentation"}
                  aria-expanded={party.party === 'Others' ? showOthers : undefined}
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
        </section>

        {/* Daily News Section */}
        <section className="news-section full-width" aria-labelledby="daily-news-title">
          <div className="section-title">
            <Newspaper />
            <h3 id="daily-news-title">{language === 'en' ? 'Daily Updates' : 'दैनिक अपडेट'}</h3>
          </div>
          <div className="news-grid-expanded">
            {loading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="news-skeleton"></div>)
            ) : (
              dailyNews.map((item) => <NewsCard key={item.id} item={item} language={language} isPremium={true} />)
            )}
          </div>
        </section>

        {/* For You Section (Educational) */}
        <section className="news-section full-width" aria-labelledby="foryou-news-title">
          <div className="section-title">
            <Globe className="foryou-icon" />
            <h3 id="foryou-news-title">{language === 'en' ? 'For You' : 'आपके लिए'}</h3>
          </div>
          <div className="news-grid-expanded">
            {loading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="news-skeleton"></div>)
            ) : (
              forYouNews.map((item) => <NewsCard key={item.id} item={item} language={language} isPremium={true} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Insights;
