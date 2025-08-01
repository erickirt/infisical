import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { faArrowUpRightFromSquare, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import { Button, Card, CardTitle, FormControl, Input } from "@app/components/v2";
import { useWorkspace } from "@app/context";
import { removeTrailingSlash } from "@app/helpers/string";
import { useSaveIntegrationAccessToken } from "@app/hooks/api";

const formSchema = z.object({
  instanceUrl: z.string().min(1, { message: "Instance URL required" }),
  apiKey: z.string().min(1, { message: "API Key required" })
});

type TForm = z.infer<typeof formSchema>;

export const OctopusDeployAuthorizePage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useSaveIntegrationAccessToken();
  const { currentWorkspace } = useWorkspace();

  const { control, handleSubmit } = useForm<TForm>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({ instanceUrl, apiKey }: TForm) => {
    try {
      const integrationAuth = await mutateAsync({
        workspaceId: currentWorkspace.id,
        integration: "octopus-deploy",
        url: removeTrailingSlash(instanceUrl),
        accessToken: apiKey
      });

      navigate({
        to: "/projects/secret-management/$projectId/integrations/octopus-deploy/create",
        params: {
          projectId: currentWorkspace.id
        },
        search: {
          integrationAuthId: integrationAuth.id
        }
      });
    } catch (err: any) {
      createNotification({
        type: "error",
        text: err.message ?? "Error authorizing integration"
      });
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full w-full items-center justify-center"
    >
      <Helmet>
        <title>Authorize Octopus Deploy Integration</title>
      </Helmet>
      <Card className="mb-12 max-w-lg rounded-md border border-mineshaft-600">
        <CardTitle
          className="px-6 text-left text-xl"
          subTitle="After adding your credentials, you will be prompted to set up an integration for a particular environment and secret path."
        >
          <div className="flex flex-row items-center">
            <div className="inline-flex items-center pb-0.5">
              <img
                src="/images/integrations/Octopus Deploy.png"
                height={30}
                width={30}
                alt="Octopus Deploy logo"
              />
            </div>
            <span className="ml-1.5">Octopus Deploy Integration</span>
            <a
              href="https://infisical.com/docs/integrations/cloud/octopus-deploy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="mb-1 ml-2 inline-block cursor-default rounded-md bg-yellow/20 px-1.5 pb-[0.03rem] pt-[0.04rem] text-sm text-yellow opacity-80 hover:opacity-100">
                <FontAwesomeIcon icon={faBookOpen} className="mr-1.5" />
                Docs
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className="mb-[0.07rem] ml-1.5 text-xxs"
                />
              </div>
            </a>
          </div>
        </CardTitle>
        <Controller
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              label="Octopus Deploy Instance URL"
              errorText={error?.message}
              isError={Boolean(error)}
              className="px-6"
            >
              <Input value={value} onChange={onChange} placeholder="https://xxxx.octopus.app" />
            </FormControl>
          )}
          name="instanceUrl"
          control={control}
        />
        <Controller
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              label="Octopus Deploy API Key"
              errorText={error?.message}
              isError={Boolean(error)}
              className="px-6"
            >
              <Input
                value={value}
                onChange={onChange}
                placeholder="API-XXXXXXXXXXXXXXXXXXXXXXXX"
                type="password"
              />
            </FormControl>
          )}
          name="apiKey"
          control={control}
        />
        <Button
          type="submit"
          colorSchema="primary"
          variant="outline_bg"
          className="mb-6 ml-auto mr-6 mt-2 w-min"
          isLoading={isPending}
          isDisabled={isPending}
        >
          Connect to Octopus Deploy
        </Button>
      </Card>
    </form>
  );
};
