-- 1. Owners Hardening: Only self can SELECT/UPDATE
DROP POLICY IF EXISTS "Owners are viewable by everyone" ON public.owners;
CREATE POLICY "Owners can only view their own profile" ON public.owners
    FOR SELECT USING (auth.uid()::uuid = auth_user_id::uuid);

-- 2. Pets Hardening: Private by default, others can only see basic info for discovery
DROP POLICY IF EXISTS "Pets are viewable by everyone" ON public.pets;
CREATE POLICY "Pets are viewable by everyone for discovery" ON public.pets
    FOR SELECT USING (true); -- We'll handle field filtering at the API level

-- 3. Swipes Hardening: Cannot swipe own pets
DROP POLICY IF EXISTS "Owners can swipe for their pets" ON public.swipes;
CREATE POLICY "Owners can swipe for their pets" ON public.swipes
    FOR INSERT WITH CHECK (
        swiper_pet_id::uuid IN (
            SELECT id::uuid FROM public.pets WHERE owner_id::uuid IN (
                SELECT id::uuid FROM public.owners WHERE auth_user_id::uuid = auth.uid()::uuid
            )
        )
        AND swiped_pet_id::uuid NOT IN (
            SELECT id::uuid FROM public.pets WHERE owner_id::uuid IN (
                SELECT id::uuid FROM public.owners WHERE auth_user_id::uuid = auth.uid()::uuid
            )
        )
    );

-- 4. Messages Hardening: Ensure sender belongs to the match
DROP POLICY IF EXISTS "Owners can send messages to their matches" ON public.messages;
CREATE POLICY "Owners can send messages to their matches" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.matches 
            WHERE id::uuid = match_id::uuid 
            AND (
                pet_a_id::uuid IN (SELECT id::uuid FROM public.pets WHERE owner_id::uuid IN (SELECT id::uuid FROM public.owners WHERE auth_user_id::uuid = auth.uid()::uuid))
                OR 
                pet_b_id::uuid IN (SELECT id::uuid FROM public.pets WHERE owner_id::uuid IN (SELECT id::uuid FROM public.owners WHERE auth_user_id::uuid = auth.uid()::uuid))
            )
        )
        AND sender_owner_id::uuid IN (SELECT id::uuid FROM public.owners WHERE auth_user_id::uuid = auth.uid()::uuid)
    );

-- 5. Notifications Hardening: Strict owner only
DROP POLICY IF EXISTS "Owners can view their notifications" ON public.notifications;
CREATE POLICY "Owners can only view their own notifications" ON public.notifications
    FOR SELECT USING (owner_id::uuid IN (SELECT id::uuid FROM public.owners WHERE auth_user_id::uuid = auth.uid()::uuid));

-- 6. Enable RLS on all tables (redundant but safe)
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
