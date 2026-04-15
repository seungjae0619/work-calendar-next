export default function CalendarStyles() {
  return (
    <style>{`
      .fc { background: #ffffff; }
      .fc .fc-toolbar { background: #ffffff; }
      .fc .fc-toolbar-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1a1a1a;
        letter-spacing: 0.05em;
      }
      .fc .fc-button {
        background: #ffffff !important;
        border: 1px solid #e0e0e0 !important;
        color: #444 !important;
        box-shadow: none !important;
        border-radius: 6px !important;
        padding: 4px 10px !important;
        font-size: 0.8rem !important;
        transition: background 0.15s;
      }
      .fc .fc-button:hover { background: #f5f5f5 !important; }
      .fc .fc-col-header-cell {
        padding: 8px 0;
        background: #fafafa;
        border-bottom: 1px solid #ececec;
      }
      .fc .fc-col-header-cell-cushion {
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #888;
        text-decoration: none !important;
      }
      .fc .fc-day-sun .fc-col-header-cell-cushion { color: #e53935; }
      .fc .fc-day-sat .fc-col-header-cell-cushion { color: #1e88e5; }
      .fc .fc-daygrid-day { border-color: #f0f0f0 !important; }
      .fc .fc-daygrid-day-number {
        font-size: 0.82rem;
        color: #333;
        padding: 6px 8px;
        text-decoration: none !important;
      }
      .fc .fc-day-sun .fc-daygrid-day-number { color: #e53935; }
      .fc .fc-day-sat .fc-daygrid-day-number { color: #1e88e5; }
      .fc .fc-day-holiday .fc-daygrid-day-number { color: #e53935 !important; }
      .fc .fc-day-today { background: #fffde7 !important; }
      .fc .fc-day-today .fc-daygrid-day-number { font-weight: 700; color: #f9a825; }
      .fc .fc-daygrid-event { background: transparent !important; border: none !important; }
      .fc .fc-scrollgrid { border-color: #ececec !important; }
      .fc .fc-scrollgrid-section > td { border-color: #ececec !important; }
      .fc-slide-left {
        animation: slideLeft 0.25s ease-in-out;
      }
      .fc-slide-right {
        animation: slideRight 0.25s ease-in-out;
      }
      @keyframes slideLeft {
        0%   { transform: translateX(0);     opacity: 1; }
        100% { transform: translateX(-60px); opacity: 0; }
      }
      @keyframes slideRight {
        0%   { transform: translateX(0);    opacity: 1; }
        100% { transform: translateX(60px); opacity: 0; }
      }
    `}</style>
  );
}
