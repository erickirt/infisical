import { createFileRoute } from "@tanstack/react-router";

import { BreadcrumbTypes } from "@app/components/v2";
import { workspaceKeys } from "@app/hooks/api";
import { fetchUserProjectPermissions, roleQueryKeys } from "@app/hooks/api/roles/queries";
import { fetchWorkspaceById } from "@app/hooks/api/workspace/queries";
import { PkiManagerLayout } from "@app/layouts/PkiManagerLayout";
import { ProjectSelect } from "@app/layouts/ProjectLayout/components/ProjectSelect";

export const Route = createFileRoute(
  "/_authenticate/_inject-org-details/_org-layout/projects/cert-management/$projectId/_cert-manager-layout"
)({
  component: PkiManagerLayout,
  beforeLoad: async ({ params, context }) => {
    const project = await context.queryClient.ensureQueryData({
      queryKey: workspaceKeys.getWorkspaceById(params.projectId),
      queryFn: () => fetchWorkspaceById(params.projectId)
    });

    await context.queryClient.ensureQueryData({
      queryKey: roleQueryKeys.getUserProjectPermissions({
        workspaceId: params.projectId
      }),
      queryFn: () => fetchUserProjectPermissions({ workspaceId: params.projectId })
    });

    return {
      project,
      breadcrumbs: [
        {
          type: BreadcrumbTypes.Component,
          component: ProjectSelect
        }
      ]
    };
  }
});
