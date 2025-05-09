import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    order_id: '',
    method: 'credit_card',
    amount: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/payments', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Payment submitted successfully!');
      setFormData({ order_id: '', method: 'credit_card', amount: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit payment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold">Add Payment</h2>

      <div>
        <Label>Order ID</Label>
        <Input
          type="text"
          value={formData.order_id}
          onChange={(e) => handleChange('order_id', e.target.value)}
        />
      </div>

      <div>
        <Label>Amount</Label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
        />
      </div>

      <div>
        <Label>Payment Method</Label>
        <Select
          value={formData.method}
          onValueChange={(value) => handleChange('method', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Submit Payment</Button>
    </form>
  );
};

export default PaymentForm;
