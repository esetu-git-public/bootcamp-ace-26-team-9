import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaUserTie } from "react-icons/fa";
import { getAuthUser } from "../../services/authService";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin",
    employeeId: "EMP001",
    email: "admin@gmail.com",
    phone: "+91 9876543210",
    department: "Human Resources",
    role: "HR Manager",
  });

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      const updatedProfile = {
        ...profile,
        name: user.name || "Admin",
        email: user.email || "admin@company.com",
        employeeId: "EMP" + (user.id ? user.id.slice(0, 4).toUpperCase() : "001"),
        role: user.role || "HR Manager"
      };
      setProfile(updatedProfile);
      setFormData(updatedProfile);
    }
  }, []);

  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfile(formData);
    setShowModal(false);
    alert("Profile Updated Successfully");
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">

        {/* Page Title */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account information
          </p>

        </div>

        {/* Profile Card */}

        <div className="bg-white rounded-3xl shadow-lg p-10">

          <div className="flex flex-col md:flex-row gap-10">

            {/* Left */}

            <div className="flex flex-col items-center">

              <FaUserCircle className="text-blue-600 text-9xl" />

              <h2 className="text-3xl font-bold mt-4">
                {profile.name}
              </h2>

              <p className="text-gray-500">
                {profile.role}
              </p>

            </div>

            {/* Right */}

            <div className="flex-1 grid md:grid-cols-2 gap-8">

              <div>

                <div className="flex items-center gap-3 mb-6">
                  <FaUserTie className="text-blue-600" />
                  <div>
                    <p className="text-gray-500">Employee ID</p>
                    <h3 className="font-semibold">{profile.employeeId}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <FaBuilding className="text-green-600" />
                  <div>
                    <p className="text-gray-500">Department</p>
                    <h3 className="font-semibold">
                      {profile.department}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-purple-600" />
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <h3 className="font-semibold">{profile.phone}</h3>
                  </div>
                </div>

              </div>

              <div>

                <div className="flex items-center gap-3 mb-6">
                  <FaEnvelope className="text-red-600" />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <h3 className="font-semibold">
                      {profile.email}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaUserTie className="text-orange-600" />
                  <div>
                    <p className="text-gray-500">Role</p>
                    <h3 className="font-semibold">
                      {profile.role}
                    </h3>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Buttons */}

          <div className="mt-10 flex gap-4">

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
            >
              Edit Profile
            </button>

            <button
              onClick={() => alert("Change Password Feature Coming Soon")}
              className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-xl"
            >
              Change Password
            </button>

          </div>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white shadow rounded-2xl p-6">

            <h3 className="text-gray-500">
              Employees Managed
            </h3>

            <h1 className="text-4xl font-bold text-blue-600 mt-2">
              1245
            </h1>

          </div>

          <div className="bg-white shadow rounded-2xl p-6">

            <h3 className="text-gray-500">
              Predictions Generated
            </h3>

            <h1 className="text-4xl font-bold text-green-600 mt-2">
              356
            </h1>

          </div>

          <div className="bg-white shadow rounded-2xl p-6">

            <h3 className="text-gray-500">
              Reports Generated
            </h3>

            <h1 className="text-4xl font-bold text-purple-600 mt-2">
              24
            </h1>

          </div>

        </div>

        {/* Edit Modal */}

        {showModal && (

          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-8 w-full max-w-lg">

              <h2 className="text-2xl font-bold mb-6">
                Edit Profile
              </h2>

              <div className="space-y-4">

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  placeholder="Name"
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  placeholder="Email"
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  placeholder="Phone"
                />

                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  placeholder="Department"
                />

              </div>

              <div className="flex justify-end gap-4 mt-8">

                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </MainLayout>
  );
};

export default Profile;