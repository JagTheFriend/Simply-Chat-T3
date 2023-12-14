import Image from "next/image";
import { api } from "~/utils/api";

export function AddNewContact() {
  return (
    <button
      className="btn btn-success"
      style={{ position: "fixed", bottom: "5%", right: "4%" }}
    >
      New Contact
      <svg
        style={{ marginLeft: "10px" }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="feather feather-user-plus"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
      </svg>
    </button>
  );
}

export function DisplayContactsList() {
  const { data: contactData, isError } = api.contact.getContacts.useQuery();

  if (isError) return <>An Error occurred while loading all contacts</>;

  return (
    <ul className="list-group">
      {contactData?.map((contact) => {
        const { data: userData, isError: fetchError } =
          api.user.findUser.useQuery({
            userId: contact.contactId,
          });
        if (fetchError)
          return <li className="list-group-item">Unable to load info</li>;
        return (
          <li className="list-group-item">
            <Image
              alt="Avatar"
              className="avatar avatar-48 bg-light rounded-circle text-white p-2"
              src={userData?.image ?? ""}
              // style={{ marginLeft: "0.5rem" }}
            />
            {userData?.name ?? "Unknown"}
          </li>
        );
      })}
    </ul>
  );
}
