import React, { useEffect, useState } from 'react';
import '../styles/Objects.css';
import ObjectCard from './ObjectCard';
import Navbar from './Navbar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AddObjectModal from './AddObjectModal'; // Importujte novu komponentu

const Objects = () => {
  const [objects, setObjects] = useState([]);
  const [placeItems, setPlaceItems] = useState([]); // Dodajte state za placeItems
  const [filterOn, setFilterOn] = useState('PlaceItem');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [isAscending, setIsAscending] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [userRole, setUserRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUserRole(userRole); // Pretpostavljamo da se uloga nalazi u `role` polju tokena
    }
    fetchObjects();
    fetchPlaceItems(); // Dodajte ovu funkciju za preuzimanje placeItems
  }, [filterOn, filterQuery, sortBy, isAscending, pageNumber, pageSize]);

  const fetchObjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing!');
        // Možda je korisnik odjavljen, možeš ga preusmeriti na login stranicu
      }
      const response = await axios.get('https://localhost:5000/api/Place', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          filterOn,
          filterQuery: filterQuery !== 'all' ? filterQuery : '',
          sortBy,
          isAscending,
          pageNumber,
          pageSize
        }
      });
      setObjects(response.data);
    } catch (error) {
      console.error('Error fetching objects:', error);
    }
  };

  const fetchPlaceItems = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/PlaceItem'); // Ažurirajte URL ako je potrebno
      setPlaceItems(response.data);
    } catch (error) {
      console.error('Error fetching place items:', error);
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    setIsAscending(!isAscending);
  };

  const handleFilter = (e) => {
    setFilterQuery(e.target.value);
    setPageNumber(1); // Resetujemo na prvu stranicu
  };

  const nextPage = () => setPageNumber(pageNumber + 1);
  const prevPage = () => setPageNumber(pageNumber - 1);
  const changePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPageNumber(1); // Resetujemo na prvu stranicu
  };

  const handleAddObject = async (newObject) => {
  try {
    const token = localStorage.getItem('token');
    
    await axios.post('https://localhost:5000/api/Place', newObject, {  // Dodaj JSON.stringify
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert('Object added successfully');
    fetchObjects(); // Osvježite listu objekata
  } catch (error) {
    console.error('Error adding object:', error);
    alert('Error adding object.');
  }
};


  return (
    <div className="objects-container-page">
      <Navbar />
      <div className="objects-content">
        <div className='objects-title'>
          <h2>All Objects</h2>
        </div>
        <div className="toolbar">
          <button className="sort-button" onClick={() => handleSort('price')}>
            Sort Price {isAscending ? '↑' : '↓'}
          </button>
          <input
            type="text"
            placeholder="Search by title"
            className="search-input"
            value={filterQuery} // Povežite sa state-om
            onChange={(e) => { setFilterOn('Name'); handleFilter(e) }}
          />
          <select className="filter-select" onChange={(e) => { setFilterOn('PlaceItem'); handleFilter(e) }}>
            <option value="all">All</option>
            <option value="cafe">Café</option>
            <option value="rooftop">Rooftop</option>
            <option value="restaurant">Restaurant</option>
          </select>
          
          <button className="add-object-button" disabled={userRole === 'RegularUser'} onClick={() => setIsModalOpen(true)}>+ Add Object</button>
        </div>
        <div className="objects-grid">
          {objects.map((obj, index) => (
            <ObjectCard
              key={index}
              id={obj.placeID}
              name={obj.name}
              price={obj.price}
              location={obj.location}
              photo={obj.photo}
            />
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={prevPage}
            disabled={pageNumber === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="page-label">Page {pageNumber}</span>
          <button
            onClick={nextPage}
            disabled={objects.length <= pageSize}
            className="pagination-button"
          >
            Next
          </button>
          <select
            value={pageSize}
            onChange={changePageSize}
            className="select-cards-per-page"
          >
            <option value="8">8 per page</option>
            <option value="16">16 per page</option>
            <option value="24">24 per page</option>
          </select>
        </div>
      </div>
      {/* Modal za dodavanje objekta */}
      <AddObjectModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onAddObject={handleAddObject}
        placeItems={placeItems} // Prosledite placeItems
      />
    </div>
  );
};

export default Objects;
