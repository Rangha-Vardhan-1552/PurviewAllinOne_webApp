import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // Make sure to import the storage from your firebase config
import { ref as dbRef, push, set } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL,uploadString } from "firebase/storage";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import axios from 'axios';
import { UploadFile } from '@mui/icons-material';

export default function CriminalDB() {
    const [criminalData, setCriminalData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editCriminal, setEditCriminal] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storage = getStorage();
                
                const fileRef = storageRef(storage, 'faces.json'); // Adjust the path to your JSON file
               
                const url = await getDownloadURL(fileRef);
                           
                const response = await fetch(url);
                
                const data = await response.json();
                
                const criminalArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setCriminalData(criminalArray);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setCriminalData([]);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect will only run once, similar to componentDidMount


    const handleClickOpen = (criminal) => {
        setEditCriminal(criminal);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (prop) => (event) => {
        setEditCriminal({ ...editCriminal, [prop]: event.target.value });
    };

    const handleSave = async () => {
        try {
            const db = getStorage();
            const fileRef = storageRef(db, 'faces.json');
            
            // Get the download URL for the file
            const url = await getDownloadURL(fileRef);
            const response = await fetch(url);
            const data = await response.json();
            
            // Update the data locally
            data[editCriminal.id] = {
                ...data[editCriminal.id],
                caseNumber: editCriminal.caseNumber,
                crime: editCriminal.crime,
                title: editCriminal.title,
                imageUrl: editCriminal.imageUrl,
                parole: editCriminal.parole
            };
            
            // Convert the updated object back to a string
            const updatedJsonString = JSON.stringify(data);
            
            // Upload the updated JSON string to Firebase Storage
            await uploadString(fileRef, updatedJsonString, 'raw');
            console.log('Data updated successfully!');
            
            // Update local state and close modal
            setCriminalData(criminalData.map(item => item.id === editCriminal.id ? { ...item, ...editCriminal } : item));
            handleClose();  // Assuming handleClose closes a modal and cleans up state
        } catch (error) {
            console.error("Error updating data: ", error);
        }
    };


    const handleDelete = async (id) => {
        try {
            const updatedData = criminalData.filter(criminal => criminal.id !== id); // Remove the item from the array
            
            // Convert the updated data back to a JSON string
            const updatedJsonString = JSON.stringify(Object.fromEntries(updatedData.map(item => [item.id, {
                caseNumber: item.caseNumber,
                crime: item.crime,
                title: item.title,
                imageUrl: item.imageUrl,
                parole: item.parole
            }])));
            
            // Reference to the Firebase Storage
            const db = getStorage();
            const fileRef = storageRef(db, 'faces.json');
            
            // Upload the updated JSON string to Firebase Storage
            await uploadString(fileRef, updatedJsonString, 'raw');
            console.log('Data deleted successfully!');
            
            // Update the local state
            setCriminalData(updatedData);
        } catch (error) {
            console.error("Error deleting data: ", error);
        }
    };
    

    return (
        <>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                <div className='flex gap-2  items-center'>
                    <div className='flex  gap-2 items-center'>
                        <div className='flex-col'>
                            <label className='font-normal text-md uppercase'>SortBy </label>
                            <select  className='flex-col border border-gray-500-0  bg-gray-50  text-gray-500 rounded-md p-2 py-1 px-7 '>
                                <option value='ascending'>ascending</option>
                                <option value='descending'>descending</option>
                            </select>
                        </div>
                        <div className='flex-col'>
                            <a href='/criminalAdd' className='p-2 border bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-400'>+Add Details</a>
                        </div>
                    </div>
                </div>
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <TableRow>
                            <TableCell scope="col" className="px-6 py-3 ">
                                CaseNumber
                            </TableCell>
                            <TableCell scope="col" className="px-6 py-3">
                                Crime
                            </TableCell>
                            <TableCell scope="col" className="px-6 py-3">
                                PhotoID
                            </TableCell>
                            <TableCell scope="col" className="px-6 py-3">
                                Name
                            </TableCell>
                            <TableCell scope="col" className="px-6 py-3">
                                ParoleStatus
                            </TableCell>
                            <TableCell scope="col" className="px-6 py-3">
                                Edit
                            </TableCell>
                            <TableCell scope="col" className="px-6 py-3">
                                Delete
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {criminalData.map((row) => (
                            <TableRow key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <TableCell scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {row.caseNumber}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {row.crime}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <img src={row.imageUrl} alt={row.name} style={{maxHeight:'40px',maxWidth:'40px'}}/>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {row.title}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {row.parole}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Button onClick={() => handleClickOpen(row)} className="bg-gray-600 text-white hover:bg-green-400 font-medium rounded-md">Edit</Button>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Button onClick={() => handleDelete(row.id)} className="bg-red-600 text-white hover:bg-red-400 font-medium rounded-md">
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Criminal Details</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editCriminal.title || ''}
                        onChange={handleChange('title')}
                    />
                    <TextField
                        margin="dense"
                        id="crime"
                        label="Crime"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editCriminal.crime || ''}
                        onChange={handleChange('crime')}
                    />
                    <TextField
                        margin="dense"
                        id="caseNumber"
                        label="Case Number"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editCriminal.caseNumber || ''}
                        onChange={handleChange('caseNumber')}
                    />
                    <TextField
                        margin="dense"
                        id="parole"
                        label="Parole Status"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editCriminal.parole || ''}
                        onChange={handleChange('parole')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );


}
