"use client";
import { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Globe,
  Users2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagementTable() {
  // Data sets
  const sportsList = [
    "Men's Basketball",
    "Women's Volleyball",
    "Men's Table Tennis",
    "Women's Badminton",
    "Men's Chess",
  ];

  const teamsList = [
    "Team SBE",
    "Team SAS",
    "Team SLG",
    "Team SOE",
    "Team SAFAD",
  ];

  // States
  const [filter, setFilter] = useState("Select an Option");
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSelect = (option: string) => {
    setFilter(option);
    setShowDropdown(false);
    setSearch(""); // clear search when changing category
  };

  // Choose base data
  const baseData =
    filter === "All Sports" ? sportsList : filter === "All Teams" ? teamsList : [];

  // Filter based on search input
  const data = baseData.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-6">
      {/* Top Filter + Add Button Row */}
      <div className="flex justify-between items-center mb-6 relative">
        {/* Filter Dropdown */}
        <div className="relative inline-block">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50 min-w-[180px]"
          >
            {filter === "All Sports" ? (
              <Globe size={16} className="text-gray-500" />
            ) : filter === "All Teams" ? (
              <Users2 size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={14} className="text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700">{filter}</span>
            <ChevronDown
              size={14}
              className={`text-gray-500 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md">
              <button
                onClick={() => handleSelect("Select an Option")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Select an Option
              </button>
              <button
                onClick={() => handleSelect("All Sports")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                All Sports
              </button>
              <button
                onClick={() => handleSelect("All Teams")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                All Teams
              </button>
            </div>
          )}
        </div>

        {/* Add Button (appears only after selection) */}
        {filter !== "Select an Option" && (
          <Button
            className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm text-white ${
              filter === "All Sports"
                ? "bg-red-700 hover:bg-red-800"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            <Plus size={16} />
            {filter === "All Sports" ? "Add Sport" : "Add Team"}
          </Button>
        )}
      </div>

      {/* Table + Header Section */}
      <div className="border rounded-md overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-black text-white flex justify-between items-center px-6 py-3">
          <h2 className="text-lg font-bold uppercase">USC Days</h2>
          <input
            type="text"
            placeholder="Keyword Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={filter === "Select an Option"}
            className={`border text-sm px-3 py-1 rounded-md bg-black placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 ${
              filter === "Select an Option"
                ? "border-gray-700 text-gray-500 cursor-not-allowed"
                : "border-gray-500 text-white"
            }`}
          />
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-2 text-xs font-semibold text-gray-700">
                {filter === "All Teams"
                  ? "TEAM"
                  : filter === "All Sports"
                  ? "SPORT"
                  : "CATEGORY"}
              </th>
              <th className="text-right px-6 py-2 text-xs font-semibold text-gray-700">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {filter === "Select an Option" ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center text-gray-500 py-8 text-sm"
                >
                  Please select a category to view items.
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="flex items-center gap-2 px-6 py-3">
                    {filter === "All Sports" ? (
                      <Globe size={16} className="text-gray-500" />
                    ) : (
                      <Users2 size={16} className="text-gray-500" />
                    )}
                    {item}
                  </td>
                  <td className="text-right px-6 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-1 text-gray-700 border-gray-300 hover:bg-gray-100"
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-1 text-gray-700 border-gray-300 hover:bg-gray-100"
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="text-center text-gray-500 py-8 text-sm"
                >
                  No matches found for “{search}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
