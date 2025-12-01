
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Doctor, Appointment, Role, AppNotification } from './types';
import { auth, googleProvider, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

// Mock Data (kept for display purposes for un-authed parts or doctor lists)
const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Bennett',
    email: 'sarah@vitalcare.com',
    role: 'doctor',
    specialty: 'Cardiologist',
    bio: 'Dr. Bennett has over 15 years of experience in preventative cardiology and women’s heart health.',
    avatar: 'https://picsum.photos/id/64/200/200',
  },
  {
    id: 'd2',
    name: 'Dr. James Wu',
    email: 'james@vitalcare.com',
    role: 'doctor',
    specialty: 'Dermatologist',
    bio: 'Specializing in both cosmetic and medical dermatology with a focus on holistic skin care.',
    avatar: 'https://picsum.photos/id/91/200/200',
  },
  {
    id: 'd3',
    name: 'Dr. Emily Carter',
    email: 'emily@vitalcare.com',
    role: 'doctor',
    specialty: 'General Practitioner',
    bio: 'A compassionate family doctor dedicated to long-term patient wellness and lifestyle medicine.',
    avatar: 'https://picsum.photos/id/338/200/200',
  }
];

interface StoreContextType {
  user: User | null;
  loading: boolean;
  doctors: Doctor[];
  appointments: Appointment[];
  notifications: AppNotification[];
  login: (email: string, password: string, role: Role) => Promise<void>;
  loginWithGoogle: () => Promise<Role>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  bookAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => string;
  markAppointmentAsPaid: (id: string) => void;
  cancelAppointment: (id: string) => void;
  updateDoctorAvailability: (doctorId: string, isAvailable: boolean) => void;
  addDoctor: (doctor: Doctor) => void;
  removeDoctor: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Strict email verification check
        if (!firebaseUser.emailVerified) {
           setUser(null);
           setLoading(false);
           return;
        }

        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          let userSnap = await getDoc(userRef);

          // If user doc doesn't exist (e.g. legacy user or direct login), create it
          if (!userSnap.exists()) {
            let assignedRole: Role = 'patient';
            let assignedName = firebaseUser.displayName || 'User';
            let avatar = firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${assignedName}&background=random`;
            let extraProps = {};

            // Fallback logic to assign role based on Mock List or email format
            if (firebaseUser.email?.includes('admin')) {
              assignedRole = 'admin';
              assignedName = 'Administrator';
            } else {
                const docMock = doctors.find(d => d.email === firebaseUser.email);
                if (docMock) {
                    assignedRole = 'doctor';
                    assignedName = docMock.name;
                    avatar = docMock.avatar || avatar;
                    extraProps = { specialty: docMock.specialty, bio: docMock.bio };
                }
            }

            const initialData = {
              name: assignedName,
              email: firebaseUser.email || '',
              role: assignedRole,
              avatar: avatar,
              medicalNotes: 'No notes available yet.',
              ...extraProps
            };

            await setDoc(userRef, initialData);
            userSnap = await getDoc(userRef); // Refresh snap
          }

          if (userSnap.exists()) {
             setUser({ id: firebaseUser.uid, ...userSnap.data() } as User);
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [doctors]);

  // Initial Mock Appointments
  useEffect(() => {
    // Determine a date that is tomorrow for testing the reminder system
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    
    // Add an appointment for "Today" as well for doctor digest testing
    const today = new Date();
    today.setHours(15, 0, 0, 0);

    setAppointments([
      {
        id: 'appt_1',
        patientId: 'p1',
        doctorId: 'd1',
        date: tomorrow.toISOString(),
        duration: 30,
        status: 'confirmed',
        notes: 'Regular checkup'
      },
      {
        id: 'appt_2',
        patientId: 'p2',
        doctorId: 'd1',
        date: today.toISOString(),
        duration: 30,
        status: 'confirmed',
        notes: 'Skin rash consultation'
      }
    ]);
  }, []);

  // --- REMINDER SYSTEM LOGIC ---
  useEffect(() => {
    if (!user || appointments.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      
      // 1. Patient Reminders: 24 Hours Before
      if (user.role === 'patient') {
        appointments.forEach(appt => {
          if (appt.patientId === user.id && appt.status === 'confirmed') {
            const apptDate = new Date(appt.date);
            const timeDiff = apptDate.getTime() - now.getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            // If appointment is between 23 and 25 hours away
            if (hoursDiff > 0 && hoursDiff <= 25) {
              const notifId = `reminder_${appt.id}`;
              
              setNotifications(prev => {
                // Prevent duplicate notifications
                if (prev.some(n => n.id === notifId)) return prev;

                // Simulate Email Sending
                console.log(`[EMAIL SIMULATION] Sending 24h Reminder to ${user.email} for appointment on ${apptDate.toLocaleString()}`);

                return [...prev, {
                  id: notifId,
                  userId: user.id,
                  type: 'reminder',
                  title: 'Upcoming Appointment Reminder',
                  message: `You have an appointment tomorrow at ${apptDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`,
                  date: new Date().toISOString(),
                  read: false
                }];
              });
            }
          }
        });
      }

      // 2. Doctor Daily Digest
      if (user.role === 'doctor') {
        const todayStr = now.toDateString();
        const digestId = `digest_${user.id}_${todayStr}`;

        // Check if we already generated a digest for today
        setNotifications(prev => {
           if (prev.some(n => n.id === digestId)) return prev;

           // Find appointments for this doctor today
           const todayAppts = appointments.filter(appt => {
             const apptDate = new Date(appt.date);
             return appt.doctorId === user.id && 
                    appt.status === 'confirmed' &&
                    apptDate.toDateString() === todayStr;
           });

           if (todayAppts.length > 0) {
             // Simulate Email Sending
             console.log(`[EMAIL SIMULATION] Sending Daily Digest to ${user.email}. Count: ${todayAppts.length}`);

             return [...prev, {
               id: digestId,
               userId: user.id,
               type: 'digest',
               title: 'Daily Appointment Digest',
               message: `You have ${todayAppts.length} confirmed appointment(s) scheduled for today.`,
               date: new Date().toISOString(),
               read: false
             }];
           }
           return prev;
        });
      }
    };

    // Run check immediately
    checkReminders();
    
    // Optional: Run every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);

  }, [user, appointments]);


  const login = async (email: string, password: string, role: Role) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        await signOut(auth);
        throw new Error('email-not-verified');
      }
      // Note: onAuthStateChanged will handle fetching the Firestore data and setting the user
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<Role> => {
    try {
      await signInWithPopup(auth, googleProvider);
      const currentUser = auth.currentUser;
      if (currentUser?.email?.includes('admin')) return 'admin';
      const doc = doctors.find(d => d.email === currentUser?.email);
      if (doc) return 'doctor';
      return 'patient';
    } catch (error: any) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Auth Profile
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Create Firestore Document immediately
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
        role: 'patient', // Default role for public registration
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
        medicalNotes: 'No notes available yet.'
      });

      await sendEmailVerification(userCredential.user);
      await signOut(auth); // Force sign out so they have to login after verifying
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Reset password failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), data);
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user || !auth.currentUser) return;
    try {
      // 1. Delete Firestore Data
      await deleteDoc(doc(db, 'users', user.id));
      // 2. Delete Auth Account
      await deleteUser(auth.currentUser);
      setUser(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const bookAppointment = (appt: Omit<Appointment, 'id' | 'status'>): string => {
    const id = Math.random().toString(36).substring(7);
    const newAppt: Appointment = {
      ...appt,
      id,
      status: 'pending',
    };
    setAppointments(prev => [...prev, newAppt]);
    return id;
  };

  const markAppointmentAsPaid = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
    
    // Generate an immediate system notification for payment success
    if (user) {
        setNotifications(prev => [...prev, {
            id: `pay_${Date.now()}`,
            userId: user.id,
            type: 'system',
            title: 'Booking Confirmed',
            message: 'Your payment was successful and appointment is confirmed.',
            date: new Date().toISOString(),
            read: false
        }]);
    }
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const updateDoctorAvailability = (doctorId: string, isAvailable: boolean) => {
    alert("Schedule updated! (Simulation)");
  };

  const addDoctor = (doctor: Doctor) => {
    setDoctors(prev => [...prev, doctor]);
  };

  const removeDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
      setNotifications([]);
  };

  return (
    <StoreContext.Provider value={{
      user,
      loading,
      doctors,
      appointments,
      notifications,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
      updateUserProfile,
      deleteAccount,
      bookAppointment,
      markAppointmentAsPaid,
      cancelAppointment,
      updateDoctorAvailability,
      addDoctor,
      removeDoctor,
      markNotificationAsRead,
      clearAllNotifications
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
