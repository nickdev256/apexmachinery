import Icon from './Icon';
import './Timeline.css';

export function ProgressBar({ steps, activeIndex }) {
  return (
    <div className="progress-bar">
      {steps.map((step, i) => (
        <div className="progress-step" key={step}>
          <div className={`progress-dot ${i <= activeIndex ? 'done' : ''} ${i === activeIndex ? 'current' : ''}`}>
            {i < activeIndex ? <Icon name="check" size={14} /> : i + 1}
          </div>
          <span className={i <= activeIndex ? 'active-label' : ''}>{step}</span>
          {i < steps.length - 1 && <div className={`progress-line ${i < activeIndex ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  );
}

export function Timeline({ milestones }) {
  return (
    <ul className="timeline">
      {milestones.map((m, i) => (
        <li key={i} className={`timeline-item ${m.status}`}>
          <div className="timeline-marker">
            <Icon name={m.status === 'done' ? 'check' : m.status === 'current' ? 'clock' : 'package'} size={14} />
          </div>
          <div className="timeline-content">
            <div className="timeline-top">
              <strong>{m.title}</strong>
              <span>{m.date}</span>
            </div>
            <p>{m.note}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
