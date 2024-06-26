import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

function App() {
  const [data, setData] = useState(null);
  const [release, setRelease] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [displayMode, setDisplayMode] = useState('years');

  useEffect(() => {
    axios("https://how-old-minecraft-api.vercel.app/api/scrape")
      .then(r => {
        setData(r.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSelectChange = (event) => {
    const selectedVersion = event.target.value;
    const selectedRelease = data.find(mc => mc.version === selectedVersion);

    if (selectedRelease) {
      const releaseDate = new Date(selectedRelease.releaseDate);
      const today = new Date();

      const ageInMilliseconds = today - releaseDate;
      const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
      const ageInWeeks = Math.floor(ageInDays / 7);
      const ageInYears = Math.floor(ageInDays / 365);
      const ageInMonths = Math.floor(ageInDays / 30);

      setRelease({
        ...selectedRelease,
        age: {
          years: ageInYears,
          months: ageInMonths,
          weeks: ageInWeeks,
          days: ageInDays
        }
      });
    } else {
      setRelease(null);
    }
  };

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
  };

  const renderAge = () => {
    if (!release || !release.age) return null;

    switch (displayMode) {
      case 'years':
        return `${release.age.years} years`;
      case 'months':
        return `${release.age.months} months`;
      case 'weeks':
        return `${release.age.weeks} weeks`;
      case 'days':
        return `${release.age.days} days`;
      default:
        return '';
    }
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredData = data ? data.filter(mc =>
    mc.version.toLowerCase().includes(filterText.toLowerCase())
  ) : [];


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
          <div className='text-white font-bold'>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4" id='menu'>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          How old is my <span className='text-3xl'>Minecraft</span> version?
        </h2>

        <input
          type="text"
          className="block w-full mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Filter versions..."
          value={filterText}
          onChange={handleFilterChange}
        />

        <select
          className="block w-full mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          defaultValue=""
          onChange={handleSelectChange}
        >
          <option disabled value="">Select version</option>
          {filteredData.map((mc) => (
            <option key={mc.version} value={mc.version}>{mc.version}</option>
          ))}
        </select>

        {release && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800">Version: {release.version}</h3>
            <p className="text-gray-700">Release Date: {release.releaseDate}</p>
            <p className="text-gray-700">Your version is {renderAge()} old</p>
          </div>
        )}

        <div className="mt-4">
          <button
            className={`px-4 py-2 mr-2 rounded-md ${displayMode === 'years' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleDisplayModeChange('years')}
          >
            Years
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-md ${displayMode === 'months' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleDisplayModeChange('months')}
          >
            Months
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-md ${displayMode === 'weeks' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleDisplayModeChange('weeks')}
          >
            Weeks
          </button>
          <button
            className={`px-4 py-2 rounded-md ${displayMode === 'days' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => handleDisplayModeChange('days')}
          >
            Days
          </button>
        </div>

        <div className="mt-4 text-center">
          <a href="https://github.com/Lukeuke/how-old-is-minecraft" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;