import React from 'react';
import FaceRecognition from './FaceDetection';
import CriminalWeb from './criminalWeb';

function WebApp() {
  return (
    <div className="App">
      <h1>Face Recognition App</h1>
      <FaceRecognition />
      {/* <CriminalWeb/> */}
    </div>
  );
}

export default WebApp;
