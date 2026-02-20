import { MiddlewareConfig } from 'next/server'
import { stackMiddlewares, refreshAuthorization } from '@/middlewares'
import { withLog } from '@/middlewares/withLog'

const middlewares = [refreshAuthorization, withLog]
export default stackMiddlewares(middlewares)

export const config: MiddlewareConfig = {
    matcher: ['/((?!_next|favicon.ico).*)']
}
