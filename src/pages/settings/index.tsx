import ChangePassworForm from "@/components/settings/ChangePasswordForm";
import ChangeEmailForm from "@/components/settings/ChangeEmailForm";
import Layout from "@/components/dashboard/Layout";
import { GetServerSideProps } from "next";
import withAuth from "@/utils/withAuth";
import { Tabs } from "@radix-ui/themes";
import Head from "next/head";


const Settings = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta
          name="robots"
          content={"noindex, nofollow, noarchive, nosnippet"}
        />
      </Head>
      <Layout>
        <Tabs.Root defaultValue="email">
          <Tabs.List>
            <Tabs.Trigger value="email">Email</Tabs.Trigger>
            <Tabs.Trigger value="password">Change Password</Tabs.Trigger>
          </Tabs.List>

          <div className="pt-8">
            <Tabs.Content value="email">
              <ChangeEmailForm />
            </Tabs.Content>

            <Tabs.Content value="password">
              <ChangePassworForm />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuth(context);
};

export default Settings;
