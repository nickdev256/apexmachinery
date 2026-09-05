import { supabaseAdmin } from '../config/supabase.js';


export async function logActivity({
  userId,
  action,
  entityType = null,
  entityId = null,
  description = null,
  metadata = {},
}) {
  try {
    const {
      error,
    } = await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: userId || null,
        action,
        entity_type: entityType,
        entity_id:
          entityId
            ? String(entityId)
            : null,
        description,
        metadata,
      });


    if (error) {
      console.error(
        'Activity log failed:',
        error.message
      );
    }
  } catch (error) {
    console.error(
      'Activity logging error:',
      error
    );
  }
}