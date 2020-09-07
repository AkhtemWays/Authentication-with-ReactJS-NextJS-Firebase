import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/Home.module.css";
import Firebase from "../firebase/config";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useRouter } from "next/router";
import emailValidation from "../utils/customEmailValidation";
import passwordValidation from "../utils/customPasswordValidation";
import validatePassword from "../utils/customPasswordValidation";

export default function emailUpdate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    Firebase.getAuthState().then((user) => {
      if (!user) {
        router.replace("/signin");
      }
    });
  }, []);
  const handleChange = useCallback((ev) => {
    switch (ev.target.name) {
      case "password":
        setPassword(ev.target.value);
        return;
      case "confirmPassword":
        setConfirmPassword(ev.target.value);
        return;
      case "email":
        setEmail(ev.target.value);
        return;
      default:
        return;
    }
  });
  const onFinish = useCallback((ev) => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 3000);
    if (
      password === confirmPassword &&
      emailValidation(email) &&
      validatePassword(password)
    ) {
      Firebase.getCurrentUser()
        .updateEmail(email)
        .then(() => {
          success();
          router.push("/dashboard");
        })
        .catch((e) => error(e.message));
    } else if (password === confirmPassword && !emailValidation(email)) {
      error("Email is invalid");
    } else if (
      !passwordValidation(password) ||
      !passwordValidation(confirmPassword)
    ) {
      error(
        "Passwords should be between 6 and 20 characters long which contain at least one numeric digit, one uppercase and one lowercase letter"
      );
    } else if (!password === confirmPassword && emailValidation(email)) {
      error("Passwords do not match");
    } else if (email === Firebase.getCurrentUser().email) {
      error("Email can not be the same");
    } else {
      error("Passwords do not match and email is invalid");
    }
  });
  function success() {
    const modal = Modal.success({
      title: "Success",
      content: `You successfully updated your email!`,
    });

    setTimeout(() => {
      modal.destroy();
    }, 1500);
  }

  function error(content) {
    const modal = Modal.error({
      title: "Error occured",
      content: content,
    });
    setTimeout(() => {
      modal.destroy();
    }, 6000);
  }
  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            hasFeedback
            validateStatus="success"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
              {
                email: true,
                message: "This is not a valid email address",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus="success"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
              {
                min: 6,
                message: `Password can not be fewer than 6 characters`,
              },
              {
                max: 20,
                message: `Password can not be longer than 20 characters`,
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              name="password"
              min="6"
              max="20"
              pattern=""
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus="success"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
              {
                min: 6,
                message: `Password can not be fewer than 6 characters`,
              },
              {
                max: 20,
                message: `Password can not be longer than 20 characters`,
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              min="6"
              max="20"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={disabled}
              type="submit"
              type="primary"
              className={`login-form-button ${styles.loginFormButton}`}
              onClick={onFinish}
            >
              Update Email
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
