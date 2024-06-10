import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Make sure to import the storage from your firebase config
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Dashboard() {
    const [formData, setFormData] = useState({
        caseNumber: '',
        crime: '',
        imageUrl: '',
        name: '',
        paroleStatus: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');

    const inputChangeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const fileChangeHandler = (e) => {
        setImageFile(e.target.files[0]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = '';
            if (imageFile) {
                const imageRef = storageRef(storage, `images/${imageFile.name}`);
                const uploadTask = uploadBytesResumable(imageRef, imageFile);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Track progress
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        console.error('Error uploading file: ', error);
                    },
                    async () => {
                        // Handle successful uploads on complete
                        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        const newEntry = {
                            ...formData,
                            imageUrl
                        };

                        const newEntryRef = push(dbRef(db, 'facepr/'));
                        await set(newEntryRef, newEntry);

                        console.log('Successfully added to database');
                        setFormData({
                            caseNumber: '',
                            crime: '',
                            imageUrl: '',
                            name: '',
                            paroleStatus: ''
                        });
                        setImageFile(null);
                        setUploadProgress(0);
                        setSuccessMessage('Successfully added to database');
                    }
                );
            } else {
                const newEntry = {
                    ...formData,
                };

                const newEntryRef = push(dbRef(db, 'facepr/'));
                await set(newEntryRef, newEntry);

                console.log('Successfully added to database');
                setFormData({
                    caseNumber: '',
                    crime: '',
                    imageUrl: '',
                    name: '',
                    paroleStatus: ''
                });
                setUploadProgress(0);
                setSuccessMessage('Successfully added to database');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <div>
            <div>Criminal Data</div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Case Number:</label>
                    <input
                        name='caseNumber'
                        value={formData.caseNumber}
                        onChange={inputChangeHandler}
                    />
                </div>
                <div>
                    <label>Crime:</label>
                    <input
                        name='crime'
                        value={formData.crime}
                        onChange={inputChangeHandler}
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={fileChangeHandler}
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        name='name'
                        value={formData.name}
                        onChange={inputChangeHandler}
                    />
                </div>
                <div>
                    <label>Parole Status:</label>
                    <input
                        name='paroleStatus'
                        value={formData.paroleStatus}
                        onChange={inputChangeHandler}
                    />
                </div>
                <button type='submit'>Submit</button>
            </form>
            {uploadProgress > 0 && <div>Upload Progress: {uploadProgress}%</div>}
            {successMessage && <div>{successMessage}</div>}
        </div>
        
    );
}
