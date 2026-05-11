import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { failure, handleOptions, json, readBody } from '../_shared/http.ts'
import { createServiceRoleClient } from '../_shared/supabase.ts'

interface BootstrapAdminRequest {
  email?: string
  fullName?: string
  password?: string
}

Deno.serve(async (request) => {
  const optionsResponse = handleOptions(request)

  if (optionsResponse) {
    return optionsResponse
  }

  if (request.method !== 'POST') {
    return failure('Method not allowed', 405)
  }

  try {
    const payload = await readBody<BootstrapAdminRequest>(request)
    const email = payload.email?.trim()
    const password = payload.password?.trim()
    const fullName = payload.fullName?.trim() || 'PROVA Admin'

    if (!email) {
      return failure('Email is required', 400)
    }

    if (!password || password.length < 8) {
      return failure('Password must be at least 8 characters long', 400)
    }

    const supabase = createServiceRoleClient()
    const { count, error: adminCountError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (adminCountError) {
      throw adminCountError
    }

    if ((count ?? 0) > 0) {
      return failure('An admin profile already exists. Bootstrap is locked.', 409)
    }

    const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
      app_metadata: {
        role: 'admin',
      },
      email,
      email_confirm: true,
      password,
      user_metadata: {
        full_name: fullName,
      },
    })

    if (createUserError || !createdUser.user) {
      throw createUserError ?? new Error('Unable to create admin user')
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      email,
      full_name: fullName,
      id: createdUser.user.id,
      role: 'admin',
    })

    if (profileError) {
      throw profileError
    }

    const { error: auditError } = await supabase.from('audit_events').insert({
      actor_profile_id: createdUser.user.id,
      entity_id: createdUser.user.id,
      entity_type: 'profile',
      event_type: 'admin.bootstrap',
      payload: {
        email,
      },
    })

    if (auditError) {
      throw auditError
    }

    return json(
      {
        email,
        message: 'Initial admin user created successfully.',
        userId: createdUser.user.id,
      },
      201,
    )
  } catch (error) {
    return failure('Unable to bootstrap admin user', 400, error instanceof Error ? error.message : error)
  }
})