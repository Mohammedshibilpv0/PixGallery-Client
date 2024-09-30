import { useState } from 'react';
import { validateName, validateEmail, validatePhone, validatePassword } from '../util/validation';
import { login, register } from '../api/userApi/userApi';
import Loading from '../Componets/loading/loading';
import useShowToast from '../Hook/toaster';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reduxLogin } from '../store/userSlice';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string; 
    name: string;
    phone: string;
}

interface Errors {
    email?: string;
    password?: string;
    confirmPassword?: string; 
    name?: string;
    phone?: string;
}

const initailData={
        email: '',
        password: '',
        confirmPassword: '', 
        name: '',
        phone: ''
}

const Auth = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>(initailData);
    const [errors, setErrors] = useState<Errors>({});
    const [loading,setLoading]=useState<boolean>(false)
    const Toaster = useShowToast()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        let errorMsg = '';
        switch (name) {
            case 'name':
                if (!validateName(value)) {
                    errorMsg = 'Name must only contain alphabets and minimum 3 letters.';
                }
                break;
            case 'phone':
                if (!validatePhone(value)) {
                    errorMsg = 'Phone number must contain exactly 10 digits.';
                }
                break;
            case 'email':
                if (!validateEmail(value)) {
                    errorMsg = 'Invalid email format. Use @gmail.com, @outlook.com, or @apple.com.';
                }
                break;
            case 'password':
                if (!validatePassword(value)) {
                    errorMsg = 'Password must be at least 6 characters long, include at least 1 uppercase letter, 1 number, and 1 special character.';
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) {
                    errorMsg = 'Passwords do not match.';
                }
                break;
            default:
                break;
        }

        setErrors(prevState => ({ ...prevState, [name]: errorMsg }));
    };

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Errors = {};
        
        if (!isLogin) {
            if (!validateName(formData.name)) {
                newErrors.name = 'Name must only contain alphabets.';
            }
            if (!validatePhone(formData.phone)) {
                newErrors.phone = 'Phone number must contain exactly 10 digits.';
            }
            if (!isLogin && formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = 'Passwords do not match.'; 
            }
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format. Use @gmail.com, @outlook.com, or @apple.com.';
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters long, include at least 1 uppercase letter, 1 number, and 1 special character.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true)
        try{
            if(!isLogin){
                const response = await register(formData)
                if(response.status=='error'){
                    console.log(response.message)
                    Toaster(response.message,'error',true)
                    setLoading(false)
                    return
                }
                Toaster(response.message,'success',true)
                setLoading(false)
                setIsLogin(true)
                setFormData(initailData)
            }else{
                const response = await login(formData.email,formData.password)
                console.log(response)
                if(response.status=='error'){
                    Toaster(response.message,'error',true)
                    setLoading(false)
                    return
                }else if(response.status=='success'){
                    dispatch(reduxLogin({_id:response.data.user._id,name:response.data.user.name,email:response.data.user.email,phone:response.data.user.phone}))
                    Toaster(response.message,'success',true)
                    setLoading(false)
                    navigate('/')
                }
               
            }
        }catch(err){
            setLoading(false)
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '', 
            name: '',
            phone: ''
        });
        setErrors({});
    };

    return (
        <section className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {isLogin ? "Sign in to your account" : "Create an account"}
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                                </div>
                              
                            </>
                        )}
                        <div>
                            
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}

                            <div className="flex space-x-2"> 
                                    <div className="flex-1">
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                        <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                                    </div>
                                    {!isLogin && <div className="flex-1">
                                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                        <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                        {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                                    </div>}
                                </div>
                        </div>
                        <button type={loading?undefined:'submit'} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {loading? <Loading/>:isLogin ? "Sign in" : "Create account"}
                        </button>
                        <p className="text-sm font-light flex text-gray-500 dark:text-gray-400">
                            {isLogin ? "Don't have an account yet? " : "Already have an account? "}
                            <p className="font-medium text-primary-600 hover:underline dark:text-primary-500 " onClick={toggleMode}>
                                <span className='flex cursor-pointer ms-1'>{isLogin ? "Sign up" : "Sign in"}</span>
                            </p>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Auth;
