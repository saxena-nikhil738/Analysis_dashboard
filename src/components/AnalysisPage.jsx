import React, { useState, useEffect } from "react";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const AnalysisPage = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  // Initialize state from cookies
  const [ageFilter, setAgeFilter] = useState(Cookies.get("age") || "");
  const [genderFilter, setGenderFilter] = useState(Cookies.get("gender") || "");
  const [startDate, setStartDate] = useState(Cookies.get("startdate") || "");
  const [endDate, setEndDate] = useState(Cookies.get("enddate") || "");

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureData, setFeatureData] = useState([]);
  const features = ["A", "B", "C", "D", "E", "F"];

  // Redirect if not authenticated
  useEffect(() => {
    const username = Cookies.get("username");
    const password = Cookies.get("password");

    console.log("Username:", username); // Debugging check
    console.log("Password:", password);

    if (!username || !password) {
      console.log("Redirecting to /login...");
      navigate("/login");
    }
  }, [navigate]);

  // Set preferences function
  const setPreferences = () => {
    Cookies.set("age", ageFilter, { expires: 1 });
    Cookies.set("gender", genderFilter, { expires: 1 });
    Cookies.set("startdate", startDate, { expires: 1 });
    Cookies.set("enddate", endDate, { expires: 1 });
  };

  // Load preferences from query parameters or cookies
  useEffect(() => {
    if (!query) {
      const preferences = {
        age: Cookies.get("age") || "",
        gender: Cookies.get("gender") || "",
        startdate: Cookies.get("startdate") || "",
        enddate: Cookies.get("enddate") || "",
      };

      setAgeFilter(preferences.age);
      setGenderFilter(preferences.gender);
      setStartDate(preferences.startdate);
      setEndDate(preferences.enddate);
      setPreferences();
    }
  }, [query]);

  useEffect(() => {
    setPreferences();
    dff(filteredData);
  }, [ageFilter, genderFilter, startDate, endDate]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (ageFilter) params.append("age", ageFilter);
    if (genderFilter) params.append("gender", genderFilter);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    navigate(`/?${params.toString()}`);
  }, [ageFilter, genderFilter, startDate, endDate, navigate]);

  const summedData = features.map((feature) => {
    const sum = featureData.reduce((total, row) => {
      return total + (row[feature] || 0); // Sum up all values for the current feature
    }, 0);

    return {
      name: feature, // Feature name (for Y axis)
      sum, // Total sum (for X axis)
    };
  });

  const transformData = (rawData) => {
    const headers = Object.values(rawData[0]).slice(1);

    const transformedData = rawData.slice(1).map((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        const cellValue = row[Object.keys(row)[index + 1]];

        if (header.toLowerCase() === "day") {
          if (typeof cellValue === "number") {
            const dateObject = XLSX.SSF.parse_date_code(cellValue);
            const parsedDate = new Date(
              dateObject.y,
              dateObject.m - 1,
              dateObject.d
            );
            rowData[header] = dayjs(parsedDate).format("MM/DD/YYYY");
          } else if (typeof cellValue === "string") {
            const parsedStringDate = dayjs(
              cellValue,
              ["DD/MM/YYYY", "MM-DD-YYYY", "YYYY-MM-DD"],
              true
            );

            if (parsedStringDate.isValid()) {
              rowData[header] = parsedStringDate.format("DD/MM/YYYY");
            } else {
              rowData[header] = cellValue;
            }
          } else {
            rowData[header] = cellValue;
          }
        } else {
          rowData[header] = cellValue;
        }
      });
      return rowData;
    });
    return transformedData;
  };

  const dff = (filteredData) => {
    // console.log(filteredData);

    const compareDates = (date1, date2) => {
      const [day1, month1, year1] = date1.split("/").map(Number);
      const [day2, month2, year2] = date2.split("/").map(Number);

      return (
        new Date(year1, month1 - 1, day1) - new Date(year2, month2 - 1, day2)
      );
    };

    // Assuming filteredData is already available in your component
    const AppliedData = filteredData
      .filter((item) => {
        const isWithinDateRange =
          startDate && endDate
            ? compareDates(item.Day, startDate) >= 0 &&
              compareDates(item.Day, endDate) <= 0 // Date comparison
            : true;

        const isAgeMatch = ageFilter ? item.Age === ageFilter : true; // Ignore ageFilter if null
        const isGenderMatch = genderFilter
          ? item.Gender === genderFilter
          : true; // Ignore genderFilter if null

        return isAgeMatch && isGenderMatch && isWithinDateRange;
      })
      .sort((a, b) => compareDates(a.Day, b.Day));

    // console.log(AppliedData);
    setFeatureData([...AppliedData]);
    return AppliedData;
  };

  useEffect(() => {
    async function fetchEcxel() {
      const url =
        "https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/edit?gid=485741054#gid=485741054"; // Replace with your file URL

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const arrayBuffer = await response.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const transformedData = transformData(jsonData);
        setFilteredData([...transformedData]);
        setFeatureData([...transformedData]);
        dff(transformedData);
      } catch (error) {
        console.error("Error fetching the Excel file:", error);
      }
    }
    fetchEcxel();
  }, []);

  const handleBarClick = (data) => {
    if (data) {
      const clickedFeature = data.name; // Get the name of the clicked feature
      console.log("Clicked Feature:", clickedFeature);

      const featuredData = featureData.map((row) => ({
        Day: row.Day,
        value: row[clickedFeature],
      }));
      setSelectedFeature(clickedFeature);
      setData([...featuredData]);

      console.log("Feature Data:", featuredData);
    }
  };

  const getFormatedDate = (newValue) => {
    const dayjsValue = dayjs(newValue);

    if (dayjsValue.isValid()) {
      const day = dayjsValue.date();
      const month = dayjsValue.month() + 1;

      const formattedDate = `${day}/${month}/${dayjsValue.year()}`;
      return formattedDate;
    } else {
      console.log("Invalid date selected");
    }
  };

  const ClearPreferences = () => {
    Cookies.remove("age");
    Cookies.remove("gender");
    Cookies.remove("startdate");
    Cookies.remove("enddate");
  };
  const Logout = () => {
    console.log("object");
    Cookies.remove("username");
    Cookies.remove("password");
    ClearPreferences();
    navigate("/login");
  };

  // Event handlers for date and filters
  const selectEndDate = (value) => {
    const selectedDate = getFormatedDate(value);
    setEndDate(selectedDate); // This will trigger useEffect
  };

  const selectStartDate = (value) => {
    const selectedDate = getFormatedDate(value);
    setStartDate(selectedDate); // This will trigger useEffect
  };

  const selectAge = (e) => {
    setAgeFilter(e.target.value); // This will trigger useEffect
    // navigate(`/age=${e.target.value}`);
  };

  const selectGender = (e) => {
    setGenderFilter(e.target.value); // This will trigger useEffect
  };

  const showData = () => {
    console.log(ageFilter);
    console.log(genderFilter);
    console.log(startDate);
    console.log(endDate);
  };

  // Assuming filteredData is already available in your component

  return (
    <>
      {/* <DynamicBarChart /> */}
      <div style={{ padding: "20px" }}>
        <h1>Product Analytics Dashboard</h1>
        <Button onClick={Logout}>Logout</Button>
        <Button onClick={ClearPreferences}>Remove Preferences</Button>
        <div className="filters">
          <h3 style={{ marginRight: "30px" }}>Filters: </h3>
          <input
            type="date"
            // value={startDate}
            className="input-date"
            onChange={(e) => selectStartDate(e.target.value)}
          />
          <input
            type="date"
            className="input-date"
            onChange={(e) => selectEndDate(e.target.value)}
          />

          <div className="form-control">
            <FormControl className="select-control">
              <InputLabel>Age Group</InputLabel>
              <Select value={ageFilter} onChange={(e) => selectAge(e)}>
                <MenuItem value="15-25">15-25</MenuItem>
                <MenuItem value=">25">{"> "}25</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-control">
            <FormControl className="select-control">
              <InputLabel>Gender</InputLabel>
              <Select value={genderFilter} onChange={(e) => selectGender(e)}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="applied-filters">
          {ageFilter && (
            <div className="filter-key">
              <p>Age:</p>
              <span className="filter-value">{ageFilter}</span>
            </div>
          )}
          {genderFilter && (
            <div className="filter-key">
              <p>Gender:</p>
              <span className="filter-value">{genderFilter}</span>
            </div>
          )}
          {startDate && (
            <div className="filter-key">
              <p>From date:</p>
              <span className="filter-value">{startDate}</span>
            </div>
          )}
          {endDate && (
            <div className="filter-key">
              <p>To date:</p>
              <span className="filter-value">{endDate}</span>
            </div>
          )}
        </div>

        <h3>Total Time Spent by Features</h3>
        <BarChart width={1000} height={400} layout="vertical" data={summedData}>
          <CartesianGrid strokeDasharray="3 5" />

          {/* X-axis with title */}
          <XAxis
            type="number"
            label={{
              value: "Sum of Features",
              position: "insideBottom", // Adjusted position
              offset: 50, // Increased offset to create more gap
            }}
          />

          {/* Y-axis with title */}
          <YAxis
            dataKey="name"
            type="category"
            label={{
              value: "Features",
              angle: -90,
              position: "insideLeft",
              dy: 50,
            }}
          />

          <Tooltip />

          {/* Render a single bar that shows the sum for each feature */}
          <Bar
            className="bar"
            dataKey="sum"
            fill="#8884d8"
            barSize={30}
            onClick={(data) => handleBarClick(data)}
            style={{ cursor: "pointer" }} // Click handler for individual bars
          />
        </BarChart>

        {selectedFeature && (
          <>
            <h3>{`Time Trend for Feature ${selectedFeature}`}</h3>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                width={1000}
                height={400}
                data={data}
                margin={{ top: 50, right: 50, left: 50, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Day"
                  label={{
                    // value: "Day",
                    position: "insideBottom",
                    offset: 10,
                  }}
                />
                <YAxis
                  label={{ value: "Value", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </>
  );
};

export default AnalysisPage;
