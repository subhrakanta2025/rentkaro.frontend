import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: 'Please enter a valid email address' });

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thanks for subscribing! Check your email for confirmation.');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-semibold text-foreground">Subscribe to our newsletter</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get the latest deals, travel tips, and rental guides delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" size="icon" disabled={isSubmitting}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
