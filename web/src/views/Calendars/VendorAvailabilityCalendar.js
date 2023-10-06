import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [markedDates, setMarkedDates] = useState([
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 28), 
    new Date(new Date().getFullYear(), new Date().getMonth(), 10), 
  ]);

  const toggleModal = () => {
    setShowModal(!showModal);
    setStartDate(null);
    setEndDate(null);
    setIsBusy(false);
    setIsAvailable(false);
  };

  const handleDateRangeSelection = () => {
    if (startDate && endDate) {
      const newMarkedDates = [...markedDates];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        newMarkedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setMarkedDates(newMarkedDates);
    }
    toggleModal();
  };

  const isDateMarkedAsBusy = (date) => {
    return markedDates.some(d => d.toDateString() === date.toDateString());
  };

  const tileClassName = ({ date }) => {
    if (isDateMarkedAsBusy(date)) {
      return 'busy-tile';
    }
  };

  return (
    <div className="my-calendar">
      <div className="calendar-container" style={{ width: '80%' }}> 
        <div className='heading heading1'> <h1 className="calendar-title">Calendar</h1>
          <Button
            variant="success"
            className="set-availability-button"
            onClick={toggleModal}
          >
            Set Availability
          </Button>
              </div>
              <div className='xyz'>
        <Calendar
          onChange={setDate}
                      value={date}
                 
          tileClassName={tileClassName}
          onClickDay={(value) => {
            if (isBusy || isAvailable) {
              const newMarkedDates = [...markedDates, value];
              setMarkedDates(newMarkedDates);
            }
          }}
                  />
                  </div>
        <Modal show={showModal} onHide={toggleModal} centered>
          <Modal.Header>
            <div className='heading'>
              <Modal.Title><h3>Select Date Range</h3></Modal.Title>
              <button className="close" onClick={toggleModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <DateRangePicker
              ranges={[
                {
                  startDate: startDate || new Date(),
                  endDate: endDate || new Date(),
                  key: 'selection',
                },
              ]}
              onChange={(ranges) => {
                setStartDate(ranges.selection.startDate);
                setEndDate(ranges.selection.endDate);
              }}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
            />
            <div className="modal-buttons">
              <label>
                <input
                  type="radio"
                  name="availability"
                  value="busy"
                  checked={isBusy}
                  onChange={() => {
                    setIsBusy(true);
                    setIsAvailable(false);
                  }}
                />
                Mark Busy
              </label>
              <label>
                <input
                  type="radio"
                  name="availability"
                  value="available"
                  checked={isAvailable}
                  onChange={() => {
                    setIsBusy(false);
                    setIsAvailable(true);
                  }}
                />
                Mark Available
              </label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDateRangeSelection}>
              Save as {isBusy ? 'Busy' : 'Available'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default MyCalendar;
