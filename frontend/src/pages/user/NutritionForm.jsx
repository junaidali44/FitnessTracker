import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { MEAL_TYPES } from '../../utils/constants';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const emptyFood = { name: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fat: '' };

export default function NutritionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    mealType: 'Breakfast',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    foods: [{ ...emptyFood }]
  });

  useEffect(() => {
    if (editing) {
      api.get(`/nutrition/${id}`).then(res => {
        const n = res.data.data;
        setForm({
          mealType: n.mealType,
          date: new Date(n.date).toISOString().split('T')[0],
          notes: n.notes || '',
          foods: n.foods
        });
      }).finally(() => setLoading(false));
    }
  }, [id, editing]);

  const updateFood = (i, field, value) => {
    const foods = [...form.foods];
    foods[i] = { ...foods[i], [field]: value };
    setForm({ ...form, foods });
  };

  const addFood = () => setForm({ ...form, foods: [...form.foods, { ...emptyFood }] });
  const removeFood = (i) => setForm({ ...form, foods: form.foods.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        mealType: form.mealType,
        date: form.date,
        notes: form.notes,
        foods: form.foods.filter(f => f.name).map(f => ({
          name: f.name,
          quantity: Number(f.quantity) || 0,
          unit: f.unit,
          calories: Number(f.calories) || 0,
          protein: Number(f.protein) || 0,
          carbs: Number(f.carbs) || 0,
          fat: Number(f.fat) || 0
        }))
      };
      if (editing) {
        await api.put(`/nutrition/${id}`, payload);
        toast.success('Updated');
      } else {
        await api.post('/nutrition', payload);
        toast.success('Meal logged!');
      }
      navigate('/nutrition');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6">{editing ? 'Edit Meal' : 'Log New Meal'}</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Meal Type *</label>
            <select className="input" value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
              {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">Foods</label>
            <button type="button" onClick={addFood} className="text-sm text-primary-500 flex items-center gap-1">
              <PlusIcon className="w-4 h-4" /> Add Food
            </button>
          </div>
          <div className="space-y-2">
            {form.foods.map((f, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <input className="input col-span-4" placeholder="Food name" value={f.name} onChange={(e) => updateFood(i, 'name', e.target.value)} />
                <input type="number" className="input col-span-1" placeholder="Qty" value={f.quantity} onChange={(e) => updateFood(i, 'quantity', e.target.value)} />
                <input type="number" className="input col-span-1" placeholder="Cal" value={f.calories} onChange={(e) => updateFood(i, 'calories', e.target.value)} />
                <input type="number" className="input col-span-1" placeholder="P" value={f.protein} onChange={(e) => updateFood(i, 'protein', e.target.value)} />
                <input type="number" className="input col-span-1" placeholder="C" value={f.carbs} onChange={(e) => updateFood(i, 'carbs', e.target.value)} />
                <input type="number" className="input col-span-1" placeholder="F" value={f.fat} onChange={(e) => updateFood(i, 'fat', e.target.value)} />
                {form.foods.length > 1 && (
                  <button type="button" onClick={() => removeFood(i)} className="col-span-1 text-red-500 p-1">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate('/nutrition')} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Meal'}</button>
        </div>
      </form>
    </div>
  );
}