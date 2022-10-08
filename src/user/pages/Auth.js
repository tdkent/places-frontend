import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./Auth.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
  const [isLogIn, setIsLogIn] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  
  const auth = useContext(AuthContext)

  const authSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState);
    auth.login()
  };

  const switchModeHandler = () => {
    if (!isLogIn) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        }, false
      )
    }
    setIsLogIn((prev) => !prev);
    console.log("swiched mode to", isLogIn);
  };

  return (
    <Card className="authentication">
      <h2>Login Required</h2>
      <form onSubmit={authSubmitHandler}>
        {!isLogIn && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your name"
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter your name."
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-mail"
          validators={[VALIDATOR_EMAIL]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid password with at least 5 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          LOGIN
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SIGN UP
      </Button>
    </Card>
  );
};

export default Auth;
