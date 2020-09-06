import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/Home.module.css";
import Firebase from "../firebase/config";
import { useRouter } from "next/router";

export default function signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    Firebase.getAuthState().then((user) => {
      if (user) {
        router.replace("/dashboard");
      }
    });
  }, []);
  const signup = useCallback((ev) => {
    console.log(Firebase.getAuthState());
    Firebase.signUp(email, password)
      .then((data) => {
        setEmail("");
        setPassword("");
        router.push("/signin");
      })
      .catch((e) => console.log(e));
  });
  return (
    <div className={styles.container}>
      <div>
        <label>email</label>
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </div>
      <div>
        <label>password</label>
        <input
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
      </div>
      <button onClick={signup}>Sign up</button>
    </div>
  );
}
