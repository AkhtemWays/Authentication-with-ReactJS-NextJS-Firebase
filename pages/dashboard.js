import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/Home.module.css";
import Firebase, { firestore } from "../firebase/config";
import { useRouter } from "next/router";
import Link from "next/link";
import verifyEmail from "../firebase/emailSendConfig";
import { Spin } from "antd";

export default function dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Firebase.getAuthState().then((serverUser) => {
      if (!serverUser) {
        // navigate back
        router.replace("/signin");
      } else {
        setUser(serverUser);
        firestore
          .collection("users")
          .where("email", "==", serverUser.email)
          .update({ email: "ahtydsadsa@mail.ru" })
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              setLoading(false);
              // setUser делай тут как исправишь
              setUser(doc.data());
            });
          });
      }
    });
  }, []);
  const handleClick = useCallback((ev) => {
    Firebase.logout();

    router.push("/signin");
  });

  return loading && user ? (
    <div className={styles.container}>
      <h1>Hello {user.email}</h1>

      <button onClick={handleClick}>Logout</button>
      <Link href="/test">
        <a>Go to test page</a>
      </Link>

      {!user.emailVerified && (
        <button onClick={verifyEmail}>Verify Email</button>
      )}

      <Link href="/email-update">
        <a>Update Email</a>
      </Link>
    </div>
  ) : (
    <div className={styles.container}>
      <Spin size="large" />
    </div>
  );
}
