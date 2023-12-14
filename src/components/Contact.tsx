import type { User } from "@prisma/client";
import Image from "next/image";
import { createContext, useContext, useState } from "react";
import { api } from "~/utils/api";

const SearchedContactContext = createContext({
  searchedContact: {} as User,
  setSearchedContact: (_user: User) => {
    return;
  },
});

function DisplayResult() {
  const { searchedContact } = useContext(SearchedContactContext);

  return (
    <>
      <hr />
      <div
        style={{
          fontSize: "19px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          alt="Avatar"
          className="avatar avatar-48 bg-light rounded-circle text-white p-2"
          src={searchedContact.image ?? ""}
          style={{ marginLeft: "0.5rem" }}
          width={"100"}
          height={"100"}
        />{" "}
        {searchedContact.name}
      </div>
      <hr />
    </>
  );
}

function Form() {
  const { searchedContact, setSearchedContact } = useContext(
    SearchedContactContext
  );

  const [currentEmail, setCurrentEmail] = useState("");
  const { refetch } = api.user.findUserByEmail.useQuery(
    {
      email: currentEmail,
    },
    {
      enabled: false,
    }
  );

  async function searchContact() {
    // Reset data
    setSearchedContact({} as User);

    const { data: contactData, isError } = await refetch();

    if (isError)
      return alert("An Error occurred while searching for Contact's details");

    if (!contactData) return alert(`Email ${currentEmail} not found`);

    setSearchedContact(contactData);
  }

  return (
    <>
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="contactEmail"
          placeholder="name@example.com"
          onInput={(e) => {
            setCurrentEmail(e.currentTarget.value);
          }}
        />
        <label htmlFor={"contactEmail"}>Contact's Email address</label>
      </div>
      {searchedContact?.id !== undefined && <DisplayResult />}
      <div className="d-grid">
        <button
          className="btn btn-outline-primary"
          onClick={() => searchContact()}
          disabled={!currentEmail}
        >
          Search
        </button>
      </div>
    </>
  );
}

function Footer() {
  const { searchedContact } = useContext(SearchedContactContext);
  const { mutate } = api.contact.createContact.useMutation({
    onError: () => {
      alert(
        "An Error occurred while adding this contact into your Contact's list"
      );
    },
    onSuccess: () => {
      alert("Contact added to your Contact's list");
    },
  });

  function addContactToUser() {
    return mutate({
      contactId: searchedContact.id,
    });
  }

  return (
    <div className="modal-footer">
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        Close
      </button>
      <button
        type="button"
        data-bs-dismiss="modal"
        className="btn btn-success"
        onClick={() => addContactToUser()}
        disabled={searchedContact?.id === undefined}
      >
        Add Contact
      </button>
    </div>
  );
}

function AddNewContactModal() {
  const [searchedContact, setSearchedContact] = useState({} as User);

  return (
    <SearchedContactContext.Provider
      value={{ searchedContact, setSearchedContact }}
    >
      <div
        className="modal fade"
        id="addNewContactModal"
        tabIndex={-1}
        aria-labelledby="addNewContactLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addNewContactLabel">
                Add New Contact
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Form />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </SearchedContactContext.Provider>
  );
}

export function AddNewContact() {
  return (
    <>
      <button
        className="btn btn-success"
        style={{ position: "fixed", bottom: "5%", right: "4%" }}
        data-bs-toggle="modal"
        data-bs-target="#addNewContactModal"
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
      <AddNewContactModal />
    </>
  );
}

function ContactItem({ contactId }: { contactId: string }) {
  const { data: userData, isError: fetchError } =
    api.user.findUserById.useQuery({
      userId: contactId,
    });
  if (fetchError)
    return <li className="list-group-item">Unable to load info</li>;
  return (
    <li className="list-group-item">
      <Image
        alt="Avatar"
        className="avatar avatar-48 bg-light rounded-circle text-white p-2"
        src={userData?.image ?? ""}
        width={"100"}
        height={"100"}
      />
      {userData?.name ?? "Unknown"}
    </li>
  );
}

export function DisplayContactsList() {
  const { data: contactData, isError } = api.contact.getContacts.useQuery();

  if (isError) return <>An Error occurred while loading all contacts</>;

  return (
    <ul className="list-group">
      {contactData?.map((contact) => (
        <ContactItem contactId={contact.contactId} />
      ))}
    </ul>
  );
}
