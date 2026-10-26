import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Applied");
  const [saving, setSaving] = useState(false);

  // ===============================
  // GET LOGGED-IN USER
  // ===============================

  const savedUser = JSON.parse(
    localStorage.getItem("jobtrackUser")
  );

  // ===============================
  // GET JWT TOKEN
  // ===============================

  const token = localStorage.getItem("jobtrackToken");

  // ===============================
  // BACKEND CONNECTION TEST
  // ===============================

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend Response:", data);
      })
      .catch((error) => {
        console.error(
          "Backend Connection Error:",
          error
        );
      });
  }, []);

  // ===============================
  // LOAD USER'S APPLICATIONS
  // ===============================

  useEffect(() => {
    setError("");

    if (!savedUser || !savedUser.id || !token) {
      navigate("/login");
      return;
    }

    fetch(
      "http://localhost:5000/api/applications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("jobtrackToken");
          localStorage.removeItem("jobtrackLoggedIn");
          localStorage.removeItem("jobtrackUser");

          navigate("/login");

          throw new Error("Session expired.");
        }

        if (!response.ok) {
          throw new Error(
            "Failed to fetch applications."
          );
        }

        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setApplications(data);
          setError("");
        } else {
          console.error(
            "Invalid applications data:",
            data
          );

          setError(
            "Could not load your applications. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error(
          "Failed to load applications:",
          error
        );

        if (error.message !== "Session expired.") {
          setError(
            "Could not load your applications. Please check your backend connection and try again."
          );
        }
      });
  }, [navigate, savedUser?.id, token]);

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("jobtrackLoggedIn");
    localStorage.removeItem("jobtrackUser");
    localStorage.removeItem("jobtrackToken");

    navigate("/login");
  };

  // ===============================
  // APPLICATION VALIDATION
  // ===============================

  const validateApplication = () => {
    const cleanCompany = company.trim();
    const cleanPosition = position.trim();

    // Required fields
    if (!cleanCompany || !cleanPosition || !date) {
      alert("Please fill in all fields.");
      return false;
    }

    // Company validation
    if (cleanCompany.length < 2) {
      alert(
        "Company name must be at least 2 characters."
      );
      return false;
    }

    // Position validation
    if (cleanPosition.length < 2) {
      alert(
        "Job position must be at least 2 characters."
      );
      return false;
    }

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(
      `${date}T00:00:00`
    );

    if (isNaN(selectedDate.getTime())) {
      alert("Please enter a valid application date.");
      return false;
    }

    if (selectedDate > today) {
      alert(
        "Application date cannot be in the future."
      );
      return false;
    }

    // Status validation
    const validStatuses = [
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      alert(
        "Please select a valid application status."
      );
      return false;
    }

    return true;
  };

  // ===============================
  // ADD APPLICATION
  // ===============================

  const handleAddApplication = async (e) => {
    e.preventDefault();

    if (!validateApplication()) {
      return;
    }

    if (saving) {
      return;
    }

    if (!savedUser || !savedUser.id || !token) {
      alert(
        "Your session has expired. Please login again."
      );

      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const cleanCompany = company.trim();
      const cleanPosition = position.trim();

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            company: cleanCompany,
            position: cleanPosition,
            date,
            status,
          }),
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("jobtrackToken");
        localStorage.removeItem("jobtrackLoggedIn");
        localStorage.removeItem("jobtrackUser");

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to add application."
        );

        return;
      }

      setApplications((currentApplications) => [
        data.application,
        ...currentApplications,
      ]);

      console.log(
        "Application added to MySQL:",
        data.application
      );

      resetForm();
    } catch (error) {
      console.error(
        "Add Application Error:",
        error
      );

      alert(
        "Could not connect to backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // EDIT APPLICATION
  // ===============================

  const handleEditApplication = (application) => {
    setEditingId(application.id);

    setCompany(
      application.company || ""
    );

    setPosition(
      application.position || ""
    );

    const applicationDate =
      application.date_applied ||
      application.date ||
      "";

    setDate(
      applicationDate
        ? String(applicationDate).slice(0, 10)
        : ""
    );

    setStatus(
      application.status || "Applied"
    );

    setShowForm(true);
  };

  // ===============================
  // UPDATE APPLICATION
  // ===============================

  const handleUpdateApplication = async (e) => {
    e.preventDefault();

    if (!validateApplication()) {
      return;
    }

    if (saving) {
      return;
    }

    if (!editingId) {
      alert(
        "No application selected for editing."
      );

      return;
    }

    if (!savedUser || !savedUser.id || !token) {
      alert(
        "Your session has expired. Please login again."
      );

      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const cleanCompany = company.trim();
      const cleanPosition = position.trim();

      const response = await fetch(
        `http://localhost:5000/api/applications/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            company: cleanCompany,
            position: cleanPosition,
            date,
            status,
          }),
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("jobtrackToken");
        localStorage.removeItem("jobtrackLoggedIn");
        localStorage.removeItem("jobtrackUser");

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update application."
        );

        return;
      }

      setApplications((currentApplications) =>
        currentApplications.map(
          (application) =>
            application.id === editingId
              ? {
                  ...application,
                  company: cleanCompany,
                  position: cleanPosition,
                  date_applied: date,
                  status,
                }
              : application
        )
      );

      console.log(
        "Application updated in MySQL:",
        editingId
      );

      resetForm();
    } catch (error) {
      console.error(
        "Update Application Error:",
        error
      );

      alert(
        "Could not connect to backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // DELETE APPLICATION
  // ===============================

  const handleDeleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    if (!savedUser || !savedUser.id || !token) {
      alert(
        "Your session has expired. Please login again."
      );

      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("jobtrackToken");
        localStorage.removeItem("jobtrackLoggedIn");
        localStorage.removeItem("jobtrackUser");

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete application."
        );

        return;
      }

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) =>
            application.id !== id
        )
      );

      console.log(
        "Application deleted from MySQL:",
        id
      );
    } catch (error) {
      console.error(
        "Delete Application Error:",
        error
      );

      alert(
        "Could not connect to backend."
      );
    }
  };

  // ===============================
  // RESET FORM
  // ===============================

  const resetForm = () => {
    setCompany("");
    setPosition("");
    setDate("");
    setStatus("Applied");
    setEditingId(null);
    setShowForm(false);
    setSaving(false);
  };

  // ===============================
  // FORMAT DATE
  // ===============================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const dateObject = new Date(dateValue);

    if (isNaN(dateObject.getTime())) {
      return dateValue;
    }

    return dateObject.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="dashboard-logo">

          <span className="logo-icon">
            J
          </span>

          JobTrack

        </div>

        <nav className="sidebar-nav">

          <a
            href="/dashboard"
            className="active"
          >
            🏠
            <span>Dashboard</span>
          </a>

          <a href="#">
            📋
            <span>Applications</span>
          </a>

          <a href="#">
            📅
            <span>Interviews</span>
          </a>

          <a href="#">
            ⭐
            <span>Offers</span>
          </a>

        </nav>

        <div className="sidebar-bottom">

          <a href="#">
            ⚙️
            <span>Settings</span>
          </a>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪
            <span>Log out</span>
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Here's what's happening with your job search.
            </p>

          </div>

          <div className="user-profile">

            <div className="user-avatar">

              {savedUser?.name
                ? savedUser.name
                    .charAt(0)
                    .toUpperCase()
                : "S"}

            </div>

            <div>

              <strong>
                {savedUser?.name || "Sayantan"}
              </strong>

              <small>
                Job Seeker
              </small>

            </div>

          </div>

        </header>


        {/* STATS */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>

              <span>
                Total Applications
              </span>

              <strong>
                {applications.length}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <span>
                Interviews
              </span>

              <strong>
                {
                  applications.filter(
                    (app) =>
                      app.status ===
                      "Interview"
                  ).length
                }
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⭐
            </div>

            <div>

              <span>
                Offers
              </span>

              <strong>
                {
                  applications.filter(
                    (app) =>
                      app.status ===
                      "Offer"
                  ).length
                }
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {
                  applications.filter(
                    (app) =>
                      app.status ===
                      "Applied"
                  ).length
                }
              </strong>

            </div>

          </div>

        </section>


        {/* APPLICATION SECTION */}

        <section className="applications-section">

          <div className="section-top">

            <div>

              <h2>
                Recent Applications
              </h2>

              <p>
                Keep track of your latest job applications.
              </p>

              {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "10px",
                  }}
                >
                  {error}
                </p>
              )}

            </div>

            <button
              className="add-job-btn"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              disabled={saving}
            >
              + Add Application
            </button>

          </div>


          {/* ADD / EDIT FORM */}

          {showForm && (

            <div className="add-application-form">

              <h2>
                {editingId
                  ? "Edit Application"
                  : "Add New Application"}
              </h2>

              <form
                onSubmit={
                  editingId
                    ? handleUpdateApplication
                    : handleAddApplication
                }
              >

                <div className="form-group">

                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) =>
                      setCompany(
                        e.target.value
                      )
                    }
                    disabled={saving}
                  />

                </div>


                <div className="form-group">

                  <label>
                    Job Position
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={position}
                    onChange={(e) =>
                      setPosition(
                        e.target.value
                      )
                    }
                    disabled={saving}
                  />

                </div>


                <div className="form-group">

                  <label>
                    Date Applied
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(
                        e.target.value
                      )
                    }
                    max={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    disabled={saving}
                  />

                </div>


                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value
                      )
                    }
                    disabled={saving}
                  >

                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Interview">
                      Interview
                    </option>

                    <option value="Offer">
                      Offer
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>

                  </select>

                </div>


                <div className="form-buttons">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={saving}
                  >
                    {saving
                      ? editingId
                        ? "Updating..."
                        : "Saving..."
                      : editingId
                      ? "Update Application"
                      : "Save Application"}
                  </button>

                </div>

              </form>

            </div>

          )}


          {/* APPLICATION TABLE */}

          <div className="application-table">

            <div className="table-header">

              <span>
                Company
              </span>

              <span>
                Position
              </span>

              <span>
                Date Applied
              </span>

              <span>
                Status
              </span>

              <span>
                Action
              </span>

            </div>


            {applications.length === 0 && !error ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                No applications found.
              </div>
            ) : (
              applications.map(
                (application) => (

                  <div
                    className="table-row"
                    key={application.id}
                  >

                    <div className="company">

                      <div className="table-company-icon">

                        {application.company
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <strong>
                        {application.company}
                      </strong>

                    </div>


                    <span>
                      {application.position}
                    </span>


                    <span>
                      {formatDate(
                        application.date_applied ||
                          application.date
                      )}
                    </span>


                    <span
                      className={`table-status ${application.status.toLowerCase()}`}
                    >
                      {application.status}
                    </span>


                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditApplication(
                            application
                          )
                        }
                        title="Edit application"
                        disabled={saving}
                      >
                        ✏️
                      </button>


                      <button
                        className="action-btn"
                        onClick={() =>
                          handleDeleteApplication(
                            application.id
                          )
                        }
                        title="Delete application"
                        disabled={saving}
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                )
              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;