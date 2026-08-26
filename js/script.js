// Mock data for 3 roles
var roleProfiles = {
  student: {
    name: "Rahul Sharma",
    id: "STU2024001",
    email: "rahul@campus.edu",
    dept: "Computer Science",
    year: "3rd Year",
    semester: "6th Semester",
    roleLabel: "Student"
  },
  faculty: {
    name: "Dr. Anita Sen",
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
  var urlParams = new URLSearchParams(window.location.search);
  var paramRole = urlParams.get("role");
  if (paramRole) return paramRole;
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

// On page load
document.addEventListener("DOMContentLoaded", function () {
  var role = getActiveRole();
  var user = getUserProfile();

  // Topbar user info
  var topbarUser = document.getElementById("topbarUserName");
  if (topbarUser) topbarUser.textContent = user.name;

  var topbarAvatar = document.getElementById("topbarAvatar");
  if (topbarAvatar) topbarAvatar.textContent = user.name.charAt(0);

  // Role switcher dropdown in topbar
  var roleSelect = document.getElementById("globalRoleSelect");
  if (roleSelect) {
    roleSelect.value = role;
    roleSelect.addEventListener("change", function () {
      setActiveRole(this.value);
      window.location.reload();
    });
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

  // Initialize specific page logic
  initLogin();
  initRegister();
  initDashboard(user, role);
  initProfile(user, role);
  initSearchAndFilter();
  initAttendance();
  initResults(role);
});

// Dynamic sidebar links
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

  html += '<a href="index.html" style="margin-top: 15px; color: var(--danger);">' +
    '<span class="sidebar-icon">🚪</span><span>Logout</span></a>';

  nav.innerHTML = html;
}

// Login logic
function initLogin() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  var selectedRole = "student";
  var tabs = document.querySelectorAll(".role-tab");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      this.classList.add("active");
      selectedRole = this.getAttribute("data-role");
    });
  });

  window.fillDemo = function (role) {
    selectedRole = role;
    tabs.forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-role") === role);
    });
    var idInput = document.getElementById("loginId");
    var passInput = document.getElementById("loginPassword");
    if (role === "student") { idInput.value = "rahul@campus.edu"; passInput.value = "123456"; }
    else if (role === "faculty") { idInput.value = "anita.sen@campus.edu"; passInput.value = "123456"; }
    else { idInput.value = "admin@campus.edu"; passInput.value = "123456"; }
  };

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

// Register logic
function initRegister() {
  var form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("regName").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var pass = document.getElementById("regPassword").value;
    var confirm = document.getElementById("regConfirmPassword").value;
    var err = document.getElementById("regError");
    var success = document.getElementById("regSuccess");

    err.textContent = "";
    success.textContent = "";

    if (!name || !email || !pass || !confirm) {
      err.textContent = "Please fill in all fields.";
      return;
    }
    if (pass.length < 6) {
      err.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (pass !== confirm) {
      err.textContent = "Passwords do not match.";
      return;
    }
    success.textContent = "Registration successful! You can now log in.";
    form.reset();
  });
}

// Dashboard widgets per role
function initDashboard(user, role) {
  var welcomeMsg = document.getElementById("welcomeMsg");
  if (!welcomeMsg) return;

  welcomeMsg.textContent = "Welcome, " + user.name + "!";
  var roleTag = document.getElementById("welcomeRole");
  if (roleTag) roleTag.textContent = user.roleLabel || role.toUpperCase();

  var container = document.getElementById("dashboardWidgets");
  if (!container) return;

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

// Attendance toggle buttons
function initAttendance() {
  var buttons = document.querySelectorAll(".attend-toggle");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
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

  function updateSummary() {
    var total = document.querySelectorAll(".attend-toggle").length;
    var present = document.querySelectorAll(".attend-toggle.btn-success").length;
    var countEl = document.getElementById("presentCountDisplay");
    if (countEl && total > 0) {
      countEl.textContent = present + " / " + total + " Present (" + Math.round((present / total) * 100) + "%)";
    }
  }
}

// Results management init
function initResults(role) {
  var studentView = document.getElementById("studentResultView");
  var facultyView = document.getElementById("facultyResultView");
  var adminView = document.getElementById("adminResultView");

  if (!studentView && !facultyView && !adminView) return;

  if (role === "student" && studentView) {
    studentView.style.display = "block";
  } else if (role === "faculty" && facultyView) {
    facultyView.style.display = "block";
  } else if (adminView) {
    adminView.style.display = "block";
  }
}

// Admin toggle publish status
window.togglePublish = function (btn) {
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

// Modal helpers
function openModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove("active");
}
