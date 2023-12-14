import type { User } from "@prisma/client";
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import { api } from "~/utils/api";

const ContactDetailsContext = createContext({} as User);

function LoadUserData({ contactId }: { contactId: string }) {
  const [contactDetail, setContactDetail] = useState({} as User);
  const { data, isError } = api.user.findUserById.useQuery(
    {
      userId: contactId,
    },
    {
      refetchInterval: 1000 * 60 * 4,
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
    }
  );
  if (isError || !data) return <>{"Unable to load contact's details"}</>;
  setContactDetail(data);

  return (
    <ContactDetailsContext.Provider
      value={contactDetail}
    ></ContactDetailsContext.Provider>
  );
}

export default function Chat() {
  const router = useRouter();
  const contactId = router.query.contactId as string;

  if (!contactId) return <>{"Provide a valid contact ID"}</>;

  return (
    <div className="container" style={{ fontSize: "21px" }}>
      <LoadUserData contactId={contactId} />;
    </div>
  );
}
