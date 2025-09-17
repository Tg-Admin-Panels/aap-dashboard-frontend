import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import PageMeta from "../../components/common/PageMeta";
import { AppDispatch, RootState } from "../../features/store";
import {
  getAllStates,
  getAllDistricts,
  getAllLegislativeAssemblies,
  getAllBooths,
} from "../../features/locations/locationsApi";
import {
  clearDistricts,
  clearLegislativeAssemblies,
  clearBooths,
} from "../../features/locations/locations.slice";
import SpinnerOverlay from "../../components/ui/SpinnerOverlay";

export default function LocationDropdowns() {
  const dispatch = useDispatch<AppDispatch>();
  const { states, districts, legislativeAssemblies, booths, loading, error } = useSelector(
    (state: RootState) => state.locations
  );

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLegislativeAssembly, setSelectedLegislativeAssembly] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAllStates({}));
  }, [dispatch]);

  useEffect(() => {
    if (selectedState) {
      dispatch(getAllDistricts({ parentId: selectedState }));
    } else {
      dispatch(clearDistricts());
    }
  }, [dispatch, selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(getAllLegislativeAssemblies({ parentId: selectedDistrict }));
    } else {
      dispatch(clearLegislativeAssemblies());
    }
  }, [dispatch, selectedDistrict]);

  useEffect(() => {
    if (selectedLegislativeAssembly) {
      dispatch(getAllBooths({ parentId: selectedLegislativeAssembly }));
    } else {
      dispatch(clearBooths());
    }
  }, [dispatch, selectedLegislativeAssembly]);

  const stateOptions = states.map((state) => ({
    value: state._id,
    label: state.name,
  }));

  const districtOptions = districts.map((district) => ({
    value: district._id,
    label: district.name,
  }));

  const legislativeAssemblyOptions = legislativeAssemblies.map((assembly) => ({
    value: assembly._id,
    label: assembly.name,
  }));

  const boothOptions = booths.map((booth) => ({
    value: booth._id,
    label: booth.name,
  }));

  const customStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      backgroundColor: 'transparent',
      borderColor: '#d1d5db', // gray-300
      minHeight: '44px', // h-11
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af', // gray-400
      },
    }),
    singleValue: (baseStyles: any) => ({
      ...baseStyles,
      color: '#1f2937', // gray-900
    }),
    input: (baseStyles: any) => ({
      ...baseStyles,
      color: '#1f2937', // gray-900
    }),
    placeholder: (baseStyles: any) => ({
      ...baseStyles,
      color: '#9ca3af', // gray-400
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e0e7ff' : 'white', // blue-500, indigo-100
      color: state.isSelected ? 'white' : '#1f2937', // white, gray-900
      '&:active': {
        backgroundColor: '#2563eb', // blue-600
      },
    }),
  };

  return (
    <>
      <PageMeta title="Dependent Dropdowns" description="Dependent dropdowns for locations" />
      <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dependent Location Dropdowns</h2>
        <SpinnerOverlay loading={loading} />
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
            <Select
              id="state-select"
              options={stateOptions}
              onChange={(option) => {
                setSelectedState(option ? option.value : null);
                setSelectedDistrict(null);
                setSelectedLegislativeAssembly(null);
                setSelectedBooth(null);
              }}
              value={stateOptions.find(option => option.value === selectedState)}
              placeholder="Select State"
              isClearable
              styles={customStyles}
            />
          </div>

          <div>
            <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
            <Select
              id="district-select"
              options={districtOptions}
              onChange={(option) => {
                setSelectedDistrict(option ? option.value : null);
                setSelectedLegislativeAssembly(null);
                setSelectedBooth(null);
              }}
              value={districtOptions.find(option => option.value === selectedDistrict)}
              placeholder="Select District"
              isClearable
              isDisabled={!selectedState}
              styles={customStyles}
            />
          </div>

          <div>
            <label htmlFor="legislative-assembly-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Legislative Assembly</label>
            <Select
              id="legislative-assembly-select"
              options={legislativeAssemblyOptions}
              onChange={(option) => {
                setSelectedLegislativeAssembly(option ? option.value : null);
                setSelectedBooth(null);
              }}
              value={legislativeAssemblyOptions.find(option => option.value === selectedLegislativeAssembly)}
              placeholder="Select Legislative Assembly"
              isClearable
              isDisabled={!selectedDistrict}
              styles={customStyles}
            />
          </div>

          <div>
            <label htmlFor="booth-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Booth</label>
            <Select
              id="booth-select"
              options={boothOptions}
              onChange={(option) => setSelectedBooth(option ? option.value : null)}
              value={boothOptions.find(option => option.value === selectedBooth)}
              placeholder="Select Booth"
              isClearable
              isDisabled={!selectedLegislativeAssembly}
              styles={customStyles}
            />
          </div>
        </div>
      </div>
    </>
  );
}
