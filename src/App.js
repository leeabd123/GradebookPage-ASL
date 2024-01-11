import React, { useState, useEffect, useRef } from 'react';
import { CSVLink } from "react-csv";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';
import './App.css';

function App() {

  // mock data for classrooms and students
  const mockClassrooms = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Science" },
    { id: 3, name: "History" },
    { id: 4, name: "English Literature" }, // Updated English classroom name
    { id: 5, name: "Physical Education & Health" }, // Updated Physical Education classroom name
  ];
  const initialMockStudents = {
    1: [ // Mathematics
      { id: 101, name: "Alice Johnson", grades: { assignment1: 85, quiz1: 90, assignment2: 88, quiz2: 93, finalExam: 87 } },
      { id: 102, name: "Bob Smith", grades: { assignment1: 75, quiz1: 80, assignment2: 78, quiz2: 85, finalExam: 82 } },
      { id: 103, name: "Charlie Brown", grades: { assignment1: 95, quiz1: 100, assignment2: 92, quiz2: 97, finalExam: 94 } },
      { id: 104, name: "Dana White", grades: { assignment1: 68, quiz1: 74, assignment2: 71, quiz2: 78, finalExam: 76 } },
      { id: 105, name: "Eve Black", grades: { assignment1: 88, quiz1: 91, assignment2: 89, quiz2: 92, finalExam: 90 } }, 
      { id: 103, name: "Charlie Brown", grades: { assignment1: 95, quiz1: 100, assignment2: 92, quiz2: 97, finalExam: 94 } },
      { id: 104, name: "Dana White", grades: { assignment1: 68, quiz1: 74, assignment2: 71, quiz2: 78, finalExam: 76 } },
      { id: 105, name: "Eve Black", grades: { assignment1: 88, quiz1: 91, assignment2: 89, quiz2: 92, finalExam: 90 } }
    ],
    2: [ // Science
      { id: 201, name: "Frank Green", grades: { assignment1: 81, quiz1: 85, assignment2: 83, quiz2: 87, finalExam: 50 } },
      { id: 202, name: "Grace Hall", grades: { assignment1: 77, quiz1: 79, assignment2: 76, quiz2: 82, finalExam: 80 } },
      { id: 201, name: "Frank Green", grades: { assignment1: 81, quiz1: 85, assignment2: 83, quiz2: 87, finalExam: 84 } },
      { id: 202, name: "Grace Hall", grades: { assignment1: 77, quiz1: 79, assignment2: 76, quiz2: 82, finalExam: 80 } },
      { id: 201, name: "Frank Green", grades: { assignment1: 81, quiz1: 85, assignment2: 83, quiz2: 87, finalExam: 84 } },
      { id: 202, name: "Grace Hall", grades: { assignment1: 77, quiz1: 79, assignment2: 76, quiz2: 82, finalExam: 80 } }
      // ... more students for Science
    ],
    3: [ // History
      { id: 301, name: "Hank Brown", grades: { assignment1: 90, quiz1: 93, assignment2: 88, quiz2: 91, finalExam: 89 } },
      { id: 302, name: "Ivy Green", grades: { assignment1: 84, quiz1: 86, assignment2: 85, quiz2: 88, finalExam: 87 } },
      // ... more students for History
    ],
    4: [ // English Literature
    // Add unique students for English Literature
    { id: 401, name: "Emily White", grades: { assignment1: 78, quiz1: 85, assignment2: 82, quiz2: 88, finalExam: 81 } },
    { id: 402, name: "George Brown", grades: { assignment1: 88, quiz1: 91, assignment2: 89, quiz2: 92, finalExam: 90 } },
    { id: 403, name: "Isabella Davis", grades: { assignment1: 72, quiz1: 75, assignment2: 70, quiz2: 78, finalExam: 74 } },
    // Add more students for English Literature if needed
  ],
  5: [ // Physical Education & Health
    // Add unique students for Physical Education & Health
    { id: 501, name: "Liam Wilson", grades: { assignment1: 90, quiz1: 92, assignment2: 88, quiz2: 91, finalExam: 89 } },
    { id: 502, name: "Olivia Lee", grades: { assignment1: 78, quiz1: 80, assignment2: 76, quiz2: 82, finalExam: 80 } },
    { id: 503, name: "Noah Johnson", grades: { assignment1: 95, quiz1: 97, assignment2: 92, quiz2: 94, finalExam: 93 } },
    { id: 401, name: "Emily White", grades: { assignment1: 78, quiz1: 85, assignment2: 82, quiz2: 88, finalExam: 81 } },
    { id: 402, name: "George Brown", grades: { assignment1: 88, quiz1: 91, assignment2: 89, quiz2: 92, finalExam: 90 } },
    { id: 403, name: "Isabella Davis", grades: { assignment1: 72, quiz1: 75, assignment2: 70, quiz2: 78, finalExam: 74 } },
    { id: 301, name: "Hank Brown", grades: { assignment1: 90, quiz1: 93, assignment2: 88, quiz2: 91, finalExam: 89 } },
    { id: 302, name: "Ivy Green", grades: { assignment1: 84, quiz1: 86, assignment2: 85, quiz2: 88, finalExam: 87 } },
    // Add more students for Physical Education & Health if needed
  ],
    // ... more classrooms with students and their grades
  };
  //

  
  const [classrooms, setClassrooms] = useState(mockClassrooms);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null); // Updated state
  const [students, setStudents] = useState([]);
  const [mockStudents, setMockStudents] = useState(initialMockStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);


  const fileInputRef = useRef(null);

  // Function to select a classroom and fetch its data
  const selectClassroom = (classroomId) => {
    setStudents([]); // Clear the students state
    setSelectedClassroom(classroomId); // Set the new classroom as selected
    setSelectedClassroomId(classroomId); // Update selected classroom ID

    setSelectedStudent(null); // Reset selected student
  };

  const calculateGradeDistribution = () => {
    if (!selectedClassroom) return [];

    let gradeCounts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };

    students.forEach(student => {
      Object.values(student.grades).forEach(grade => {
        if (grade >= 90) gradeCounts['A'] += 1;
        else if (grade >= 80) gradeCounts['B'] += 1;
        else if (grade >= 70) gradeCounts['C'] += 1;
        else if (grade >= 60) gradeCounts['D'] += 1;
        else gradeCounts['F'] += 1;
      });
    });

    const distributionData = Object.keys(gradeCounts).map(key => ({ name: key, count: gradeCounts[key] }));
    console.log(distributionData); // Debugging line
    return distributionData;
  };
  useEffect(() => {
    if (selectedClassroom) {
      setStudents(mockStudents[selectedClassroom] || []);
    }
  }, [selectedClassroom, mockStudents, setSelectedClassroomId]);
  


  // Function to generate CSV data based on the current state
// Function to generate CSV data based on the current state
function generateCsvData() {
  if (!selectedClassroom || !students.length) return [];

  const headers = ['Name', 'ID', ...Object.keys(students[0].grades)];
  const data = students.map(student => {
    return [
      student.name,
      student.id,
      ...Object.values(student.grades)
    ];
  });

  return [headers, ...data];
}



useEffect(() => {
  
  // Function to handle CSV data generation and download
  function handleDownloadCsv() {
    const csvData = generateCsvData();
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gradebook.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const downloadButton = document.getElementById('download-button');
  if (downloadButton) {
    downloadButton.addEventListener('click', handleDownloadCsv);
  }

  return () => {
    if (downloadButton) {
      downloadButton.removeEventListener('click', handleDownloadCsv);
    }
  };
}, [selectedClassroom, students]);

  
   // State to hold the parsed data from CSV
   const [parsedData, setParsedData] = useState([]);

   // Function to update student data based on the parsed data
  

const updateStudentData = (parsedData) => {
  // Create a new object to replace the old data
  let updatedMockStudents = { ...mockStudents };

  parsedData.forEach((row) => {
    const studentID = Number(row.ID);

    if (!studentID) {
      return; 
    }

    // Adjust this to match the structure of your CSV file for grades
    const grades = {
      assignment1: Number(row.assignment1),
      quiz1: Number(row.quiz1),
      assignment2: Number(row.assignment2),
      quiz2: Number(row.quiz2),
      finalExam: Number(row.finalExam),
    };

    if (!updatedMockStudents[selectedClassroom]) {
      updatedMockStudents[selectedClassroom] = [];
    }

    const studentIndex = updatedMockStudents[selectedClassroom].findIndex(
      (student) => student.id === studentID
    );

    if (studentIndex !== -1) {
      // If the student already exists, update their grades
      updatedMockStudents[selectedClassroom][studentIndex].grades = {
        ...updatedMockStudents[selectedClassroom][studentIndex].grades,
        ...grades,
      };
    } else {
      updatedMockStudents[selectedClassroom].push({
        id: studentID,
        name: row.Name,
        grades: grades,
      });
    }
  });

  // Set the updated mockStudents state
  setMockStudents(updatedMockStudents);

  // If a classroom is currently selected, update its students as well
  if (selectedClassroom !== null) {
    setStudents(updatedMockStudents[selectedClassroom] || []);
  }
};




// Function to handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  console.log('File uploaded:', file.name);

  Papa.parse(file, {
    complete: (result) => {
      console.log('Parsed data:', result.data);
      updateStudentData(result.data); // Call the updateStudentData function
    },
    header: true,
  });
};


  const updateData = (result) => {
    console.log("Parsed data:", result.data);
  
    if (selectedClassroom !== null) {
      setMockStudents((prevMockStudents) => {
        const updatedMockStudents = { ...prevMockStudents };
  
        result.data.forEach((row) => {
          const classroomId = Number(row.classroomId);
          const studentName = row.name;
  
          // Adjust this to match the structure of your CSV file
          const grades = Object.fromEntries(
            Object.entries(row).filter(([key, _]) => key.startsWith('grade'))
          );
  
          if (classroomId === selectedClassroom) {
            if (!updatedMockStudents[classroomId]) {
              updatedMockStudents[classroomId] = [];
            }
  
            const studentIndex = updatedMockStudents[classroomId].findIndex(
              (student) => student.name === studentName
            );
  
            if (studentIndex !== -1) {
              updatedMockStudents[classroomId][studentIndex].grades = grades;
            } else {
              updatedMockStudents[classroomId].push({
                id: Math.random(), // Ideally, use a better ID generation strategy
                name: studentName,
                grades: grades,
              });
            }
          }
        });


        


  
        return updatedMockStudents;
      });
  
      // If a classroom is currently selected, update its students as well
      setStudents(mockStudents[selectedClassroom] || []);
    }
  };
  
  

  
  
  
  // Inside your return statement
  return (
    <div className="App">
      <h1 className='gradebook-title'>ASL Aspire Gradebook</h1>
      <div className="navbar-container">
        <navbar className="navbar">
        {classrooms.map(classroom => (
          <button className="nav-elem" key={classroom.id} onClick={() => selectClassroom(classroom.id)}>
            {classroom.name}
          </button>
        ))}
        </navbar>  
      </div>

      <div className="content-container">
        <div className="students-section">
          {selectedClassroom && (
            <>
              <h2>{classrooms.find(c => c.id === selectedClassroom)?.name}</h2>
              <div className="student-list">
                {students.map(student => (
                  <div key={student.id} className="student-name" onClick={() => setSelectedStudent(student)}>
                    {student.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="chart-section">
        {selectedStudent ? (
          <div className="student-grade-container">
            <h3>{selectedStudent.name}'s Grades</h3>
            <div className="grades-list">
              {Object.entries(selectedStudent.grades).map(([key, value]) => (
                <div key={key} className="grade-item">
                  <span>{key}: </span>
                  <span>{value}</span>
                </div>
              ))}
              </div>
              <button onClick={() => setSelectedStudent(null)}>Back to Grade Distribution</button>
            </div>
          ) : (
            selectedClassroom && (
              <div className="chart-container">
                <h3 className='grade-dist'>Grade Distribution</h3>
                <BarChart
                  width={500}
                  height={300}
                  data={calculateGradeDistribution()}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid stroke="#ffffff" strokeDasharray="3 3" /> {/* White grid lines */}
                  <XAxis dataKey="name" stroke="#000000" /> {/* Black X-axis */}
                  <YAxis stroke="#000000" /> {/* Black Y-axis */}
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#A093C3" /> {/* Set fill to the desired color */}
                </BarChart>

              </div>
            )
          )}
        </div>
      </div>

      <CSVLink data={generateCsvData()} filename="gradebook.csv" className="download-button">
  Download Gradebook
</CSVLink>
<input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} className="upload-button" />



    </div>
  );
  
  
}

export default App;
