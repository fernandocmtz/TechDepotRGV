import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Address {
  address_id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

const AddressForm: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Omit<Address, 'address_id'>>({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });
  const [editId, setEditId] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  const fetchAddresses = async () => {
    try {
      const res = await axios.get<Address[]>('http://localhost:5001/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data);
    } catch {
      toast.error('Failed to load addresses');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`http://localhost:5001/api/addresses/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Address updated');
      } else {
        await axios.post('http://localhost:5001/api/addresses', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Address added');
      }

      setForm({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
      });
      setEditId(null);
      fetchAddresses();
    } catch {
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (address: Address) => {
    setEditId(address.address_id);
    setForm({
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Address deleted');
      fetchAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-xl font-semibold">🏠 Saved Addresses</h3>

      {addresses.length === 0 ? (
        <p className="text-muted-foreground">No saved addresses.</p>
      ) : (
        <ul className="space-y-2">
          {addresses.map((a) => (
            <li key={a.address_id} className="border p-3 rounded flex justify-between items-start">
              <div>
                <strong>{a.address_line1}</strong>{a.address_line2 && `, ${a.address_line2}`}<br />
                {a.city}, {a.state} {a.postal_code}<br />
                {a.country}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(a)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(a.address_id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow-md">
        <h4 className="font-medium">{editId ? 'Edit Address' : 'Add New Address'}</h4>

        <div>
          <Label>Address Line 1</Label>
          <Input value={form.address_line1} onChange={(e) => handleChange('address_line1', e.target.value)} required />
        </div>

        <div>
          <Label>Address Line 2</Label>
          <Input value={form.address_line2} onChange={(e) => handleChange('address_line2', e.target.value)} />
        </div>

        <div>
          <Label>City</Label>
          <Input value={form.city} onChange={(e) => handleChange('city', e.target.value)} required />
        </div>

        <div>
          <Label>State</Label>
          <Input value={form.state} onChange={(e) => handleChange('state', e.target.value)} />
        </div>

        <div>
          <Label>Postal Code</Label>
          <Input value={form.postal_code} onChange={(e) => handleChange('postal_code', e.target.value)} />
        </div>

        <div>
          <Label>Country</Label>
          <Input value={form.country} onChange={(e) => handleChange('country', e.target.value)} required />
        </div>

        <div className="flex gap-2">
          <Button type="submit">{editId ? 'Update' : 'Add Address'}</Button>
          {editId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>}
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
