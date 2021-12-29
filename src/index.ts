import { runDirective } from '@router/directives'
import '@router/directives/index'
import { init } from '@router/router'

runDirective('data-router-cloak')
runDirective('data-router-page')
runDirective('data-router-link')

init()
