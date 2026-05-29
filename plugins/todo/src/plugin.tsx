import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';

import { rootRouteRef } from './routes';

export const page = PageBlueprint.make({
  params: {
    path: '/todo',
    routeRef: rootRouteRef,
    loader: () =>
      import('./components/ExampleComponent').then(m =>
        <m.ExampleComponent />,
      ),
  },
});

export const todoPlugin = createFrontendPlugin({
  pluginId: 'todo',
  extensions: [page],
  routes: {
    root: rootRouteRef,
  }
});
