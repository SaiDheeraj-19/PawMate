import { createClient as createSupabase } from './supabase/server';
import pb from './pocketbase';
import prisma from './prisma';

export type BackendType = 'supabase' | 'pocketbase';

export const getBackend = (): BackendType => {
  return (process.env.NEXT_PUBLIC_BACKEND as BackendType) || 'supabase';
};

export async function getCurrentUser() {
  const backend = getBackend();
  
  if (backend === 'supabase') {
    const supabase = createSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } else {
    return pb.authStore.model;
  }
}

export async function getOwner(): Promise<any> {
  const backend = getBackend();
  const user = await getCurrentUser();
  if (!user) return null;

  if (backend === 'supabase') {
    return await prisma.owner.findUnique({
      where: { auth_user_id: user.id },
      include: { pets: true }
    });
  } else {
    try {
      const owner = await pb.collection('owners').getFirstListItem(`user_id="${user.id}"`, {
        expand: 'pets_via_owner'
      });
      return { 
        ...owner, 
        pets: owner.expand?.pets_via_owner || [],
        lat: (owner as any).lat,
        lng: (owner as any).lng
      };
    } catch (e) {
      return null;
    }
  }
}
