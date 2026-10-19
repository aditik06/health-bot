// Shared request validation. Each rule returns { value } (normalized) or
// { error } - routes collect the first error and answer 400, so bad input
// is rejected up front instead of reaching SQLite (where a wrong type is a
// 500 and a wrong-but-valid-looking value is silently stored).

const PREGNANCY_STATUSES = ['not-pregnant', 'pregnant', 'trying'];
const PHONE_PATTERN = /^[0-9+()\-.\s,;x#*]*$/i;

const fail = (error) => ({ error });
const ok = (value) => ({ value });
const isEmpty = (v) => v === null || v === undefined || v === '';

function isRealDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  // round-trips only if the day exists (rejects 2026-02-31, 2026-13-01, ...)
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function text({ label, max, required = false }) {
  return (v) => {
    if (isEmpty(v)) return required ? fail(`${label} is required`) : ok(null);
    if (typeof v !== 'string') return fail(`${label} must be text`);
    const trimmed = v.trim();
    if (trimmed === '') return required ? fail(`${label} is required`) : ok(null);
    if (trimmed.length > max) return fail(`${label} must be ${max} characters or fewer`);
    return ok(trimmed);
  };
}

function phone({ label }) {
  return (v) => {
    const result = text({ label, max: 30 })(v);
    if (result.error || result.value === null) return result;
    if (!PHONE_PATTERN.test(result.value)) return fail(`${label} can only contain digits, spaces and + ( ) - .`);
    return result;
  };
}

function integer({ label, min, max, nullable = true }) {
  return (v) => {
    if (isEmpty(v)) return nullable ? ok(null) : fail(`${label} is required`);
    // forms submit numbers as strings
    const n = typeof v === 'number' ? v : (typeof v === 'string' && /^-?\d+$/.test(v.trim()) ? Number(v) : NaN);
    if (!Number.isInteger(n)) return fail(`${label} must be a whole number`);
    if (n < min || n > max) return fail(`${label} must be between ${min} and ${max}`);
    return ok(n);
  };
}

function date({ label }) {
  return (v) => {
    if (isEmpty(v)) return ok(null);
    if (typeof v !== 'string' || !isRealDate(v)) return fail(`${label} must be a valid date (YYYY-MM-DD)`);
    return ok(v);
  };
}

function oneOf({ label, values }) {
  return (v) => (values.includes(v) ? ok(v) : fail(`${label} must be one of: ${values.join(', ')}`));
}

function bool({ label }) {
  return (v) => {
    if (typeof v === 'boolean') return ok(v);
    if (v === 0 || v === 1) return ok(v === 1);
    return fail(`${label} must be true or false`);
  };
}

// Editable profile fields, keyed by the JSON name the client uses.
const PROFILE_RULES = {
  name: text({ label: 'Name', max: 100, required: true }),
  age: integer({ label: 'Age', min: 1, max: 120 }),
  cycleStartDate: date({ label: 'Last period start date' }),
  cycleLength: integer({ label: 'Cycle length', min: 15, max: 60, nullable: false }),
  pregnancyStatus: oneOf({ label: 'Pregnancy status', values: PREGNANCY_STATUSES }),
  pregnancyStartDate: date({ label: 'Pregnancy start date' }),
  doctorName: text({ label: "Doctor's name", max: 100 }),
  doctorPhone: phone({ label: "Doctor's phone" }),
  hospitalName: text({ label: 'Hospital name', max: 100 }),
  hospitalPhone: phone({ label: 'Hospital phone' }),
  emergencyContact: text({ label: 'Emergency contact name', max: 100 }),
  emergencyPhone: phone({ label: 'Emergency contact phone' }),
  dietaryNotes: text({ label: 'Dietary notes', max: 5000 }),
  darkMode: bool({ label: 'Dark mode' })
};

// Validates whichever profile fields are present in `body` (unknown keys are
// ignored). Returns { values, error }: `values` holds normalized values for
// every present field; `error` is the first problem found, or null.
function validateProfile(body) {
  const values = {};
  for (const [key, rule] of Object.entries(PROFILE_RULES)) {
    if (!Object.prototype.hasOwnProperty.call(body, key)) continue;
    const result = rule(body[key]);
    if (result.error) return { values: {}, error: result.error };
    values[key] = result.value;
  }
  return { values, error: null };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (typeof email !== 'string') return 'Email is required';
  const trimmed = email.trim();
  if (trimmed.length > 254 || !EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address';
  return null;
}

// bcrypt only uses the first 72 bytes, so a longer password would be
// silently truncated - refuse it rather than let two different passwords
// behave as one.
function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) return 'Password must be at least 8 characters';
  if (Buffer.byteLength(password, 'utf8') > 72) return 'Password must be 72 bytes or fewer';
  return null;
}

module.exports = { validateProfile, validateEmail, validatePassword, PREGNANCY_STATUSES };
