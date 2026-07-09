import { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const initialEmployees = [
  {
    id: "EMP001",
    name: "John Smith",
    department: "IT",
    role: "Software Engineer",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Sarah Johnson",
    department: "HR",
    role: "HR Executive",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Michael Brown",
    department: "Finance",
    role: "Accountant",
    status: "Inactive",
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    department: "Sales",
    role: "Sales Manager",
    status: "Active",
  },
  {
    id: "EMP005",
    name: "David Wilson",
    department: "Marketing",
    role: "Marketing Executive",
    status: "Inactive",
  },
];

const EmployeeTable = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (employee) => {
    alert(
      `Employee Details

ID: ${employee.id}
Name: ${employee.name}
Department: ${employee.department}
Role: ${employee.role}
Status: ${employee.status}`
    );
  };

  const handleEdit = (employee) => {
    alert(`Edit Employee: ${employee.name}\n\n(Backend Integration Later)`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Employee List
        </h2>

        <input
          type="text"
          placeholder="Search Employee..."
          className="border rounded-lg px-4 py-2 w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredEmployees.map((emp) => (

              <tr
                key={emp.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">{emp.id}</td>

                <td className="p-4 font-semibold">{emp.name}</td>

                <td className="p-4">{emp.department}</td>

                <td className="p-4">{emp.role}</td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      emp.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {emp.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-4">

                    <button
                      onClick={() => handleView(emp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default EmployeeTable;