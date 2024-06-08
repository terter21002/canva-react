import React, { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button, Link, Rows, Text } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import { IoCloudUploadSharp } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import styles from "styles/components.css";
import { FaPlay } from "react-icons/fa";
import Fourth from "../assets/images/Fourth.png";
import Third from "../assets/images/Third.jpg";
import { title } from "process";

export const App = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const data = [
    {
      image: Fourth,
      title: "This is a title",
      description: "This is a description",
    },
    {
      image: Third,
      title: "This is a title",
      description: "This is a description",
    },
    {
      image: Third,
      title: "This is a title",
      description: "This is a description",
    },
    // {
    //   image:
    //     "data:image/png;base64,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",
    //   title: "This is a title",
    //   description: "this is description",
    // },
    {
      image: Fourth,
      title: "This is a title",
      description: "this is description",
    },
  ];

  const initialRows = [
    { Words: "Key in the word", Weight: 30 },
    { Words: "Key in the word", Weight: 30 },
    { Words: "Key in the word", Weight: 15 },
    { Words: "Key in the word", Weight: 15 },
    { Words: "Key in the word", Weight: 10 },
  ];
  const [rows, setRows] = useState(initialRows);

  // Handle file upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is a CSV
    const validFileTypes = ["text/csv", "application/vnd.ms-excel"];
    if (!validFileTypes.includes(file.type)) {
      setErrorMessage(
        "File format error. Please ensure the data format is correct and conforms to the sample file standards, and then try again."
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000); // Clear the error message after 5 seconds
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Convert rows to a map for easy merging
      const parsedRowsMap = new Map<string, number>();
      json.slice(1).forEach((row: any) => {
        const word = row[0] || "Key in the word";
        const weight = parseFloat(row[1]) || 0;
        if (parsedRowsMap.has(word)) {
          // If the word exists, add the weight
          parsedRowsMap.set(word, parsedRowsMap.get(word)! + weight);
        } else {
          // Otherwise, add a new entry
          parsedRowsMap.set(word, weight);
        }
      });

      // Convert map back to array of objects
      const parsedRows = Array.from(parsedRowsMap).map(([word, weight]) => ({
        Words: word,
        Weight: weight,
      }));

      const redistributedRows = redistributeWeights(parsedRows);
      setRows(redistributedRows);
    };
    reader.readAsBinaryString(file);
  };

  // Function to handle text input change
  const handleWordChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].Words = value;
    setRows(updatedRows);
  };

  // Function to handle weight input change
  const handleWeightChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].Weight = parseFloat(value) || 0;
    setRows(updatedRows);
  };

  // Function to redistribute weights
  const redistributeWeights = (updatedRows) => {
    const totalWeight = updatedRows.reduce((acc, row) => acc + row.Weight, 0);
    const weightFactor = 100 / totalWeight;
    return updatedRows.map((row) => ({
      ...row,
      Weight: row.Weight * weightFactor,
    }));
  };

  // Increment rows
  const incrementRows = () => {
    if (rows.length < 10) {
      const updatedRows = [...rows, { Words: "Key in the word", Weight: 0 }];
      setRows(redistributeWeights(updatedRows));
    }
  };

  // Decrement rows
  const decrementRows = () => {
    if (rows.length > 3) {
      const updatedRows = rows.slice(0, rows.length - 1);
      setRows(redistributeWeights(updatedRows));
    }
  };

  // Redistribute weights on component mount and when rows change
  useEffect(() => {
    setRows(redistributeWeights(rows));
  }, [rows.length]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "7vmax" }}
      className={styles.scrollContainer}
    >
      <Rows spacing="2u">
        <Text>WordCloud</Text>
        <Text>1.Load the text you need.</Text>
        <label htmlFor="file-upload">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1vmax",
              width: "45vw",
              height: "5vh",
              backgroundColor: "#8B3CFF",
              color: "white",
              border: "none",
              outline: "none",
              fontSize: "10px",
              borderRadius: "3px",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "#6a2592";
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "#8B3CFF";
            }}
          >
            <IoCloudUploadSharp />
            Upload CSV files
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>

        <Text>Enter text here to create a world cloud.</Text>

        <div className={styles.tableDiv}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>Word</th>
                <th className={styles.th}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr className={styles.tr} key={index}>
                  <td className={styles.wordsTd}>
                    <input
                      type="text"
                      className={styles.wordsInput}
                      value={item.Words}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                    />
                  </td>
                  <td className={styles.weightTd}>
                    <input
                      type="text"
                      className={styles.weightInput}
                      value={Math.round(item.Weight) + "%"} // Convert float to integer using Math.round
                      onChange={(e) =>
                        handleWeightChange(index, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.plusMinusIconDiv}>
            <span className={styles.plusMinusIcon} onClick={incrementRows}>
              <FiPlus />
            </span>
            <span className={styles.plusMinusIcon} onClick={decrementRows}>
              <FiMinus />
            </span>
          </div>
        </div>
      </Rows>
      <Rows spacing="1u">
        <Text>2.Select a text style</Text>
        <div style={{ paddingTop: "4px" }}></div>
        <div className={styles.textStyleDiv}>
          {data.map((item, index) => (
            <div key={index} className={styles.textStyleBox}>
              <div className={styles.imageDiv}>
                <img className={styles.image} src={item.image} alt="img" />
              </div>
              <div className={styles.textStyleContaint}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.description}>{item.description}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ paddingTop: "8vmax" }}></div>
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5vmax",
            width: "88%",
            height: "5vh",
            backgroundColor: "#7630D7",
            color: "white",
            fontSize: "2vmax",
            border: "none",
            outline: "none",
            borderRadius: "3px",
            transition: "background-color 0.3s ease",
            cursor: "pointer",
            position: "fixed",
            bottom: "10px",
            zIndex: 999,
          }}
          onMouseOver={(e) => {
            if (e.target instanceof HTMLElement) {
              e.target.style.backgroundColor = "#6a2592";
            }
          }}
          onMouseOut={(e) => {
            if (e.target instanceof HTMLElement) {
              e.target.style.backgroundColor = "#7630D7";
            }
          }}
        >
          <FaPlay />
          Create
        </button>
      </Rows>
    </div>
  );
};
