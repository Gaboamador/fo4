import React, { useState, useEffect } from 'react';
import { materials } from '../data/materials';
import { materialValues } from '../data/materials';
import '../styles/FindMaterials.css';
import {Container, Form } from 'react-bootstrap';
import { GrPowerReset } from "react-icons/gr";

const FindMaterials = () => {

    const [filter, setFilter] = useState('');
    const [filteredMerchants, setFilteredMerchants] = useState(materials);
    const [suggestions, setSuggestions] = useState([]);
    const [materialNames, setMaterialNames] = useState([]);

    useEffect(() => {
        // Extract all material names from the materials object (only once when materialNames is empty)
        if (materialNames.length === 0) {
        setMaterialNames([...new Set(
            materials.flatMap(merchant => Object.keys(merchant.materials))
        )]);
        }
        
        if (filter) {
            const results = materials.filter(merchant =>
                Object.keys(merchant.materials).some(
                    key => key.toLowerCase() === filter.toLowerCase() && merchant.materials[key] === true
                )
            );
            setFilteredMerchants(results);
        } else {
            setFilteredMerchants([]);
        }

        // Update suggestions based on filter input
        const lowerCaseFilter = filter.toLowerCase();
        const perfectMatch = materialNames.find(material => material.toLowerCase() === lowerCaseFilter);
        if (perfectMatch) {            
            setSuggestions([perfectMatch]);
        } else {
            setSuggestions(
                materialNames.filter(material =>
                    material.toLowerCase().includes(lowerCaseFilter)
                )
            );
        }
    }, [filter, materialNames]);

    // Find the value for the filtered material
    const findMaterialValue = (materialName) => {
        const material = materialValues.find(item => item.material.toLowerCase() === materialName.toLowerCase());
        return material ? material.value : 'N/A'; // Return 'N/A' if value is not found
    };

    const handleInputChange = (e) => {
        setFilter(e.target.value);
    };

    // Function to handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setFilter(suggestion);
    };

    // Check if an exact match for the material exists
    const isExactMatch = (filter, materialNames) => {
        return materialNames.some(material => material.toLowerCase() === filter.toLowerCase());
    };
    const isMaterialSelected = isExactMatch(filter, materialNames);

    const handleReset = () => {
        setFilter('')
    };

return (
    <div>
        
        {/* <span className="title lessPadding">SHIPMENT OF {filter.toUpperCase()}</span> */}
        <span className="title lessPadding">SHIPMENT OF {isMaterialSelected ? filter.toUpperCase() : "..."}</span>
        
        <Container className="content">
        <input
                type="text"
                placeholder="Enter material name"
                value={filter}
                onChange={handleInputChange}
            />
            <button onClick={() => handleReset()}><GrPowerReset/></button>
            {suggestions.length > 0 && (
                <ul className={`suggestions-list ${isMaterialSelected || suggestions.length === 1 ? "single" : ""}`}>
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {isMaterialSelected ? suggestion.toUpperCase() + " (" + findMaterialValue(filter) + ")" : suggestion}
                    </li>
                ))}
            </ul>
            )}
            {isMaterialSelected && (
                <div className="shipment-grid">
                    <div className="shipment-header">SHIPMENTS</div>
                    <div>x25<br/>{findMaterialValue(filter) * 25}</div>
                    <div>x50<br/>{findMaterialValue(filter) * 50}</div>
                    <div>x100<br/>{findMaterialValue(filter) * 100}</div>
                </div>
            )}
            <div>
            {filteredMerchants.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>MERCHANT</th>
                                <th>LOCATIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMerchants.map((merchant, index) => (
                                <tr key={index}>
                                    <td>{merchant.name}</td>
                                    <td>{merchant.location.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </Container>
    </div>
);
};

export default FindMaterials;
