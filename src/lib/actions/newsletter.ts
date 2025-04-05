'use server'

import { createClient } from '@/lib/supabase/server'

interface NewsletterFormData {
  email: string
}

export async function subscribeToNewsletter({ email }: NewsletterFormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: email.toLowerCase() })

  if (error) {
    if (error.code === '23505') {
      throw new Error('Email already subscribed')
    }
    throw new Error(`Failed to subscribe to newsletter: ${error.message}`)
  }

  return { success: true }
}

export async function getNewsletterSubscribers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get newsletter subscribers: ${error.message}`)
  }

  return data
}
