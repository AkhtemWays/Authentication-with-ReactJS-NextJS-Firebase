import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Link href="/signin">
        <a>go to sign in</a>
      </Link>
    </div>
  );
}
