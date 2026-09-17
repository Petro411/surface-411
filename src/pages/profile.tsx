import Subscription from "@/components/dashboard/Subscription";
import Layout from "@/components/dashboard/Layout";
import { GetServerSideProps } from "next";
import withAuth from "@/utils/withAuth";
import Head from "next/head";


const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta
          name="robots"
          content={"noindex, nofollow, noarchive, nosnippet"}
        />
      </Head>
      <Layout>
        <Subscription />
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withAuth(context);
};

export default Dashboard;
