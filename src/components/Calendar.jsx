import React, { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import debounce from 'lodash.debounce';

const fetchGlobalEvents = async () => {
  try {
    const response = await fetch(
      "https://calendarific.com/api/v2/holidays?&api_key=afQo8gVPGQw2mcVM1k7498fWcY1Atyw1&country=IN&year=2024"
    );
    const data = await response.json();
    if (data.response && data.response.holidays) {
      return data.response.holidays.map(holiday => ({
        title: holiday.name,
        start: holiday.date.iso,
        isGlobal: true
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching global events:", error);
    return [];
  }
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    const loadEvents = async () => {
      const globalEvents = await fetchGlobalEvents();
      setEvents(globalEvents);

      const savedUserEvents = JSON.parse(localStorage.getItem('userEvents')) || [];
      setUserEvents(savedUserEvents);
      setFilteredEvents([...globalEvents, ...savedUserEvents]);
    };

    loadEvents();
  }, []);

  const calendarRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('userEvents', JSON.stringify(userEvents));
    const allEvents = [...events, ...userEvents];
    const filtered = allEvents.filter(event =>
      event.title.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [userEvents, events, filter]);

  const handleAddEventClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleDateClick = useCallback((arg) => {
    if (!modalOpen) {
      setNewEvent({ ...newEvent, start: arg.dateStr, end: arg.dateStr });
      setModalOpen(true);
    }
  }, [modalOpen, newEvent]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddEvent = useCallback(() => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const eventToAdd = { ...newEvent, id: new Date().toISOString(), isGlobal: false };
      setUserEvents(prev => [...prev, eventToAdd]);
      setModalOpen(false);
      setNewEvent({ title: '', start: '', end: '' });
    } else {
      alert('Please fill in all fields');
    }
  }, [newEvent]);

  const handleEditEvent = useCallback(() => {
    if (selectedEvent) {
      const updatedEvents = userEvents.map(event =>
        event.id === selectedEvent.id ? { ...selectedEvent } : event
      );
      setUserEvents(updatedEvents);
      setEditModalOpen(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent, userEvents]);

  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      console.log("Deleting event:", selectedEvent);
      const updatedEvents = userEvents.filter(event => event.id !== selectedEvent.id);
      console.log("Updated events after deletion:", updatedEvents);

      setUserEvents(updatedEvents);
      setEditModalOpen(false);
      setSelectedEvent(null);
    } else {
      console.log("No event selected for deletion.");
    }
  }, [selectedEvent, userEvents]);

  const handleFilterChange = useCallback(debounce((e) => {
    setFilter(e.target.value);
  }, 300), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!modalOpen && !editModalOpen) {
          setModalOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modalOpen, editModalOpen]);

  return (
    <div>
      <input
        type="text"
        placeholder="Filter events"
        onChange={handleFilterChange}
        style={{
          margin: "10px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          width: "calc(100% - 50px)"
        }}
      />
      <button
        style={{
          margin: "10px",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleAddEventClick}>Add Event</button>

      {modalOpen && (
        <div
          ref={modalRef}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
            zIndex: "1000",
          }}
        >
          <button
            onClick={() => setModalOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            &times;
          </button>
          <h2 style={{textAlign: "center"}}>Add Event</h2>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleInputChange}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="datetime-local"
            name="start"
            placeholder="Start Date"
            value={newEvent.start}
            onChange={handleInputChange}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="datetime-local"
            name="end"
            placeholder="End Date"
            value={newEvent.end}
            onChange={handleInputChange}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={handleAddEvent}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Event
          </button>
          <button
            onClick={() => setModalOpen(false)}
            style={{
              padding: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {editModalOpen && selectedEvent && (
        <div
          ref={modalRef}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
            zIndex: "1000",
          }}
        >
          <button
            onClick={() => setEditModalOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            &times;
          </button>
          <h2>Edit Event</h2>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={selectedEvent.title || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="datetime-local"
            name="start"
            placeholder="Start Date"
            value={selectedEvent.start || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="datetime-local"
            name="end"
            placeholder="End Date"
            value={selectedEvent.end || ''}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={handleEditEvent}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Save Changes
          </button>
          <button
            onClick={handleDeleteEvent}
            style={{
              padding: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete Event
          </button>
          <button
            onClick={() => setEditModalOpen(false)}
            style={{
              padding: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="90vh"
        events={filteredEvents}
        dateClick={handleDateClick}
        eventClick={({ event }) => {
          console.log("Event clicked:", event._def.extendedProps);
          setSelectedEvent({ ...event._def.extendedProps, id: event.id });
          setEditModalOpen(true);
        }}
        
        
      />
    </div>
  );
};

export default Calendar;
