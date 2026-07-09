import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailAlerts: true,
    autoLogout: false,
  });

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSave = () => {
    alert("Settings Saved Successfully!");
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Customize your application preferences.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="space-y-8">

            <div className="flex justify-between items-center">

              <div>
                <h2 className="font-semibold text-lg">
                  Enable Notifications
                </h2>

                <p className="text-gray-500">
                  Receive system notifications.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
                className="w-6 h-6"
              />

            </div>

            <div className="flex justify-between items-center">

              <div>
                <h2 className="font-semibold text-lg">
                  Dark Mode
                </h2>

                <p className="text-gray-500">
                  Switch application theme.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
                className="w-6 h-6"
              />

            </div>

            <div className="flex justify-between items-center">

              <div>
                <h2 className="font-semibold text-lg">
                  Email Alerts
                </h2>

                <p className="text-gray-500">
                  Receive email notifications.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={() => handleToggle("emailAlerts")}
                className="w-6 h-6"
              />

            </div>

            <div className="flex justify-between items-center">

              <div>
                <h2 className="font-semibold text-lg">
                  Auto Logout
                </h2>

                <p className="text-gray-500">
                  Logout after inactivity.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.autoLogout}
                onChange={() => handleToggle("autoLogout")}
                className="w-6 h-6"
              />

            </div>

            <div className="pt-6">

              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
              >
                Save Settings
              </button>

            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Settings;