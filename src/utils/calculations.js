// Grade point mapping for B.Tech (RTU/AKTU pattern)
// Updated Grading System: A++:10, A+:9, A:8.5, B+:8, B:7.5, C+:7, C:6.5, D+:6, D:5.5, E+:5, E:4, F:0
export const GRADE_POINTS = {
  'A++': 10,  // Outstanding
  'A+': 9,   // Excellent
  'A': 8.5,  // Very Good
  'B+': 8,   // Good
  'B': 7.5,  // Above Average
  'C+': 7,   // Average
  'C': 6.5,  // Below Average
  'D+': 6,   // Pass
  'D': 5.5,  // Pass
  'E+': 5,   // Needs Improvement
  'E': 4,    // Needs Improvement
  'F': 0     // Fail
};

export const GRADES = Object.keys(GRADE_POINTS);

// Calculate SGPA for a single semester
export const calculateSGPA = (subjects) => {
  if (!subjects || subjects.length === 0) {
    return { sgpa: 0, totalCredits: 0, totalPoints: 0 };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach(subject => {
    const credits = parseFloat(subject.credits) || 0;
    const gradePoints = GRADE_POINTS[subject.grade] || 0;
    
    totalPoints += credits * gradePoints;
    totalCredits += credits;
  });

  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

  return {
    sgpa: parseFloat(sgpa),
    totalCredits,
    totalPoints
  };
};

// Calculate CGPA across multiple semesters
export const calculateCGPA = (semesters) => {
  if (!semesters || semesters.length === 0) {
    return { cgpa: 0, totalCredits: 0, totalPoints: 0 };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  semesters.forEach(sem => {
    const sgpa = parseFloat(sem.sgpa) || 0;
    const credits = parseFloat(sem.credits) || 0;
    
    totalPoints += credits * sgpa;
    totalCredits += credits;
  });

  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

  return {
    cgpa: parseFloat(cgpa),
    totalCredits,
    totalPoints
  };
};

// Calculate required SGPA for remaining semesters to achieve target CGPA
export const calculateRequiredSGPA = (currentCGPA, completedCredits, targetCGPA, remainingSemesters, creditsPerSemester) => {
  const totalSemesters = 8;
  const completedSemesters = completedCredits / creditsPerSemester;
  
  if (remainingSemesters <= 0 || completedSemesters >= totalSemesters) {
    return { achievable: false, requiredSGPA: null, message: 'No remaining semesters' };
  }

  const totalCredits = totalSemesters * creditsPerSemester;
  const remainingCredits = totalCredits - completedCredits;
  
  // Current total points
  const currentPoints = currentCGPA * completedCredits;
  
  // Target total points needed
  const targetPoints = targetCGPA * totalCredits;
  
  // Points needed from remaining semesters
  const requiredPoints = targetPoints - currentPoints;
  
  // Required SGPA for remaining semesters
  const requiredSGPA = requiredPoints / remainingCredits;
  
  if (requiredSGPA > 10) {
    return {
      achievable: false,
      requiredSGPA: null,
      message: `Need ${requiredSGPA.toFixed(2)} SGPA (impossible - max is 10)`
    };
  }
  
  if (requiredSGPA < 0) {
    return {
      achievable: true,
      requiredSGPA: 0,
      message: 'Target already achieved!'
    };
  }

  return {
    achievable: true,
    requiredSGPA: parseFloat(requiredSGPA.toFixed(2)),
    remainingCredits,
    message: `Required SGPA for remaining ${remainingSemesters} semester${remainingSemesters > 1 ? 's' : ''}`
  };
};

// Get color based on CGPA/SGPA value
export const getGradeColor = (value) => {
  if (value >= 9) return '#10b981'; // Excellent - green
  if (value >= 8) return '#00d4ff'; // Very Good - cyan
  if (value >= 7) return '#5a67d8'; // Good - indigo
  if (value >= 6) return '#f59e0b'; // Average - yellow
  if (value >= 5) return '#f97316'; // Below Average - orange
  return '#ef4444'; // Poor - red
};

// Get grade description
export const getGradeDescription = (value) => {
  if (value >= 9) return 'Outstanding';
  if (value >= 8) return 'Excellent';
  if (value >= 7) return 'Very Good';
  if (value >= 6) return 'Good';
  if (value >= 5) return 'Average';
  if (value >= 4) return 'Pass';
  return 'Needs Improvement';
};
