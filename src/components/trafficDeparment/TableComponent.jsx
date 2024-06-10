import React, { useState, useEffect, useRef } from 'react';
import '../trafficDeparment/TableComponent.css'; // Import CSS for TableComponent
import './ChalanPrintComponent.css'; // Import CSS for ChalanPrintComponent
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ChalanPrintComponent from './ChalanPrintComponent'; // Import the React component
import ReactToPrint from 'react-to-print';
import { useNavigate } from 'react-router-dom';

const TableComponent = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [evidenceData, setEvidenceData] = useState({});
  const componentRef = useRef();
  const [selectedEvidenceImage, setSelectedEvidenceImage] = useState('');
  const navigate=useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      console.log(db)
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

  const handleRemoveFilterDate = () => {
    setSelectedDate('');
    setFilterCriteria('');
    setFilterValue('');
    setAppliedFilters([]);
  };

  const handleRemoveFilterTime = () => {
    setSelectedTime('');
    setFilterCriteria('');
    setFilterValue('');
    setAppliedFilters([]);
  };

  const handleApplyFilter = () => {
    if (filterCriteria && filterValue) {
      const newFilter = { criteria: filterCriteria, value: filterValue };
      setAppliedFilters([...appliedFilters, newFilter]);
      setFilterValue('');
    }
  };

  const handleSelectEvidenceImage = (e) => {
    setSelectedEvidenceImage(e.target.value);
  };

  const filteredData = tableData.filter((row) => {
    return appliedFilters.every((filter) => {
      if (filter.criteria === 'date') {
        const rowDate = new Date(row.Date).toISOString().split('T')[0];
        const filterDate = new Date(filter.value).toISOString().split('T')[0];
        return rowDate === filterDate;
      } else if (filter.criteria === 'time') {
        return row.Time === filter.value;
      } else {
        return row[filter.criteria]?.toLowerCase().includes(filter.value.toLowerCase());
      }
    });
  });

  const getEvidenceImages = (plateNumber) => {
    // Check if evidence data exists for the given plate number
    if (evidenceData[plateNumber]) {
      // Extract the array of objects corresponding to the plate number
      const evidenceArray = Object.values(evidenceData[plateNumber]);
      // Extract the URLs from each object in the array
      return evidenceArray.map((evidence) => evidence.Image);
    } else {
      return []; // Return an empty array if no evidence data found for the plate number
    }
  };

  console.log(evidenceData, "&&&&&&");

  return (
    <>
    <div className="table-container">
      
      <div className=" flex justify-between filter-container">
      <div className=''>
        <button className='border p-2 text-white bg-green-500 rounded-md' onClick={()=>navigate('/trafficDetailsAdd')}>Add Traffic Details</button>
      </div>
        {selectedDate && (
          <button className="dateFilter border " onClick={handleRemoveFilterDate}>
            <span>{selectedDate}</span>
            <span className="datex">X</span>
          </button>
        )}
        {selectedTime && (
          <button className="timeFilter " onClick={handleRemoveFilterTime}>
            <span>{selectedTime}</span>
            <span className='timex'>X</span>
          </button>
        )}
        <select value={filterCriteria} className='bg-slate-200 rounded-md p-2 text-slate-600' onChange={handleFilterCriteriaChange}>
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
        ) : (
          <input
            type="text"
            placeholder={`Filter by ${filterCriteria}`}
            value={filterValue}
            onChange={handleFilterValueChange}
            className='bg-slate-200 rounded-md p-2 text-slate-600'
          />
        )}
        <button className='text-white bg-blue-600 rounded-md p-2 px-6' onClick={handleApplyFilter}>Apply</button>
      </div>

      <div style={{ display: 'none' }}>
        <ChalanPrintComponent ref={componentRef} tableData={filteredData} />
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
          {filteredData.slice().reverse().map((row, index) => (
            // Only render the row if "Result" is not null
            row.Result && row.Result.length === 10 && (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.Date}</td>
                <td>{row.Time}</td>
                <td>{row.Result || 'N/A'}</td>
                <td>
                  <img
                    src={row.Image}
                    alt={`Image ${index + 1}`}
                    className="table-image"
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
            )
          ))}
        </tbody>
      </table>
      <div className='print'>
        <ReactToPrint
          trigger={() => <button className="printButton">Print</button>}
          content={() => componentRef.current}
        />
      </div>
      {selectedEvidenceImage && (
        <div className="image-overlay">
          <button className="close-button" onClick={() => setSelectedEvidenceImage('')}>×</button>
          <img height={100} width={100} src={selectedEvidenceImage} alt="Selected Evidence" />
        </div>
      )}
    </div>
    </>
  );
};

export default TableComponent;
