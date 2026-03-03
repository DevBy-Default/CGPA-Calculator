# TODO - Make Semester Selection User-Friendly

## Task: Improve semester selection in CGPA Calculator

### Changes made:

- [x] 1. Show all 8 semesters (removed year-based filtering)
- [x] 2. Make semester selector more user-friendly with:
   - Modern dropdown selector with "Select Semester" label
   - Quick click chips (1-8) for easy semester switching
   - Visual feedback with active state highlighting

### File edited:
- `src/components/SGPACalculator.jsx`

### Summary of changes:
1. Changed `availableSemesters` to always return [1, 2, 3, 4, 5, 6, 7, 8]
2. Replaced old tab buttons with:
   - A dropdown select menu with custom styling
   - Quick-access semester chips (1-8) that are easy to click
3. Added proper CSS styles for the new components
