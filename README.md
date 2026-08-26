# Campus Connect — 50% Frontend Milestone

A modern, responsive, and role-based College Management System frontend portal built for college students, faculty, and administrators.

---

## 📌 Project Overview
**Campus Connect** provides an integrated interface for managing student attendance, academic curriculum, examination results, notice boards, study materials, and campus events.

- **Milestone**: 50% Mini-Project Phase (Frontend Only)
- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript
- **No Backend / Database**: Frontend simulation with `localStorage` state management and 3-role interactive demo.

---

## 👥 Supported Roles
1. **Student**: View enrolled courses, track subject attendance %, view semester examination grades & SGPA/CGPA, download study notes, and browse campus notices/events.
2. **Faculty**: Mark classroom attendance (Present / Absent / Late interactive roll-call), enter and save examination marks/grades, and post study materials.
3. **Admin**: View campus-wide statistics, manage student/faculty user directories, control result publishing status, and manage notices & events.

---

## 📂 Project Structure

```
CampusConnect/
├── css/
│   └── style.css            # Central stylesheet (clean academic blue theme)
├── js/
│   └── script.js            # Vanilla JS for role switching, dynamic sidebar & search/filter
├── images/
│   └── profile-placeholder.png
├── index.html               # College landing page with role cards & quick stats
├── login.html               # 3-role login portal with 1-click demo pre-fill buttons
├── register.html            # User registration form with validation
├── dashboard.html           # Role-tailored dashboard with live metrics
├── profile.html             # Profile identity card with inline edit mode
├── courses.html             # Course catalog with syllabus progress meters
├── attendance.html          # Subject attendance summary + Faculty interactive roll-call
├── results.html             # Result Management (Student view, Faculty marks entry, Admin control)
├── notices.html             # Searchable notice board with category filters & post modal
├── events.html              # Campus events calendar with RSVP toggle
├── materials.html           # Lecture slides & lab manuals repository with upload modal
├── users.html               # Admin student & faculty directory with live search
├── settings.html            # Account preferences & password change demo
└── doc.html                 # Mini-project presentation download page
```

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ayanmulani4867-cyber/Campus-Connect-50-.git
   ```
2. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox).
3. No build tools, package managers, or server installations required!

---

## 📄 License
Academic Mini-Project — Created for College Curriculum Evaluation.
