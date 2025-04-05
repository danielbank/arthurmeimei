'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { subscribeToNewsletter } from '@/lib/actions/newsletter'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export const newsletterFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export default function NewsletterForm() {
  const form = useForm<z.infer<typeof newsletterFormSchema>>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof newsletterFormSchema>) {
    toast.promise(subscribeToNewsletter(values), {
      loading: 'Subscribing to newsletter...',
      success: () => {
        form.reset()
        return "You've been subscribed to our newsletter! We'll be in touch soon."
      },
      error: (error) => {
        if (error instanceof Error && error.message === 'Email already subscribed') {
          return 'This email is already subscribed to our newsletter'
        }
        return 'An unexpected error occurred. Please try again.'
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-bold">Subscribe to Our Newsletter!</h1>
        <p className="text-sm text-gray-500">
          Get the latest news and updates from Arthur and Mei Mei.
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Subscribe to Newsletter
        </Button>
      </form>
    </Form>
  )
}
