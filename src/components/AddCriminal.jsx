
import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, getDownloadURL, uploadString, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddCriminal() {
    const [criminalData, setCriminalData] = useState([]);
    const [newCriminal, setNewCriminal] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading]= useState(false)
    const navigate = useNavigate();

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
    }, []); 

    const getHighestId = async () => {
        const storage = getStorage();
        const fileRef = storageRef(storage, 'faces.json');
        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        const data = await response.json();

        let highestId = 0;
        Object.keys(data).forEach(key => {
            const id = parseInt(key, 10);
            if (id > highestId) highestId = id;
        });
        return highestId;
    };

    const handleChange = (prop) => (event) => {
        setNewCriminal({ ...newCriminal, [prop]: event.target.value });
    };

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            setLoading(true)
            const storage = getStorage();
            const fileRef = storageRef(storage, 'faces.json');
            const url = await getDownloadURL(fileRef);
            const response = await fetch(url);
            const data = await response.json();

            const highestId = await getHighestId();
            const newId = (highestId + 1).toString();

            let imageUrl = '';
            if (imageFile) {
                const imageRef = storageRef(storage, `facepn/${newId}.jpg`);
                const uploadTask = uploadBytesResumable(imageRef, imageFile);
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => {}, 
                        (error) => reject(error), 
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            data[newId] = {
                caseNumber: newCriminal.caseNumber,
                color: -16711936,
                crime: newCriminal.crime,
                crop: {
                    mHeight: 354,
                    mNativePtr: -5476376630906086000,
                    mWidth: 348
                },
                distance: -1.0,
                extra: [
                    [
                        // Your extra data here...
                    ]
                ],
                id: newId,
                imageUrl: imageUrl,
                location: { bottom: 34, left: 228, right: 582, top: 48 },
                parole: newCriminal.parole,
                title: newCriminal.title
            };

            const updatedJsonString = JSON.stringify(data);            
            await uploadString(fileRef, updatedJsonString, 'raw');

            setCriminalData([...criminalData, { id: newId, ...newCriminal }]);
            setLoading(false)
            toast.success('Criminal data added successfully', {
                position:'top-center',
                autoClose: 2000,
                onClose: () => navigate('/criminal_dash')
            });
        } catch (error) {
            setLoading(false)
            console.error("Error updating data: ", error);
            toast.error('Error adding criminal data', {
                position:'top-right',
            });
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 shadow-lg">
            <div className='border shadow-lg bg-slate-300 sm:mx-auto sm:w-full sm:max-w-md py-4 rounded-md'>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Cbi_logo.svg/640px-Cbi_logo.svg.png"
                        alt="crimeDepartment"
                    />
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Crime Details
                    </h2>
                </div>
                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSave}>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                Name 
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="title"
                                    type="text"
                                    autoComplete="title"
                                    required
                                    value={newCriminal.title || ''}
                                    onChange={handleChange('title')}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex-col w-fit">
                                <div className="flex-row items-center justify-between">
                                    <label htmlFor="caseNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                        Case Number
                                    </label>
                                </div>
                                <div className="mt-2 flex-row">
                                    <input
                                        id="caseNumber"
                                        name="caseNumber"
                                        type="text"
                                        autoComplete="caseNumber"
                                        required
                                        value={newCriminal.caseNumber || ''}
                                        onChange={handleChange('caseNumber')}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="flex-col">
                                <div className="flex-row">
                                    <label htmlFor="crime" className="block text-sm font-medium leading-6 text-gray-900">
                                        Crime 
                                    </label>
                                    <div className="mt-2 flex-row">
                                        <input
                                            id="crime"
                                            name="crime"
                                            type="text"
                                            autoComplete="crime"
                                            required
                                            value={newCriminal.crime || ''}
                                            onChange={handleChange('crime')}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="parole" className="block text-sm font-medium leading-6 text-gray-900">
                                Parole 
                            </label>
                            <div className="mt-2">
                                <input
                                    id="parole"
                                    name="parole"
                                    type="text"
                                    autoComplete="parole"
                                    required
                                    value={newCriminal.parole || ''}
                                    onChange={handleChange('parole')}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                                Upload Image
                            </label>
                            <div className="mt-2">
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading?'Loading...':'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
