
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
                crime: newCriminal.crime,
                color: -16711936,
                
                crop: {
                    mHeight: 354,
                    mNativePtr: -5476376630906086000,
                    mWidth: 348
                },
                distance: -1.0,
                extra: [
                    [
                        -0.012836635, 0.005718313, -0.0017628076, 0.015304367, -0.016327688,
                        -0.063060366, 0.12646712, 0.19231425, -0.1213364, 0.112351,
                        0.0010579209, -1.2626565e-5, 0.012928198, 0.002284921, -0.0035532555,
                        -0.068070136, -0.01012291, -0.002061049, 0.008721032, 0.008318958,
                        0.13320565, -0.044852372, -0.10256278, 0.00217235, 0.10485613,
                        -0.023021352, -0.002767697, -0.079509355, 0.0048536127, 0.027391298,
                        0.0043186336, 0.27531484, 0.10889385, 0.005547743, 0.1508049,
                        0.11564335, -0.07085727, 0.018527348, -0.00871676, 0.15645371,
                        -0.002499203, -0.004306481, -0.0085014105, -0.00414275, -0.0026126662,
                        0.046741866, -0.16870165, -0.024943216, -2.3479066e-4, 0.05745535,
                        -0.06347171, -0.0027743822, -0.26573983, -0.00208963, -0.020483458,
                        0.005454604, 0.0908135, -8.9061505e-4, -0.005467186, -0.011501416,
                        0.0038046383, -0.0071242023, 0.018226063, 0.13371499, 0.0049578683,
                        -0.03221526, -0.0020127955, 0.022661883, 0.0014151302, 0.0010863987,
                        -0.0028150657, -0.25824893, 0.18536554, 0.006756072, -0.026947418,
                        -0.007287184, 0.0036267275, -0.0012096015, -0.013707495, 0.24136521,
                        0.007665439, 0.031767085, 0.004255056, -0.154263, 0.14321122,
                        8.225575e-4, 0.004539332, 0.015986161, 0.11989188, -0.32764655,
                        -0.005784579, 9.576043e-4, -0.0017028943, 0.0058619427, -0.23642944,
                        -0.015065964, -0.02079628, -0.14040367, 0.0016475747, 0.056755148,
                        -0.002013509, 0.006266211, -0.0063026496, -7.5185724e-4, 0.008931328,
                        0.004919351, 0.009944612, 0.0054629943, -0.0135069415, -0.0032312209,
                        0.1182015, 0.0072341706, -0.00951996, -0.047898047, 0.0034009782,
                        0.103913695, 0.001766917, -0.042122502, 0.044523258, -0.021937467,
                        0.0072975215, 0.0033391162, 0.08061141, 0.00220236, 9.914552e-6,
                        0.009122349, 0.0077352193, -0.00889497, -0.014810954, -0.0058066873,
                        3.551753e-4, 0.0035134177, 0.0010136747, 0.10770778, -0.047352534,
                        1.7767373e-4, -0.078808025, -0.011789048, -0.005601511, -0.012761054,
                        0.002448405, -0.0011770095, -0.008348879, -0.052423697, 0.1316496,
                        -0.09964082, 0.01772809, 0.006948244, 0.007042452, 0.009977107,
                        -0.0033854956, -0.038919397, 0.074683696, 0.0026308228, 9.83485e-4,
                        0.0027749597, 0.013235658, -0.0074043036, -0.0019077141, -0.002397841,
                        0.0069827777, 3.874823e-4, 0.013121792, -0.0047271955, -0.00229746,
                        0.002975416, -0.0024459297, -0.119981, 0.006981032, -0.0021349406,
                        -0.014891029, -0.028577724, 6.7436707e-4, -0.07943581, 0.04608963,
                        -0.0042343144, -0.022433305, 0.013509716, -0.0038679403, -0.0039587123,
                        -0.023665808, -0.032650903, -0.013382255, -0.01159236, 0.11755349,
                        0.09245909, 0.024598686, -0.020491496, -0.0847743, -0.083522014,
                        0.007744896, -0.007884583
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
