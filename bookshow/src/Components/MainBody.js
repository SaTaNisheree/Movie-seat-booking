import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Login from './Login';
import Signup from './Signup';
import SearchMovie from './SearchMovie';
import SearchHall from './SearchHall';
import MovieDetails from './MovieDetails';
import HallDetails from './HallDetails';
import SeatSelection from './SeatSelection';
import AddMovie from './AddMovie';
import AddHall from './AddHall';
import AddShow from './AddShow';

const MainBody = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [showAddHall, setShowAddHall] = useState(false);
  const [showAddShow, setShowAddShow] = useState(false);

  const handleLogin = (username, password) => {
    if (username === 'admin@123' && password === 'admin123') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setIsAdmin(false);
    setSelectedMovie(null);
    setSelectedHall(null);
    setSelectedSeats([]);
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleSelectHall = (hall) => {
    setSelectedHall(hall);
  };

  const handleSelectSeats = (seats) => {
    setSelectedSeats(seats);
  };

  return (
    <div className="container py-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Movie Booking App</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!loggedIn ? (
                <>
                  <li className="nav-item">
                    <Button variant="link" onClick={() => setShowLoginModal(true)}>Login</Button>
                  </li>
                  <li className="nav-item">
                    <Button variant="link" onClick={() => setShowSignupModal(true)}>Signup</Button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Button variant="link" onClick={handleLogout}>Logout</Button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onLogin={handleLogin} />
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Signup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Signup />
        </Modal.Body>
      </Modal>

      {!loggedIn ? (
        <div className="text-center">
          <h2>Please login or signup to book tickets</h2>
        </div>
      ) : (
        <div>
          {isAdmin ? (
            <div className="text-center">
              <h2>Admin Panel</h2>
              <Button variant="primary" className="m-2" onClick={() => setShowAddMovie(true)}>Add Movie</Button>
              <Button variant="primary" className="m-2" onClick={() => setShowAddHall(true)}>Add Hall</Button>
              <Button variant="primary" className="m-2" onClick={() => setShowAddShow(true)}>Add Show</Button>

              {/* Add Movie Modal */}
              <Modal show={showAddMovie} onHide={() => setShowAddMovie(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddMovie />
                </Modal.Body>
              </Modal>

              {/* Add Hall Modal */}
              <Modal show={showAddHall} onHide={() => setShowAddHall(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Hall</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddHall />
                </Modal.Body>
              </Modal>

              {/* Add Show Modal */}
              <Modal show={showAddShow} onHide={() => setShowAddShow(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Show</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddShow />
                </Modal.Body>
              </Modal>
            </div>
          ) : (
            <>
              <div className="row mt-4">
                <div className="col-md-12">
                  <SearchMovie onSelectMovie={handleSelectMovie} />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <SearchHall onSelectHall={handleSelectHall} />
                </div>
              </div>
              {selectedMovie && (
                <div className="row mt-4">
                  <div className="col">
                    <MovieDetails movie={selectedMovie} />
                  </div>
                </div>
              )}
              {selectedHall && (
                <div className="row mt-4">
                  <div className="col">
                    <HallDetails hall={selectedHall} />
                  </div>
                </div>
              )}
              {selectedMovie && selectedHall && (
                <div className="row mt-4">
                  <div className="col">
                    <SeatSelection selectedSeats={selectedSeats} onSelectSeat={handleSelectSeats} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MainBody;
