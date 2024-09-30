import { useState } from 'react';
import { validatePassword } from '../../util/validation';
import {  useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { resetPassword } from '../../api/userApi/userApi';
import useShowToast from '../../Hook/toaster';
import Loading from '../loading/loading';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProps) => {
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading,setLoading]=useState<boolean>(false)
    const [error, setError] = useState('');
    const Toast = useShowToast()
    const userId = useSelector((state: RootState) => state.user.userInfo?._id);
    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }
        if (!validatePassword(newPassword)) {
            setError ( 'Password must be at least 6 characters long, include at least 1 uppercase letter, 1 number, and 1 special character.')
            return
        }

        try{
            setLoading(true)
            const response= await resetPassword(userId??'',currentPassword,newPassword)
            if(response.status=='error'){
                setLoading(false)
                Toast(response.message,'error',true)
            }else if(response.status=='success'){
                Toast(response.message,'success',true)
                setNewPassword('')
                setCurrentPassword('')
                setConfirmPassword('')
                setError('')
                onClose()
            }
        }catch(err){
            setLoading(false)
        }


    };

    const closeModal = ()=>{
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        onClose()
    }
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Reset Password</h2>

                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-900 dark:text-white">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type={loading?undefined:'submit'}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-500"
                        >
                            {loading?<Loading/>:'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
