import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, BarChart3, Globe, ExternalLink, Clock, Map as MapIcon } from 'lucide-react';
import { translations } from '../utils/translations';
import IndiaMap from './IndiaMap';

const Insights = ({ language }) => {
  const t = translations[language];
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  // Mock seat data (Current projections/results)
  const seatData = [
    { party: 'BJP', seats: 285, color: '#FF9933', percentage: 52 },
    { party: 'Congress', seats: 95, color: '#00BFFF', percentage: 17 },
    { party: 'TMC', seats: 29, color: '#20C997', percentage: 5 },
    { party: 'Others', seats: 134, color: '#6C757D', percentage: 26 },
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
            image: "https://images.unsplash.com/photo-1540910419892-f0c74b0e8966?auto=format&fit=crop&w=600",
            date: "2 hours ago",
            content: language === 'en' ? "The Election Commission of India has officially released the schedule for the upcoming general elections. The polling will be conducted in 7 phases starting from April 19." : "भारत के चुनाव आयोग ने आधिकारिक तौर पर आगामी आम चुनावों के लिए कार्यक्रम जारी कर दिया है। मतदान 19 अप्रैल से शुरू होकर 7 चरणों में होगा।"
          },
          {
            id: 2,
            title: language === 'en' ? "Voter Turnout Hits Record High in Phase 1" : "पहले चरण में मतदान का प्रतिशत रिकॉर्ड स्तर पर पहुँचा",
            source: "National Review",
            image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=600",
            date: "5 hours ago",
            content: language === 'en' ? "Massive voter participation was recorded in the first phase of elections across 102 constituencies. Youth and first-time voters turned up in large numbers." : "102 निर्वाचन क्षेत्रों में चुनावों के पहले चरण में बड़े पैमाने पर मतदाताओं की भागीदारी दर्ज की गई। युवा और पहली बार वोट देने वाले बड़ी संख्या में पहुंचे।"
          },
          {
            id: 3,
            title: language === 'en' ? "New Tech in EVMs ensures 100% Security" : "ईवीएम में नई तकनीक 100% सुरक्षा सुनिश्चित करती है",
            source: "Tech Democracy",
            image: "https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&w=600",
            date: "1 day ago",
            content: language === 'en' ? "The latest generation of EVMs features advanced encryption and VVPAT verification, making the voting process more transparent and tamper-proof than ever." : "ईवीएम की नवीनतम पीढ़ी में उन्नत एन्क्रिप्शन और वीवीपीएटी सत्यापन की सुविधा है, जो मतदान प्रक्रिया को पहले से कहीं अधिक पारदर्शी और छेड़छाड़-मुक्त बनाती है।"
          }
        ];
        setNews(mockNews);
        setLoading(false);
      }, 800);
    };

    fetchNews();
  }, [language]);

  return (
    <div className="insights-container fade-in">
      <div className="section-header">
        <h2>{t.nav.insights}</h2>
        <p>{language === 'en' ? 'Stay updated with the latest trends, news, and seat projections.' : 'नवीनतम रुझानों, समाचारों और सीट अनुमानों के साथ अपडेट रहें।'}</p>
      </div>

      <div className="insights-dashboard">
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
              <div key={party.party} className="party-row">
                <div className="party-info">
                  <span className="party-name">{party.party}</span>
                  <span className="party-seats">{party.seats}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${party.percentage}%`, 
                      backgroundColor: party.color,
                      boxShadow: `0 0 10px ${party.color}44`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <p className="disclaimer">
            {language === 'en' ? '*Based on recent projections. Check official results for final data.' : '*नवीनतम अनुमानों पर आधारित। अंतिम डेटा के लिए आधिकारिक परिणाम देखें।'}
          </p>
        </div>

        {/* News Section */}
        <div className="news-section">
          <div className="section-title">
            <Newspaper />
            <h3>{t.app.latestNews}</h3>
          </div>
          <div className="news-grid">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="news-skeleton"></div>
              ))
            ) : (
              news.map((item) => (
                <div key={item.id} className="news-card clickable" onClick={() => setSelectedNews(item)}>
                  <div className="news-image">
                    <img src={item.image} alt="news" loading="lazy" />
                    <span className="news-tag">{item.source}</span>
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <Clock size={14} />
                      <span>{item.date}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <span className="read-more">
                      {language === 'en' ? 'View Details' : 'विवरण देखें'}
                      <ExternalLink size={14} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* State-wise Interactive Map Section */}
        <IndiaMap language={language} />
      </div>

      {/* News Modal */}
      {selectedNews && (
        <div className="modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="modal-content slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedNews(null)}>&times;</button>
            <div className="modal-image">
              <img src={selectedNews.image} alt="news detail" />
            </div>
            <div className="modal-body">
              <div className="modal-meta">
                <span className="modal-tag">{selectedNews.source}</span>
                <span className="modal-date">{selectedNews.date}</span>
              </div>
              <h2>{selectedNews.title}</h2>
              <p>{selectedNews.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
