# B.Tech CGPA Calculator - Specification Document

## 1. Project Overview

**Project Name:** B.Tech CGPA Calculator  
**Project Type:** Single Page Web Application (React + Vite)  
**Core Functionality:** A comprehensive SGPA and CGPA calculator for B.Tech students in India with result prediction capabilities  
**Target Users:** B.Tech students (RTU/AKTU syllabus pattern)

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections:**
- **Header**: Logo, App Title, Dark/Light Mode Toggle
- **Hero Section**: Title "B.Tech CGPA Calculator" + tagline
- **Main Content**: Two-column grid (desktop) / stacked (mobile)
  - Left Column: SGPA Calculator Card
  - Right Column: CGPA Calculator + Prediction Card
- **Footer**: Credits and info

**Responsive Breakpoints:**
- Mobile: < 768px (single column, stacked)
- Tablet: 768px - 1024px (adjusted spacing)
- Desktop: > 1024px (two columns)

### Visual Design

**Color Palette - Dark Mode (Default):**
- Background: `#0a0a0a`
- Card Background: `rgba(26, 26, 46, 0.7)`
- Primary Accent: `#00d4ff` (Cyan)
- Secondary Accent: `#5a67d8` (Indigo)
- Text Primary: `#ffffff`
- Text Secondary: `#94a3b8`
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Border: `rgba(255, 255, 255, 0.1)`

**Color Palette - Light Mode:**
- Background: `#f8fafc`
- Card Background: `rgba(255, 255, 255, 0.8)`
- Primary Accent: `#0891b2` (Darker Cyan)
- Secondary Accent: `#4f46e5` (Darker Indigo)
- Text Primary: `#1e293b`
- Text Secondary: `#64748b`

**Typography:**
- Font Family: "Inter", sans-serif
- Headings: 
  - H1: 2.5rem (40px), font-weight: 700
  - H2: 1.75rem (28px), font-weight: 600
  - H3: 1.25rem (20px), font-weight: 600
- Body: 1rem (16px), font-weight: 400
- Small: 0.875rem (14px)

**Spacing System:**
- Base unit: 4px
- Card padding: 24px
- Section gap: 32px
- Element gap: 16px

**Visual Effects:**
- Glassmorphism: `backdrop-filter: blur(12px)`
- Card shadow (dark): `0 8px 32px rgba(0, 0, 0, 0.4)`
- Card shadow (light): `0 8px 32px rgba(0, 0, 0, 0.1)`
- Border radius: 16px (cards), 8px (inputs/buttons)
- Gradient accents: `linear-gradient(135deg, #00d4ff, #5a67d8)`

### Components

**1. Header**
- App logo/icon (graduation cap or calculator)
- Title text
- Dark/Light mode toggle button with smooth transition

**2. SGPA Calculator Card**
- Semester selector dropdown (Semester 1-8)
- Subject list with:
  - Subject name input
  - Credits input (L+T+P format or total credits)
  - Grade dropdown (O, A+, A, B+, B, C+, C, D, E, F, U)
- Add Subject button (+)
- Remove subject button (x) per row
- Calculate SGPA button
- Result display: Total Credits, SGPA
- Warning for F/U grades

**3. CGPA Calculator Card**
- Previous semesters input table (Sem 1-8)
- Each row: Semester number, SGPA input, Credits input
- Auto-calculate CGPA display
- Circular progress indicator for CGPA visualization

**4. Prediction Card**
- Target CGPA selector (7.0, 7.5, 8.0, 8.5, 9.0)
- Remaining semesters dropdown
- Required SGPA calculation display
- Visual roadmap/progress bar

**5. Animations**
- Page load: Fade in + slide up
- Card hover: Subtle scale (1.02) + shadow increase
- Button hover: Color shift + slight scale
- Input focus: Border color change + glow
- Mode toggle: Smooth color transitions (0.3s)
- Result calculation: Number count-up animation

---

## 3. Functionality Specification

### Core Features

**A. SGPA Calculator**
1. Select semester (1-8)
2. Add subjects with:
   - Subject name (text, optional)
   - Credits (1-10, number input)
   - Grade (dropdown: O=10, A+=9, A=8, B+=7, B=6, C+=5, C=4, D=3, E=2, F=0, U=0)
3. Dynamic add/remove subjects
4. Calculate SGPA: `Σ(credits × grade_points) / Σ(credits)`
5. Display total credits and SGPA
6. Validation: Show warning for F/U grades

**B. CGPA Calculator**
1. Input fields for up to 8 semesters:
   - SGPA (0-10)
   - Total Credits
2. Auto-calculate cumulative: `Σ(total_credits × SGPA) / Σ(total_credits)`
3. Circular progress visualization showing current CGPA
4. Display total completed credits

**C. Prediction Calculator**
1. Input:
   - Target CGPA (dropdown: 7.0, 7.5, 8.0, 8.5, 9.0)
   - Number of remaining semesters (1-7)
2. Calculate required SGPA for remaining semesters
3. Show if target is achievable (max SGPA = 10)
4. Visual roadmap showing current vs target

### Grade Point Mapping
| Grade | Points |
|-------|--------|
| O (Outstanding) | 10 |
| A+ (Excellent) | 9 |
| A (Very Good) | 8 |
| B+ (Good) | 7 |
| B (Average) | 6 |
| C+ (Above Average) | 5 |
| C (Average) | 4 |
| D (Pass) | 3 |
| E (Needs Improvement) | 2 |
| F (Fail) | 0 |
| U (Absent) | 0 |

### User Interactions
- Click "Add Subject" → New row appears with animation
- Click "Remove" → Row removed with fade animation
- Change any input → Auto-recalculate SGPA
- Toggle dark/light mode → Smooth theme transition
- Hover cards → Subtle lift effect

### Data Handling
- All calculations done client-side
- LocalStorage for saving semester data (optional)
- No server required

### Edge Cases
- Division by zero (no credits): Show 0.00 SGPA
- Invalid inputs: Show validation error
- Target impossible (required > 10): Show "Not achievable" message

---

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark mode displays with #0a0a0a background
- [ ] Glassmorphism cards have blur effect
- [ ] Gradient accents visible on buttons/highlights
- [ ] Typography uses Inter font
- [ ] Responsive layout works on mobile (< 768px)
- [ ] Animations are smooth (60fps)

### Functional Checkpoints
- [ ] Can add/remove subjects dynamically
- [ ] SGPA calculates correctly: Example (3 credits × 9) + (4 credits × 8) = 59/7 = 8.43
- [ ] CGPA calculates correctly across multiple semesters
- [ ] Prediction shows required SGPA
- [ ] Dark/Light mode toggle works
- [ ] F/U grade warnings display

### Test Cases
1. **Basic SGPA**: 3 subjects with credits 4,3,4 and grades A+,A,A → SGPA = (4×9 + 3×8 + 4×8) / (4+3+4) = 92/11 = 8.36
2. **CGPA**: Sem1 (8.5, 24 credits), Sem2 (8.0, 24 credits) → CGPA = (8.5×24 + 8.0×24) / 48 = 8.25
3. **Prediction**: Current CGPA 7.5, 6 semesters done, target 8.0, 2 remaining → Calculate required SGPA

---

## 5. Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: CSS Modules + CSS Custom Properties
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Fonts**: Google Fonts (Inter)

---

## 6. File Structure

```
cgpa-calculator/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SGPACalculator.jsx
│   │   ├── CGPACalculator.jsx
│   │   ├── PredictionCalculator.jsx
│   │   ├── CircularProgress.jsx
│   │   └── GradeSelect.jsx
│   └── utils/
│       └── calculations.js
