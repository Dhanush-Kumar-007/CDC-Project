# CDC Placement Portal — Architecture & Build Plan

This document is the blueprint for the whole build. Every later phase will fill in
the files listed here — nothing here is arbitrary, it maps 1:1 to the requirements.

---

## 1. High-Level Architecture

```
┌─────────────────────┐         HTTPS / JSON          ┌──────────────────────┐
│   React (Vite) SPA  │ ─────────────────────────────▶ │  Express.js REST API │
│   Tailwind + RHF     │ ◀───────────────────────────── │  (Node.js, MVC)      │
└─────────────────────┘        JWT in Authorization    └──────────┬───────────┘
                                       header                      │
                                                                    │ Mongoose ODM
                                                                    ▼
                                                          ┌───────────────────┐
                                                          │   MongoDB Atlas    │
                                                          │ students / admins /│
                                                          │ jobs / applications │
                                                          └───────────────────┘

Static file serving: /uploads/resumes, /uploads/logos (served by Express, disk-backed
via Multer — swappable for S3/Cloudinary later without changing the API contract).
```

**Pattern:** MVC on the backend (routes → controllers → models), service-layer
pattern on the frontend (`services/*.js` wrap Axios calls; pages/components never
call Axios directly).

**Auth flow:** JWT issued on login, stored in memory + localStorage on the client,
attached via Axios interceptor. Two separate JWT "types" (`role: student|admin`)
so role-based middleware can gate routes server-side — the frontend routing guard
is UX only, never the security boundary.

**Deadline enforcement:** No cron job dependency for correctness. Job status is
computed **lazily and authoritatively at read/write time**:
- A virtual/derived `computedStatus` is calculated on every job fetch by comparing
  `now` to `lastDateToApply` + `lastTimeToApply`.
- `POST /api/applications/apply` re-checks the deadline server-side before writing,
  regardless of what the frontend believes the job status is.
- A secondary scheduled job (`node-cron`) periodically flips stale `Active` jobs to
  `Closed` in the DB so admin dashboards/counts are cheap to query without
  recomputing on every list call. This is a performance optimization, not the
  source of truth — the apply-time check is.

---

## 2. Backend Folder Structure (MVC)

```
backend/
├── server.js                     # App entrypoint: loads env, connects DB, mounts routes, starts listener
├── package.json
├── .env.example
│
├── config/
│   ├── db.js                     # Mongoose connection (MongoDB Atlas)
│   └── multer.js                 # Multer storage config (resumes, logos) + file-type/size filters
│
├── models/
│   ├── Student.js                # Student schema (personal, academic, skills, resume path, password hash)
│   ├── Admin.js                  # Admin schema (email, password hash, name)
│   ├── Job.js                    # Job schema (company, role, eligibility, deadlines, status)
│   └── Application.js            # Application schema (studentId ref, jobId ref, snapshot fields, status)
│
├── controllers/
│   ├── authController.js         # studentRegister, studentLogin, adminLogin
│   ├── studentController.js      # getProfile, updateProfile, changePassword, uploadResume
│   ├── jobController.js          # getJobs, getJobById, createJob, updateJob, deleteJob, closeJob
│   ├── applicationController.js  # applyToJob, getMyApplications, getApplicantsForJob, updateStatus, exportCsv
│   └── dashboardController.js    # getAdminStats, getStudentDashboardData
│
├── routes/
│   ├── authRoutes.js              -> /api/auth/*
│   ├── studentRoutes.js           -> /api/students/*
│   ├── jobRoutes.js               -> /api/jobs/*
│   ├── applicationRoutes.js       -> /api/applications/*
│   └── dashboardRoutes.js         -> /api/dashboard/*
│
├── middleware/
│   ├── authMiddleware.js         # verifyToken (JWT) — attaches req.user
│   ├── roleMiddleware.js         # requireRole('student' | 'admin')
│   ├── validateRequest.js        # runs express-validator result, formats 400 errors
│   ├── errorHandler.js           # centralized error-handling middleware (last in chain)
│   ├── notFound.js               # 404 handler
│   └── rateLimiter.js            # express-rate-limit configs (auth routes stricter)
│
├── utils/
│   ├── generateToken.js          # JWT sign helper
│   ├── jobStatus.js              # isJobExpired(job), computeStatus(job) — single source of truth
│   ├── asyncHandler.js           # wraps async controllers, forwards errors to errorHandler
│   ├── apiResponse.js            # consistent { success, message, data } response shape
│   └── csvExport.js              # applicants -> CSV string builder
│
├── validators/
│   ├── authValidators.js         # register/login field rules (express-validator chains)
│   ├── jobValidators.js
│   └── applicationValidators.js
│
└── uploads/
    ├── resumes/                  # student resume PDFs (gitignored, kept via .gitkeep)
    └── logos/                    # company logos (gitignored, kept via .gitkeep)
```

## 3. Frontend Folder Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
│
├── public/
│
└── src/
    ├── main.jsx                       # ReactDOM root, wraps App in AuthProvider + Router
    ├── App.jsx                        # Route table (public / student / admin, guarded)
    ├── index.css                      # Tailwind directives + base typography
    │
    ├── context/
    │   └── AuthContext.jsx            # user, token, role, login(), logout(), loading state
    │
    ├── hooks/
    │   ├── useAuth.js                 # convenience hook around AuthContext
    │   └── useFetch.js                # generic loading/error/data wrapper for GET calls
    │
    ├── services/
    │   ├── api.js                     # Axios instance: baseURL, JWT interceptor, 401 handler
    │   ├── authService.js             # registerStudent, loginStudent, loginAdmin
    │   ├── studentService.js          # getProfile, updateProfile, changePassword, uploadResume
    │   ├── jobService.js              # getJobs, getJob, createJob, updateJob, deleteJob
    │   ├── applicationService.js      # apply, getMyApplications, getApplicantsForJob, updateStatus
    │   └── dashboardService.js        # getAdminStats
    │
    ├── layouts/
    │   ├── StudentLayout.jsx          # Sidebar/topbar shell for student pages + <Outlet/>
    │   ├── AdminLayout.jsx            # Sidebar/topbar shell for admin pages + <Outlet/>
    │   └── AuthLayout.jsx             # Centered card shell for login/register pages
    │
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── ProtectedRoute.jsx     # role-aware route guard, redirects unauthenticated/wrong-role
    │   │   ├── Card.jsx
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx              # RHF-bound text/select/date input
    │   │   ├── Table.jsx              # generic sortable/paginated table shell
    │   │   ├── Modal.jsx
    │   │   ├── Badge.jsx              # status pill (Applied/Shortlisted/etc, Active/Closed)
    │   │   ├── Spinner.jsx
    │   │   └── EmptyState.jsx
    │   ├── student/
    │   │   ├── ProfileForm.jsx
    │   │   ├── ResumeUpload.jsx
    │   │   ├── ProfileCompletionMeter.jsx
    │   │   └── ApplicationStatusCard.jsx
    │   ├── admin/
    │   │   ├── StatCard.jsx
    │   │   ├── ApplicantTable.jsx
    │   │   ├── ApplicantFilters.jsx   # department/CGPA/date filters + search
    │   │   └── JobForm.jsx            # shared create/edit job form
    │   └── jobs/
    │       ├── JobCard.jsx
    │       ├── JobDetails.jsx
    │       └── ApplyButton.jsx        # disables + explains why when ineligible/expired
    │
    ├── pages/
    │   ├── auth/
    │   │   ├── StudentLogin.jsx
    │   │   ├── StudentRegister.jsx
    │   │   └── AdminLogin.jsx
    │   ├── student/
    │   │   ├── StudentDashboard.jsx
    │   │   ├── StudentProfile.jsx
    │   │   ├── JobListing.jsx
    │   │   ├── JobDetailPage.jsx
    │   │   └── MyApplications.jsx
    │   └── admin/
    │       ├── AdminDashboard.jsx
    │       ├── ManageJobs.jsx
    │       ├── JobFormPage.jsx        # create/edit
    │       └── ApplicantsPage.jsx     # per-job applicant list, filters, CSV export
    │
    └── utils/
        ├── validators.js              # shared regex/rules mirrored from backend (UX only)
        ├── constants.js               # departments, job types, status enums
        └── formatDate.js
```

## 4. Data Model Summary (detail comes in Phase 2)

| Collection     | Key relationships                                   |
|-----------------|------------------------------------------------------|
| `students`      | referenced by `applications.studentId`               |
| `admins`        | standalone, seeded manually / via seed script         |
| `jobs`          | referenced by `applications.jobId`                    |
| `applications`  | `studentId` → students, `jobId` → jobs, compound unique index on `(studentId, jobId)` to enforce "no duplicate applications" at the DB layer, not just app logic |

## 5. Build Phases (proposed)

1. ✅ **Phase 1 — Architecture & folder structure** (this document)
2. **Phase 2 — Backend foundation:** `server.js`, `config/db.js`, all Mongoose models, `.env.example`, `package.json`
3. **Phase 3 — Backend auth:** authController, authRoutes, JWT/bcrypt utils, validators, middleware (auth/role/error/rate-limit)
4. **Phase 4 — Backend jobs + applications:** jobController/Routes, applicationController/Routes, deadline-enforcement logic, dashboardController
5. **Phase 5 — Frontend foundation:** Vite/Tailwind setup, routing, AuthContext, Axios service layer, ProtectedRoute
6. **Phase 6 — Student UI:** register/login, dashboard, profile, job listing/detail, apply flow, my applications
7. **Phase 7 — Admin UI:** login, dashboard stats, job CRUD, applicants table with filters/search/sort/CSV export
8. **Phase 8 — Polish & deploy:** README, seed script for admin account, security hardening pass (helmet/CORS/rate-limit review), Vercel/Render deployment notes

Each phase will produce complete, runnable files — no placeholders — so you can
install dependencies and test incrementally instead of waiting for the whole app.

---

**Next step:** say "proceed to Phase 2" (or ask for changes to this plan first) and
I'll generate the backend foundation — models, DB config, and server entrypoint.
