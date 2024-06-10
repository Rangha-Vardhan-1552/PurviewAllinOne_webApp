import React, { useState, useEffect, useRef } from 'react';
import './../trafficDeparment/TableComponent.css';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ChalanPrintComponent from './ChalanPrintComponent';
import ReactToPrint from 'react-to-print';
import { useNavigate } from 'react-router-dom';

const TableComponent = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedNumberPlate, setSelectedNumberPlate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [evidenceData, setEvidenceData] = useState({});
  const componentRef = useRef();
  const [selectedEvidenceImage, setSelectedEvidenceImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  let numbers = 0;
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const dbRefImages = ref(db, 'images');
      const dbRefEvidences = ref(db, 'evidences');

      const unsubscribeImages = onValue(dbRefImages, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTableData(Object.values(data));
        }
      });

      const unsubscribeEvidences = onValue(dbRefEvidences, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEvidenceData(data);
        }
      });

      return () => {
        unsubscribeImages();
        unsubscribeEvidences();
      };
    };

    fetchData();
  }, []);

  const handleFilterCriteriaChange = (e) => {
    setFilterCriteria(e.target.value);
    setFilterValue('');
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setFilterCriteria('date');
    setFilterValue(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setFilterCriteria('time');
    setFilterValue(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setFilterCriteria('location');
    setFilterValue(e.target.value);
  };

  const handleNumberPlateChange = (e) => {
    setSelectedNumberPlate(e.target.value);
    setFilterCriteria('Result');
    setFilterValue(e.target.value);
  };

  const handleRemoveFilterDate = () => {
    setSelectedDate('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'date'));
  };

  const handleRemoveFilterTime = () => {
    setSelectedTime('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'time'));
  };

  const handleRemoveFilterLocation = () => {
    setSelectedLocation('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'location'));
  };

  const handleRemoveFilterNumberPlate = () => {
    setSelectedNumberPlate('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'Result'));
  };

  const handleApplyFilter = () => {
    if (filterCriteria && filterValue) {
      setAppliedFilters((prevFilters) => {
        const updatedFilters = prevFilters.filter((filter) => filter.criteria !== filterCriteria);
        return [...updatedFilters, { criteria: filterCriteria, value: filterValue }];
      });
      setFilterValue('');
    }
  };

  const handleSelectEvidenceImage = (e) => {
    setSelectedEvidenceImage(e.target.value);
  };

  const handleSelectImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const filteredData = tableData.filter((row) => {
    return appliedFilters.every((filter) => {
      if (filter.criteria === 'date' && selectedDate) {
        const rowDate = new Date(row.Date).toISOString().split('T')[0];
        const filterDate = new Date(filter.value).toISOString().split('T')[0];
        return rowDate === filterDate;
      } else if (filter.criteria === 'time' && selectedTime) {
        return row.Time.slice(0, 5) === filter.value;
      } else if (filter.criteria === 'location' && selectedLocation) {
        const rowLocation = row.Location ? row.Location.toLowerCase() : '';
        return rowLocation.includes(filter.value.toLowerCase());
      } else if (filter.criteria === 'Result' && selectedNumberPlate) {
        const rowNumberPlate = row.Result ? row.Result.toLowerCase() : '';
        return rowNumberPlate.includes(filter.value.toLowerCase());
      } else {
        return false;
      }
    });
  });

  const getEvidenceImages = (plateNumber) => {
    if (evidenceData[plateNumber]) {
      const evidenceArray = Object.values(evidenceData[plateNumber]);
      return evidenceArray.map((evidence) => evidence.Image);
    } else {
      return [];
    }
  };

  return (
    <div className="table-container">
      

      <div className="filter-container">
      <div style={{ position:'absolute',right:950}}>
  <button className="border p-2 text-white bg-green-500 rounded-md" onClick={() => navigate('/trafficDetailsAdd')}>
    Add Traffic Details
  </button>
</div>
        {selectedDate && (
          <button className="dateFilter" onClick={handleRemoveFilterDate}>
            <span>{selectedDate}</span>
            <span className="datex">X</span>
          </button>
        )}
        {selectedTime && (
          <button className="timeFilter" onClick={handleRemoveFilterTime}>
            <span>{selectedTime}</span>
            <span className="timex">X</span>
          </button>
        )}
        {selectedLocation && (
          <button className="locationFilter" onClick={handleRemoveFilterLocation}>
            <span>{selectedLocation}</span>
            <span className="locationx">X</span>
          </button>
        )}
        {selectedNumberPlate && (
          <button className="numberPlateFilter" onClick={handleRemoveFilterNumberPlate}>
            <span>{selectedNumberPlate}</span>
            <span className="numberPlateX">X</span>
          </button>
        )}
        <select value={filterCriteria} onChange={handleFilterCriteriaChange}>
          <option value="">Select Filter</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="location">Location</option>
          <option value="Result">Number Plate</option>
        </select>
        {filterCriteria === 'date' ? (
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        ) : filterCriteria === 'time' ? (
          <input type="time" value={selectedTime} onChange={handleTimeChange} />
        ) : filterCriteria === 'location' ? (
          <input
            type="text"
            placeholder="Filter by Location"
            value={filterValue}
            onChange={handleLocationChange}
          />
        ) : filterCriteria === 'Result' ? (
          <input
            type="text"
            placeholder="Filter by Number Plate"
            value={filterValue}
            onChange={handleNumberPlateChange}
          />
        ) : null}
        <button className="applyButton" onClick={handleApplyFilter}>Apply</button>
      </div>

      <div style={{ display: 'none' }}>
        <ChalanPrintComponent ref={componentRef} tableData={filteredData} evidenceData={evidenceData} />
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>S.NO.</th>
            <th>Date</th>
            <th>Time</th>
            <th>Number Plate</th>
            <th>Photo Captured</th>
            <th>Evidences</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.slice().reverse().map((row, index) => {
            // Only render the row if "Result" is not null
            if (row.Result && row.Result.length === 10) {
              numbers++; // Increment the numbers variable
              return (
                <tr key={index}>
                  <td>{numbers}</td> {/* Display the incremented numbers */}
                  <td>{row.Date}</td>
                  <td>{row.Time}</td>
                  <td>{row.Result || 'N/A'}</td>
                  <td>
                    <img
                      src={row.Image}
                      alt={`Image ${index + 1}`}
                      className="table-image"
                      onClick={() => handleSelectImage(row.Image)} // Set selected image on click
                    />
                  </td>
                  <td>
                    <select
                      className="evidence-dropdown"
                      onChange={handleSelectEvidenceImage}
                    >
                      <option value="">Select Evidence</option>
                      {getEvidenceImages(row.Result).map((evidence, idx) => (
                        <option key={idx} value={evidence}>
                          Evidence {idx + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            }
            return null; // Return null for rows that don't meet the condition
          })}
        </tbody>
      </table>
      <div className="print">
        <ReactToPrint
          trigger={() => <button className="printButton">Print</button>}
          content={() => componentRef.current}
        />
      </div>
      {selectedEvidenceImage && (
        <div className="image-overlay">
          <button className="close-button" onClick={() => setSelectedEvidenceImage('')}>×</button>
          <img height={500} width={500} src={selectedEvidenceImage} alt="Selected Evidence" />
        </div>
      )}
      {selectedImage && (
        <div className="image-overlay">
          <button className="close-button" onClick={() => setSelectedImage('')}>×</button>
          <img height={500} width={500} src={selectedImage} alt="Selected Image" />
        </div>
      )}
    </div>
  );
};

export default TableComponent;
