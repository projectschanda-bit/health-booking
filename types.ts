
export type Role = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  medicalNotes?: string; // For patients
  specialty?: string; // For doctors
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  bio: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO string
  duration: 30 | 60; // minutes
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  notes?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'reminder' | 'digest' | 'system';
  title: string;
  message: string;
  date: string; // ISO string
  read: boolean;
}

export const EST_TIMEZONE = 'America/New_York';
