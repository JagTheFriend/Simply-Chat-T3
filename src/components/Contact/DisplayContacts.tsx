import { useRouter } from "next/router";
import { api } from "~/utils/api";
import UserProfile from "../Profile";

function ContactItem({ contactId }: { contactId: string }) {
  const router = useRouter();
  const { data: userData, isError: fetchError } =
    api.user.findUserById.useQuery(
      {
        userId: contactId,
      },
      {
        refetchInterval: 1000 * 60 * 3,
      }
    );
  const { mutate } = api.contact.deleteContact.useMutation({
    onError: () => {
      alert("An error occurred");
    },
    onSuccess: () => {
      alert(`Deleted Contact ${userData?.name}`);
    },
  });

  if (fetchError)
    return (
      <li key={`${Math.random()}`} className="list-group-item">
        Unable to load info
      </li>
    );
  return (
    <li key={`${Math.random()}`} className="list-group-item">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          fontSize: "21px",
        }}
      >
        <UserProfile username={userData?.name} avatar={userData?.image} />
        <div style={{ marginLeft: "5rem" }}>
          <button
            type="button"
            className="btn btn-success"
            onClick={async () => {
              await router.push(
                `/chat/${contactId}?data=${JSON.stringify(userData)}`,
                undefined,
                {
                  shallow: true,
                }
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-message-circle"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </button>
          <button
            type="button"
            style={{ marginLeft: "1rem" }}
            className="btn btn-danger"
            onClick={() =>
              void mutate({
                contactId: contactId,
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-trash-2"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

export function DisplayContactsList() {
  const { data: contactData, isError } = api.contact.getContacts.useQuery(
    undefined,
    {
      refetchInterval: 1000 * 60 * 3,
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
    }
  );

  if (isError) return <>An Error occurred while loading all contacts</>;

  return (
    <ul className="list-group">
      {contactData?.map((contact) => (
        <ContactItem key={`${Math.random()}`} contactId={contact.contactId} />
      ))}
    </ul>
  );
}
