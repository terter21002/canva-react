import React, { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button, Link, Rows, Text } from "@canva/app-ui-kit";
import { upload } from "@canva/asset";
import { FontWeight, addNativeElement } from "@canva/design";
import { IoCloudUploadSharp } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import styles from "styles/components.css";
import { FaPlay } from "react-icons/fa";
import Fourth from "../assets/images/Fourth.png";
import Third from "../assets/images/Third.jpg";
import { title } from "process";

// Mock of the addNativeElement function from Canva's API

export const App = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);

  const data = [
    {
      image: Fourth,
      title: "This is a title",
      description: "This is a description",
      style: {
        fontFamily: "Arial",
        color: "#ff0099",
        decoration: "underline",
        fontStyle: "italic",
        fontWeight: "bold",
        textAlign: "center",
      },
    },
    {
      image: Third,
      title: "This is a title",
      description: "This is a description",
      style: {
        fontFamily: "Georgia",
        color: "#0000ff",
        decoration: "none",
        fontStyle: "normal",
        fontWeight: "normal",
        textAlign: "left",
      },
    },
    {
      image: Third,
      title: "This is a title",
      description: "This is a description",
      style: {
        fontFamily: "Comic Sans MS",
        color: "#00ff00",
        decoration: "overline",
        fontStyle: "italic",
        fontWeight: "bold",
        textAlign: "right",
      },
    },
    {
      image: Fourth,
      title: "This is a title",
      description: "this is description",
      style: {
        fontFamily: "Times New Roman",
        color: "#ff9900",
        decoration: "line-through",
        fontStyle: "normal",
        fontWeight: "normal",
        textAlign: "center",
      },
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

  // Set background color initially
  useEffect(() => {
    async function setBackground() {
      const result = await upload({
        type: "IMAGE",
        mimeType: "image/jpeg",
        url: "https://static.vecteezy.com/system/resources/thumbnails/008/079/335/small/empty-showcase-abstract-pastel-color-background-3d-illustration-free-vector.jpg",
        thumbnailUrl:
          "https://www.canva.dev/example-assets/image-import/thumbnail.jpg",
      });

      await addNativeElement({
        type: "IMAGE",
        ref: result.ref,
        width: 800,
        height: 600,
        top: 0,
        left: 0,
      });
    }

    setBackground();
  }, []);

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

  //Create graphic
  const createText = async () => {
    if (selectedStyle === null) {
      alert("Please select a text style first.");
      return;
    }
    const { style } = data[selectedStyle];
    for (const row of rows) {
      await addNativeElement({
        type: "TEXT",
        children: [row.Words],
        fontSize: row.Weight,
        color: style.color,
        decoration: "none",
        fontStyle: style.fontStyle as "italic" | "normal" | undefined,
        fontWeight: style.fontWeight as FontWeight | undefined,
        textAlign: "center",
        top: Math.random() * 500,
        left: Math.random() * 500,
        width: Math.random() * 500,
      });
    }
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
                <img
                  key={index}
                  src={item.image}
                  alt={`Style ${index + 1}`}
                  className={`${styles.textStyleImage} ${
                    selectedStyle === index ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedStyle(index)}
                />
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
          onClick={createText}
        >
          <FaPlay />
          Create
        </button>
      </Rows>
    </div>
  );
};
