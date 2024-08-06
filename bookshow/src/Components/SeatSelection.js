import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SeatSelection = () => {
  const { movieId, hallId, serialNo } = useParams();
  const [selectedSeatIndexes, setSelectedSeatIndexes] = useState([]);
  const [bookable, setBookable] = useState(false);
  const [seats, setSeats] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/seats/${serialNo}`);
        if (response.data) {
          setSeats(response.data[0].seat_status);
        }
      } catch (err) {
        console.error(err);
        setSeats([]);
      }
    };

    // Fetch seats data based on serialNo
    fetchSeats();
  }, [serialNo]);

  const handleSeatClick = (index) => {
    const updatedSeatIndexes = [...selectedSeatIndexes];
    if (updatedSeatIndexes.includes(index)) {
      // Deselect the seat if it's already selected
      updatedSeatIndexes.splice(updatedSeatIndexes.indexOf(index), 1);
    } else {
      // Select the seat if it's not already selected
      updatedSeatIndexes.push(index);
    }
    setSelectedSeatIndexes(updatedSeatIndexes);
    setBookable(updatedSeatIndexes.length > 0);
  };

  const handleBookSeats = async () => {
    // Simulate booking seats (Replace this with actual API call)
    try {
      const response = await axios.post(`http://localhost:5500/bookseats`, {
        serialNo,
        selectedSeats: selectedSeatIndexes // Send selected seat indexes in the API request
      });
      if (response.data.success) {
        setBookingStatus('success');
      } else {
        setBookingStatus('failure');
      }
    } catch (err) {
      console.error(err);
      setBookingStatus('failure');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">Seat Selection</div>
            <div className="card-body">
              <div className="text-center mb-4">
                <h5>Screen</h5>
                <img src="/screen.svg" alt="Screen" style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
              <div className="d-flex flex-wrap justify-content-center">
                {seats.map((status, index) => (
                  <button
                    key={index}
                    className={`btn m-1 ${status === 'booked' ? 'btn-danger disabled' : selectedSeatIndexes.includes(index) ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => handleSeatClick(index)}
                    disabled={status === 'booked'}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={handleBookSeats} disabled={!bookable}>Book Seats</button>
              </div>
              {bookingStatus === 'success' && (
                <>
                  <div className="modal-backdrop fade show"></div>
                  <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header bg-success text-white">
                          <h5 className="modal-title">Tickets Booked Successfully!</h5>
                        </div>
                        <div className="modal-body">
                          Your tickets have been booked successfully.
                        </div>
                        <div className="modal-footer">
                          <Link to="/" className="btn btn-primary">Home</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {bookingStatus === 'failure' && (
                <div className="alert alert-danger mt-3" role="alert">
                  Sorry, some selected seats are not available currently. Please choose again.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
