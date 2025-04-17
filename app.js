const { useState, useEffect } = React;

const RecoveryCalendar = () => {
  const [surgeryDate, setSurgeryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [recoveryDays, setRecoveryDays] = useState(14);
  const [milestones, setMilestones] = useState([
    { day: 1, title: "手術當天", description: "" },
    { day: 2, title: "術後第2天", description: "" },
    { day: 3, title: "術後第3天", description: "" },
    { day: 5, title: "術後第5天", description: "" },
    { day: 7, title: "術後第7天", description: "" },
    { day: 10, title: "術後第10天", description: "" },
    { day: 14, title: "術後第14天", description: "" }
  ]);
  
  const [customMilestone, setCustomMilestone] = useState({ day: "", title: "", description: "" });
  const [currentDay, setCurrentDay] = useState(0);
  const [messages, setMessages] = useState([
    "今天會比昨天好一點！",
    "每一天都是朝康復邁進的一步",
    "你正在變得更強！",
    "堅持住，你做得很棒！",
    "恢復是一個過程，慢慢來",
    "每一天都是勝利",
    "一小步一小步，你正在進步"
  ]);

  useEffect(() => {
    const calculateCurrentDay = () => {
      const surgery = new Date(surgeryDate);
      const today = new Date();
      const diffTime = Math.abs(today - surgery);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCurrentDay(diffDays);
    };
    
    calculateCurrentDay();
    const timer = setInterval(calculateCurrentDay, 1000 * 60 * 60);
    
    return () => clearInterval(timer);
  }, [surgeryDate]);

  const handleAddMilestone = () => {
    if (customMilestone.day && customMilestone.title) {
      setMilestones([...milestones, { 
        day: parseInt(customMilestone.day), 
        title: customMilestone.title, 
        description: customMilestone.description 
      }]);
      setCustomMilestone({ day: "", title: "", description: "" });
    }
  };

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const recoveryPercentage = Math.min(100, Math.round((currentDay / recoveryDays) * 100));

  return (
    <div className="calendar-container">
      <h1>手術恢復倒數日曆</h1>
      
      <div className="section">
        <div className="form-control">
          <label>手術日期：</label>
          <input 
            type="date" 
            value={surgeryDate} 
            onChange={(e) => setSurgeryDate(e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label>預計恢復天數：</label>
          <input 
            type="number" 
            value={recoveryDays} 
            onChange={(e) => setRecoveryDays(parseInt(e.target.value))}
            min="1"
          />
        </div>
      </div>
      
      <div className="section">
        <h2>恢復進度</h2>
        
        <div style={{textAlign: 'center', marginBottom: '10px'}}>
          <span style={{fontSize: '24px', fontWeight: 'bold', color: '#1877f2'}}>{currentDay}</span>
          <span style={{marginLeft: '5px'}}>/ {recoveryDays} 天</span>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${recoveryPercentage}%` }}
          ></div>
        </div>
        
        <p style={{textAlign: 'center'}}>
          已完成 {recoveryPercentage}% 的恢復歷程
        </p>
        
        <div className="message-box">
          {getRandomMessage()}
        </div>
      </div>
      
      <div className="section">
        <h2>恢復里程碑</h2>
        
        {milestones
          .sort((a, b) => a.day - b.day)
          .map((milestone, index) => (
            <div 
              key={index} 
              className={`milestone ${currentDay >= milestone.day ? 'completed' : 'pending'}`}
            >
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{fontWeight: 'bold'}}>第 {milestone.day} 天</span>
                {currentDay >= milestone.day && (
                  <span style={{color: 'green'}}>✓ 已達成</span>
                )}
              </div>
              <p style={{margin: '5px 0', fontWeight: '500'}}>{milestone.title}</p>
              <p style={{margin: '5px 0', fontSize: '14px', color: '#666'}}>{milestone.description}</p>
            </div>
          ))
        }
      </div>
      
      <div className="section">
        <h2>添加個人里程碑</h2>
        
        <div className="form-control">
          <label>第幾天：</label>
          <input 
            type="number" 
            value={customMilestone.day} 
            onChange={(e) => setCustomMilestone({...customMilestone, day: e.target.value})}
            min="1"
          />
        </div>
        
        <div className="form-control">
          <label>標題：</label>
          <input 
            type="text" 
            value={customMilestone.title} 
            onChange={(e) => setCustomMilestone({...customMilestone, title: e.target.value})}
            placeholder="例如：回診"
          />
        </div>
        
        <div className="form-control">
          <label>描述：</label>
          <input 
            type="text" 
            value={customMilestone.description} 
            onChange={(e) => setCustomMilestone({...customMilestone, description: e.target.value})}
            placeholder="例如：檢查傷口恢復情況"
          />
        </div>
        
        <button onClick={handleAddMilestone}>
          添加里程碑
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<RecoveryCalendar />, document.getElementById('root'));
