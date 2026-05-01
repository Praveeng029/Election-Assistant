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
        {language === 'en' ? 'READ' : 'पढ़ें'}
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

      // Daily Updates — Google News searches always show live, current results
      const mockDaily = [
        {
          id: 'd1',
          title: language === 'en' ? "Latest India Election 2024 News" : "भारत चुनाव 2024 की ताज़ा खबरें",
          source: "Google News",
          image: "https://images.unsplash.com/photo-1540910419892-f0c74b0e8966?q=80&w=800&auto=format&fit=crop",
          date: "Live Feed",
          url: "https://news.google.com/search?q=India+election+2024&hl=en-IN&gl=IN&ceid=IN:en"
        },
        {
          id: 'd2',
          title: language === 'en' ? "Lok Sabha Results & Party Seat Counts" : "लोकसभा परिणाम और पार्टी सीट गिनती",
          source: "Google News",
          image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=800&auto=format&fit=crop",
          date: "Latest",
          url: "https://news.google.com/search?q=Lok+Sabha+election+results+2024&hl=en-IN&gl=IN&ceid=IN:en"
        },
        {
          id: 'd3',
          title: language === 'en' ? "BJP, Congress & NDA Alliance Updates" : "भाजपा, कांग्रेस और एनडीए गठबंधन अपडेट",
          source: "Google News",
          image: "https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=800&auto=format&fit=crop",
          date: "Breaking",
          url: "https://news.google.com/search?q=BJP+Congress+NDA+India+election&hl=en-IN&gl=IN&ceid=IN:en"
        }
      ];

      // For You — Wikipedia: 100% stable, free, no paywall, fully readable
      const mockForYou = [
        {
          id: 'f1',
          title: language === 'en' ? "2024 Indian General Election — Complete Overview" : "2024 भारतीय आम चुनाव — पूर्ण अवलोकन",
          source: "Wikipedia",
          image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop",
          date: "Educational",
          url: "https://en.wikipedia.org/wiki/2024_Indian_general_election"
        },
        {
          id: 'f2',
          title: language === 'en' ? "Model Code of Conduct — What It Means" : "आदर्श आचार संहिता — इसका क्या अर्थ है",
          source: "Wikipedia",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop",
          date: "Must Read",
          url: "https://en.wikipedia.org/wiki/Model_Code_of_Conduct_(India)"
        },
        {
          id: 'f3',
          title: language === 'en' ? "Electronic Voting in India — EVM & VVPAT Guide" : "भारत में इलेक्ट्रॉनिक मतदान — ईवीएम और वीवीपीएटी",
          source: "Wikipedia",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
          date: "Essential",
          url: "https://en.wikipedia.org/wiki/Electronic_voting_in_India"
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
