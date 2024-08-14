import React, { useState } from 'react';
import { perks } from '../data/perks';
import '../styles/PerksTable.css';
import {Container } from 'react-bootstrap';

const PerkTable = () => {
    const [filters, setFilters] = useState({
        category: '',
        SPECIAL: '',
        perkName: '',
        attributeRank: '',
        perkRank: '',
        playerLevel: '',
        description: ''
    });

    const [columns, setColumns] = useState({
        SPECIAL: true,
        perkName: true,
        attributeRank: true,
        perkRank: true,
        playerLevel: true,
        description: true
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value.toLowerCase()
        }));
    };

    const handleColumnToggle = (column) => {
        setColumns(prevColumns => ({
            ...prevColumns,
            [column]: !prevColumns[column]
        }));
    };

    const filteredPerks = Object.keys(perks)
        .filter(category => !filters.category || category === filters.category)
        .reduce((acc, category) => {
            const categoryPerks = perks[category];
            const filteredCategoryPerks = Object.keys(categoryPerks)
                .reduce((perkAcc, perkKey) => {
                    const perk = categoryPerks[perkKey];
                    const filteredRanks = perk.ranks
                        .filter(rank => {
                            return (!filters.SPECIAL || perk.SPECIAL.toLowerCase().includes(filters.SPECIAL)) &&
                                (!filters.perkName || perk.perkName.toLowerCase().includes(filters.perkName)) &&
                                (!filters.attributeRank || perk.attributeRank.toLowerCase().includes(filters.attributeRank)) &&
                                (!filters.perkRank || rank.perkRank === parseInt(filters.perkRank, 10)) &&
                                (!filters.playerLevel || rank.playerLevel === parseInt(filters.playerLevel, 10)) &&
                                (!filters.description || rank.description.toLowerCase().includes(filters.description));
                        });
                    if (filteredRanks.length) {
                        perkAcc[perk.perkName] = { ...perk, ranks: filteredRanks };
                    }
                    return perkAcc;
                }, {});
            if (Object.keys(filteredCategoryPerks).length) {
                acc[category] = filteredCategoryPerks;
            }
            return acc;
        }, {});

    return (
        <div>
            
            <span className="title lessPadding">PERK TABLE</span>
            
            <Container className="content">
            <div className="filters">
                {columns.SPECIAL && (
                    <label className="filter-item">
                        <span>SPECIAL:</span>
                        <input
                            type="text"
                            name="SPECIAL"
                            value={filters.SPECIAL}
                            onChange={handleFilterChange}
                        />
                    </label>
                )}
                {columns.category && (
                    <label className="filter-item">
                        <span>Category:</span>
                        <select name="category" onChange={handleFilterChange} value={filters.category}>
                            <option value="">All</option>
                            {Object.keys(perks).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </label>
                )}
                {columns.perkName && (
                    <label className="filter-item">
                        <span>Perk Name:</span>
                        <input
                            type="text"
                            name="perkName"
                            value={filters.perkName}
                            onChange={handleFilterChange}
                        />
                    </label>
                )}
                {columns.attributeRank && (
                    <label className="filter-item">
                        <span>Attribute Rank:</span>
                        <input
                            type="text"
                            name="attributeRank"
                            value={filters.attributeRank}
                            onChange={handleFilterChange}
                        />
                    </label>
                )}
                {columns.perkRank && (
                    <label className="filter-item">
                        <span>Perk Rank:</span>
                        <input
                            type="number"
                            name="perkRank"
                            value={filters.perkRank}
                            onChange={handleFilterChange}
                        />
                    </label>
                )}
                {columns.playerLevel && (
                    <label className="filter-item">
                        <span>Player Level:</span>
                        <input
                            type="number"
                            name="playerLevel"
                            value={filters.playerLevel}
                            onChange={handleFilterChange}
                        />
                    </label>
                )}
                {columns.description && (
                    <label className="filter-item">
                        <span>Description:</span>
                        <input
                            type="text"
                            name="description"
                            value={filters.description}
                            onChange={handleFilterChange}
                        />
                    </label>
                )}
            </div>

            <div className="column-toggles">
                {Object.keys(columns).map(column => (
                    <button key={column} onClick={() => handleColumnToggle(column)} className={`${columns[column] ? 'green' : 'red'}`}>
                        {columns[column] ? `Hide ${column}` : `Show ${column}`}
                    </button>
                ))}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {columns.SPECIAL && <th>SPECIAL</th>}
                            {columns.perkName && <th>Perk Name</th>}
                            {columns.attributeRank && <th>Attribute Rank</th>}
                            {columns.perkRank && <th>Perk Rank</th>}
                            {columns.playerLevel && <th>Player Level</th>}
                            {columns.description && <th>Description</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(filteredPerks).map(category => (
                            Object.keys(filteredPerks[category]).map(perkName => (
                                filteredPerks[category][perkName].ranks.map(rank => (
                                    <tr key={`${category}-${perkName}-${rank.perkRank}`}>
                                        {columns.SPECIAL && <td>{filteredPerks[category][perkName].SPECIAL}</td>}
                                        {columns.perkName && <td>{perkName}</td>}
                                        {columns.attributeRank && <td>{filteredPerks[category][perkName].attributeRank}</td>}
                                        {columns.perkRank && <td>{rank.perkRank}</td>}
                                        {columns.playerLevel && <td>{rank.playerLevel}</td>}
                                        {columns.description && <td>{rank.description}</td>}
                                    </tr>
                                ))
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
            </Container>
        </div>
    );
};

export default PerkTable;
