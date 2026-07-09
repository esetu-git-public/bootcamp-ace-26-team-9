import { useState } from "react";

const SettingsForm = () => {
  const [settings, setSettings] = useState({
    companyName: "ABC Pvt Ltd",
    adminName: "Admin",
    email: "admin@gmail.com",
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    alert("Settings Saved Successfully!");
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-2xl shadow-lg p-8"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>

          <label className="block font-semibold mb-2">
            Company Name
          </label>

          <input
            type="text"
            name="companyName"
            value={settings.companyName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Admin Name
          </label>

          <input
            type="text"
            name="adminName"
            value={settings.adminName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

        </div>

      </div>

      <div className="mt-8 space-y-5">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
          />

          Enable Notifications

        </label>

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={handleChange}
          />

          Dark Mode

        </label>

      </div>

      <button
        type="submit"
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
      >
        Save Settings
      </button>

    </form>
  );
};

export default SettingsForm;