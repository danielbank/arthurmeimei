/* Newsletter Subscribers */
create table newsletter_subscribers (
    id uuid primary key default gen_random_uuid (),
    email text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table newsletter_subscribers enable row level security;

create policy "Anyone can subscribe to the newsletter" on newsletter_subscribers for
insert to anon with check (true);