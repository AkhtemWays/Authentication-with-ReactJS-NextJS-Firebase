import React, { useState, useEffect, useCallback, useRef } from "react";
import { config } from "../config";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/router";
import {
  Form,
  Input,
  Tooltip,
  Radio,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "../styles/Home.module.css";
import { DatePicker, Spin, Modal } from "antd";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import Firebase, { firestore } from "../firebase/config";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function RegistrationForm() {
  // state
  const [form] = Form.useForm();
  const [country, setCountry] = useState("");
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [date, setDate] = useState(null);
  const [gender, setGender] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const reRef = useRef();

  const [disabled, setDisabled] = useState(false);
  // logic
  const onFinish = (values) => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);

    firestore
      .collection("users")
      .add({
        username: values.username,
        password: values.password,
        email: values.email,
        birthdate: values.date._d,
        gender: values.gender,
        region: values.region,
        country: values.country,
        phone: values.phone,
      })
      .then((data) => {
        success();
        router.push("/signin");
      })
      .catch((e) => error(`Database error ${e.message}`));
  };

  useEffect(() => {
    setLoading(true);

    Firebase.getAuthState().then((user) => {
      if (user) {
        router.replace("/dashboard");
      }
      setLoading(false);
    });
  }, []);

  const handleRegion = useCallback((region) => {
    setRegion(region);
  });
  const handleCountry = useCallback((countryEvent) => {
    setCountry(countryEvent);
  });

  const handleChange = useCallback((ev) => {
    console.log(ev);
    switch (ev.target.name) {
      case "username":
        setUsername(ev.target.value);
        break;
      case "phone":
        setPhone(ev.target.value);
        break;
      case "password":
        setPassword(ev.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(ev.target.value);
        break;
      case "email":
        setEmail(ev.target.value);
        break;
      case "gender":
        setGender(ev.target.value);
        break;
      default:
        return;
    }
  });
  const handleDate = (date, dateString) => {
    setDate(new Date(dateString));
    console.log(date);
  };
  // UI

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
        <Option value="91">+91</Option>
        <Option value="95">+95</Option>
      </Select>
    </Form.Item>
  );

  function success() {
    const modal = Modal.success({
      title: "Success",
      content: `You successfully signed up!\nCheck your email for account confirmation`,
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
  return (
    <div className={styles.container}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className={styles.registerForm}>
          <h2 align="center">Sign up</h2>
          {
            <div>
              <p></p>
            </div>
          }
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              prefix: "86",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Email is not valid",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
              hasFeedback
            >
              <Input type="email" value={email} onChange={handleChange} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              extra="Passwords should be between 6 and 20 characters long which contain at least one numeric digit, one uppercase and one lowercase letter"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                type="password"
                value={password}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },

                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                type="password"
                value={confirmPassword}
                onChange={handleChange}
              />
            </Form.Item>

            <Form.Item
              name="username"
              label={
                <span>
                  Username&nbsp;
                  <Tooltip title="What do you want others to call you?">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                  whitespace: true,
                },
                {
                  min: true,
                  message: "Username should contain more than 2 characters",
                  whitespace: true,
                },
              ]}
            >
              <Input
                min="3"
                type="text"
                value={username}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name="date"
              label="Birth date"
              rules={[
                {
                  required: true,
                  message: "Please input your birth date",
                },
              ]}
            >
              <DatePicker onChange={handleDate} />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                {
                  required: true,
                  message: "Please input your gender",
                },
              ]}
            >
              <Radio.Group onChange={handleChange} value={gender}>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input
                value={phone}
                onChange={handleChange}
                addonBefore={prefixSelector}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[
                {
                  required: true,
                  message: "Please select your country",
                },
              ]}
            >
              <CountryDropdown
                value={country}
                onChange={handleCountry}
                style={{
                  width: "100%",
                  height: "32px",
                }}
              />
            </Form.Item>
            <Form.Item
              name="region"
              label="Region"
              rules={[
                {
                  required: true,
                  message: "Please select your region",
                },
              ]}
            >
              <RegionDropdown
                country={country}
                value={region}
                onChange={handleRegion}
                style={{
                  width: "100%",
                  height: "32px",
                }}
              />
            </Form.Item>
            <Form.Item
              label="Captcha"
              extra="We must make sure that your are a human."
            >
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="captcha"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Please input the captcha you got!",
                      },
                    ]}
                  >
                    <ReCAPTCHA
                      sitekey={config.sitekey}
                      size="normal"
                      ref={reRef}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("Should accept agreement"),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                I have read the{" "}
                <a href="https://about.google/intl/en_RU/how-our-business-works/">
                  agreement
                </a>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" disabled={disabled}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
