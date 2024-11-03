export async function errorMiddleware(
    request: Request,
    env: Env,
    handler: () => Promise<Response>
  ): Promise<Response> {
    try {
      return await handler()
    } catch (error) {
        console.error(error)
        return new Response("ok", { status: 200 })
    }
  }