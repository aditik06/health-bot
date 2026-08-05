function userToJson(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    age: row.age,
    cycleStartDate: row.cycle_start_date,
    cycleLength: row.cycle_length,
    pregnancyStatus: row.pregnancy_status,
    pregnancyStartDate: row.pregnancy_start_date,
    doctorName: row.doctor_name,
    doctorPhone: row.doctor_phone,
    hospitalName: row.hospital_name,
    hospitalPhone: row.hospital_phone,
    emergencyContact: row.emergency_contact,
    emergencyPhone: row.emergency_phone,
    darkMode: !!row.dark_mode,
    dietaryNotes: row.dietary_notes,
    emailVerified: !!row.email_verified,
    createdAt: row.created_at
  };
}

function appointmentToJson(row) {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    type: row.type,
    doctor: row.doctor,
    notes: row.notes,
    reminder: !!row.reminder
  };
}

function medicationToJson(row) {
  return {
    id: row.id,
    name: row.name,
    dosage: row.dosage,
    frequency: row.frequency,
    time: row.time,
    purpose: row.purpose,
    notes: row.notes,
    active: !!row.active,
    reminder: !!row.reminder,
    createdAt: row.created_at
  };
}

function prescriptionToJson(row) {
  return {
    id: row.id,
    filename: row.filename,
    mimeType: row.mime_type,
    uploadedAt: row.uploaded_at,
    url: `/api/prescriptions/${row.id}/file`
  };
}

function diaryToJson(row) {
  return {
    id: row.id,
    date: row.date,
    mood: row.mood,
    energy: row.energy,
    title: row.title,
    content: row.content,
    symptoms: row.symptoms ? JSON.parse(row.symptoms) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
    createdAt: row.created_at
  };
}

function weightToJson(row) {
  return { id: row.id, date: row.date, weight: row.weight };
}

function kickSessionToJson(row) {
  const kicks = row.kicks_json ? JSON.parse(row.kicks_json) : [];
  return {
    id: row.id,
    date: row.date,
    kicks,
    count: kicks.length,
    startedAt: row.started_at
  };
}

function contractionToJson(row) {
  return {
    id: row.id,
    startTime: row.start_time,
    endTime: row.end_time,
    durationSec: row.duration_sec
  };
}

function cycleLogToJson(row) {
  return { id: row.id, startDate: row.start_date, length: row.length };
}

module.exports = {
  userToJson,
  appointmentToJson,
  medicationToJson,
  prescriptionToJson,
  diaryToJson,
  weightToJson,
  kickSessionToJson,
  contractionToJson,
  cycleLogToJson
};
