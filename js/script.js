// Mock data for 3 roles
var roleProfiles = {
  student: {
    name: "John Snow",
    id: "STU2024001",
    email: "rahul@campus.edu",
    dept: "Computer Science",
    year: "3rd Year",
    semester: "6th Semester",
    roleLabel: "Student"
  },
  faculty: {
    name: "P B Patil",
    id: "FAC2018042",
    email: "anita.sen@campus.edu",
    dept: "Computer Science",
    designation: "Associate Professor",
    roleLabel: "Faculty"
  },
  admin: {
    name: "Admin Controller",
    id: "ADM2015001",
    email: "admin@campus.edu",
    dept: "Academic Affairs",
    office: "Admin Block 101",
    roleLabel: "Administrator"
  }
};

function getActiveRole() {
  return localStorage.getItem("campus_role") || "student";
}

function setActiveRole(role) {
  localStorage.setItem("campus_role", role);
}

function getUserProfile() {
  var role = getActiveRole();
  var saved = localStorage.getItem("campus_user_" + role);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return roleProfiles[role] || roleProfiles.student;
}

// Role-Based Access Control (RBAC) Enforcement
function enforceRBAC() {
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  var publicPages = ["index.html", "login.html", "doc.html"];

  // Allow public landing and login pages
  if (publicPages.indexOf(currentPath) !== -1) {
    return;
  }

  var currentRole = localStorage.getItem("campus_role");
  if (!currentRole || !roleProfiles[currentRole]) {
    // Unauthorized access: redirect to login
    window.location.href = "login.html";
    return;
  }

  // 1. User directory is strictly for Admin only
  if (currentPath === "users.html" && currentRole !== "admin") {
    alert("Access Denied: The User Directory is restricted to Administrators only.");
    window.location.href = "dashboard.html";
    return;
  }

  // 2. Attendance is for Faculty and Students only
  if (currentPath === "attendance.html" && currentRole === "admin") {
    alert("Access Denied: Attendance management is reserved for Faculty and Students.");
    window.location.href = "dashboard.html";
    return;
  }
}

// On page load
document.addEventListener("DOMContentLoaded", function () {
  enforceRBAC();

  var role = getActiveRole();
  var user = getUserProfile();

  // Topbar user info
  var topbarUser = document.getElementById("topbarUserName");
  if (topbarUser) topbarUser.textContent = user.name;

  var topbarAvatar = document.getElementById("topbarAvatar");
  if (topbarAvatar) topbarAvatar.textContent = user.name.charAt(0);

  // Topbar role indicator badge
  var topbarRoleBadge = document.getElementById("topbarRoleBadge");
  if (topbarRoleBadge) {
    topbarRoleBadge.textContent = user.roleLabel || role.toUpperCase();
    if (role === "student") {
      topbarRoleBadge.className = "badge badge-primary";
    } else if (role === "faculty") {
      topbarRoleBadge.className = "badge badge-info";
    } else if (role === "admin") {
      topbarRoleBadge.className = "badge badge-warning";
    }
  }

  // Sidebar toggle for mobile
  var menuBtn = document.getElementById("menuBtn");
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("sidebarOverlay");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      if (overlay) overlay.classList.toggle("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      if (sidebar) sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });
  }

  // Password toggle
  document.querySelectorAll(".toggle-pass").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = this.getAttribute("data-target");
      var input = targetId ? document.getElementById(targetId) : this.previousElementSibling;
      if (input) {
        if (input.type === "password") {
          input.type = "text";
          this.textContent = "Hide";
        } else {
          input.type = "password";
          this.textContent = "Show";
        }
      }
    });
  });

  // Setup sidebar links based on role
  setupSidebar(role);

  // Initialize specific page logic with RBAC
  initLogin();
  initDashboard(user, role);
  initProfile(user, role);
  initSearchAndFilter();
  initAttendance(role);
  initResults(role);
  initNotices(role);
  initMaterials(role);
  initUsers(role);
});

// Dynamic sidebar links strictly matching role authorizations
function setupSidebar(role) {
  var nav = document.getElementById("sidebarNav");
  if (!nav) return;

  var current = window.location.pathname.split("/").pop() || "index.html";
  var items = [];

  if (role === "student") {
    items = [
      { name: "Dashboard", href: "dashboard.html", icon: "📊" },
      { name: "My Profile", href: "profile.html", icon: "👤" },
      { name: "Courses", href: "courses.html", icon: "📚" },
      { name: "My Results", href: "results.html", icon: "📝" },
      { name: "Notices", href: "notices.html", icon: "📢" },
      { name: "Events", href: "events.html", icon: "🎉" },
      { name: "Study Materials", href: "materials.html", icon: "📁" },
      { name: "Settings", href: "settings.html", icon: "⚙️" }
    ];
  } else if (role === "faculty") {
    items = [
      { name: "Dashboard", href: "dashboard.html", icon: "📊" },
      { name: "Faculty Profile", href: "profile.html", icon: "👤" },
      { name: "My Classes", href: "courses.html", icon: "📚" },
      { name: "Mark Attendance", href: "attendance.html", icon: "📅" },
      { name: "Enter Marks", href: "results.html", icon: "📝" },
      { name: "Notices", href: "notices.html", icon: "📢" },
      { name: "Events", href: "events.html", icon: "🎉" },
      { name: "Upload Materials", href: "materials.html", icon: "📁" },
      { name: "Settings", href: "settings.html", icon: "⚙️" }
    ];
  } else {
    items = [
      { name: "Dashboard", href: "dashboard.html", icon: "📊" },
      { name: "Admin Profile", href: "profile.html", icon: "👤" },
      { name: "User Directory", href: "users.html", icon: "👥" },
      { name: "Courses", href: "courses.html", icon: "📚" },
      { name: "Result Control", href: "results.html", icon: "📝" },
      { name: "Manage Notices", href: "notices.html", icon: "📢" },
      { name: "Manage Events", href: "events.html", icon: "🎉" },
      { name: "Study Repository", href: "materials.html", icon: "📁" },
      { name: "Settings", href: "settings.html", icon: "⚙️" }
    ];
  }

  var html = items.map(function (item) {
    return '<a href="' + item.href + '" class="' + (current === item.href ? 'active' : '') + '">' +
      '<span class="sidebar-icon">' + item.icon + '</span>' +
      '<span>' + item.name + '</span></a>';
  }).join("");

  html += '<a href="login.html" onclick="logoutUser(event)" style="margin-top: 15px; color: var(--danger);">' +
    '<span class="sidebar-icon">🚪</span><span>Logout</span></a>';

  nav.innerHTML = html;
}

// User logout handler
window.logoutUser = function (e) {
  if (e) e.preventDefault();
  localStorage.removeItem("campus_role");
  window.location.href = "login.html";
};

// Login logic
function initLogin() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  var savedRole = localStorage.getItem("campus_role") || "student";
  var selectedRole = (roleProfiles[savedRole]) ? savedRole : "student";
  var tabs = document.querySelectorAll(".role-tab");

  tabs.forEach(function (t) {
    if (t.getAttribute("data-role") === selectedRole) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      this.classList.add("active");
      selectedRole = this.getAttribute("data-role");
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("loginId").value.trim();
    var pass = document.getElementById("loginPassword").value.trim();
    var err = document.getElementById("loginError");

    if (!id || !pass) {
      err.textContent = "Please enter both ID/Email and password.";
      return;
    }
    err.textContent = "";
    setActiveRole(selectedRole);
    window.location.href = "dashboard.html";
  });
}

// Dashboard widgets & quick links strictly per role
function initDashboard(user, role) {
  var welcomeMsg = document.getElementById("welcomeMsg");
  if (!welcomeMsg) return;

  welcomeMsg.textContent = "Welcome, " + user.name + "!";
  var roleTag = document.getElementById("welcomeRole");
  if (roleTag) roleTag.textContent = user.roleLabel || role.toUpperCase();

  var container = document.getElementById("dashboardWidgets");
  if (container) {
    if (role === "student") {
      container.innerHTML =
        '<div class="stat-card stat-green"><div class="stat-card-header">Attendance</div><div class="stat-card-value">85%</div><div class="stat-card-desc">Good Standing (Min 75%)</div><div class="progress-bar-bg"><div class="progress-bar-fill progress-green" style="width: 85%;"></div></div></div>' +
        '<div class="stat-card"><div class="stat-card-header">Current CGPA</div><div class="stat-card-value">8.8</div><div class="stat-card-desc">Ranked top 10% in CSE</div><div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 88%;"></div></div></div>' +
        '<div class="stat-card stat-amber"><div class="stat-card-header">Enrolled Courses</div><div class="stat-card-value">5 Courses</div><div class="stat-card-desc">22 Total Credits</div></div>' +
        '<div class="stat-card stat-purple"><div class="stat-card-header">Pending Tasks</div><div class="stat-card-value">2 Tasks</div><div class="stat-card-desc">Due this week</div></div>';
    } else if (role === "faculty") {
      container.innerHTML =
        '<div class="stat-card stat-green"><div class="stat-card-header">Today Classes</div><div class="stat-card-value">4 Classes</div><div class="stat-card-desc">Next: DBMS @ 11:30 AM</div></div>' +
        '<div class="stat-card"><div class="stat-card-header">Total Students</div><div class="stat-card-value">180</div><div class="stat-card-desc">3 Department Batches</div></div>' +
        '<div class="stat-card stat-amber"><div class="stat-card-header">Attendance Pending</div><div class="stat-card-value">1 Class</div><div class="stat-card-desc">CSE 3rd Year</div></div>' +
        '<div class="stat-card stat-purple"><div class="stat-card-header">Uploaded Notes</div><div class="stat-card-value">14 Files</div><div class="stat-card-desc">Module 4 Graph Theory</div></div>';
    } else {
      container.innerHTML =
        '<div class="stat-card stat-green"><div class="stat-card-header">Total Students</div><div class="stat-card-value">1,250</div><div class="stat-card-desc">Active Enrolled</div></div>' +
        '<div class="stat-card"><div class="stat-card-header">Faculty Members</div><div class="stat-card-value">85</div><div class="stat-card-desc">6 Engineering Depts</div></div>' +
        '<div class="stat-card stat-amber"><div class="stat-card-header">Active Courses</div><div class="stat-card-value">42</div><div class="stat-card-desc">Spring 2026 Semester</div></div>' +
        '<div class="stat-card stat-purple"><div class="stat-card-header">System Health</div><div class="stat-card-value">100%</div><div class="stat-card-desc">Portal Running Smoothly</div></div>';
    }
  }

  // Populate role-authorized quick links
  var quickLinks = document.getElementById("dashboardQuickLinks");
  if (quickLinks) {
    if (role === "student") {
      quickLinks.innerHTML =
        '<a href="courses.html" class="btn btn-secondary btn-sm">📚 My Courses</a>' +
        '<a href="results.html" class="btn btn-secondary btn-sm">📝 My Results</a>' +
        '<a href="materials.html" class="btn btn-secondary btn-sm">📁 Study Notes</a>' +
        '<a href="notices.html" class="btn btn-secondary btn-sm">📢 Notice Board</a>' +
        '<a href="events.html" class="btn btn-secondary btn-sm">🎉 Events</a>' +
        '<a href="settings.html" class="btn btn-secondary btn-sm">⚙️ Settings</a>';
    } else if (role === "faculty") {
      quickLinks.innerHTML =
        '<a href="courses.html" class="btn btn-secondary btn-sm">📚 My Classes</a>' +
        '<a href="attendance.html" class="btn btn-secondary btn-sm">📅 Mark Attendance</a>' +
        '<a href="results.html" class="btn btn-secondary btn-sm">📝 Enter Marks</a>' +
        '<a href="materials.html" class="btn btn-secondary btn-sm">📁 Upload Materials</a>' +
        '<a href="notices.html" class="btn btn-secondary btn-sm">📢 Notice Board</a>' +
        '<a href="settings.html" class="btn btn-secondary btn-sm">⚙️ Settings</a>';
    } else {
      quickLinks.innerHTML =
        '<a href="users.html" class="btn btn-secondary btn-sm">👥 User Directory</a>' +
        '<a href="courses.html" class="btn btn-secondary btn-sm">📚 Manage Courses</a>' +
        '<a href="results.html" class="btn btn-secondary btn-sm">📝 Result Control</a>' +
        '<a href="notices.html" class="btn btn-secondary btn-sm">📢 Manage Notices</a>' +
        '<a href="materials.html" class="btn btn-secondary btn-sm">📁 Study Repository</a>' +
        '<a href="settings.html" class="btn btn-secondary btn-sm">⚙️ Settings</a>';
    }
  }
}

// Profile page edit & save
function initProfile(user, role) {
  var nameEl = document.getElementById("profileName");
  if (!nameEl) return;

  nameEl.textContent = user.name;
  var roleTag = document.getElementById("profileRoleTag");
  if (roleTag) roleTag.textContent = user.roleLabel || role.toUpperCase();

  var pId = document.getElementById("pId");
  var pEmail = document.getElementById("pEmail");
  var pDept = document.getElementById("pDept");
  var pExtra = document.getElementById("pExtra");

  if (pId) pId.textContent = user.id;
  if (pEmail) pEmail.textContent = user.email;
  if (pDept) pDept.textContent = user.dept;
  if (pExtra) pExtra.textContent = user.year || user.designation || user.office || "-";

  var editBtn = document.getElementById("editProfileBtn");
  var detailsBox = document.getElementById("profileDetails");
  var editBox = document.getElementById("profileEditForm");
  var editing = false;

  if (editBtn && detailsBox && editBox) {
    editBtn.addEventListener("click", function () {
      if (!editing) {
        document.getElementById("editName").value = user.name;
        document.getElementById("editEmail").value = user.email;
        document.getElementById("editDept").value = user.dept;
        detailsBox.style.display = "none";
        editBox.style.display = "block";
        editBtn.textContent = "Save Changes";
        editBtn.className = "btn btn-success btn-sm";
        editing = true;
      } else {
        user.name = document.getElementById("editName").value.trim() || user.name;
        user.email = document.getElementById("editEmail").value.trim() || user.email;
        user.dept = document.getElementById("editDept").value.trim() || user.dept;

        localStorage.setItem("campus_user_" + role, JSON.stringify(user));

        nameEl.textContent = user.name;
        if (pEmail) pEmail.textContent = user.email;
        if (pDept) pDept.textContent = user.dept;

        var topUser = document.getElementById("topbarUserName");
        if (topUser) topUser.textContent = user.name;

        detailsBox.style.display = "block";
        editBox.style.display = "none";
        editBtn.textContent = "Edit Profile";
        editBtn.className = "btn btn-secondary btn-sm";
        editing = false;
        alert("Profile updated successfully!");
      }
    });
  }
}

// Search and category filters
function initSearchAndFilter() {
  var searchInput = document.getElementById("globalSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var query = this.value.toLowerCase();
      var items = document.querySelectorAll(".filterable-item, .data-table tbody tr");
      items.forEach(function (item) {
        item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
  }

  var filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.replace("btn-primary", "btn-secondary"); });
      this.classList.replace("btn-secondary", "btn-primary");

      var filter = this.getAttribute("data-filter");
      document.querySelectorAll(".filterable-item").forEach(function (item) {
        var cat = item.getAttribute("data-category");
        item.style.display = (filter === "all" || cat === filter) ? "" : "none";
      });
    });
  });
}

// Attendance module with RBAC
function initAttendance(role) {
  var facultyCard = document.getElementById("facultyRollCallCard");

  if (role === "student") {
    // Completely remove faculty roll-call section for students
    if (facultyCard) facultyCard.remove();
  } else if (role === "faculty") {
    if (facultyCard) facultyCard.style.display = "block";
  }

  var buttons = document.querySelectorAll(".attend-toggle");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (getActiveRole() !== "faculty") {
        alert("Permission Denied: Only faculty members can mark attendance.");
        return;
      }
      if (this.classList.contains("btn-success")) {
        this.className = "btn btn-sm btn-danger attend-toggle";
        this.textContent = "Absent";
      } else if (this.classList.contains("btn-danger")) {
        this.className = "btn btn-sm btn-warning attend-toggle";
        this.textContent = "Late";
      } else {
        this.className = "btn btn-sm btn-success attend-toggle";
        this.textContent = "Present";
      }
      updateSummary();
    });
  });

  window.saveFacultyAttendance = function () {
    if (getActiveRole() !== "faculty") {
      alert("Permission Denied: Only faculty members can save attendance.");
      return;
    }
    alert("Attendance saved successfully for CS601!");
  };

  function updateSummary() {
    var total = document.querySelectorAll(".attend-toggle").length;
    var present = document.querySelectorAll(".attend-toggle.btn-success").length;
    var countEl = document.getElementById("presentCountDisplay");
    if (countEl && total > 0) {
      countEl.textContent = present + " / " + total + " Present (" + Math.round((present / total) * 100) + "%)";
    }
  }
}

// Results management init with strict DOM isolation per role
function initResults(role) {
  var studentView = document.getElementById("studentResultView");
  var facultyView = document.getElementById("facultyResultView");
  var adminView = document.getElementById("adminResultView");

  if (!studentView && !facultyView && !adminView) return;

  if (role === "student") {
    if (studentView) studentView.style.display = "block";
    if (facultyView) facultyView.remove();
    if (adminView) adminView.remove();
  } else if (role === "faculty") {
    if (facultyView) facultyView.style.display = "block";
    if (studentView) studentView.remove();
    if (adminView) adminView.remove();
  } else if (role === "admin") {
    if (adminView) adminView.style.display = "block";
    if (studentView) studentView.remove();
    if (facultyView) facultyView.remove();
  }
}

// Notices module RBAC: restrict post notice functionality to faculty/admin
function initNotices(role) {
  var postBtn = document.getElementById("postNoticeBtn");
  var modal = document.getElementById("newNoticeModal");

  if (role === "student") {
    if (postBtn) postBtn.remove();
    if (modal) modal.remove();
  }
}

// Study Materials module RBAC: restrict upload functionality to faculty/admin
function initMaterials(role) {
  var uploadBtn = document.getElementById("uploadMaterialBtn");
  var modal = document.getElementById("uploadMaterialModal");

  if (role === "student") {
    if (uploadBtn) uploadBtn.remove();
    if (modal) modal.remove();
  }
}

// User Directory RBAC: restrict to admin
function initUsers(role) {
  var addBtn = document.getElementById("addUserBtn");
  var modal = document.getElementById("addUserModal");

  if (role !== "admin") {
    if (addBtn) addBtn.remove();
    if (modal) modal.remove();
  }
}

// Admin toggle publish status
window.togglePublish = function (btn) {
  if (getActiveRole() !== "admin") {
    alert("Permission Denied: Only Administrators can publish or unpublish examination results.");
    return;
  }
  var row = btn.closest("tr");
  var badge = row.querySelector(".result-status-badge");
  if (btn.classList.contains("btn-warning")) {
    btn.className = "btn btn-success btn-sm pub-toggle-btn";
    btn.textContent = "Publish";
    badge.className = "badge badge-warning result-status-badge";
    badge.textContent = "Unpublished";
    alert("Result Unpublished.");
  } else {
    btn.className = "btn btn-warning btn-sm pub-toggle-btn";
    btn.textContent = "Unpublish";
    badge.className = "badge badge-success result-status-badge";
    badge.textContent = "Published";
    alert("Result Published successfully.");
  }
};

// Modal helpers with RBAC checks
function openModal(id) {
  var role = getActiveRole();
  if (id === "newNoticeModal" && role === "student") {
    alert("Permission Denied: Only Faculty and Administrators can publish notices.");
    return;
  }
  if (id === "uploadMaterialModal" && role === "student") {
    alert("Permission Denied: Only Faculty and Administrators can upload study materials.");
    return;
  }
  if (id === "addUserModal" && role !== "admin") {
    alert("Permission Denied: Only Administrators can add members to the user directory.");
    return;
  }
  var el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove("active");
}
