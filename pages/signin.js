import React, { useEffect, useCallback, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Firebase from "../firebase/config";
import { useRouter } from "next/router";
import { Modal, Spin } from "antd";

export default function NormalLoginForm() {
  // Logic
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    Firebase.getAuthState().then((user) => {
      if (user) {
        router.replace("/dashboard");
      }
      setLoading(false);
    });
  }, []);
  const onFinish = useCallback((ev) => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
    Firebase.signIn(email, password)
      .then((data) => {
        success();
        router.push("/dashboard");
      })
      .catch((e) => {
        console.log(e.message);
        setErrorMessage(e.message);
        error();
      });
  });

  // Modals

  function success() {
    const modal = Modal.success({
      title: "Success",
      content: `You successfully logged in`,
    });

    setTimeout(() => {
      modal.destroy();
    }, 1500);
  }

  function error() {
    const modal = Modal.error({
      title: "Error occured",
      content: errorMessage,
    });
    setTimeout(() => {
      modal.destroy();
    }, 4000);
  }
  // Content
  return (
    <div className={styles.container}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className={styles.loginForm}>
          <h2>Login</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              hasFeedback
              validateStatus="success"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              validateStatus="success"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link href="/test">
                <a className="login-form-forgot">Forgot password</a>
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                disabled={disabled}
                type="primary"
                htmlType="submit"
                className={`login-form-button ${styles.loginFormButton}`}
              >
                Log in
              </Button>

              <Link href="/signup">
                <a>register now!</a>
              </Link>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
