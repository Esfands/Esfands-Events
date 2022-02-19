import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import useWebSocket from '../util/hooks/useWebSocket';
import useTimer from '../util/hooks/useTimer';

import Prediction from './prediction/Prediction';
import Poll from './poll/Poll';
import classNames from 'classnames';

const App = () => {
  const [event, connected] = useWebSocket();
  const [isOpen, setOpen] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [timer, setTimerDates, setTimerActive] = useTimer(null);

  useEffect(() => {
    if (event?.event.endsWith('begin')) {
      setTimerDates(event.dates);
      setVisible(true);
      setOpen(true);
    } else if (event?.event.endsWith('lock')) {
      setTimerActive(false);
      setTimeout(() => setVisible(false), 10000);
    } else if (event?.event.endsWith('end')) {
      setTimerActive(false);
      setOpen(false);
      setVisible(true);
      setTimeout(() => setVisible(false), 10000);
    }
  }, [event, setTimerActive, setTimerDates]);

  if (!connected) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <h1 className="text-white">No connection to Twitch</h1>
      </div>
    );
  }

  let eventComponent = null;

  if (event) {
    eventComponent =
      event.eventType === 'prediction' ? (
        <Prediction event={event} />
      ) : (
        <Poll event={event} isOpen={isOpen} />
      );
  }

  const eventClasses = classNames('position-absolute', {
    [event?.eventType]: !!event,
    [event?.format]: event?.format === 'compact',
    'no-event': !event,
  });

  return (
    <CSSTransition in={isVisible} timeout={500} classNames="event">
      <div id="event" className={eventClasses}>
        <div className="event-head position-absolute d-flex justify-content-between">
          <div className="text-wrap">
            <span className="top-tag event-type">
              {event?.eventType.toUpperCase()}
            </span>
          </div>
          <div className="text-wrap">
            <span className="top-tag time-left">{timer}</span>
          </div>
        </div>
        <div className="event-body">
          <h1 className="title">{event?.title}</h1>
          {eventComponent}
        </div>
      </div>
    </CSSTransition>
  );
};

export default App;
