import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { RiTodoLine } from '@remixicon/react';

import { rootRouteRef } from './routes';

export const page = PageBlueprint.make({
  params: {
    title: 'Todo',
    icon: <RiTodoLine />,
    path: '/todo',
    routeRef: rootRouteRef,
    loader: () => import('./components/TodoPage').then(m => <m.TodoPage />),
  },
});

export const todoPlugin = createFrontendPlugin({
  pluginId: 'todo',
  extensions: [page],
  routes: {
    root: rootRouteRef,
  },
});
