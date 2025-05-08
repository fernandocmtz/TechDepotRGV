import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PaymentMethod {
  method_id: number;
  cardholder_name: string;
  card_last4: string;
  expiration_date: string;
  brand: string;
}

const PaymentMethodManager: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [form, setForm] = useState({
    cardholder_name: '',
    card_last4: '',
    expiration_date: '',
    brand: 'visa',
  });
  const [editId, setEditId] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  const fetchMethods = async () => {
    try {
      const res = await axios.get<PaymentMethod[]>('http://localhost:5001/api/payment-methods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMethods(res.data);
    } catch {
      toast.error('Failed to load payment methods');
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditId(method.method_id);
    setForm({
      cardholder_name: method.cardholder_name,
      card_last4: method.card_last4,
      expiration_date: method.expiration_date,
      brand: method.brand,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/payment-methods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Payment method deleted');
      fetchMethods();
    } catch {
      toast.error('Failed to delete method');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`http://localhost:5001/api/payment-methods/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Payment method updated');
      } else {
        await axios.post('http://localhost:5001/api/payment-methods', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Payment method added');
      }

      setForm({ cardholder_name: '', card_last4: '', expiration_date: '', brand: 'visa' });
      setEditId(null);
      fetchMethods();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ cardholder_name: '', card_last4: '', expiration_date: '', brand: 'visa' });
  };

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-xl font-semibold">💳 Saved Payment Methods</h3>

      {methods.length === 0 ? (
        <p className="text-muted-foreground">No saved payment methods.</p>
      ) : (
        <ul className="space-y-2">
          {methods.map((method) => (
            <li key={method.method_id} className="border p-3 rounded flex justify-between items-start">
              <div>
                <strong>{method.brand.toUpperCase()}</strong> ending in {method.card_last4} (exp: {method.expiration_date})<br />
                Cardholder: {method.cardholder_name}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(method)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(method.method_id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow-md">
        <h4 className="font-medium">{editId ? 'Edit Payment Method' : 'Add New Payment Method'}</h4>

        <div>
          <Label>Cardholder Name</Label>
          <Input
            value={form.cardholder_name}
            onChange={(e) => handleChange('cardholder_name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label> CVV </Label>
          <Input
            value={form.card_last4}
            onChange={(e) => handleChange('card_last4', e.target.value)}
            maxLength={4}
            required
          />
        </div>

        <div>
          <Label>Expiration Date (MM/YYYY)</Label>
          <Input
            value={form.expiration_date}
            onChange={(e) => handleChange('expiration_date', e.target.value)}
            placeholder="MM/YYYY"
            required
          />
        </div>

        <div>
          <Label>Card Brand</Label>
          <Select value={form.brand} onValueChange={(val) => handleChange('brand', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select card brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">Mastercard</SelectItem>
              <SelectItem value="amex">Amex</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="submit">{editId ? 'Update' : 'Save Method'}</Button>
          {editId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodManager;
