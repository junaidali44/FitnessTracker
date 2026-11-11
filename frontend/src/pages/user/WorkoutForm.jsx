import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { WORKOUT_CATEGORIES, DIFFICULTY_LEVELS } from '../../utils/constants';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { validateForm, workoutSchema, validateTags } from '../../utils/validators';
import { getFriendlyError, SUCCESS_MESSAGES } from '../../utils/errorMessages';

export default function WorkoutForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({}); // ✅ Added missing state
  
  const [form, setForm] = useState({
    name: '',
    category: 'Strength',
    duration: '',
    caloriesBurned: '',
    difficulty: 'Medium',
    notes: '',
    tags: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }]
  });

  useEffect(() => {
    if (editing) {
      api.get(`/workouts/${id}`)
        .then(res => {
          const w = res.data.data;
          setForm({
            name: w.name,
            category: w.category,
            duration: w.duration || '',
            caloriesBurned: w.caloriesBurned || '',
            difficulty: w.difficulty,
            notes: w.notes || '',
            tags: (w.tags || []).join(', '),
            exercises: w.exercises?.length ? w.exercises : [{ name: '', sets: '', reps: '', weight: '' }]
          });
        })
        .catch(() => toast.error('Failed to load'))
        .finally(() => setLoading(false));
    }
  }, [id, editing]);

  const updateExercise = (i, field, value) => {
    const exercises = [...form.exercises];
    exercises[i] = { ...exercises[i], [field]: value };
    setForm({ ...form, exercises });
  };

  const addExercise = () => setForm({ ...form, exercises: [...form.exercises, { name: '', sets: '', reps: '', weight: '' }] });
  const removeExercise = (i) => setForm({ ...form, exercises: form.exercises.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const { isValid, errors: validationErrors } = validateForm(form, workoutSchema);
    const tagsCheck = validateTags(form.tags);
    if (!tagsCheck.valid) validationErrors.tags = tagsCheck.error;

    if (!isValid || !tagsCheck.valid) {
      setErrors(validationErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        duration: Number(form.duration) || 0,
        caloriesBurned: Number(form.caloriesBurned) || undefined,
        difficulty: form.difficulty,
        notes: form.notes.trim(),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        exercises: form.exercises
          .filter((ex) => ex.name.trim())
          .map((ex) => ({
            name: ex.name.trim(),
            sets: Number(ex.sets) || 0,
            reps: Number(ex.reps) || 0,
            weight: Number(ex.weight) || 0,
          })),
      };
      if (editing) {
        await api.put(`/workouts/${id}`, payload);
        toast.success(SUCCESS_MESSAGES.WORKOUT_UPDATED);
      } else {
        await api.post('/workouts', payload);
        toast.success(SUCCESS_MESSAGES.WORKOUT_CREATED);
      }
      navigate('/workouts');
    } catch (error) {
      toast.error(getFriendlyError(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6">{editing ? 'Edit Workout' : 'Log New Workout'}</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
        <div className="grid md:grid-cols-2 gap-4">
          
          {/* Name Field */}
          <div>
            <label className="label">Workout Name *</label>
            <input 
              className={`input ${errors.name ? 'input-error' : ''}`} 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              placeholder="Morning Push Day" 
            />
            {errors.name && <p className="mt-1 text-xs text-crimson-500">{errors.name}</p>}
          </div>

          {/* Category Field */}
          <div>
            <label className="label">Category *</label>
            <select 
              className={`input ${errors.category ? 'input-error' : ''}`} 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {WORKOUT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-crimson-500">{errors.category}</p>}
          </div>

          {/* Duration Field */}
          <div>
            <label className="label">Duration (minutes)</label>
            <input 
              type="number" 
              className={`input ${errors.duration ? 'input-error' : ''}`} 
              value={form.duration} 
              onChange={(e) => setForm({ ...form, duration: e.target.value })} 
            />
            {errors.duration && <p className="mt-1 text-xs text-crimson-500">{errors.duration}</p>}
          </div>

          {/* Calories Field */}
          <div>
            <label className="label">Calories Burned</label>
            <input 
              type="number" 
              className={`input ${errors.caloriesBurned ? 'input-error' : ''}`} 
              value={form.caloriesBurned} 
              onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })} 
              placeholder="Auto-calculated if empty" 
            />
            {errors.caloriesBurned && <p className="mt-1 text-xs text-crimson-500">{errors.caloriesBurned}</p>}
          </div>

          {/* Difficulty Field */}
          <div>
            <label className="label">Difficulty</label>
            <select 
              className="input" 
              value={form.difficulty} 
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              {DIFFICULTY_LEVELS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Tags Field */}
          <div>
            <label className="label">Tags (comma separated)</label>
            <input 
              className={`input ${errors.tags ? 'input-error' : ''}`} 
              value={form.tags} 
              onChange={(e) => setForm({ ...form, tags: e.target.value })} 
              placeholder="chest, triceps" 
            />
            {errors.tags && <p className="mt-1 text-xs text-crimson-500">{errors.tags}</p>}
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">Exercises</label>
            <button type="button" onClick={addExercise} className="text-sm text-primary-500 flex items-center gap-1 hover:text-primary-400 transition-colors">
              <PlusIcon className="w-4 h-4" /> Add Exercise
            </button>
          </div>
          <div className="space-y-2">
            {form.exercises.map((ex, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <input className="input col-span-4" placeholder="Exercise name" value={ex.name} onChange={(e) => updateExercise(i, 'name', e.target.value)} />
                <input type="number" className="input col-span-2" placeholder="Sets" value={ex.sets} onChange={(e) => updateExercise(i, 'sets', e.target.value)} />
                <input type="number" className="input col-span-2" placeholder="Reps" value={ex.reps} onChange={(e) => updateExercise(i, 'reps', e.target.value)} />
                <input type="number" className="input col-span-3" placeholder="Weight (kg)" value={ex.weight} onChange={(e) => updateExercise(i, 'weight', e.target.value)} />
                {form.exercises.length > 1 && (
                  <button type="button" onClick={() => removeExercise(i)} className="col-span-1 text-red-500 p-1 hover:text-red-400">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate('/workouts')} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Save Workout'}</button>
        </div>
      </form>
    </div>
  );
}