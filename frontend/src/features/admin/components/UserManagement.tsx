import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { userApi } from '../api/userApi';
import { UserFormModal } from './UserFormModal';
import type { User, CreateUserData, UpdateUserData } from '../types/user.types';

interface LayoutContext {
    user?: { name: string; role: string };
    dateTime: { time: string; date: string };
}

export const UserManagement = () => {
    const { theme } = useTheme();
    const { dateTime } = useOutletContext<LayoutContext>();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await userApi.getUsers();
            setUsers(response.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (data: CreateUserData | UpdateUserData) => {
        await userApi.createUser(data as CreateUserData);
        await loadUsers();
    };

    const handleUpdateUser = async (data: CreateUserData | UpdateUserData) => {
        if (selectedUser) {
            await userApi.updateUser(selectedUser.id, data as UpdateUserData);
            await loadUsers();
        }
    };

    const handleDeactivate = async (userId: number) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await userApi.deactivateUser(userId);
                await loadUsers();
            } catch (err: any) {
                alert(err.response?.data?.message || 'Failed to deactivate user');
            }
        }
    };

    const handleActivate = async (userId: number) => {
        try {
            await userApi.activateUser(userId);
            await loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to activate user');
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-4">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        User Management
                    </h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Create, edit, and manage user accounts
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {dateTime.time}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {dateTime.date}
                    </p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:border-gray-400`}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create User
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                {isLoading ? (
                    <div className="p-12 text-center">
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Loading users...
                        </p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            {searchTerm ? 'No users found matching your search' : 'No users found'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Name
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Email
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Role
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Status
                                    </th>
                                    <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            } font-medium`}>
                                            {user.name}
                                        </td>
                                        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                    : user.role === 'manager'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${user.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark'
                                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Edit
                                            </button>
                                            {user.is_active ? (
                                                <button
                                                    onClick={() => handleDeactivate(user.id)}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleActivate(user.id)}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 transition-colors"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Form Modal */}
            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === 'create' ? handleCreateUser : handleUpdateUser}
                user={selectedUser}
                mode={modalMode}
            />
        </div>
    );
};
