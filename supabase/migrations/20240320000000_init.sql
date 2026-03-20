-- Enable PostGIS extension
create extension if not exists postgis;

-- Create Enums (matching Prisma schema)
create type species as enum ('dog', 'cat', 'rabbit', 'bird', 'other');
create type gender as enum ('male', 'female');
create type size as enum ('small', 'medium', 'large');
create type intent as enum ('playdate', 'breeding', 'both');
create type direction as enum ('like', 'pass');
create type notification_type as enum ('new_match', 'new_message');

-- Create Tables
create table public.owners (
    id uuid primary key default gen_random_uuid(),
    auth_user_id uuid unique not null references auth.users(id) on delete cascade,
    name text not null,
    bio text,
    avatar_url text,
    city text,
    lat float8,
    lng float8,
    location geography(point) generated always as (st_makepoint(lng, lat)) stored,
    created_at timestamptz default now()
);

create table public.pets (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references public.owners(id) on delete cascade,
    name text not null,
    species species not null,
    breed text,
    age_months int not null,
    gender gender not null,
    size size not null,
    temperament_tags text[] default '{}',
    description text,
    intent intent not null,
    is_vaccinated boolean default false,
    photos text[] default '{}',
    created_at timestamptz default now()
);

create table public.swipes (
    id uuid primary key default gen_random_uuid(),
    swiper_pet_id uuid not null references public.pets(id) on delete cascade,
    swiped_pet_id uuid not null references public.pets(id) on delete cascade,
    direction direction not null,
    created_at timestamptz default now(),
    unique(swiper_pet_id, swiped_pet_id)
);

create table public.matches (
    id uuid primary key default gen_random_uuid(),
    pet_a_id uuid not null references public.pets(id) on delete cascade,
    pet_b_id uuid not null references public.pets(id) on delete cascade,
    created_at timestamptz default now(),
    unique(pet_a_id, pet_b_id)
);

create table public.messages (
    id uuid primary key default gen_random_uuid(),
    match_id uuid not null references public.matches(id) on delete cascade,
    sender_owner_id uuid not null references public.owners(id) on delete cascade,
    content text not null,
    created_at timestamptz default now(),
    read_at timestamptz
);

create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references public.owners(id) on delete cascade,
    type notification_type not null,
    payload jsonb not null default '{}',
    read boolean default false,
    created_at timestamptz default now()
);

-- Row Level Security (RLS)

alter table public.owners enable row level security;
alter table public.pets enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Owners: Profile is public, but only owner can update
create policy "Owners are viewable by everyone" on public.owners
    for select using (true);
create policy "Owners can update their own profile" on public.owners
    for update using (auth.uid() = auth_user_id);
create policy "Owners can insert their own profile" on public.owners
    for insert with check (auth.uid() = auth_user_id);

-- Pets: Publicly viewable, but only owner can manage
create policy "Pets are viewable by everyone" on public.pets
    for select using (true);
create policy "Owners can manage their own pets" on public.pets
    for all using (
        owner_id in (select id from public.owners where auth_user_id = auth.uid())
    );

-- Swipes: Only owner of swiper_pet can swipe
create policy "Owners can swipe for their pets" on public.swipes
    for all using (
        swiper_pet_id in (
            select id from public.pets where owner_id in (
                select id from public.owners where auth_user_id = auth.uid()
            )
        )
    );

-- Matches: Only owners of the involved pets can view
create policy "Owners can view their matches" on public.matches
    for select using (
        pet_a_id in (select id from public.pets where owner_id in (select id from public.owners where auth_user_id = auth.uid()))
        or
        pet_b_id in (select id from public.pets where owner_id in (select id from public.owners where auth_user_id = auth.uid()))
    );

-- Messages: Only owners in the match can view/send
create policy "Owners can view messages in their matches" on public.messages
    for select using (
        match_id in (
            select id from public.matches where 
            pet_a_id in (select id from public.pets where owner_id in (select id from public.owners where auth_user_id = auth.uid()))
            or
            pet_b_id in (select id from public.pets where owner_id in (select id from public.owners where auth_user_id = auth.uid()))
        )
    );
create policy "Owners can send messages to their matches" on public.messages
    for insert with check (
        match_id in (
            select id from public.matches where 
            pet_a_id in (select id from public.pets where owner_id in (select id from public.owners where auth_user_id = auth.uid()))
            or
            pet_b_id in (select id from public.pets where owner_id in (select id from public.owners where auth_user_id = auth.uid()))
        )
        and sender_owner_id in (select id from public.owners where auth_user_id = auth.uid())
    );

-- Notifications: Only owner can view/update
create policy "Owners can view their notifications" on public.notifications
    for select using (
        owner_id in (select id from public.owners where auth_user_id = auth.uid())
    );
create policy "Owners can update their notifications" on public.notifications
    for update using (
        owner_id in (select id from public.owners where auth_user_id = auth.uid())
    );

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
    insert into public.owners (auth_user_id, name, avatar_url)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new.raw_user_meta_data->>'avatar_url');
    return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
