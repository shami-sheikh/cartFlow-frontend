import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addUser, fetchAllUsers, deleteUser, updateUser } from "../../redux/slices/adminUserSlice";

const UserManagement = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth user for admin check
  const { user: authUser, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  
  // Get admin users state
  const { users, loading, error } = useSelector((state) => state.adminUsers);

  useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Fetch users when component mounts
  useEffect(() => {
    if (authUser && authUser.role === "admin") {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, authUser]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const promise = dispatch(addUser(data)).unwrap();
    
    toast.promise(promise, {
      loading: 'Adding user...',
      success: () => {
        reset();
        return 'User added successfully!';
      },
      error: (error) => {
        return error.message || 'Failed to add user';
      },
    });
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      const promise = dispatch(deleteUser(userToDelete._id)).unwrap();
      
      toast.promise(promise, {
        loading: 'Deleting user...',
        success: () => {
          setShowDeleteModal(false);
          setUserToDelete(null);
          return 'User deleted successfully!';
        },
        error: (error) => {
          return error.message || 'Failed to delete user';
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleRoleChange = (userId, newRole) => {
    const promise = dispatch(updateUser({ id: userId, userData: { role: newRole } })).unwrap();
    
    toast.promise(promise, {
      loading: 'Updating user role...',
      success: 'User role updated successfully!',
      error: (error) => {
        return error.message || 'Failed to update user role';
      },
    });
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-bold mb-10 text-center text-white">
          User <span className="text-yellow-400">Management</span>
        </h2>

        {/* Add User Form */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 text-white p-8 rounded-2xl shadow-xl mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-yellow-400">
            Add New User
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                  placeholder="Enter Name"
                />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-red-400 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2 text-gray-300">
                  Role
                </label>
                <select
                  id="role"
                  {...register("role", { required: true })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "+ Add User"}
            </button>
          </form>
        </div>

        {/* Existing Users Table */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-semibold mb-6 text-white">Existing Users</h3>
          <div className="overflow-x-auto rounded-lg">
            {loading ? (
              <div className="text-center py-12 text-yellow-400">Loading users...</div>
            ) : users && users.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="px-3 py-1 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-400 hover:text-red-300 bg-red-900 bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Empty State
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No users found. Add your first user above.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*  Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the user <span className="font-semibold text-yellow-400">"{userToDelete?.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;