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
    return (
      <div className="min-h-screen bg-[#fcfaf6] flex items-center justify-center text-[#8e8577]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf6] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2
          className="text-4xl font-light mb-10 text-center text-[#0f0d0b]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          User Management
        </h2>

        {/* Add User Form */}
        <div className="bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-sm mb-12">
          <h3
            className="text-2xl font-light mb-6 text-center text-[#0f0d0b]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Add New User
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm text-[#0f0d0b] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition-colors"
                  placeholder="Enter Name"
                />
                {errors.name && (
                  <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-[#0f0d0b] mb-2">
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
                  className="w-full px-4 py-3 rounded-lg bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition-colors"
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm text-[#0f0d0b] mb-2">
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
                  className="w-full px-4 py-3 rounded-lg bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] placeholder-[#aba293] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition-colors"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm text-[#0f0d0b] mb-2">
                  Role
                </label>
                <select
                  id="role"
                  {...register("role", { required: true })}
                  className="w-full px-4 py-3 rounded-lg bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] hover:border-[#c9973f]/60 focus:outline-none focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] transition-colors"
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
              className="w-full bg-[#0f0d0b] hover:bg-[#c9973f] text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "+ Add User"}
            </button>
          </form>
        </div>

        {/* Existing Users Table */}
        <div className="bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-sm">
          <h3
            className="text-2xl font-light mb-6 text-[#0f0d0b]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Existing Users
          </h3>
          <div className="overflow-x-auto rounded-lg border border-[#ebdccb]/40">
            {loading ? (
              <div className="text-center py-12 text-[#8e8577]">Loading users...</div>
            ) : users && users.length > 0 ? (
              <table className="min-w-full divide-y divide-[#ebdccb]/60">
                <thead className="bg-[#fcfaf6]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[#8e8577] uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-[#8e8577] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#ebdccb]/40">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#fcfaf6] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#0f0d0b]">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#5c5548]">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-[#fcfaf6] border border-[#e1dacd] text-[#0f0d0b] focus:ring-1 focus:ring-[#c9973f]/40 focus:border-[#c9973f] focus:outline-none hover:border-[#c9973f]/60 transition-colors text-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <p className="text-[#8e8577] text-lg">No users found. Add your first user above.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#ebdccb]/60 p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h3
              className="text-2xl font-light text-[#0f0d0b] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Confirm Deletion
            </h3>
            <p className="text-[#5c5548] mb-8">
              Are you sure you want to delete the user <span className="font-semibold text-[#0f0d0b]">"{userToDelete?.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-6 py-2.5 border border-[#ebdccb] text-[#5c5548] rounded-xl hover:border-[#c9973f]/60 hover:text-[#0f0d0b] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
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