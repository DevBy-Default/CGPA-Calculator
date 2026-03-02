# TODO - CGPA Calculator Modification

## Task: Update syllabus data with exact subjects/credits from user and modify grade points

### Information Gathered:
- Current rtuSyllabus.js has generic RTU subjects that don't match user's provided data
- calculations.js has different grade points (O=10, A+=9, A=8, etc.)
- User wants exact subjects and credits for all 8 semesters pre-added
- User wants grade points: A++:10, A+:9, A:8.5, B+:8, B:7.5, C+:7, C:6.5, D+:6, D:5.5, E+:5, E:4, F:0

### Plan:
- [x] 1. Update src/utils/calculations.js - Change GRADE_POINTS to user's grading scale
- [x] 2. Update src/data/rtuSyllabus.js - Replace all 8 semesters with exact subjects/credits provided

### Dependent Files:
- src/utils/calculations.js - grade points modification
- src/data/rtuSyllabus.js - complete syllabus overhaul

### Followup Steps:
- [ ] Verify changes by running the app (npm run dev)
- [ ] Test SGPA calculation with new grade points
