const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Transform the data for charting
      const transformedData = jsonData.map((row) => {
        // Convert the serial date number to a readable date
        const dateValue =
          row.Day instanceof Date ? row.Day : XLSX.SSF.parse_date_code(row.Day);
        const formattedDate = new Date(
          dateValue.y,
          dateValue.m - 1,
          dateValue.d
        ); // Month is 0-indexed

        return {
          day: dayjs(formattedDate).format("DD/MM/YYYY"), // Format the date as needed
          age: row.Age,
          gender: row.Gender,
          features: [
            { name: "A", value: row.A },
            { name: "B", value: row.B },
            { name: "C", value: row.C },
            { name: "D", value: row.D },
            { name: "E", value: row.E },
            { name: "F", value: row.F },
          ],
        };
      });

      console.log(transformedData);

      // Get min and max dates
      const { min, max } = getMinMaxDates(transformedData);
      // setStartDate(min);
      // setEndDate(max);
      console.log(min, max);
      setFilteredData(transformedData);
    };
    reader.readAsBinaryString(file);
  };

  const getMinMaxDates = (data) => {
    console.log(data);
    // Extract the dates from the objects
    const dates = data.map((item) => {
      return console.log(dayjs(item.A));
    });
    // new Date(item.A)});

    // console.log(dates);

    // Find the minimum and maximum dates
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    console.log(minDate, maxDate);

    return {
      minDate: minDate.toLocaleDateString(), // Format as needed
      maxDate: maxDate.toLocaleDateString(), // Format as needed
    };
  };