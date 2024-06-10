import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from './NavigationHeader';
// import brandImage from '../../assets/dashboard_img/brand_img.png';
// import brand from '../../assets/dashboard_img/brandicon.png';
// import gallery from '../../assets/dashboard_img/gallerylogo.png';
// import sound from '../../assets/dashboard_img/sound.png';
import { FaChevronRight, FaChevronDown, FaRegLightbulb, FaCheck } from 'react-icons/fa';

export default function BrandSetup() {
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [brandLogo, setBrandLogo] = useState(null);
  const [brandColor1, setBrandColor1] = useState('#283048');
  const [brandColor2, setBrandColor2] = useState('#859398');
  const [savedBrandColor1, setSavedBrandColor1] = useState('#283048');
  const [savedBrandColor2, setSavedBrandColor2] = useState('#859398');
  const [completedSections, setCompletedSections] = useState({});
  const [expandedSection, setExpandedSection] = useState(null);
  const navigate = useNavigate();

  const handleLogoUpload = (event) => {
    setBrandLogo(URL.createObjectURL(event.target.files[0]));
    setSavedBrandColor1('#14142C');
    setSavedBrandColor2('#926335');
  };

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const handleSaveAndContinue = (section) => {
    if (section === 3) {
      setSavedBrandColor1(brandColor1);
      setSavedBrandColor2(brandColor2);
    }
    setCompletedSections({ ...completedSections, [section]: true });
    setExpandedSection(null);
  };

  const handleCreateBrand = () => {
    navigate('/createbrandpage');
  };

  useEffect(() => {
    setBrandColor1('#14142C');
    setBrandColor2('#C89767');
  }, []);

  return (
    <div className="bg-[#d9e9f2] min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <NavigationHeader />
      <div className="flex-grow p-4 lg:p-20 lg:ml-40 mt-8">
        <div className="w-full max-w-5xl mx-auto bg-opacity-25 bg-[#fcfcfc] border border-[#fcfcfc] rounded-3xl flex flex-col items-center">
          <div className="w-full bg-[rgba(252,252,252,0.40)] rounded-t-3xl p-1">
            <div className="flex items-center">
              <div className="bg-[rgba(0,39,153,0.15)] w-12 h-12 ml-4 rounded-lg flex items-center justify-center">
                <div className="bg-[#082a66] rounded-lg p-2 flex items-center justify-center w-8 h-8">
                  <img src={brand} alt="Brand Icon" className="w-4 h-4" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-[#082a66] ml-4 mr-80">Brand Setup</h1>
              <img src={brandImage} alt="Brand Banner" className="w-[180px] h-[90px] ml-28 relative bottom-[-1px] pb-0" />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row p-8 w-full">
            <div className="flex justify-center lg:justify-start mb-8 lg:mb-0 lg:mr-8">
              <div className="relative w-96 h-96 bg-white rounded-3xl flex items-center justify-center">
                <div className="absolute w-[21rem] h-[20rem] bg-gradient-to-r from-[#283048] to-[#859398] rounded-3xl flex items-center justify-center">
                  <div className="absolute w-48 h-40 bg-[rgba(255,255,255,0.24)] rounded-3xl flex items-center justify-center">
                    <img src={brandLogo || gallery} alt="Brand" className="w-20 h-20 object-cover" />
                  </div>
                </div>
                <img src={sound} alt="Microphone" className="absolute top-0 right-2 w-8 h-8" />
              </div>
            </div>
            <div className="flex-grow">
              <div onClick={() => toggleSection(1)} className={`border p-4 rounded-2xl mb-4 cursor-pointer ${expandedSection === 1 ? 'bg-[#f6f8fe]' : 'bg-[rgba(252,252,252,0.25)]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                      <FaRegLightbulb className="text-black text-2xl" />
                    </div>
                    <p className="ml-3">Write Brand Name & Description</p>
                    {completedSections[1] && <div className="bg-[#a7f3d0] text-[#059669] p-2 rounded-full flex items-center ml-2"><FaCheck /></div>}
                  </div>
                  {completedSections[1] && (
                    <div className="flex items-center bg-white rounded-lg p-2 ml-4">
                      <p className="m-0">{truncateText(brandName, 30)}</p>
                    </div>
                  )}
                  <div>
                    {expandedSection === 1 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>
                {expandedSection === 1 && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Brand Name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#fcfcfc] mb-2 bg-[#f5f5f5]"
                    />
                    <textarea
                      placeholder="Brand Description"
                      rows="3"
                      value={brandDescription}
                      onChange={(e) => setBrandDescription(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#fcfcfc] mb-2 bg-[#f5f5f5]"
                    />
                    <button className="w-full p-2 bg-gradient-to-r from-[#00a7ff] to-[#006499] text-white rounded-lg" onClick={() => handleSaveAndContinue(1)}>
                      Save and Continue
                    </button>
                  </div>
                )}
              </div>

              <div onClick={() => toggleSection(2)} className={`border p-4 rounded-2xl mb-4 cursor-pointer ${expandedSection === 2 ? 'bg-[#f6f8fe]' : 'bg-[rgba(252,252,252,0.25)]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                      <FaRegLightbulb className="text-black text-2xl" />
                    </div>
                    <p className="ml-3">Select Brand Logo</p>
                    {completedSections[2] && <div className="bg-[#a7f3d0] text-[#059669] p-2 rounded-full flex items-center ml-2"><FaCheck /></div>}
                  </div>
                  {completedSections[2] && (
                    <div className="flex items-center bg-white rounded-lg p-2 ml-4">
                      <img src={brandLogo || gallery} alt="Brand Logo" className="w-8 h-8 object-cover rounded-md" />
                    </div>
                  )}
                  <div>
                    {expandedSection === 2 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>
                {expandedSection === 2 && (
                  <div className="mt-4">
                    <p>Upload your logo here. A dark-colored logo with a transparent background is recommended.</p>
                    <input type="file" onChange={handleLogoUpload} className="w-full mb-2" />
                    <button className="w-full p-2 bg-gradient-to-r from-[#00a7ff] to-[#006499] text-white rounded-lg" onClick={() => handleSaveAndContinue(2)}>
                      Save and Continue
                    </button>
                  </div>
                )}
              </div>

              <div onClick={() => toggleSection(3)} className={`border p-4 rounded-2xl mb-4 cursor-pointer ${expandedSection === 3 ? 'bg-[#f6f8fe]' : 'bg-[rgba(252,252,252,0.25)]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-[rgba(0,39,153,0.15)] rounded-full p-2">
                      <FaRegLightbulb className="text-black text-2xl" />
                    </div>
                    <p className="ml-3">Extracted Brand Colors</p>
                    {completedSections[3] && <div className="bg-[#a7f3d0] text-[#059669] p-2 rounded-full flex items-center ml-2"><FaCheck /></div>}
                  </div>
                  <div>
                    {expandedSection === 3 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </div>
                {expandedSection === 3 && (
                  <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="flex items-center gap-4 w-full">
                      <label className="text-sm font-semibold">Brand Color 1</label>
                      <input
                        type="color"
                        value={brandColor1}
                        onChange={(e) => setBrandColor1(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <span className="w-20 h-8 rounded-lg flex items-center justify-center" style={{ background: brandColor1 }}>{brandColor1}</span>
                    </div>
                    <div className="flex items-center gap-4 w-full">
                      <label className="text-sm font-semibold">Brand Color 2</label>
                      <input
                        type="color"
                        value={brandColor2}
                        onChange={(e) => setBrandColor2(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <span className="w-20 h-8 rounded-lg flex items-center justify-center" style={{ background: brandColor2 }}>{brandColor2}</span>
                    </div>
                    <button className="w-full p-2 bg-gradient-to-r from-[#00a7ff] to-[#006499] text-white rounded-lg" onClick={() => handleSaveAndContinue(3)}>
                      Save and Continue
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-start mt-4">
                <button className="p-2 pl-6 ml-2 pr-6 bg-gradient-to-r from-[#00a7ff] to-[#006499] text-white rounded-lg" onClick={handleCreateBrand}>
                  Create Brand
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
