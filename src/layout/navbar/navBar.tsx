import { useState } from 'react';
import { LogOut, Key } from 'lucide-react';
import { RootState } from '../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { reduxLogout } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import ResetPasswordModal from '../../Componets/ResetPassword/ResetPasswordModal';

const NavBar = () => {
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);

  const isLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(reduxLogout());
    navigate('/login');
  };

  const openResetPasswordModal = () => setResetPasswordModalOpen(true);
  const closeResetPasswordModal = () => setResetPasswordModalOpen(false);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 sticky">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-white cursor-pointer">
            PixGallery
          </span>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={openResetPasswordModal}
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-500"
                >
                  <Key size={20} className="mr-2" />
                  <span>Reset Password</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <LogOut size={20} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>


      <ResetPasswordModal isOpen={isResetPasswordModalOpen} onClose={closeResetPasswordModal} />
    </>
  );
};

export default NavBar;
