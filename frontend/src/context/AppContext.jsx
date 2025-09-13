import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from '../config/api';

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Getting Doctors using API
    const getDoctosData = async () => {
        try {
            setLoading(true)
            const { data } = await api.get('/api/doctor/list')
            
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching doctors:', error)
        } finally {
            setLoading(false)
        }
    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {
        try {
            setLoading(true)
            console.log('Loading user profile with token:', token)
            const { data } = await api.get('/api/user/get-profile')
            
            if (data.success) {
                console.log('Profile data received:', data.user)
                setUserData(data.user)
            } else {
                console.error('Failed to load profile:', data.message)
                toast.error(data.message || 'Failed to load profile')
                // If profile fetch fails, clear token
                localStorage.removeItem('token')
                setToken('')
                setUserData(null)
            }
        } catch (error) {
            console.error('Error loading user profile:', error)
            toast.error(error.response?.data?.message || 'Error loading profile')
            // On error, clear user data
            localStorage.removeItem('token')
            setToken('')
            setUserData(null)
        } finally {
            setLoading(false)
        }
    }

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUserData(null)
        toast.success('Logged out successfully')
    }

    // Listen for refresh message from admin panel
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data === 'REFRESH_DOCTORS') {
                getDoctosData()
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    // Initial fetch of doctors
    useEffect(() => {
        getDoctosData()
    }, [])

    // Periodic refresh of doctors (every 5 minutes)
    useEffect(() => {
        const refreshInterval = setInterval(getDoctosData, 300000) // 5 minutes
        return () => clearInterval(refreshInterval)
    }, [])

    // Load user profile when token changes
    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(null)
            setLoading(false)
        }
    }, [token])

    const value = {
        doctors,
        getDoctosData,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
        handleLogout,
        loading
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;