import React, { useState, useCallback, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Firebase, { firestore } from "../firebase/config";
import { useRouter } from "next/router";
import { Modal, Button, Form, Input, Spin } from "antd";
import { MailOutlined } from "@ant-design/icons";
export default function test() {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleRestore = (values) => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);

    Firebase.resetPassword(email)
      .then(() => {
        success();
        router.push("/signin");
      })
      .catch((e) => {
        console.log(`Firebase error ${e}`);
        error("Server error");
      });
  };
  const success = useCallback(() => {
    const modal = Modal.success({
      title: "Success",
      content: `The password reset email was sent to ${email}`,
    });

    setTimeout(() => {
      modal.destroy();
    }, 2000);
  });
  function error(errorMessage) {
    const modal = Modal.error({
      title: "Error occured",
      content: errorMessage,
    });
    setTimeout(() => {
      modal.destroy();
    }, 4000);
  }
  useEffect(() => {
    setLoading(true);

    Firebase.getAuthState().then((user) => {
      if (user) {
        router.replace("/dashboard");
      }
      setLoading(false);
    });
  }, []);
  if (!loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loginForm}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={handleRestore}
          >
            <Form.Item
              name="email"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
                {
                  type: "email",
                  message: "Email is incorrect",
                },
              ]}
            >
              <Input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                type="email"
              />
            </Form.Item>
            <Form.Item>
              <Button
                disabled={disabled}
                type="primary"
                htmlType="submit"
                className={`login-form-button ${styles.loginFormButton}`}
              >
                Send email
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }
}
