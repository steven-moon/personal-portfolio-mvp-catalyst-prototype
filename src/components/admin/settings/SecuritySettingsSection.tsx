import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/user';
import { Trash2, Edit, Plus, Save, X, Key } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Local storage key for users
const USERS_STORAGE_KEY = 'portfolio_users';

// Default admin user
const defaultAdmin: User = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role: UserRole.ADMIN,
  createdAt: new Date('2023-01-01').toISOString(),
  lastLogin: new Date().toISOString(),
};

const SecuritySettingsSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: UserRole.VIEWER,
    password: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [changePassword, setChangePassword] = useState<{id: string, password: string} | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      let loadedUsers: User[] = [];
      
      if (storedUsers) {
        loadedUsers = JSON.parse(storedUsers);
      } else {
        // Initialize with default admin if no users exist
        loadedUsers = [defaultAdmin];
        saveUsers(loadedUsers);
      }
      
      // Ensure there's always an admin user
      const hasAdmin = loadedUsers.some(user => user.role === UserRole.ADMIN);
      if (!hasAdmin) {
        loadedUsers.push(defaultAdmin);
        saveUsers(loadedUsers);
      }
      
      setUsers(loadedUsers);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
      setUsers([defaultAdmin]);
    } finally {
      setLoading(false);
    }
  };

  const saveUsers = (usersToSave: User[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersToSave));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.name || !newUser.password) {
        toast.error('Email, name, and password are required');
        return;
      }

      // Check if email already exists
      if (users.some(u => u.email === newUser.email)) {
        toast.error('A user with this email already exists');
        return;
      }

      // Check if trying to add an admin when one already exists
      if (newUser.role === UserRole.ADMIN && users.some(u => u.role === UserRole.ADMIN)) {
        toast.error('Only one admin user is allowed');
        return;
      }

      const newUserData: User = {
        id: Date.now().toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        // In a real app, you would hash the password here
      };

      const updatedUsers = [...users, newUserData];
      const success = saveUsers(updatedUsers);

      if (success) {
        toast.success('User added successfully');
        setUsers(updatedUsers);
        setNewUser({
          email: '',
          name: '',
          role: UserRole.VIEWER,
          password: '',
        });
        setShowAddForm(false);
      } else {
        toast.error('Failed to add user');
      }
    } catch (error) {
      toast.error('An error occurred while adding the user');
      console.error(error);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      // Check if changing email to one that already exists
      if (users.some(u => u.email === editingUser.email && u.id !== editingUser.id)) {
        toast.error('A user with this email already exists');
        return;
      }

      // Check if trying to change the role of the only admin
      const admins = users.filter(u => u.role === UserRole.ADMIN);
      if (
        admins.length === 1 &&
        admins[0].id === editingUser.id &&
        editingUser.role !== UserRole.ADMIN
      ) {
        toast.error('Cannot change the role of the only admin user');
        return;
      }

      const updatedUsers = users.map(u => 
        u.id === editingUser.id ? { ...editingUser } : u
      );
      
      const success = saveUsers(updatedUsers);

      if (success) {
        toast.success('User updated successfully');
        setUsers(updatedUsers);
        setEditingUser(null);
        setShowEditModal(false);
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.error('An error occurred while updating the user');
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Find the user to delete
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    // Check if it's an admin
    if (userToDelete.role === UserRole.ADMIN) {
      toast.error('The admin user cannot be deleted');
      return;
    }

    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      const success = saveUsers(updatedUsers);
      
      if (success) {
        toast.success('User deleted successfully');
        setUsers(updatedUsers);
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the user');
      console.error(error);
    }
  };

  const openPasswordModal = (userId: string) => {
    setChangePassword({ id: userId, password: '' });
    setShowPasswordModal(true);
  };

  const handleChangePassword = () => {
    if (!changePassword || !changePassword.password) {
      toast.error('Password cannot be empty');
      return;
    }

    try {
      // In a real app, you would hash the password here
      // For demo purposes, we're just showing a success message
      // In a real implementation, you would update the user record with the hashed password
      
      // Note: For security reasons, we don't actually store the password in localStorage
      // This is just a UI demonstration
      
      toast.success('Password updated successfully');
      setChangePassword(null);
      setShowPasswordModal(false);
    } catch (error) {
      toast.error('An error occurred while updating the password');
      console.error(error);
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case UserRole.EDITOR:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case UserRole.VIEWER:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <NeumorphicButton
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-2 text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add User
        </NeumorphicButton>
      </div>

      {showAddForm && (
        <div className="neu-flat p-4 space-y-4">
          <h3 className="font-medium">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="User Name"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
              >
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.EDITOR}>Editor</option>
                <option value={UserRole.VIEWER}>Viewer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <NeumorphicButton
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 text-sm"
              variant="secondary"
            >
              Cancel
            </NeumorphicButton>
            <NeumorphicButton
              onClick={handleAddUser}
              className="px-3 py-2 text-sm"
            >
              Add User
            </NeumorphicButton>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left">
              <tr className="border-b dark:border-gray-700">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Last Login</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b dark:border-gray-700">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openPasswordModal(user.id)}
                        className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                        title="Change Password"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      {user.role !== UserRole.ADMIN && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details. Changes will be saved when you click the Save button.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                  disabled={
                    editingUser.role === UserRole.ADMIN && 
                    users.filter(u => u.role === UserRole.ADMIN).length === 1
                  }
                >
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.EDITOR}>Editor</option>
                  <option value={UserRole.VIEWER}>Viewer</option>
                </select>
                {editingUser.role === UserRole.ADMIN && 
                  users.filter(u => u.role === UserRole.ADMIN).length === 1 && (
                  <p className="text-xs text-amber-600 mt-1">
                    Cannot change role as this is the only admin user.
                  </p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-end pt-4">
            <NeumorphicButton
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
              className="px-3 py-2 text-sm"
              variant="secondary"
            >
              Cancel
            </NeumorphicButton>
            <NeumorphicButton
              onClick={handleUpdateUser}
              className="px-3 py-2 text-sm ml-2"
            >
              Save Changes
            </NeumorphicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter a new password for this user.
            </DialogDescription>
          </DialogHeader>
          
          {changePassword && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={changePassword.password}
                  onChange={(e) => setChangePassword({ ...changePassword, password: e.target.value })}
                  className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Note: For demo purposes, passwords are not actually stored.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-end pt-4">
            <NeumorphicButton
              onClick={() => {
                setShowPasswordModal(false);
                setChangePassword(null);
              }}
              className="px-3 py-2 text-sm"
              variant="secondary"
            >
              Cancel
            </NeumorphicButton>
            <NeumorphicButton
              onClick={handleChangePassword}
              className="px-3 py-2 text-sm ml-2"
            >
              Update Password
            </NeumorphicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4 p-4 neu-flat bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded-lg">
        <p className="text-sm">
          <strong>Note:</strong> User management in this demo is for display purposes only. 
          All changes are stored in your browser's localStorage and will persist between sessions.
          The admin user cannot be deleted, but their email and password can be changed.
        </p>
      </div>
    </div>
  );
};

export default SecuritySettingsSection; 