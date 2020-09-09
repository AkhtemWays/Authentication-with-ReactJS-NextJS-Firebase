import React, { useState, useEffect, useRef } from "react";
import Avatar from "react-avatar";
import Firebase from "../firebase/config";
import { url } from "./imgUrl";
import { useRouter } from "next/router";
import { firestore } from "../firebase/config";

export default function profilePicChanger() {
  const [img, setImg] = useState(url);
  const [file, setFile] = useState({});
  const myRef = useRef();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const chooseFile = (ev) => {
    setFile(ev.target.files[0]);
  };
  const handleUpload = async () => {
    await Firebase.uploadImage(file, myRef, user.email);
  };
  useEffect(() => {
    Firebase.getAuthState().then((user) => {
      if (!user) {
        router.replace("/signin");
      } else {
        firestore
          .collection("users")
          .where("email", "==", user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => setUser(doc.data()));
          })
          .catch((e) => console.log(e));
      }
    });
  }, []);

  return (
    <>
      <img
        src={!user ? img : user.image ? user.image : img}
        ref={myRef}
        round="true"
      />
      <div>
        <input type="file" onChange={chooseFile} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </>
  );
}
