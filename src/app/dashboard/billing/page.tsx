import BillingForm from '@/components/BillingForm';
import { getUserSubscriptionPlan } from '@/lib/stripe';

const Page = async () => {
  const subcriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subcriptionPlan} />;
};

export default Page;
